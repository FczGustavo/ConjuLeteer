import sys
import json
import re
from pathlib import Path
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")

reader = pypdf.PdfReader(str(PDF_PATH))
print("Total pages in PDF:", len(reader.pages))

# 1. Investigate Gender section in PDF
print("\n--- Investigating Gender section ---")
for i, page in enumerate(reader.pages):
    txt = page.extract_text() or ""
    if "GENDER" in txt.upper() or "GÊNERO" in txt.upper():
        print(f"Page {i+1} mentions GENDER:")
        first_few = "\n".join([line.strip() for line in txt.splitlines() if line.strip()][:10])
        print(first_few)
        print("-" * 40)

# 2. Investigate EFOMM 2011 in PDF (Anexo 3)
print("\n--- Investigating EFOMM 2011 in PDF ---")
for i, page in enumerate(reader.pages):
    txt = page.extract_text() or ""
    if "first extract" in txt.lower() or "japanese shipyard" in txt.lower():
        print(f"Page {i+1} mentions first extract / japanese shipyard:")
        print(txt[:1000])
        print("=" * 50)
