import pypdf
import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces
from parse_helpers import clean_portuguese, parse_gabarito, smart_split_reading_statement, extract_options_from_bottom

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"

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

all_questions = []

for cfg in PDF_CONFIGS:
    filepath = os.path.join(pdf_dir, cfg["file"])
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    print(f"\nProcessing {cfg['file']}...")
    reader = pypdf.PdfReader(filepath)
    full_text = ""
    for p_idx, page in enumerate(reader.pages):
        full_text += f"\n--- PAGE {p_idx+1} ---\n" + page.extract_text()
        
    cleaned_full_text = clean_portuguese(full_text)
    
    # 1. Find Gabarito in the last 15 pages
    gab_text = ""
    for p in range(max(0, len(reader.pages) - 15), len(reader.pages)):
        gab_text += reader.pages[p].extract_text() + "\n"
    gabarito_map = parse_gabarito(gab_text)
    print(f"  Extracted {len(gabarito_map)} gabarito answers.")
    
    # 2. Extract questions from the seven public Portuguese PDFs.
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
                
        # Stop at gabarito section if found
        p_gab = cleaned_full_text.find("Respostas:")
        if p_gab != -1 and end > p_gab and start < p_gab:
            end = p_gab
            
        block = cleaned_full_text[start:end].strip()
        pre_text, raw_opts = extract_options_from_bottom(block)
        reading_text, statement = smart_split_reading_statement(pre_text)
        
        correct_letter = gabarito_map.get(q_num, 'A')
        
        options = []
        for let, opt_text in raw_opts:
            cleaned_opt = fix_broken_spaces(opt_text)
            options.append({
                "letter": let,
                "text": cleaned_opt,
                "correct": (let == correct_letter)
            })
            
        all_questions.append({
            "id": f"{cfg['subjectId']}-{cfg['listId']}-q{q_num}",
            "subjectId": cfg["subjectId"],
            "subjectTitle": cfg["subjectTitle"],
            "listId": cfg["listId"],
            "listTitle": cfg["listTitle"],
            "questionNumber": q_num,
            "readingText": reading_text,
            "statement": statement,
            "options": options,
            "correctLetter": correct_letter,
            "banca": cfg["banca"]
        })
        
    print(f"  Parsed {len(seen_q)} questions for {cfg['subjectTitle']}.")

print(f"\n==========================================")
print(f"TOTAL QUESTIONS IN BANK: {len(all_questions)}")
print(f"==========================================")

# Write to TypeScript file
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
  { id: 'fonetica', title: '1. Fonética e Fonologia', shortTitle: 'Fonética', description: 'Encontros vocálicos, consonantais, dígrafos e divisão silábica', iconName: 'Volume2' },
  { id: 'acentuacao', title: '2. Acentuação Gráfica', shortTitle: 'Acentuação', description: 'Regras gerais, hiatos, ditongos e acento diferencial', iconName: 'Edit3' },
  { id: 'formacao', title: '3. Estrutura e Formação de Palavras', shortTitle: 'Formação', description: 'Derivação, composição, parassíntese e neologismos', iconName: 'Boxes' },
  { id: 'classes_var', title: '4. Classes de Palavras Variáveis', shortTitle: 'Classes Variáveis', description: 'Substantivo, adjetivo, artigo, numeral', iconName: 'Sliders' },
  { id: 'classes_invar', title: '5. Classes de Palavras Invariáveis', shortTitle: 'Classes Invariáveis', description: 'Advérbio, preposição, conjunção e interjeição', iconName: 'Anchor' },
  { id: 'pronomes', title: '6. Pronomes', shortTitle: 'Pronomes', description: 'Emprego, colocação pronominal e valores anafóricos/catafóricos', iconName: 'Bookmark' },
  { id: 'verbos', title: '7. Verbos & Modos Verbais', shortTitle: 'Verbos', description: 'Conjugação, tempos, modos, anomalias e correlação verbal', iconName: 'Flame' },
  { id: 'importadas', title: '8. Importadas / Personalizadas', shortTitle: 'Importadas', description: 'Questões importadas via IA ou arquivos PDF do usuário', iconName: 'FileUp' }
];

export const QUESTION_BANK: QuestionBankItem[] = """ + json.dumps(all_questions, ensure_ascii=False, indent=2) + ";\n"

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts", "w", encoding="utf-8") as f:
    f.write(ts_output)

print("Saved to src/data/questionBank.ts successfully!")
