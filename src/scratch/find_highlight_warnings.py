"""Find all questions with highlight / visual warnings in Portuguese and English banks."""

import json
import re
from pathlib import Path

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")

# English bank
eng_ts = (ROOT / "src" / "data" / "englishQuestionBank.ts").read_text(encoding="utf-8")
eng_json_match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\];", eng_ts, re.S)
eng_questions = json.loads(json.loads(eng_json_match.group(1)))

# Portuguese bank
pt_ts = (ROOT / "src" / "data" / "questionBank.ts").read_text(encoding="utf-8")
# find all lists / items in questionBank.ts or load via tsx or extract
# Let's inspect questionBank.ts

print(f"Total English questions: {len(eng_questions)}")
eng_warnings = [q for q in eng_questions if q.get("quality", {}).get("status") == "warning" or any("destaque" in w.lower() for w in q.get("quality", {}).get("warnings", []))]
print(f"English questions with highlight warnings: {len(eng_warnings)}")
for q in eng_warnings:
    print(f"- {q['id']} (p. {q['provenance']['questionPage']}): warnings={q.get('quality', {}).get('warnings')}")

# Also check if Portuguese bank has any
# Let's check normalized questions or questionBank.ts
