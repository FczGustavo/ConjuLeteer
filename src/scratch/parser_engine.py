import re
import json
from clean_text_engine import fix_ligatures

# Gabaritos
GABARITO_PDF_7 = {
    1: 'E', 2: 'C', 3: 'C', 4: 'A', 5: 'A', 6: 'B', 7: 'C', 8: 'B',
    9: 'C', 10: 'C', 11: 'D', 12: 'B', 13: 'B', 14: 'C', 15: 'A', 16: 'A',
    17: 'A', 18: 'B', 19: 'D', 20: 'B', 21: 'A', 22: 'A', 23: 'A', 24: 'B',
    25: 'C', 26: 'A', 27: 'D', 28: 'B', 29: 'D', 30: 'D', 31: 'A', 32: 'B',
    33: 'B', 34: 'C', 35: 'C', 36: 'E', 37: 'A', 38: 'D', 39: 'C', 40: 'E',
    41: 'A', 42: 'C', 43: 'A', 44: 'A', 45: 'B', 46: 'E', 47: 'D', 48: 'D',
    49: 'C', 50: 'E', 51: 'E', 52: 'A', 53: 'D', 54: 'A', 55: 'D', 56: 'C',
    57: 'E', 58: 'A', 59: 'A', 60: 'E', 61: 'E', 62: 'B', 63: 'E', 64: 'E',
    65: 'D', 66: 'D', 67: 'B', 68: 'A', 69: 'E', 70: 'D', 71: 'A', 72: 'D',
    73: 'E', 74: 'A', 75: 'E', 76: 'B', 77: 'A', 78: 'D', 79: 'B', 80: 'B',
    81: 'D', 82: 'A', 83: 'A', 84: 'D', 85: 'A', 86: 'E', 87: 'A', 88: 'C',
    89: 'D', 90: 'D', 91: 'E', 92: 'C'
}

def parse_full_p7():
    with open(r"C:\Users\gusta\.gemini\antigravity-ide\brain\67056bc6-9ca1-40e1-9b72-a304ad3b8d54\scratch\pdf_7_verbos.txt", "r", encoding="utf-8") as f:
        raw = f.read()
    
    content = fix_ligatures(raw)
    
    # Split by Questão N
    pattern = re.compile(r'(Questão\s+(\d+)[^\n]*)', re.IGNORECASE)
    matches = list(pattern.finditer(content))
    
    questions = []
    seen = set()
    
    for i, m in enumerate(matches):
        q_num = int(m.group(2))
        if q_num in seen or q_num > 92:
            continue
        seen.add(q_num)
        
        start = m.start()
        end = len(content)
        for j in range(i+1, len(matches)):
            next_num = int(matches[j].group(2))
            if next_num > q_num:
                end = matches[j].start()
                break
                
        p155 = content.find("--- PAGE 155 ---")
        if p155 != -1 and end > p155:
            end = p155
            
        block = content[start:end].strip()
        correct_letter = GABARITO_PDF_7.get(q_num, 'A')
        
        # Look for options: \n[A-E]\s+
        opt_pattern = re.compile(r'\n([A-E])\s+(.+?)(?=\n[A-E]\s+|\Z)', re.DOTALL)
        opt_matches = list(opt_pattern.finditer(block))
        
        support_text = ""
        statement = ""
        options = []
        
        if len(opt_matches) >= 3:
            pre_options = block[:opt_matches[0].start()].strip()
            
            # Find boundary between support text and command
            # Common command starters in Brazilian exams
            cmd_match = re.search(r'(\n(?:Observe|Assinale|Marque|Com base|Em relação|Considere|Leia atentamente|Dentre|No trecho|No período|Quanto|Na frase|Em qual|Qual|Nas opções|Caso|De acordo|A transposição|A respeito|Lido o texto)[^\n]*\n.*)', pre_options, re.DOTALL | re.IGNORECASE)
            
            if cmd_match and cmd_match.start() > 80:
                support_text = pre_options[:cmd_match.start()].strip()
                statement = pre_options[cmd_match.start():].strip()
            else:
                support_text = ""
                statement = pre_options
                
            for om in opt_matches:
                let = om.group(1).upper()
                opt_text = om.group(2).strip()
                is_correct = (let == correct_letter)
                options.append({
                    "letter": let,
                    "text": opt_text,
                    "correct": is_correct,
                    "explanation": generate_option_explanation(q_num, let, is_correct, statement, opt_text)
                })
        else:
            statement = block
            for let in ['A', 'B', 'C', 'D', 'E']:
                is_correct = (let == correct_letter)
                options.append({
                    "letter": let,
                    "text": f"Alternativa {let}",
                    "correct": is_correct,
                    "explanation": "Gabarito oficial: Alternativa " + let + (" correta." if is_correct else " incorreta.")
                })
                
        questions.append({
            "id": f"pdf7-q{q_num}",
            "listId": "pdf_7",
            "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
            "questionNumber": q_num,
            "readingText": clean_support_text(support_text),
            "statement": statement,
            "options": options,
            "correctLetter": correct_letter,
            "banca": "Concursos Militares / Vestibulares"
        })
    return questions

def clean_support_text(text):
    if not text: return ""
    text = re.sub(r'Questão\s+\d+.*?\n', '', text)
    return text.strip()

def generate_option_explanation(q_num, letter, is_correct, statement, opt_text):
    if is_correct:
        return f"Alternativa ({letter}) é o Gabarito Oficial: atende com precisão às exigências morfossintáticas e aspectuais requeridas no enunciado."
    else:
        return f"Alternativa ({letter}) está Incorreta: diverge do padrão gramatical exigido pelo enunciado ou apresenta inadequação de modo/tempo/concordância/regência."

print("Parser engine written")
