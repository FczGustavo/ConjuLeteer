"""Inspect exact questions for the 5 English items."""

from pypdf import PdfReader
import pdfplumber
from pathlib import Path

PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")

with pdfplumber.open(PDF_PATH) as pdf:
    for pno, qnum in [(7, 54), (122, 74), (146, 29), (149, 8), (166, 79)]:
        page = pdf.pages[pno - 1]
        text = page.extract_text()
        print(f"================== PAGE {pno} (q{qnum}) ==================")
        lines = text.splitlines()
        for i, line in enumerate(lines):
            if f"{qnum:03d}" in line:
                print("\n".join(lines[max(0, i-5):min(len(lines), i+15)]))
                break
