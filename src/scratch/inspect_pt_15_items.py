"""Inspect the 15 Portuguese questions."""

import json
from pathlib import Path
import re

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")
PT_TS = (ROOT / "src" / "data" / "questionBank.ts").read_text(encoding="utf-8")

pt_ids = [
    "fonetica-pdf_1_fonetica-q67",
    "fonetica-pdf_1_fonetica-q71",
    "fonetica-pdf_1_fonetica-q72",
    "fonetica-pdf_1_fonetica-q73",
    "fonetica-pdf_1_fonetica-q74",
    "fonetica-pdf_1_fonetica-q78",
    "fonetica-pdf_1_fonetica-q81",
    "formacao-pdf_3_formacao-q64",
    "formacao-pdf_3_formacao-q81",
    "formacao-pdf_3_formacao-q92",
    "classes_var-pdf_4_classes_var-q67",
    "classes_invar-pdf_5_classes_invar-q3",
    "pronomes-pdf_6_pronomes-q56",
    "pronomes-pdf_6_pronomes-q77",
    "verbos-pdf_7-q34",
]

# Let's inspect these questions from questionBank.ts
for qid in pt_ids:
    # search for id: "qid"
    pattern = rf'id:\s*"{qid}".*?statement:\s*"(.*?)",\s*options:\s*(\[.*?\])'
    match = re.search(pattern, PT_TS, re.S)
    if match:
        print(f"=== {qid} ===")
        stmt = match.group(1).replace('\\"', '"').replace('\\n', '\n')
        print(f"Statement:\n{stmt}")
        # find support if any
        sup_match = re.search(rf'id:\s*"{qid}".*?support:\s*(\{{.*?\}})', PT_TS, re.S)
        if sup_match:
            print(f"Support:\n{sup_match.group(1)[:300]}")
