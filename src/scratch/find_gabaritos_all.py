import pypdf
import os
import re
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"
files = [
    "1. Fonética e Fonologia.pdf",
    "2. Acentuação.pdf",
    "3. Estrutura e Formação de Palavras.pdf",
    "4. Classes de Palavras Variaveis.pdf",
    "5. Classes de Palavras invariáveis.pdf",
    "6. Pronomes.pdf",
    "7. Verbos.pdf"
]

for filename in files:
    path = os.path.join(pdf_dir, filename)
    if not os.path.exists(path):
        continue
    reader = pypdf.PdfReader(path)
    total_pages = len(reader.pages)
    
    print(f"=== {filename} (Total Pages: {total_pages}) ===")
    
    # Search for "Gabarito" or "Lista de Questões"
    gab_pages = []
    exercise_pages = []
    
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if re.search(r'\bGabarito\b', text, re.IGNORECASE):
            gab_pages.append(idx + 1)
        if re.search(r'Lista de Questões|Questão 0?1\b|Exercícios Propostos', text, re.IGNORECASE):
            exercise_pages.append(idx + 1)
            
    print(f"  Pages mentioning 'Gabarito': {gab_pages}")
    print(f"  Pages mentioning Exercises/Questions: {exercise_pages[:10]}")
    
    # Check the text on the last gabarito page found
    if gab_pages:
        last_p = gab_pages[-1]
        t = reader.pages[last_p - 1].extract_text()
        # Find matches like "01. A" or "1. A" or "1 - A" or "1 D"
        g_matches = re.findall(r'(\d{1,3})\s*[\.\-\)]\s*([A-E])\b', t)
        print(f"  Found {len(g_matches)} gabarito entries on page {last_p}: {g_matches[:15]}...")
    print()
