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

fl_misspelled = ['refiete', 'conffito', 'conffitos', 'inffu', 'confiitantes', 'conflitantes', 'infiuenciadores', 'influenciadores', 'infiuência', 'afiição', 'afito']

found_issues = []
for q in questions:
    full_str = f"{q.get('readingText', '')} {q['statement']} " + " ".join(o['text'] for o in q['options'])
    for w in ['refiete', 'confiitantes', 'infiuenciadores', 'infiuência', 'afiição', 'afito', 'refieto']:
        if w in full_str:
            found_issues.append((q['id'], w))
            
print(f"Found fl misspellings: {found_issues}")
