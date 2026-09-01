import pypdf
import os
import re
import json
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces
from parse_helpers import parse_gabarito, smart_split_reading_statement
from test_strict_parser import clean_portuguese, parse_strict_options
from text_purifier import deep_clean_portuguese

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"
extractor_path = os.path.join(os.path.dirname(__file__), "extract_pdfjs.mjs")

def extract_pdf_text(filepath):
    """Use PDF.js' font-aware extraction; pypdf loses glyphs in these PDFs."""
    try:
        result = subprocess.run(
            ["node", extractor_path, filepath],
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        if result.stdout.strip():
            return result.stdout
    except (OSError, subprocess.CalledProcessError):
        pass

    # Keep the script usable in environments without Node/PDF.js.
    reader = pypdf.PdfReader(filepath)
    return "\n\n".join(
        f"--- PAGE {index + 1} ---\n{page.extract_text() or ''}"
        for index, page in enumerate(reader.pages)
    )

PDF_CONFIGS = [
    {
        "file": "1. Fonética e Fonologia.pdf",
        "subjectId": "fonetica",
        "subjectTitle": "Fonética e Fonologia",
        "listId": "pdf_1_fonetica",
        "listTitle": "Fonética e Fonologia (Aprofundamento Militar)",
        "expectedCount": 81,
        "banca": "AFA / EFOMM / EEAr / EsPCEx"
    },
    {
        "file": "2. Acentuação.pdf",
        "subjectId": "acentuacao",
        "subjectTitle": "Acentuação Gráfica",
        "listId": "pdf_2_acentuacao",
        "listTitle": "Acentuação Gráfica (Regras Gerais & Especiais)",
        "expectedCount": 74,
        "banca": "AFA / EFOMM / EEAr / EsPCEx"
    },
    {
        "file": "3. Estrutura e Formação de Palavras.pdf",
        "subjectId": "formacao",
        "subjectTitle": "Estrutura e Formação de Palavras",
        "listId": "pdf_3_formacao",
        "listTitle": "Estrutura e Processos de Formação de Palavras",
        "expectedCount": 94,
        "banca": "AFA / EFOMM / EEAr / EsPCEx"
    },
    {
        "file": "4. Classes de Palavras Variaveis.pdf",
        "subjectId": "classes_var",
        "subjectTitle": "Classes de Palavras Variáveis",
        "listId": "pdf_4_classes_var",
        "listTitle": "Classes Variáveis (Substantivos, Adjetivos, Artigos, Numerais)",
        "expectedCount": 69,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
    {
        "file": "5. Classes de Palavras invariáveis.pdf",
        "subjectId": "classes_invar",
        "subjectTitle": "Classes de Palavras Invariáveis",
        "listId": "pdf_5_classes_invar",
        "listTitle": "Classes Invariáveis (Advérbios, Preposições, Conjunções, Interjeições)",
        "expectedCount": 28,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
    {
        "file": "6. Pronomes.pdf",
        "subjectId": "pronomes",
        "subjectTitle": "Pronomes",
        "listId": "pdf_6_pronomes",
        "listTitle": "Pronomes (Emprego, Colocação Pronominal e Referenciação)",
        "expectedCount": 93,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
    {
        "file": "7. Verbos.pdf",
        "subjectId": "verbos",
        "subjectTitle": "Verbos & Modos Verbais",
        "listId": "pdf_7",
        "listTitle": "PDF 7 • Verbos (G92)",
        "expectedCount": 92,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
]

QUESTION_FORMAT_OVERRIDES = {
}

def normalize_question_formatting(text, list_id, question_number, field):
    if not text:
        return text
    override = QUESTION_FORMAT_OVERRIDES.get((list_id, question_number, field))
    if override is not None:
        return override

    # Safe repairs for all lists, including options: punctuation and numeric
    # labels should never render as isolated bold pills, while meaningful
    # multi-letter emphasis remains intact.
    text = re.sub(r'\*\*(\d{1,2})\*\*\*\*\s*([-–—])\*\*', r'\1 \2', text)
    text = re.sub(r'\*\*([\-–—:;,.!?])\*\*', r'\1', text)
    text = re.sub(r'\*\*([IVX]{1,4}|\d{1,2})\*\*(?=\s*[-–—.)])', r'\1', text, flags=re.IGNORECASE)
    text = re.sub(r'(?<=\w)\*\*([áéíóúàâêôãõç])\*\*(?=\w)', r'\1', text, flags=re.IGNORECASE)
    text = re.sub(r'[ \t]+([,.;:!?])', r'\1', text)
    return '\n'.join(re.sub(r'[ \t]{2,}', ' ', line).strip() for line in text.splitlines()).strip()

all_questions = []

for cfg in PDF_CONFIGS:
    filepath = os.path.join(pdf_dir, cfg["file"])
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    print(f"\nProcessing {cfg['file']} with strict sequential parser...")
    full_text = extract_pdf_text(filepath)
        
    cleaned_full_text = clean_portuguese(full_text)
    
    # Extract official Gabarito from end of file
    pages = re.split(r"(?=--- PAGE \d+ ---)", full_text)
    gab_text = "\n".join(pages[-15:])
    gabarito_map = parse_gabarito(gab_text)
    print(f"  Extracted {len(gabarito_map)} gabarito answers.")
    
    # Extract questions from the public Portuguese PDFs.
    pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
    question_source = cleaned_full_text

    matches = list(pattern.finditer(question_source))
    seen_q = set()
    
    for i, m in enumerate(matches):
        q_num = int(m.group(2))
        if q_num in seen_q or q_num > cfg["expectedCount"]:
            continue
        seen_q.add(q_num)
        
        start = m.start()
        end = len(question_source)
        
        for j in range(i+1, len(matches)):
            next_num = int(matches[j].group(2))
            if next_num > q_num:
                end = matches[j].start()
                break
                
        p_gab = cleaned_full_text.find("Respostas:")
        if p_gab != -1 and end > p_gab and start < p_gab:
            end = p_gab
            
        block = question_source[start:end].strip()
        block = re.split(r'\n\s*(?:GABARITO|RESPOSTAS)\s*[–—:-]', block, maxsplit=1, flags=re.IGNORECASE)[0].strip()
        stmt_part, raw_opts = parse_strict_options(block)
        reading_text, statement = smart_split_reading_statement(stmt_part)
            
        correct_letter = gabarito_map.get(q_num, 'A')
        
        # Deep clean reading text and statement
        cleaned_reading = deep_clean_portuguese(reading_text) if reading_text else None
        cleaned_statement = deep_clean_portuguese(statement)

        # PDF.js cannot recover the small poem block in the scanned page of
        # Pronomes q45, although the citation and every alternative are
        # present. Restore the cited public-domain excerpt so the question is
        # self-contained instead of showing a command that refers to missing
        # verses. The text is the canonical ``Retrato`` stanza printed on the
        # source page; the bibliographic line remains attached to the support.
        if cfg["listId"] == "pdf_6_pronomes" and q_num == 45:
            poem = (
                "TEXTO I\nRETRATO\n"
                "Eu não tinha este rosto de hoje,\n"
                "Assim calmo, assim triste, assim magro,\n"
                "Nem estes olhos tão vazios,\n"
                "Nem o lábio amargo.\n\n"
                "Eu não tinha estas mãos sem força,\n"
                "Tão paradas e frias e mortas;\n"
                "Eu não tinha este coração\n"
                "Que nem se mostra.\n\n"
                "Eu não dei por esta mudança,\n"
                "Tão simples, tão certa, tão fácil:\n"
                "— Em que espelho ficou perdida\n"
                "A minha face?"
            )
            citation_match = re.match(r'^\s*(\(MEIRELES,[^\n]*\))\s*', cleaned_statement)
            citation = citation_match.group(1) if citation_match else "(MEIRELES, Cecília. Obra Poética de Cecília Meireles. Rio de Janeiro: José Aguilar, 1958.)"
            if citation_match:
                cleaned_statement = cleaned_statement[citation_match.end():].strip()
            cleaned_reading = deep_clean_portuguese(f"{poem}\n\n{citation}")

        # Scanned support pages are restored below when the PDF text layer is incomplete.
        if cfg["listId"] == "pdf_7" and q_num == 5:
            cleaned_reading = deep_clean_portuguese("TEXTO III\nMulheres de Atenas\n\nMirem-se no exemplo\nDaquelas mulheres de Atenas\nVivem pros seus maridos\nOrgulho e raça de Atenas")
            cleaned_reading += "\n\nQuando amadas, se perfumam\nSe banham com leite, se arrumam\nSuas melenas"
            cleaned_reading += "\nQuando fustigadas não choram\nSe ajoelham, pedem, imploram\nMais duras penas; cadenas"
            cleaned_reading += "\n\nMirem-se no exemplo\nDaquelas mulheres de Atenas\nSofrem pros seus maridos\nPoder e força de Atenas\n(...)"

        if cfg["listId"] == "pdf_7" and q_num == 5:
            cleaned_reading += "\n\nElas não têm gosto ou vontade\nNem defeito, nem qualidade\nTêm medo apenas"
            cleaned_reading += "\nNão têm sonhos, só têm presságios\nO seu homem, mares, naufrágios\nLindas sirenas, morenas"
            cleaned_reading += "\n\nMirem-se no exemplo\nDaquelas mulheres de Atenas\nTemem por seus maridos\nHeróis e amantes de Atenas"
            cleaned_reading += "\n\nAs jovens viúvas marcadas\nE as gestantes abandonadas\nNão fazem cenas\nVestem-se de negro, se encolhem"
            cleaned_reading += "\nSe conformam e se recolhem\nÀs suas novenas, serenas\n\n(HOLANDA, Chico Buarque de. Meus caros amigos. LP, 1976. Phonogram/Philips)"

        silence_questions = (
            (cfg["listId"] == "pdf_4_classes_var" and q_num in {60, 61, 62})
            or (cfg["listId"] == "pdf_5_classes_invar" and q_num in {24, 25})
        )
        if silence_questions:
            cleaned_reading = deep_clean_portuguese("TEXTO I\nO silêncio incomoda")
            cleaned_reading += "\n\nComo trabalho em casa, assisto a um grande número de jogos e programas esportivos, alguns porque gosto e outros para me manter atualizado. Vejo ainda muitos noticiários gerais, filmes, programas culturais e também, por curiosidade, muitas coisas ruins. Estou viciado em televisão."
            cleaned_reading += "\n\nNão suporto mais ver tantas tragédias, crimes, violências, falcatruas e tantas politicagens para a realização da Copa de 2014."
            cleaned_reading += "\n\nEstou sem paciência para assistir a tantas partidas tumultuadas no Brasil, consequência do estilo de jogar, da tolerância com a violência e do ambiente bélico em que se transformou o futebol, dentro e fora do campo."
            cleaned_reading += "\n\nNa transmissão das partidas, fala-se e grita-se demais. Não há um único instante de silêncio, nenhuma pausa. O barulho é cada dia maior no futebol, nas ruas, nos bares, nos restaurantes e em quase todos os ambientes. O silêncio incomoda as pessoas."
            cleaned_reading += "\n\nÉ óbvio que informações e estatísticas são importantíssimas. Mas exageram. Fala-se muito, mesmo com a bola rolando. Impressiona-me como se formam conceitos, dão opiniões, baseados em estatísticas que têm pouca ou nenhuma importância."
            cleaned_reading += "\n\nNa partida entre Escócia e Brasil, um repórter da TV Globo deu a grande notícia de que Neymar foi o primeiro jogador brasileiro a marcar dois gols contra a Escócia em uma mesma partida."
            cleaned_reading += "\n\nParece haver uma disputa para saber quem dá mais informações e estatísticas, e outra, entre os narradores, para saber quem grita gol mais alto e prolongado. Se dizem que a imagem vale mais que mil palavras, por que se fala e se grita tanto?"
            cleaned_reading += "\n\nOutra discussão chata, durante e após as partidas, é se um jogador teve a intenção de colocar a mão na bola e de fazer pênalti, e se outro teve a intenção de atingir o adversário. Com raríssimas exceções, ninguém é louco para fazer pênalti nem tão canalha para querer quebrar o outro jogador."
            cleaned_reading += "\n\nO que ocorre, com frequência, é o jogador, no impulso, sem pensar, soltar o braço na cara do outro. O impulso está à frente da consciência. Não sou também tão ingênuo para achar que todas as faltas violentas são involuntárias."
            cleaned_reading += "\n\nNão dá para o árbitro saber se a falta foi intencional ou não. Ele precisa julgar o fato, e não a intenção. Eles precisam ter também bom senso, o que é raro no ser humano, para saber a gravidade das faltas. Muitas parecem iguais, mas não são. Ter critério não é unificar as diferenças."
            cleaned_reading += "\n\n(Tostão, Folha de S.Paulo, caderno D, esporte, p. 11, 10/04/2011.)"
            cleaned_statement = re.sub(r"^TEXTO I\s*", "", cleaned_statement, flags=re.IGNORECASE)

        if cfg["listId"] == "pdf_4_classes_var" and q_num == 39:
            cleaned_reading = deep_clean_portuguese("TEXTO I\nA raposa e as uvas")
            cleaned_reading += "\n\nTrecho da peça teatral A raposa e as uvas, escrita por Guilherme de Figueiredo. A cena ocorre na cidade de Samos, na casa de Xantós, um filósofo grego, que recebe Agnostos, um capitão ateniense. O jantar é servido por Esopo e Melita, escravos de Xantós."
            cleaned_reading += "\n\n(Entra Esopo, com um prato coberto. Xantós e Agnostos se dirigem para a mesa.)\n\nXANTÓS — Ah, língua! Este também começa a comer vorazmente. Fizeste bem em trazer língua, Esopo. É realmente uma das melhores coisas do mundo. Vês, estrangeiro, de qualquer modo é bom possuir riquezas. Não gostas de saborear esta língua e este vinho?\n\nAGNOSTOS — Hum."
            cleaned_reading += "\n\nXANTÓS — Outro prato, Esopo. Que é isto? Ah, língua de fumeiro! É boa língua de fumeiro, hein, amigo?\n\nAGNOSTOS — Hum. [...]\n\nXANTÓS — Serve outro prato. Que trazes aí?\n\nESOPO — Língua."
            cleaned_reading += "\n\nXANTÓS — Mais língua? Não te disse que trouxesse o que há de melhor para meu hóspede? Por que só trazes língua? Queres expor-me ao ridículo?"
            cleaned_reading += "\n\nESOPO — Que há de melhor do que a língua? A língua é o que nos une a todos, quando falamos. Sem a língua nada poderíamos dizer. A língua é a chave das ciências, o órgão da verdade e da razão. Com a língua se ensina, se persuade, se instrui, se reza, se explica, se canta, se descreve, se elogia, se mostra, se afirma. É com a língua que dizemos sim."
            cleaned_reading += "\n\nXANTÓS — Bravo, Esopo. Realmente, tu nos trouxeste o que há de melhor. Vai agora ao mercado e traz-nos o que houver de pior.\n\n(Entra Esopo com prato coberto.)\n\nXANTÓS — Língua, ainda? Mais língua? Não disseste que língua era o que havia de melhor? Queres ser espancado?"
            cleaned_reading += "\n\nESOPO — A língua, senhor, é o que há de pior no mundo. É a fonte de todas as intrigas, o início de todos os processos, a mãe de todas as discussões. É a língua que mente, que esconde, que tergiversa, que blasfema, que insulta, que se acovarda, que mendiga, que impreca, que bajula, que destrói, que calunia, que vende, que seduz. É com a língua que dizemos não. Aí está, Xantós, porque a língua é a pior de todas as coisas!"
            cleaned_reading += "\n\n(FIGUEIREDO, Guilherme. A raposa e as uvas — peça em 3 atos. Texto adaptado para fins didáticos.)"

        cleaned_statement = normalize_question_formatting(
            cleaned_statement, cfg["listId"], q_num, "statement"
        )
        if cleaned_reading:
            cleaned_reading = normalize_question_formatting(
                cleaned_reading, cfg["listId"], q_num, "readingText"
            )

        options = []
        for let, opt_text in raw_opts:
            # Clean option text with deep purifier
            cleaned_opt = deep_clean_portuguese(fix_broken_spaces(opt_text))
            cleaned_opt = normalize_question_formatting(
                cleaned_opt, cfg["listId"], q_num, "option"
            )
            # Remove any trailing next question prefixes or line noise
            cleaned_opt = re.sub(r'\s*Questão\s+\d+.*$', '', cleaned_opt, flags=re.IGNORECASE).strip()
            options.append({
                "letter": let,
                "text": cleaned_opt,
                "correct": (let == correct_letter)
            })
            
        # Detect institution/banca if mentioned in statement
        banca_name = cfg["banca"]
        banca_match = re.search(r'\((EsPCEx|AFA|EFOMM|EEAr|Escola Naval|EN|Colégio Naval|CN|EPCAR)[^\)]*\)', cleaned_statement, re.IGNORECASE)
        if banca_match:
            banca_name = banca_match.group(0).replace('(', '').replace(')', '').strip()

        all_questions.append({
            "id": f"{cfg['subjectId']}-{cfg['listId']}-q{q_num}",
            "subjectId": cfg["subjectId"],
            "subjectTitle": cfg["subjectTitle"],
            "listId": cfg["listId"],
            "listTitle": cfg["listTitle"],
            "questionNumber": q_num,
            "readingText": cleaned_reading,
            "statement": cleaned_statement,
            "options": options,
            "correctLetter": correct_letter,
            "banca": banca_name
        })
        
    print(f"  Parsed {len(seen_q)} clean questions for {cfg['subjectTitle']}.")

# Clean undefined field in Python for JSON
clean_export = []
for q in all_questions:
    # Run the purifier once more over the finalized fields. Some PDF font
    # artifacts only become recognizable after the structural formatter has
    # rejoined lines/runs; this second pass is intentional and idempotent.
    q["statement"] = deep_clean_portuguese(q["statement"])
    q["options"] = [
        {**option, "text": deep_clean_portuguese(option["text"])}
        for option in q["options"]
    ]
    if q.get("readingText"):
        q["readingText"] = deep_clean_portuguese(q["readingText"])
    item = {
        "id": q["id"],
        "subjectId": q["subjectId"],
        "subjectTitle": q["subjectTitle"],
        "listId": q["listId"],
        "listTitle": q["listTitle"],
        "questionNumber": q["questionNumber"],
        "statement": q["statement"],
        "options": q["options"],
        "correctLetter": q["correctLetter"],
        "banca": q["banca"]
    }
    if q.get("readingText"):
        item["readingText"] = q["readingText"]
    clean_export.append(item)

ts_output = """// Banco de Questões Profissional de Língua Portuguesa para Concursos Militares

export type SubjectId =
  | 'todos'
  | 'fonetica'
  | 'acentuacao'
  | 'formacao'
  | 'classes_var'
  | 'classes_invar'
  | 'pronomes'
  | 'verbos'
  | 'importadas';

export interface QuestionBankOption {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  correct: boolean;
}

export interface QuestionBankItem {
  id: string;
  subjectId: SubjectId;
  subjectTitle: string;
  listId: string;
  listTitle: string;
  questionNumber: number;
  readingText?: string;
  statement: string;
  options: QuestionBankOption[];
  correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  banca: string;
  isCustom?: boolean;
}

export interface SubjectMetadata {
  id: SubjectId;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
}

export const SUBJECTS_CONFIG: SubjectMetadata[] = [
  { id: 'todos', title: 'Todos os Assuntos', shortTitle: 'Todos', description: 'Visão agregada de todo o banco', iconName: 'Layers' },
  { id: 'fonetica', title: 'Fonética e Fonologia', shortTitle: 'Fonética', description: 'Encontros vocálicos, consonantais, dígrafos e divisão silábica', iconName: 'Volume2' },
  { id: 'acentuacao', title: 'Acentuação Gráfica', shortTitle: 'Acentuação', description: 'Regras gerais, hiatos, ditongos e acento diferencial', iconName: 'Edit3' },
  { id: 'formacao', title: 'Estrutura e Formação de Palavras', shortTitle: 'Formação', description: 'Derivação, composição, parassíntese e neologismos', iconName: 'Boxes' },
  { id: 'classes_var', title: 'Classes de Palavras Variáveis', shortTitle: 'Classes Variáveis', description: 'Substantivo, adjetivo, artigo, numeral', iconName: 'Sliders' },
  { id: 'classes_invar', title: 'Classes de Palavras Invariáveis', shortTitle: 'Classes Invariáveis', description: 'Advérbio, preposição, conjunção e interjeição', iconName: 'Anchor' },
  { id: 'pronomes', title: 'Pronomes', shortTitle: 'Pronomes', description: 'Emprego, colocação pronominal e valores anafóricos/catafóricos', iconName: 'Bookmark' },
  { id: 'verbos', title: 'Verbos & Modos Verbais', shortTitle: 'Verbos', description: 'Conjugação, tempos, modos, anomalias e correlação verbal', iconName: 'Flame' },
  { id: 'importadas', title: 'Importadas / Personalizadas', shortTitle: 'Importadas', description: 'Questões importadas via IA ou arquivos PDF do usuário', iconName: 'FileUp' }
];

export const QUESTION_BANK: QuestionBankItem[] = """ + json.dumps(clean_export, ensure_ascii=False, indent=2) + ";\n"

output_path = os.environ.get(
    "QUESTION_BANK_OUTPUT",
    r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts",
)
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_output)

print(f"\n==========================================")
print(f"TOTAL CLEAN QUESTIONS GENERATED: {len(clean_export)}")
print(f"Saved to {output_path} successfully!")
print(f"==========================================")
