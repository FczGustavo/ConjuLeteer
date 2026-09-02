import json
import re
from collections import Counter
from pathlib import Path

path = Path("src/data/englishQuestionBank.ts")
content = path.read_text(encoding="utf-8")
m = re.search(r"JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\]", content, re.S)
if m:
    data = json.loads(json.loads(m.group(1)))
    print("Total items:", len(data))
    subjects = Counter(q.get("subjectId") for q in data)
    print("Subjects:")
    for s, c in subjects.most_common():
        print(f"  {s}: {c}")
