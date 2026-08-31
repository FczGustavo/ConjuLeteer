import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from text_purifier import deep_clean_portuguese

EXPANDED_COMMAND_STARTERS = [
    r'A sequência (?:de palavras|correta|dos vocábulos|das palavras|que contém)\b',
    r'A alternativa (?:que|em que|cujo|cuja|correta|abaixo|que apresenta|incorreta)\b',
    r'A opção (?:que|em que|cujo|cuja|correta|abaixo|incorreta)\b',
    r'Assinale a (?:opção|alternativa|única alternativa)\b',
    r'Assinale o\b',
    r'Assinale, (?:a seguir|dentre|no texto)\b',
    r'Assinale\b',
    r'Marque a (?:opção|alternativa)\b',
    r'Marque o\b',
    r'Marque V\b',
    r'Marque\b',
    r'Aponte a (?:alternativa|opção|frase)\b',
    r'Aponte o\b',
    r'Indique a (?:alternativa|opção|mesma regra)\b',
    r'Indique o\b',
    r'A mesma regra (?:de acentuação|gramatical|de concordância)\b',
    r'Ao observar (?:o ponto de vista|o texto|as palavras)\b',
    r'A seguir,?\b',
    r'Em relação (?:a|à|aos|às|ao texto|às palavras|à composição)\b',
    r'Quanto (?:à|ao|aos|às|à acentuação|à tonicidade|à formação)\b',
    r'De acordo com\b',
    r'Com base (?:no texto|ainda no texto|no fragmento|no excerto)\b',
    r'Sobre o texto\b',
    r'No trecho (?:acima|a seguir|citado|“[^”]+”)\b',
    r'No texto (?:acima|apresentado|lido)\b',
    r'No período composto\b',
    r'Lido o texto\b',
    r'O vocábulo (?:em destaque|destacado|grifado|sublinhado|“[^”]+”|[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\b',
    r'O termo (?:em destaque|destacado|grifado|sublinhado|“[^”]+”|[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\b',
    r'As palavras (?:em destaque|destacadas|grifadas|sublinhadas|“[^”]+”|[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\b',
    r'Os vocábulos (?:em destaque|destacados|grifados|sublinhados|“[^”]+”|[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\b',
    r'A palavra (?:em destaque|destacada|grifada|sublinhada|“[^”]+”|[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\b',
    r'Os termos (?:em destaque|destacados|grifados|sublinhados|“[^”]+”|[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\b',
    r'A forma verbal\b',
    r'Um mesmo fonema\b',
    r'Modi(?:fi|%|@|:|\*)cou-se\b',
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
    r'Em “[^”]+”\b',
    r'Estão corretas\b',
    r'Está correto o que se afirma\b'
]

def split_reading_statement_ultra(text):
    text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', text).strip()
    text = re.sub(r'^(?:Flexão verbal|Verbos|Português|Morfologia|Correlação de tempos e modos|Sintaxe do período simples|Significação a partir de construções verbais|Empregos do infinitivo|Sujeito classificações e identificação|Separação silábica|Acentuação|Encontros consonantais|Sílaba e fonemas|Estrutura da palavra|Classes variáveis|Classes invariáveis|Pronomes|referenciação)\s*', '', text).strip()

    # 1. Check citation split at end of support text
    # Matches patterns like "(Acesso em 22 fev. 2021)", "(Disponível em: <...>)", "(ANDRADE, Carlos...)", "(Superinteressante – 04/2011)", etc.
    citation_patterns = [
        r'(?:Acess(?:o|ado)\s+em:?\s*\d{1,2}\s+[a-zç\.]+\s+\d{4}\.?)',
        r'(?:Disponível\s+em:?\s*<[^>]+>\.?)',
        r'\((?:ANDRADE|Disponível|Acesso|Fonte:|Adaptado|Superinteressante|Veja|Folha|Estadão|Globo|[A-Z\s,]{3,}\.\s*[^)]+\d{4}[^)]*|\b\d{4}\b\s*\.\s*p\.[^)]*|\btexto adaptado\b|\bfragmento\b)\)'
    ]
    
    best_citation_end = -1
    for pat in citation_patterns:
        for m in re.finditer(pat, text, re.IGNORECASE):
            if m.end() < len(text) - 15 and m.start() > 100:
                best_citation_end = max(best_citation_end, m.end())
                
    if best_citation_end != -1:
        reading = text[:best_citation_end].strip()
        statement = text[best_citation_end:].strip()
        return reading, statement

    # 2. Search backwards for question command starters
    lines = text.split('\n')
    best_split_idx = -1
    
    for idx in range(len(lines) - 1, -1, -1):
        line = lines[idx].strip()
        for pat in EXPANDED_COMMAND_STARTERS:
            if re.match(r'^' + pat, line, re.IGNORECASE):
                pre_text = "\n".join(lines[:idx]).strip()
                if len(pre_text) > 100:
                    best_split_idx = idx
                    break
        if best_split_idx != -1:
            break
            
    if best_split_idx != -1:
        reading = "\n".join(lines[:best_split_idx]).strip()
        statement = "\n".join(lines[best_split_idx:]).strip()
        return reading, statement
        
    return None, text
