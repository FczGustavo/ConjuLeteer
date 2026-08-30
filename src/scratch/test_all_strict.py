import pypdf
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces
from test_strict_parser import clean_portuguese, parse_strict_options

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"
files = [
    ("1. Fonética e Fonologia.pdf", 81),
    ("2. Acentuação.pdf", 74),
    ("3. Estrutura e Formação de Palavras.pdf", 94),
    ("4. Classes de Palavras Variaveis.pdf", 69),
    ("5. Classes de Palavras invariáveis.pdf", 28),
    ("6. Pronomes.pdf", 93)
]

total_long = 0
for filename, count in files:
    filepath = os.path.join(pdf_dir, filename)
    reader = pypdf.PdfReader(filepath)
    full_text = ""
    for page in reader.pages:
        full_text += "\n" + page.extract_text()
    cleaned = clean_portuguese(full_text)
    
    pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
    matches = list(pattern.finditer(cleaned))
    
    file_long = 0
    seen = set()
    for i, m in enumerate(matches):
        q_num = int(m.group(2))
        if q_num in seen or q_num > count: continue
        seen.add(q_num)
        start = m.start()
        end = len(cleaned)
        for j in range(i+1, len(matches)):
            next_num = int(matches[j].group(2))
            if next_num > q_num:
                end = matches[j].start()
                break
        p_gab = cleaned.find("Respostas:")
        if p_gab != -1 and end > p_gab and start < p_gab:
            end = p_gab
            
        block = cleaned[start:end].strip()
        stmt, opts = parse_strict_options(block)
        
        for let, text in opts:
            if len(text) > 350:
                file_long += 1
                print(f"[{filename}] Q{q_num} Opt {let} ({len(text)} chars): {text[:60]}...")
                
    print(f"{filename}: {len(seen)} questions parsed, {file_long} long options.")
    total_long += file_long

print(f"\nTOTAL LONG OPTIONS ACROSS ALL 6 PDFS: {total_long}")
