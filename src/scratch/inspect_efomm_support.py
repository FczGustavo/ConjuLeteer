import json
import re
from pathlib import Path
import pypdf

sys_stdout = open("scratch_efomm_inspect.txt", "w", encoding="utf-8")

PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
reader = pypdf.PdfReader(str(PDF_PATH))

# Let's inspect EFOMM reading pages in the PDF (around page 136)
sys_stdout.write("=== PAGE 136 ===\n")
sys_stdout.write(reader.pages[135].extract_text() + "\n\n")

sys_stdout.write("=== PAGE 137 ===\n")
sys_stdout.write(reader.pages[136].extract_text() + "\n\n")

# Let's check what json/ts files were generated for preview_reading_efomm
efomm_file = Path(r"c:\Users\gusta\Documents\ConjuLetter\src\data\englishPreview\readingEfomm.ts")
if efomm_file.exists():
    sys_stdout.write("=== EFOMM TS FILE FIRST 3000 CHARS ===\n")
    sys_stdout.write(efomm_file.read_text(encoding="utf-8")[:3000] + "\n")

sys_stdout.close()
print("Inspection written to scratch_efomm_inspect.txt")
