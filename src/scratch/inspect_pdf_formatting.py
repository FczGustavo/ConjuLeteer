import pypdf
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
]

for filename in files:
    path = os.path.join(pdf_dir, filename)
    if not os.path.exists(path):
        continue
    reader = pypdf.PdfReader(path)
    print(f"=== {filename} ({len(reader.pages)} pages) ===")
    
    # Inspect first 10 pages for formatting characteristics:
    # 1. Underlines / quotes / bold indicators in extracted text
    # 2. Support text titles, paragraphs, line breaks
    sample_text = ""
    for p in range(min(5, len(reader.pages))):
        sample_text += f"\n--- Page {p+1} ---\n" + reader.pages[p].extract_text()
        
    # Look for quotes, underlines, or highlighted keywords
    destaques = re.findall(r'([“"\'`][^”"\'`\n]{1,50}[”"\'`])', sample_text)
    underlined_indicators = re.findall(r'(destacad[oa]s?|grifad[oa]s?|sublinhad[oa]s?|em negrito)', sample_text, re.IGNORECASE)
    
    print(f"  Sample quotes/highlights found: {len(destaques)} (e.g. {destaques[:5]})")
    print(f"  Mentions of 'destacado/grifado/sublinhado': {len(underlined_indicators)}")
    print()
