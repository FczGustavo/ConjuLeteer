import re
from test_bottom_parser import clean_portuguese, extract_options_from_bottom, GABARITO_PDF_7, GABARITO_PDF_16, GABARITO_PDF_17

with open(r"C:\Users\gusta\.gemini\antigravity-ide\brain\67056bc6-9ca1-40e1-9b72-a304ad3b8d54\scratch\pdf_7_verbos.txt", "r", encoding="utf-8") as f:
    raw_p7 = f.read()

content = clean_portuguese(raw_p7)
pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
matches = list(pattern.finditer(content))

print(f"Total question matches in PDF 7: {len(matches)}")
success_count = 0

for i, m in enumerate(matches):
    q_num = int(m.group(2))
    if q_num > 92: continue
    start = m.start()
    end = len(content)
    for j in range(i+1, len(matches)):
        next_num = int(matches[j].group(2))
        if next_num > q_num:
            end = matches[j].start()
            break
            
    p155 = content.find("--- PAGE 155 ---")
    if p155 != -1 and end > p155: end = p155
    
    block = content[start:end].strip()
    pre_text, options = extract_options_from_bottom(block)
    
    if options and len(options) >= 4:
        success_count += 1
    else:
        print(f"FAILED on Questão {q_num}")

print(f"Success in PDF 7: {success_count} / 92")
