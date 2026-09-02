import sys
import re
from pathlib import Path
import pypdf

sys.stdout.reconfigure(encoding='utf-8')
from import_english_preview import GROUPS

PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
reader = pypdf.PdfReader(str(PDF_PATH))

# Check EAM (p36)
print("=== EAM (Page 36) ===")
print(reader.pages[35].extract_text()[:600])

# Check EsSA (p40)
print("\n=== EsSA (Page 40) ===")
print(reader.pages[39].extract_text()[:600])

# Check EEAr (p43)
print("\n=== EEAr (Page 43) ===")
print(reader.pages[42].extract_text()[:600])
