import json

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "export const QUESTION_BANK" in line:
        start_idx = i
        break

json_text = "".join(lines[start_idx:]).replace("export const QUESTION_BANK: QuestionBankItem[] = ", "").rstrip(";\n")
questions = json.loads(json_text)

print(f"Total loaded questions: {len(questions)}")

issues = []
for q in questions:
    q_id = q['id']
    opts = q.get('options', [])
    
    # Check 1: Fewer than 4 options or > 5 options
    if len(opts) < 4:
        issues.append((q_id, f"Few options: {len(opts)}"))
    
    # Check 2: Option text too long (> 400 chars) usually means statement/text leaked into options
    for opt in opts:
        if len(opt['text']) > 400:
            issues.append((q_id, f"Option {opt['letter']} too long ({len(opt['text'])} chars): {opt['text'][:60]}..."))
            
    # Check 3: Statement contains "A)" or "A " at end
    if "A " in q['statement'][-100:] or "A)" in q['statement'][-100:]:
        # Potential option leak into statement
        pass

print(f"Detected potential issues: {len(issues)}")
for item in issues[:25]:
    print(f"  [{item[0]}]: {item[1]}")
