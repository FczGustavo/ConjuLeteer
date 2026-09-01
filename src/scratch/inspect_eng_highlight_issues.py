"""Inspect the 5 English and 15 Portuguese questions against their PDFs."""

import json
from pathlib import Path
from pypdf import PdfReader
import re

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")
ENG_PDF = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
eng_reader = PdfReader(str(ENG_PDF))

eng_ts = (ROOT / "src" / "data" / "englishQuestionBank.ts").read_text(encoding="utf-8")
eng_json_match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\];", eng_ts, re.S)
eng_questions = json.loads(json.loads(eng_json_match.group(1)))

eng_ids = [
    "english_adjectives_adverbs-q54",
    "english_conjunctions-q74",
    "english_synonyms_antonyms-q29",
    "english_reading_review-q8",
    "english_reading_review-q79",
]

print("=================== ENGLISH ISSUES ===================")
for qid in eng_ids:
    q = next(x for x in eng_questions if x["id"] == qid)
    pno = q["provenance"]["questionPage"]
    print(f"\n--- {qid} (Page {pno}) ---")
    print(f"Statement:\n{q['statement']}")
    if q.get("support"):
        print(f"Support:\n{q['support']}")
    print(f"Options:\n{[opt['text'] for opt in q['options']]}")
    print(f"PDF Page {pno} excerpt:")
    page_text = eng_reader.pages[pno - 1].extract_text() or ""
    # find question snippet
    print(page_text[:1200])
