import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"c:\Users\gusta\Documents\ConjuLetter\lists\1. Fonética e Fonologia.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    for p_idx in [15, 16, 17]:
        print(f"\n================ PAGE {p_idx+1} ================")
        print(pdf.pages[p_idx].extract_text() or "")
