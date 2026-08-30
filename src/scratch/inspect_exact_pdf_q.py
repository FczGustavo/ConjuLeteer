import pypdf
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"c:\Users\gusta\Documents\ConjuLetter\lists\1. Fonética e Fonologia.pdf"
reader = pypdf.PdfReader(pdf_path)

# Extract pages 6, 7, 8, 9 where Q18, Q19, Q20 are located
text = ""
for p in range(5, 10):
    text += f"\n--- Page {p+1} ---\n" + reader.pages[p].extract_text()

# Search for Questão 18, Questão 19, Questão 20
for q in [18, 19, 20, 21, 22, 23]:
    m = re.search(r'(Questão\s+' + str(q) + r'[\s\S]*?)(?=Questão\s+' + str(q+1) + r'|GABARITO|Respostas:|\Z)', text, re.IGNORECASE)
    if m:
        print(f"=== PDF QUESTÃO {q} ===")
        print(m.group(1).strip())
        print()
