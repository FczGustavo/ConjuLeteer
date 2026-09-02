import json
from pathlib import Path

report = json.loads(Path("reports/english-preview-audit.json").read_text(encoding="utf-8"))
rows = report["rows"]

print(f"Total rows: {len(rows)}")
statuses = {}
for r in rows:
    st = r.get("quality", {}).get("status")
    statuses[st] = statuses.get(st, 0) + 1
print("Status breakdown:", statuses)

warning_rows = [r for r in rows if r.get("quality", {}).get("status") == "warning"]
print(f"\n--- Total warning rows: {len(warning_rows)} ---")
for r in warning_rows:
    qid = r["id"]
    page = r["provenance"]["questionPage"]
    warns = r["quality"]["warnings"]
    print(f"{qid} (page {page}): {warns}")

quarantined_rows = [r for r in rows if r.get("quality", {}).get("status") == "quarantined"]
print(f"\n--- Total quarantined rows: {len(quarantined_rows)} ---")
for r in quarantined_rows:
    qid = r["id"]
    page = r["provenance"]["questionPage"]
    warns = r["quality"]["warnings"]
    print(f"{qid} (page {page}): {warns}")
