"""Inspect the 13 blank issues in detail."""

import json
from pathlib import Path
from pypdf import PdfReader

PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
DATA_TS = Path(r"c:\Users\gusta\Documents\ConjuLetter\src\data\englishQuestionBank.ts")
reader = PdfReader(str(PDF_PATH))

# load questions
import re
content = DATA_TS.read_text(encoding="utf-8")
match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\];", content, re.S)
questions = json.loads(json.loads(match.group(1)))

results = json.loads(Path(r"c:\Users\gusta\Documents\ConjuLetter\src\scratch\audit_results.json").read_text(encoding="utf-8"))
blank_issues = results["blank_issues"]

for item in blank_issues:
    qid = item["id"]
    pno = item["page"]
    q = next(x for x in questions if x["id"] == qid)
    print(f"==================================================")
    print(f"ID: {qid} (Page {pno})")
    print(f"Statement:\n{q['statement']}")
    if q.get("support"):
        print(f"Support:\n{q['support']}")
    print(f"Options:\n{[opt['text'] for opt in q['options']]}")
