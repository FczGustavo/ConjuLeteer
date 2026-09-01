"""Inspect page 169 of the PDF in detail."""

import pdfplumber
from pathlib import Path

PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")

with pdfplumber.open(PDF_PATH) as pdf:
    page = pdf.pages[168] # page 169
    print(page.extract_text())
