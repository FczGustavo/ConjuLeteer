import re
from test_bottom_parser import clean_portuguese, extract_options_from_bottom

def verify_file(path, label, count):
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()
    content = clean_portuguese(raw)
    pattern = re.compile(r'(\n\s*(\d+)\s*[\)\.\-]\s+)', re.IGNORECASE)
    matches = list(pattern.finditer(content))
    
    seen = set()
    success = 0
    for i, m in enumerate(matches):
        q_num = int(m.group(2))
        if q_num in seen or q_num > count: continue
        seen.add(q_num)
        
        start = m.start()
        end = len(content)
        for j in range(i+1, len(matches)):
            next_num = int(matches[j].group(2))
            if next_num > q_num:
                end = matches[j].start()
                break
        p_gab = content.find("GABARITO")
        if p_gab != -1 and end > p_gab: end = p_gab
        
        block = content[start:end].strip()
        pre_text, options = extract_options_from_bottom(block)
        if options and len(options) >= 4:
            success += 1
        else:
            print(f"Failed {label} Q{q_num}")
    print(f"Success in {label}: {success} / {count}")

verify_file(r"C:\Users\gusta\.gemini\antigravity-ide\brain\67056bc6-9ca1-40e1-9b72-a304ad3b8d54\scratch\pdf_16_modos_1.txt", "PDF 16", 30)
verify_file(r"C:\Users\gusta\.gemini\antigravity-ide\brain\67056bc6-9ca1-40e1-9b72-a304ad3b8d54\scratch\pdf_17_modos_2.txt", "PDF 17", 30)
