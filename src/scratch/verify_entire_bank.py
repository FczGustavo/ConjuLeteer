import json
import re

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "export const QUESTION_BANK" in line:
        start_idx = i
        break

json_text = "".join(lines[start_idx:]).replace("export const QUESTION_BANK: QuestionBankItem[] = ", "").rstrip(";\n")
questions = json.loads(json_text)

print(f"Total questions in database: {len(questions)}")

subjects_count = {}
for q in questions:
    sub = q['subjectTitle']
    subjects_count[sub] = subjects_count.get(sub, 0) + 1

print("\n--- Question count per subject ---")
for sub, count in subjects_count.items():
    print(f"  {sub}: {count} questões")

# Verification checks
issues = []
watermarks_found = []
ligatures_found = []

for q in questions:
    q_id = q['id']
    full_text = q['statement'] + " " + " ".join([opt['text'] for opt in q['options']])
    if q.get('readingText'):
        full_text += " " + q['readingText']
        
    # Check 1: Any student ID watermarks
    w_match = re.findall(r'\b\d{6,}\b', full_text)
    if w_match:
        watermarks_found.append((q_id, w_match))
        
    # Check 2: Any corrupted characters (%, @, *) inside words
    lig_match = re.findall(r'[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+[%*@][a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+', full_text)
    if lig_match:
        ligatures_found.append((q_id, lig_match))
        
    # Check 3: Valid options count
    if len(q['options']) < 4:
        issues.append((q_id, f"Invalid options count: {len(q['options'])}"))
        
    # Check 4: Valid correctLetter
    if q['correctLetter'] not in ['A', 'B', 'C', 'D', 'E']:
        issues.append((q_id, f"Invalid correctLetter: {q['correctLetter']}"))

print(f"\n--- Verification Results ---")
print(f"Watermarks remaining: {len(watermarks_found)}")
print(f"Ligatures/Corruptions remaining: {len(ligatures_found)}")
print(f"Structural issues: {len(issues)}")

if ligatures_found:
    print(f"Sample remaining ligatures: {ligatures_found[:10]}")
