import pypdf
import os
import re

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

for filename in files:
    path = os.path.join(pdf_dir, filename)
    if not os.path.exists(path):
        print(f"File not found: {filename}")
        continue
    try:
        reader = pypdf.PdfReader(path)
        num_pages = len(reader.pages)
        
        # Extract last 3 pages to find GABARITO
        last_pages_text = ""
        for p_idx in range(max(0, num_pages - 4), num_pages):
            last_pages_text += reader.pages[p_idx].extract_text() + "\n"
            
        gab_match = re.search(r'GABARITO.*', last_pages_text, re.DOTALL | re.IGNORECASE)
        gab_snippet = gab_match.group(0)[:300] if gab_match else "GABARITO not found in last 4 pages"
        
        print(f"=== {filename} ===")
        print(f"  Pages: {num_pages}")
        print(f"  Gabarito snippet: {gab_snippet.replace(chr(10), ' ')}")
        print()
    except Exception as e:
        print(f"Error reading {filename}: {e}")
