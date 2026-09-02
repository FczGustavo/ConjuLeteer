import json
from pathlib import Path

report = json.loads(Path("reports/english-preview-audit.json").read_text(encoding="utf-8"))
rows = report["rows"]

for r in rows:
    qid = r["id"]
    warns = r.get("quality", {}).get("warnings", [])
    for w in warns:
        if any(keyword in w for keyword in ["Caractere", "alternativas", "Gabarito"]):
            print(f"=== {qid} (page {r['provenance']['questionPage']}) ===")
            print("Warnings:", warns)
            print("Statement:", repr(r.get("statement")))
            print("Options:", json.dumps(r.get("options"), ensure_ascii=False, indent=2))
            print("Correct:", r.get("correctLetter"))
            print()
