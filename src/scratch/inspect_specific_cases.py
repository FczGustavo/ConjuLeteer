"""Inspect specific question cases from the PDF directly."""

from pypdf import PdfReader
from pathlib import Path
import json

PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
reader = PdfReader(str(PDF_PATH))

def inspect_page(pno: int):
    text = reader.pages[pno - 1].extract_text() or ""
    print(f"=== PAGE {pno} ===")
    print(text)

print("--- Synonyms q30 (page 146) ---")
inspect_page(146)

print("--- Adjectives q40 (page 6) ---")
inspect_page(6)

print("--- Reading Review q70-73 (page 164) ---")
inspect_page(164)

print("--- Numbers q8 (page 102) ---")
inspect_page(102)
