import re
import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces

def clean_portuguese(text):
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    # Remove recurring page headers/footers like "Acessar Lista", "Separação silábica Português", "Acentuação Português", etc.
    text = re.sub(r'--- PAGE \d+ ---\s*', '', text)
    text = re.sub(r'Acessar Lista\s*', '', text)
    return text

def parse_strict_options(question_block):
    lines = []
    for raw_line in question_block.split('\n'):
        line = raw_line.strip()
        if not line:
            continue
        # PDF.js preserves bold option labels as Markdown (``**a)**``).
        # Normalize only that leading label so the strict parser can recover
        # the real alternatives instead of emitting placeholders.
        line = re.sub(
            r'^\*{1,2}([A-E])(?:\)|\.)\*{0,2}(?:\)|\.)?\s*',
            lambda match: f'{match.group(1).upper()}) ',
            line,
            flags=re.IGNORECASE,
        )
        lines.append(line)
    
    # We look for option markers from bottom up
    # A valid option marker is either:
    # 1. Standalone letter at start of line: "^([A-E])[\s\)\.\-]\s*(.*)"
    # 2. Or single letter line "^([A-E])$" followed by text on next line
    
    opt_pat = re.compile(r'^([A-E])(?:[\s\)\.\-\:]\s*(.*)|$)', re.IGNORECASE)
    
    # Find all line indices matching option letter pattern
    matched_lines = []
    for idx, line in enumerate(lines):
        m = opt_pat.match(line)
        if m:
            let = m.group(1).upper()
            rest = m.group(2) or ''
            matched_lines.append((idx, let, rest))
            
    # Now find the last sequence of A, B, C, D (and optionally E)
    # in alphabetical order
    best_seq = None
    for i in range(len(matched_lines)):
        seq = [matched_lines[i]]
        expected_next = chr(ord(seq[0][1]) + 1)
        
        for j in range(i + 1, len(matched_lines)):
            if matched_lines[j][1] == expected_next and matched_lines[j][0] > seq[-1][0]:
                seq.append(matched_lines[j])
                expected_next = chr(ord(seq[-1][1]) + 1)
                if len(seq) == 5: # A, B, C, D, E
                    break
                    
        if len(seq) >= 4 and seq[0][1] == 'A':
            best_seq = seq
            
    if not best_seq:
        # Fallback
        return question_block, [('A', 'Opção A'), ('B', 'Opção B'), ('C', 'Opção C'), ('D', 'Opção D')]
        
    first_opt_idx = best_seq[0][0]
    statement_lines = lines[:first_opt_idx]
    
    # Build options text
    options = []
    for idx, (line_idx, let, first_text) in enumerate(best_seq):
        next_line_idx = best_seq[idx + 1][0] if idx + 1 < len(best_seq) else len(lines)
        opt_text_lines = []
        if first_text:
            opt_text_lines.append(first_text)
        for k in range(line_idx + 1, next_line_idx):
            opt_text_lines.append(lines[k])
        options.append((let, fix_broken_spaces(" ".join(opt_text_lines))))
        
    statement_text = "\n".join(statement_lines)
    return statement_text, options

# Test on 1. Fonética e Fonologia.pdf
pdf_path = r"c:\Users\gusta\Documents\ConjuLetter\lists\1. Fonética e Fonologia.pdf"
reader = pypdf.PdfReader(pdf_path)
full_text = ""
for page in reader.pages:
    full_text += "\n" + page.extract_text()
cleaned = clean_portuguese(full_text)

# Split by "Questão X"
pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
matches = list(pattern.finditer(cleaned))

print(f"Total question matches in Fonética: {len(matches)}")
long_opts = 0
for i, m in enumerate(matches[:81]):
    q_num = int(m.group(2))
    start = m.start()
    end = matches[i+1].start() if i+1 < len(matches) else len(cleaned)
    p_gab = cleaned.find("Respostas:")
    if p_gab != -1 and end > p_gab and start < p_gab:
        end = p_gab
        
    block = cleaned[start:end].strip()
    stmt, opts = parse_strict_options(block)
    
    for let, text in opts:
        if len(text) > 350:
            long_opts += 1
            print(f"Q{q_num} Opt {let} ({len(text)} chars): {text[:60]}...")

print(f"Long options in Fonética with strict parser: {long_opts}")
