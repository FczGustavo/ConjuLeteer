import pypdf
import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from parse_helpers import parse_gabarito

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"

# 1. Load generated database
with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "export const QUESTION_BANK" in line:
        start_idx = i
        break

json_text = "".join(lines[start_idx:]).replace("export const QUESTION_BANK: QuestionBankItem[] = ", "").rstrip(";\n")
questions = json.loads(json_text)

# Build a lookup by (listId, questionNumber)
db_map = {}
for q in questions:
    db_map[(q['listId'], q['questionNumber'])] = q

print(f"Loaded {len(questions)} questions from questionBank.ts\n")

# 2. Extract answer keys directly from PDFs and compare
PDF_FILES = [
    ("1. Fonética e Fonologia.pdf", "pdf_1_fonetica", 81),
    ("2. Acentuação.pdf", "pdf_2_acentuacao", 74),
    ("3. Estrutura e Formação de Palavras.pdf", "pdf_3_formacao", 94),
    ("4. Classes de Palavras Variaveis.pdf", "pdf_4_classes_var", 69),
    ("5. Classes de Palavras invariáveis.pdf", "pdf_5_classes_invar", 28),
    ("6. Pronomes.pdf", "pdf_6_pronomes", 93),
    ("7. Verbos.pdf", "pdf_7", 92),
]

mismatches = []
total_compared = 0

for filename, list_id, expected_count in PDF_FILES:
    filepath = os.path.join(pdf_dir, filename)
    reader = pypdf.PdfReader(filepath)
    
    # Extract gabarito from end of file
    gab_text = ""
    for p in range(max(0, len(reader.pages) - 15), len(reader.pages)):
        gab_text += reader.pages[p].extract_text() + "\n"
    gabarito_map = parse_gabarito(gab_text)
    
    file_matches = 0
    for q_num in range(1, expected_count + 1):
        total_compared += 1
        pdf_ans = gabarito_map.get(q_num)
        db_item = db_map.get((list_id, q_num))
        
        if not db_item:
            mismatches.append(f"[{filename}] Q{q_num}: Missing in database!")
            continue
            
        db_ans = db_item['correctLetter']
        if pdf_ans != db_ans:
            mismatches.append(f"[{filename}] Q{q_num}: PDF gabarito '{pdf_ans}' != DB gabarito '{db_ans}'")
        else:
            file_matches += 1
            
    print(f"[{filename}] {file_matches}/{expected_count} gabaritos 100% coincidentes com o PDF.")

print(f"\n--- Gabarito Verification Summary ---")
print(f"Total Compared: {total_compared}")
print(f"Total Mismatches: {len(mismatches)}")

# 3. Check "Leia:" statements integrity
leia_issues = []
for q in questions:
    stmt = q['statement']
    if re.match(r'^Leia\s*:\s*$', stmt.strip(), re.IGNORECASE):
        leia_issues.append(f"[{q['id']}] Empty statement after 'Leia:'")

print(f"Incomplete 'Leia:' statements: {len(leia_issues)}")

# 4. Check paragraph count in reading texts
reading_count = sum(1 for q in questions if q.get('readingText'))
multi_p_count = sum(1 for q in questions if q.get('readingText') and "\n\n" in q['readingText'])
print(f"Total questions with Reading Text: {reading_count}")
print(f"Reading texts with multiple structured paragraphs: {multi_p_count}")
