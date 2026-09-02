import json
import re
from pathlib import Path

report_path = Path("reports/english-preview-audit.json")
data = json.loads(report_path.read_text(encoding="utf-8"))
rows = data.get("rows", [])

print(f"Loaded {len(rows)} rows.")

issues = []

for r in rows:
    qid = r["id"]
    page = r["provenance"]["questionPage"]
    section = r["provenance"]["sectionId"]
    status = r.get("quality", {}).get("status")
    stmt = r.get("statement", "")
    options = r.get("options", [])
    correct = r.get("correctLetter")
    support = r.get("support")
    
    # 1. Option count
    if status in ("verified", "warning"):
        if len(options) not in (4, 5):
            issues.append((qid, page, f"Invalid options count: {len(options)}"))
            
    # 2. Options with embedded sub-options
    for opt in options:
        text = opt.get("text", "")
        if re.search(r"[b-e]\)\s+", text):
            issues.append((qid, page, f"Option {opt['letter']} contains embedded option delimiter: {text[:60]}..."))
        if "Texto para" in text:
            issues.append((qid, page, f"Option {opt['letter']} contains 'Texto para': {text[:60]}..."))
            
    # 3. Statement with residual text headers
    if "Texto para" in stmt and not stmt.startswith("Texto para"):
        # Let's check if 'Texto para as questões' is inside statement
        m = re.search(r"Texto\s+para\s+(?:a|as)\s+quest", stmt, re.I)
        if m:
            issues.append((qid, page, f"Statement contains residual 'Texto para': {stmt[:80]}..."))
            
    # 4. Corrupted characters
    full_str = json.dumps(r, ensure_ascii=False)
    if "" in full_str:
        issues.append((qid, page, "Contains replacement character "))
    for bad in ["\x91", "\x92", "\x93", "\x94", "\x96", "\x97", "†", "‡"]:
        if bad in full_str:
            issues.append((qid, page, f"Contains raw byte/symbol: {repr(bad)}"))

print(f"\n--- Total issues found: {len(issues)} ---")
for qid, page, desc in issues[:40]:
    print(f"[{qid} p.{page}] {desc}")
