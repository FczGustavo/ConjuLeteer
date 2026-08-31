import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from test_strict_parser import clean_portuguese, parse_strict_options

pdf_path = r"c:\Users\gusta\Documents\ConjuLetter\lists\1. Fonética e Fonologia.pdf"

with pdfplumber.open(pdf_path) as pdf:
    pages_text = [pdf.pages[i].extract_text() or "" for i in range(len(pdf.pages))]
    full_text = "\n".join(pages_text)

cleaned_full_text = clean_portuguese(full_text)

# Find Questão 41 block
p41 = cleaned_full_text.find("Questão 41")
p42 = cleaned_full_text.find("Questão 42")

block41 = cleaned_full_text[p41:p42]

stmt_part, raw_opts = parse_strict_options(block41)

print("=== STMT PART ===")
print(stmt_part)
print("\n=== RAW OPTS ===")
for let, txt in raw_opts:
    print(f"[{let}] {txt[:60]}...")
