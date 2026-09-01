"""Inspect page 164 and 102 with utf-8."""

from pypdf import PdfReader
from pathlib import Path

PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
reader = PdfReader(str(PDF_PATH))

out = []
for pno in (164, 102):
    text = reader.pages[pno - 1].extract_text() or ""
    out.append(f"=== PAGE {pno} ===\n{text}\n")

Path(r"c:\Users\gusta\Documents\ConjuLetter\src\scratch\page_inspect.txt").write_text("\n".join(out), encoding="utf-8")
print("Saved to page_inspect.txt")
