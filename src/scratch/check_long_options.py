import json

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\simuladoQuestions.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find line starting with export const SIMULADO_QUESTIONS
start_idx = -1
for i, line in enumerate(lines):
    if "export const SIMULADO_QUESTIONS" in line:
        start_idx = i
        break

json_text = "".join(lines[start_idx:])
json_text = json_text.replace("export const SIMULADO_QUESTIONS: SimuladoQuestion[] = ", "").rstrip(";\n")
questions = json.loads(json_text)

print(f"Loaded {len(questions)} questions")

long_options = []
for q in questions:
    for opt in q['options']:
        if len(opt['text']) > 250:
            long_options.append((q['id'], q['questionNumber'], opt['letter'], len(opt['text']), opt['text'][:80].replace('\n', ' ')))

print(f"Options with length > 250 chars: {len(long_options)}")
for item in long_options[:20]:
    print(f"  {item[0]} (Q{item[1]}) - Opt {item[2]}: {item[3]} chars -> {item[4]}...")
