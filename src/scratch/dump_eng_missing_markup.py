"""Find all real missing markup cases across Portuguese and English and print their full details."""

import json
from pathlib import Path
from pypdf import PdfReader
import pdfplumber
import re

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")

# English
eng_ts = (ROOT / "src" / "data" / "englishQuestionBank.ts").read_text(encoding="utf-8")
eng_json_match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\];", eng_ts, re.S)
eng_questions = json.loads(json.loads(eng_json_match.group(1)))

# Let's inspect the English questions
eng_pdf = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
with pdfplumber.open(eng_pdf) as pdf:
    for q in eng_questions:
        stmt = q["statement"]
        opts = [o["text"] for o in q["options"]]
        sup = q.get("support") or {}
        sup_text = " ".join([sup.get("title", ""), *(sup.get("paragraphs", [])), sup.get("source", "")])
        full = f"{stmt} {sup_text} {' '.join(opts)}"
        
        # Check if statement mentions bold/underline/destacado/grifado
        if re.search(r"\b(?:sublinhad[oa]s?|grif[oa]s?|destacad[oa]s?|em negrito|highlighted|underlined|bold)\b", stmt, re.I):
            if not re.search(r"<u>.+?</u>|\*\*.+?\*\*", full, re.S):
                pno = q["provenance"]["questionPage"]
                print(f"==================================================")
                print(f"[ENG] {q['id']} (Page {pno})")
                print(f"Statement:\n{stmt}")
                print(f"Options:\n{opts}")
                page_text = pdf.pages[pno - 1].extract_text()
                # print lines mentioning question
                for line in page_text.splitlines():
                    if f"{q['questionNumber']:03d}" in line:
                        print(f"PDF line: {line}")
