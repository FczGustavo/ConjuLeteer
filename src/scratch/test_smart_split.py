import re
import json
from fix_spaces import fix_broken_spaces
from test_bottom_parser import clean_portuguese, extract_options_from_bottom, GABARITO_PDF_7, GABARITO_PDF_16, GABARITO_PDF_17

def smart_split_reading_statement(pre_text):
    pre_text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', pre_text).strip()
    pre_text = re.sub(r'^(?:Flexão verbal|Verbos|Português|Morfologia|Correlação de tempos e modos|Sintaxe do período simples|Significação a partir de construções verbais|Empregos do infinitivo|Sujeito classificações e identificação)\s*', '', pre_text).strip()
    
    # Split candidates from bottom
    patterns = [
        r'(?:Lido o texto,?\s+)?observe atentamente o quesito e assinale',
        r'Lido o texto,?\s+observe atentamente',
        r'Com base no texto,?\s+responda à questão',
        r'No que concerne às formas verbais destacadas',
        r'A forma verbal sublinhada no trecho',
        r'A forma verbal sublinhada está na sua forma simples',
        r'A forma verbal que pertence à segunda conjugação',
        r'A forma verbal “[^”]+”, encontrada no texto',
        r'A construção verbal em destaque',
        r'As formas verbais predominantes do texto',
        r'As formas verbais destacadas',
        r'As formas verbais sublinhadas',
        r'A transposição da voz',
        r'O verbo “[^”]+”, no primeiro período',
        r'O verbo em destaque',
        r'O trecho “[^”]+” pode ser inteiramente',
        r'No trecho a seguir,',
        r'No trecho “[^”]+”',
        r'No trecho acima,',
        r'No penúltimo parágrafo do texto,',
        r'No período composto',
        r'Tendo em vista outros empregos',
        r'Em relação à composição linguística',
        r'Em qual das alternativas a seguir',
        r'Em qual das alternativas abaixo',
        r'Em qual das orações a seguir',
        r'Em que opção a concordância',
        r'Em uma das passagens abaixo',
        r'Qual das alternativas abaixo',
        r'Qual sequência de verbos',
        r'Dentre as frases retiradas do texto,',
        r'Dentre as alternativas apresentadas',
        r'Há frase na voz passiva',
        r'Há verbo na segunda conjugação',
        r'A única alternativa em que',
        r'Assinale a opção em que',
        r'Assinale a alternativa em que',
        r'Assinale, a seguir, a alternativa',
        r'Assinale a alternativa correta',
        r'Assinale, a seguir, o enunciado',
        r'Assinale a única alternativa',
        r'Marque a opção em que',
        r'Marque a alternativa em que',
        r'Marque a alternativa que',
        r'Considere o trecho:',
        r'Considere as seguintes frases:',
        r'Leia atentamente e assinale',
        r'Leia o trecho a seguir',
        r'Leia o fragmento seguinte',
        r'Leia:',
        r'Analise os trechos a seguir:',
        r'Analise o trecho abaixo'
    ]
    
    combined_pat = r'(\n(?:' + '|'.join(patterns) + r')\b.*)'
    m = re.search(combined_pat, pre_text, re.DOTALL | re.IGNORECASE)
    
    if m and m.start() > 80:
        reading = pre_text[:m.start()].strip()
        statement = pre_text[m.start():].strip()
    else:
        reading = ""
        statement = pre_text
        
    return format_reading_text(reading), fix_broken_spaces(statement)

def format_reading_text(text):
    if not text: return ""
    text = fix_broken_spaces(text)
    # Split paragraphs nicely
    text = re.sub(r'(\d+§|\d+º§|\d+°§)', r'\n\n\1', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

# Test on all PDF 7 questions
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
        print(f"Q{q_num}: statement still long ({len(statement)} chars) -> {statement[:70]}...")

print(f"Remaining long statements in PDF 7: {long_st} / 92")
