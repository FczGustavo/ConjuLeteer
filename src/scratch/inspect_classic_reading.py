import json
import re
from collections import Counter
from pathlib import Path

path = Path("src/data/englishQuestionBank.ts")
content = path.read_text(encoding="utf-8")
m = re.search(r"JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\]", content, re.S)
if m:
    data = json.loads(json.loads(m.group(1)))
    reading_items = [q for q in data if q.get("subjectId") in ("english_reading_review", "english_synonyms_antonyms", "english_idioms_vocabulary", "english_false_cognates")]
    print("Reading / Vocab items count:", len(reading_items))
    bancas = Counter(q.get("banca") for q in reading_items)
    print("\nBancas:")
    for b, c in bancas.most_common():
        print(f"  {b}: {c}")
        
    print("\nSample items:")
    for q in reading_items[:5]:
        print(f"ID: {q['id']}, Subject: {q['subjectId']}, Banca: {q.get('banca')}, Year: {q.get('examMetadata', {}).get('year')}, Statement: {q.get('statement')[:60]}...")
