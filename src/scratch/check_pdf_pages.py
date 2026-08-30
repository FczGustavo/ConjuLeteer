import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"
files = [
    "1. Fonética e Fonologia.pdf",
    "2. Acentuação.pdf",
    "3. Estrutura e Formação de Palavras.pdf",
    "4. Classes de Palavras Variaveis.pdf",
    "5. Classes de Palavras invariáveis.pdf",
    "6. Pronomes.pdf"
]

for filename in files:
    path = os.path.join(pdf_dir, filename)
    reader = pypdf.PdfReader(path)
    print(f"==================================================")
    print(f"FILE: {filename} (Total Pages: {len(reader.pages)})")
    print(f"==================================================")
    
    # Print page 1
    p1 = reader.pages[0].extract_text()
    print("--- PAGE 1 ---")
    print(p1[:300])
    
    # Print last page
    p_last = reader.pages[-1].extract_text()
    print("--- LAST PAGE ---")
    print(p_last[-400:])
    print("\n")
