import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces
from text_purifier import deep_clean_portuguese

COMMAND_STARTERS = [
    r'A sequência (?:de palavras|correta|dos vocábulos|das palavras)\b',
    r'A alternativa (?:que|em que|cujo|cuja|correta|abaixo|que apresenta)\b',
    r'A opção (?:que|em que|cujo|cuja|correta|abaixo)\b',
    r'Assinale a (?:opção|alternativa|única alternativa)\b',
    r'Assinale o\b',
    r'Assinale, (?:a seguir|dentre|no texto)\b',
    r'Assinale\b',
    r'Marque a (?:opção|alternativa)\b',
    r'Marque o\b',
    r'Marque V\b',
    r'Marque\b',
    r'Em relação (?:a|à|aos|às|ao texto|às palavras|à composição)\b',
    r'Quanto (?:à|ao|aos|às|à acentuação|à tonicidade|à formação)\b',
    r'De acordo com\b',
    r'Com base (?:no texto|ainda no texto|no fragmento|no excerto)\b',
    r'Sobre o texto\b',
    r'No trecho (?:acima|a seguir|citado|“[^”]+”)\b',
    r'No texto (?:acima|apresentado|lido)\b',
    r'No período composto\b',
    r'Lido o texto\b',
    r'O vocábulo (?:em destaque|destacado|grifado|sublinhado|“[^”]+”)\b',
    r'O termo (?:em destaque|destacado|grifado|sublinhado|“[^”]+”)\b',
    r'As palavras (?:em destaque|destacadas|grifadas|sublinhadas|“[^”]+”)\b',
    r'Os vocábulos (?:em destaque|destacados|grifados|sublinhados|“[^”]+”)\b',
    r'A palavra (?:em destaque|destacada|grifada|sublinhada|“[^”]+”)\b',
    r'A forma verbal\b',
    r'Qual (?:é|das alternativas|das opções|sequência)\b',
    r'Dentre as (?:alternativas|opções|frases)\b',
    r'Há (?:presença|frase|verbo|erro|desvio)\b',
    r'Tendo em vista\b',
    r'Considerando (?:o texto|as regras|as afirmações)\b',
    r'Considere as (?:afirmações|frases|seguintes)\b',
    r'Analise (?:as proposições|os trechos|o texto|o excerto)\b',
    r'Em qual das (?:alternativas|opções|orações)\b',
    r'Em que (?:opção|alternativa|frase|parágrafo)\b',
    r'Em uma das passagens\b',
    r'Em “[^”]+”\b'
]

def split_reading_statement_advanced(text):
    # 1. Clean PDF initial tags like "Questão X", "Separação silábica", etc.
    text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', text).strip()
    text = re.sub(r'^(?:Flexão verbal|Verbos|Português|Morfologia|Correlação de tempos e modos|Sintaxe do período simples|Significação a partir de construções verbais|Empregos do infinitivo|Sujeito classificações e identificação|Separação silábica|Acentuação|Encontros consonantais|Sílaba e fonemas|Estrutura da palavra|Classes variáveis|Classes invariáveis|Pronomes|referenciação)\s*', '', text).strip()
    
    # 2. Check for bibliographic source citation at end of text (e.g. (ANDRADE... p.128-129) or (Fonte: ...) or (Disponível em: ...))
    citation_match = None
    for m in re.finditer(r'(\((?:ANDRADE|Disponível em|Fonte:|Adaptado de|[A-Z\s,]{3,}\.\s*[^)]+\d{4}[^)]*|\b\d{4}\b\s*\.\s*p\.[^)]*)\))', text, re.IGNORECASE):
        citation_match = m
        
    if citation_match and citation_match.end() < len(text) - 10:
        reading = text[:citation_match.end()].strip()
        statement = text[citation_match.end():].strip()
        return reading, statement

    # 3. Search backwards for question command triggers
    lines = text.split('\n')
    best_split_idx = -1
    
    # Check each line from the bottom up to see if it starts an exam command
    for idx in range(len(lines) - 1, -1, -1):
        line = lines[idx].strip()
        for pat in COMMAND_STARTERS:
            if re.match(r'^' + pat, line, re.IGNORECASE):
                # Ensure there is enough preceding text to justify splitting a reading text (> 120 chars)
                pre_text = "\n".join(lines[:idx]).strip()
                if len(pre_text) > 120:
                    best_split_idx = idx
                    break
        if best_split_idx != -1:
            break
            
    if best_split_idx != -1:
        reading = "\n".join(lines[:best_split_idx]).strip()
        statement = "\n".join(lines[best_split_idx:]).strip()
        return reading, statement
        
    return None, text

# Test with fonetica-q6 text
sample_q6 = """Após a leitura atenta do texto apresentado a seguir, responda à questão proposta.
HOMEM NO MAR
Rubem Braga
De minha varanda vejo, entre árvores e telhados, o mar. Não há ninguém na praia, que resplende ao sol. O vento é nordeste, e vai tangendo, aqui e ali, no belo azul das águas, pequenas espumas que marcham alguns segundos e morrem, como bichos alegres e humildes; perto da terra a onda é verde.
Mas percebo um movimento em um ponto do mar; é um homem nadando. Ele nada a uma certa distância da praia, em braçadas pausadas e fortes; nada a favor das águas e do vento, e as pequenas espumas que nascem e somem parecem ir mais depressa do que ele.
Justo: espumas são leves, não são feitas de nada, toda sua substância é água e vento e luz, e o homem tem sua carne, seus ossos, seu coração, todo seu corpo a transportar na água. Ele usa os músculos com uma calma energia; avança.
(ANDRADE, Carlos Drummond de; et al. Elenco de cronistas modernos. 8. ed. Rio de Janeiro: José Olympio, 1984. p.128-129)
A sequência de palavras que contém, respectivamente, um hiato, um encontro consonantal, um ditongo e um dígrafo é:"""

r, s = split_reading_statement_advanced(sample_q6)
print("=== SPLIT RESULT ===")
print("READING TEXT (Length:", len(r) if r else 0, "):")
print(r[:200] + "..." if r else "None")
print("\nSTATEMENT (Length:", len(s), "):")
print(s)
