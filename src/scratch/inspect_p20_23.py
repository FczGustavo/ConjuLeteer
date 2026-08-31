import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"c:\Users\gusta\Documents\ConjuLetter\lists\1. Fonética e Fonologia.pdf"

with pdfplumber.open(pdf_path) as pdf:
    for p_idx in range(19, 23):
        page = pdf.pages[p_idx]
        text = page.extract_text() or ""
        print(f"=== Page {p_idx+1} ===")
        print(text[:400])
        print("...\n")
