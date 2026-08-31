import pypdf
import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces
from test_strict_parser import clean_portuguese, parse_strict_options
from text_purifier import deep_clean_portuguese
from test_advanced_split import split_reading_statement_advanced

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"

PDF_CONFIGS = [
    { "file": "1. Fonética e Fonologia.pdf", "count": 81 },
    { "file": "2. Acentuação.pdf", "count": 74 },
    { "file": "3. Estrutura e Formação de Palavras.pdf", "count": 94 },
    { "file": "4. Classes de Palavras Variaveis.pdf", "count": 69 },
    { "file": "5. Classes de Palavras invariáveis.pdf", "count": 28 },
    { "file": "6. Pronomes.pdf", "count": 93 },
    { "file": "7. Verbos.pdf", "count": 92 },
    { "file": "16. Modos Verbais I  - [✅].pdf", "count": 30 },
    { "file": "17.  Modos Verbais II  - [✅].pdf", "count": 30 }
]

total_reading_split = 0
total_long_statement_left = 0

for cfg in PDF_CONFIGS:
    filepath = os.path.join(pdf_dir, cfg["file"])
    reader = pypdf.PdfReader(filepath)
    full_text = ""
    for p in reader.pages:
        full_text += "\n" + p.extract_text()
    cleaned = clean_portuguese(full_text)
    
    if cfg["file"].startswith("16.") or cfg["file"].startswith("17."):
        pattern = re.compile(r'(\n\s*(\d+)\s*[\)\.\-]\s+)', re.IGNORECASE)
    else:
        pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
        
    matches = list(pattern.finditer(cleaned))
    seen = set()
    for i, m in enumerate(matches):
        q_num = int(m.group(2))
        if q_num in seen or q_num > cfg["count"]: continue
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
        stmt_part, raw_opts = parse_strict_options(block)
        r, s = split_reading_statement_advanced(stmt_part)
        
        if r:
            total_reading_split += 1
        if len(s) > 450:
            total_long_statement_left += 1
            # print(f"[{cfg['file']} Q{q_num}] Long stmt ({len(s)} chars): {s[:100]}...")

print(f"\n==========================================")
print(f"Total Reading texts isolated: {total_reading_split}")
print(f"Statements longer than 450 chars left: {total_long_statement_left}")
print(f"==========================================")
