import pypdf
import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces
from parse_helpers import parse_gabarito
from test_strict_parser import clean_portuguese, parse_strict_options
from text_purifier import deep_clean_portuguese

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"

PDF_CONFIGS = [
    {
        "file": "1. Fonética e Fonologia.pdf",
        "subjectId": "fonetica",
        "subjectTitle": "Fonética e Fonologia",
        "listId": "pdf_1_fonetica",
        "listTitle": "Fonética e Fonologia",
        "expectedCount": 81,
        "banca": "AFA / EFOMM / EEAr / EsPCEx"
    },
    {
        "file": "2. Acentuação.pdf",
        "subjectId": "acentuacao",
        "subjectTitle": "Acentuação Gráfica",
        "listId": "pdf_2_acentuacao",
        "listTitle": "Acentuação Gráfica",
        "expectedCount": 74,
        "banca": "AFA / EFOMM / EEAr / EsPCEx"
    },
    {
        "file": "3. Estrutura e Formação de Palavras.pdf",
        "subjectId": "formacao",
        "subjectTitle": "Estrutura e Formação de Palavras",
        "listId": "pdf_3_formacao",
        "listTitle": "Estrutura e Formação de Palavras",
        "expectedCount": 94,
        "banca": "AFA / EFOMM / EEAr / EsPCEx"
    },
    {
        "file": "4. Classes de Palavras Variaveis.pdf",
        "subjectId": "classes_var",
        "subjectTitle": "Classes de Palavras Variáveis",
        "listId": "pdf_4_classes_var",
        "listTitle": "Classes de Palavras Variáveis",
        "expectedCount": 69,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
    {
        "file": "5. Classes de Palavras invariáveis.pdf",
        "subjectId": "classes_invar",
        "subjectTitle": "Classes de Palavras Invariáveis",
        "listId": "pdf_5_classes_invar",
        "listTitle": "Classes de Palavras Invariáveis",
        "expectedCount": 28,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
    {
        "file": "6. Pronomes.pdf",
        "subjectId": "pronomes",
        "subjectTitle": "Pronomes",
        "listId": "pdf_6_pronomes",
        "listTitle": "Pronomes",
        "expectedCount": 93,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
    {
        "file": "7. Verbos.pdf",
        "subjectId": "verbos",
        "subjectTitle": "Verbos & Modos Verbais",
        "listId": "pdf_7",
        "listTitle": "Verbos & Modos Verbais (G92)",
        "expectedCount": 92,
        "banca": "AFA / EN / EFOMM / Concursos Militares"
    },
]

def format_reading_text(raw_text):
    if not raw_text or len(raw_text.strip()) < 50:
        return None
        
    lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
    if not lines:
        return None
        
    # Rebuild paragraphs based on indentation, paragraph numbers, or dialogue dashes
    formatted_paragraphs = []
    current_p = []
    
    for line in lines:
        # Check if new paragraph indicator
        is_new_p = (
            re.match(r'^(?:[0-9]+[º°§]|§\s*[0-9]+|\([0-9]+\)|[IVXLCDM]+\b|—|\–|\-|\"|\“)', line) or
            len(current_p) > 0 and len(line) > 0 and line[0].isupper() and len(current_p[-1]) < 60
        )
        
        if is_new_p and current_p:
            formatted_paragraphs.append(" ".join(current_p))
            current_p = [line]
        else:
            current_p.append(line)
            
    if current_p:
        formatted_paragraphs.append(" ".join(current_p))
        
    # Join paragraphs with clean double newlines
    result = "\n\n".join(formatted_paragraphs)
    result = deep_clean_portuguese(result)
    return result.strip()

def split_reading_and_statement_faithful(stmt_block):
    # Remove initial topic labels
    stmt_block = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', stmt_block).strip()
    stmt_block = re.sub(r'^(?:Flexão verbal|Verbos|Português|Morfologia|Correlação de tempos e modos|Sintaxe do período simples|Significação a partir de construções verbais|Empregos do infinitivo|Sujeito classificações e identificação|Separação silábica|Acentuação|Encontros consonantais|Sílaba e fonemas|Estrutura da palavra|Classes variáveis|Classes invariáveis|Pronomes|referenciação)\s*', '', stmt_block).strip()

    # If the text is short (< 400 chars), it is entirely the statement!
    if len(stmt_block) < 400:
        return None, deep_clean_portuguese(stmt_block)

    # If it starts with a short "Leia:" or "Considere:", keep the excerpt inside statement!
    if re.match(r'^(?:Leia\s*:|Considere\s*:|Analise\s*:|Observe\s*:)', stmt_block, re.IGNORECASE) and len(stmt_block) < 650:
        return None, deep_clean_portuguese(stmt_block)

    # For long texts, look for the main exam question command at the bottom
    command_triggers = [
        r'Assinale a opção',
        r'Assinale a alternativa',
        r'Assinale a única alternativa',
        r'Assinale, a seguir',
        r'Assinale, dentre',
        r'Assinale o',
        r'Assinale a',
        r'Marque a opção',
        r'Marque a alternativa',
        r'Marque o',
        r'Com base no texto',
        r'Com base ainda',
        r'Em relação à composição',
        r'Em relação ao texto',
        r'Em qual das alternativas',
        r'Em qual das opções',
        r'Em qual das orações',
        r'Em que opção',
        r'Em uma das passagens',
        r'Qual das alternativas',
        r'Qual sequência',
        r'Dentre as frases',
        r'Dentre as alternativas',
        r'Há frase na voz',
        r'Há verbo na',
        r'A forma verbal',
        r'O termo “[^”]+”',
        r'O vocábulo “[^”]+”',
        r'Quanto à acentuação',
        r'Quanto à tonicidade',
        r'Quanto à formação',
        r'No trecho acima',
        r'No período composto',
        r'Lido o texto',
        r'Após a leitura atenta'
    ]

    best_pos = -1
    for trigger in command_triggers:
        for m in re.finditer(r'(?:\n|^)\s*(' + trigger + r')', stmt_block, re.IGNORECASE):
            if m.start() > 200: # Only split if there is substantial preceding text
                best_pos = max(best_pos, m.start())

    if best_pos != -1:
        raw_reading = stmt_block[:best_pos].strip()
        raw_statement = stmt_block[best_pos:].strip()
        
        formatted_reading = format_reading_text(raw_reading)
        formatted_statement = deep_clean_portuguese(raw_statement)
        return formatted_reading, formatted_statement
    else:
        return None, deep_clean_portuguese(stmt_block)

all_faithful_questions = []

for cfg in PDF_CONFIGS:
    filepath = os.path.join(pdf_dir, cfg["file"])
    if not os.path.exists(filepath):
        continue
        
    print(f"\nProcessing {cfg['file']} with faithful paragraph & statement formatter...")
    reader = pypdf.PdfReader(filepath)
    full_text = ""
    for p_idx, page in enumerate(reader.pages):
        full_text += f"\n--- PAGE {p_idx+1} ---\n" + page.extract_text()
        
    cleaned_full_text = clean_portuguese(full_text)
    
    # Extract official Gabarito
    gab_text = ""
    for p in range(max(0, len(reader.pages) - 15), len(reader.pages)):
        gab_text += reader.pages[p].extract_text() + "\n"
    gabarito_map = parse_gabarito(gab_text)
    print(f"  Extracted {len(gabarito_map)} official gabarito answers.")
    
    # Extract questions from the seven public Portuguese PDFs.
    pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
        
    matches = list(pattern.finditer(cleaned_full_text))
    seen_q = set()
    
    for i, m in enumerate(matches):
        q_num = int(m.group(2))
        if q_num in seen_q or q_num > cfg["expectedCount"]:
            continue
        seen_q.add(q_num)
        
        start = m.start()
        end = len(cleaned_full_text)
        
        for j in range(i+1, len(matches)):
            next_num = int(matches[j].group(2))
            if next_num > q_num:
                end = matches[j].start()
                break
                
        p_gab = cleaned_full_text.find("Respostas:")
        if p_gab != -1 and end > p_gab and start < p_gab:
            end = p_gab
            
        block = cleaned_full_text[start:end].strip()
        stmt_part, raw_opts = parse_strict_options(block)
        reading_text, statement = split_reading_and_statement_faithful(stmt_part)
        
        correct_letter = gabarito_map.get(q_num, 'A')
        
        options = []
        for let, opt_text in raw_opts:
            cleaned_opt = deep_clean_portuguese(fix_broken_spaces(opt_text))
            cleaned_opt = re.sub(r'\s*Questão\s+\d+.*$', '', cleaned_opt, flags=re.IGNORECASE).strip()
            options.append({
                "letter": let,
                "text": cleaned_opt,
                "correct": (let == correct_letter)
            })
            
        banca_name = cfg["banca"]
        banca_match = re.search(r'\((EsPCEx|AFA|EFOMM|EEAr|Escola Naval|EN|Colégio Naval|CN|EPCAR)[^\)]*\)', statement, re.IGNORECASE)
        if banca_match:
            banca_name = banca_match.group(0).replace('(', '').replace(')', '').strip()

        item = {
            "id": f"{cfg['subjectId']}-{cfg['listId']}-q{q_num}",
            "subjectId": cfg["subjectId"],
            "subjectTitle": cfg["subjectTitle"],
            "listId": cfg["listId"],
            "listTitle": cfg["listTitle"],
            "questionNumber": q_num,
            "statement": statement,
            "options": options,
            "correctLetter": correct_letter,
            "banca": banca_name
        }
        if reading_text:
            item["readingText"] = reading_text
            
        all_faithful_questions.append(item)
        
    print(f"  Processed {len(seen_q)} questions for {cfg['subjectTitle']}.")

print(f"\n==========================================")
print(f"TOTAL FAITHFUL QUESTIONS: {len(all_faithful_questions)}")
print(f"==========================================")

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

export const QUESTION_BANK: QuestionBankItem[] = """ + json.dumps(all_faithful_questions, ensure_ascii=False, indent=2) + ";\n"

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts", "w", encoding="utf-8") as f:
    f.write(ts_output)

print("Saved to src/data/questionBank.ts successfully!")
