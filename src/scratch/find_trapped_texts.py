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

long_statements = []
for q in questions:
    if len(q['statement']) > 350:
        long_statements.append((q['id'], len(q['statement']), q['statement'][:150]))

print(f"Total questions with statement > 350 chars: {len(long_statements)}")
for item in long_statements[:20]:
    print(f"[{item[0]}] ({item[1]} chars): {item[2]}...\n")
