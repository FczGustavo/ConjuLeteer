import json

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\simuladoQuestions.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "export const SIMULADO_QUESTIONS" in line:
        start_idx = i
        break

json_text = "".join(lines[start_idx:]).replace("export const SIMULADO_QUESTIONS: SimuladoQuestion[] = ", "").rstrip(";\n")
questions = json.loads(json_text)

long_statements = []
for q in questions:
    if len(q['statement']) > 350:
        long_statements.append((q['id'], q['questionNumber'], len(q['statement']), q['statement'][:80].replace('\n', ' ')))

print(f"Questions with statement > 350 chars: {len(long_statements)}")
for item in long_statements:
    print(f"  {item[0]} (Q{item[1]}): {item[2]} chars -> {item[3]}...")
