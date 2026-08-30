import re
import json
from fix_spaces import fix_broken_spaces
from test_bottom_parser import clean_portuguese, extract_options_from_bottom, GABARITO_PDF_7

def smart_split_reading_statement(pre_text):
    pre_text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', pre_text).strip()
    pre_text = re.sub(r'^(?:Flexão verbal|Verbos|Português|Morfologia|Correlação de tempos e modos|Sintaxe do período simples|Significação a partir de construções verbais|Empregos do infinitivo|Sujeito classificações e identificação)\s*', '', pre_text).strip()
    
    # List of triggers for exam command
    command_triggers = [
        r'Observe a conjugação',
        r'Observe o trecho',
        r'Observe os verbos',
        r'Assinale a opção',
        r'Assinale a alternativa',
        r'Assinale a única alternativa',
        r'Assinale, a seguir',
        r'Assinale o',
        r'Assinale a',
        r'Marque a opção',
        r'Marque a alternativa',
        r'Marque o',
        r'Com base no texto',
        r'Com base ainda',
        r'Em relação à composição',
        r'Em relação ao texto',
        r'Em qual das alternativas',
        r'Em qual das opções',
        r'Em qual das orações',
        r'Em que opção',
        r'Em uma das passagens',
        r'Qual das alternativas',
        r'Qual sequência',
        r'Dentre as frases',
        r'Dentre as alternativas',
        r'Há frase na voz',
        r'Há verbo na',
        r'A forma verbal sublinhada',
        r'A forma verbal destacada',
        r'A forma verbal “',
        r'A forma verbal que',
        r'A construção verbal',
        r'As formas verbais',
        r'A transposição da voz',
        r'O verbo “',
        r'O verbo em destaque',
        r'O trecho “',
        r'No trecho a seguir',
        r'No trecho “',
        r'No trecho acima',
        r'No penúltimo parágrafo',
        r'No período composto',
        r'No que concerne',
        r'Tendo em vista',
        r'Lido o texto',
        r'Considere o trecho',
        r'Considere as seguintes',
        r'Leia atentamente e assinale',
        r'Leia o trecho a seguir',
        r'Leia o fragmento seguinte',
        r'Leia a frase',
        r'Leia:',
        r'Analise os trechos a seguir',
        r'Analise o trecho abaixo',
        r'04\. \(Estratégia'
    ]
    
    # Find all matches across pre_text and pick the LAST one that is at least 60 chars in
    best_pos = -1
    for trigger in command_triggers:
        for m in re.finditer(r'(?:\n|^)\s*(' + trigger + r')', pre_text, re.IGNORECASE):
            if m.start() > 60:
                best_pos = max(best_pos, m.start())
                
    if best_pos != -1:
        reading = pre_text[:best_pos].strip()
        statement = pre_text[best_pos:].strip()
    else:
        reading = ""
        statement = pre_text
        
    return format_reading_text(reading), fix_broken_spaces(statement)

def format_reading_text(text):
    if not text: return ""
    text = fix_broken_spaces(text)
    text = re.sub(r'(\d+§|\d+º§|\d+°§)', r'\n\n\1', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

# Test
with open(r"C:\Users\gusta\.gemini\antigravity-ide\brain\67056bc6-9ca1-40e1-9b72-a304ad3b8d54\scratch\pdf_7_verbos.txt", "r", encoding="utf-8") as f:
    raw_p7 = f.read()
content_p7 = clean_portuguese(raw_p7)
pattern_p7 = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
matches_p7 = list(pattern_p7.finditer(content_p7))

long_st = 0
for i, m in enumerate(matches_p7):
    q_num = int(m.group(2))
    if q_num > 92: continue
    start = m.start()
    end = len(content_p7)
    for j in range(i+1, len(matches_p7)):
        next_num = int(matches_p7[j].group(2))
        if next_num > q_num:
            end = matches_p7[j].start()
            break
    p155 = content_p7.find("--- PAGE 155 ---")
    if p155 != -1 and end > p155: end = p155
    
    block = content_p7[start:end].strip()
    pre_text, raw_opts = extract_options_from_bottom(block)
    reading, statement = smart_split_reading_statement(pre_text)
    
    if len(statement) > 400:
        long_st += 1
        print(f"Q{q_num}: statement length {len(statement)} -> {statement[:70]}...")

print(f"Long statements remaining in PDF 7: {long_st} / 92")
