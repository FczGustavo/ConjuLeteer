import pdfplumber
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"
files = [
    "1. Fonética e Fonologia.pdf",
    "2. Acentuação.pdf",
    "3. Estrutura e Formação de Palavras.pdf",
    "4. Classes de Palavras Variaveis.pdf",
    "5. Classes de Palavras invariáveis.pdf",
    "6. Pronomes.pdf",
    "7. Verbos.pdf",
    "16. Modos Verbais I  - [✅].pdf",
    "17.  Modos Verbais II  - [✅].pdf"
]

total_broken_pdfplumber = 0

for filename in files:
    filepath = os.path.join(pdf_dir, filename)
    full_text = ""
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            full_text += "\n" + (page.extract_text() or "")
            
    m1 = re.findall(r'(?<=\s)[bcdfghjklmnpqrstvxyzBCDFGHJKLMNPQRSTVXYZ]\s+[a-záéíóúâêîôûãõç]{2,}', full_text)
    m2 = re.findall(r'[a-záéíóúâêîôûãõç]{3,}\s+[bcdfghjklmnpqrstvxyz](?=\s|[,.;:!?]|$)', full_text)
    
    broken_count = len(m1) + len(m2)
    total_broken_pdfplumber += broken_count
    print(f"[{filename}] Broken single-letters with pdfplumber: {broken_count}")

print(f"\n==========================================")
print(f"TOTAL BROKEN IN PDFPLUMBER: {total_broken_pdfplumber} (vs 2233 in pypdf)")
print(f"==========================================")
