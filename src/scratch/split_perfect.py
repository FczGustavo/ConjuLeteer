import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

SUBJECT_TAG_WORDS = {
    'português', 'fonema', 'fonemas', 'fonética', 'fonologia', 'acentuação', 
    'encontros', 'vocálicos', 'vocálico', 'consonantais', 'consonantal', 'dígrafos', 'dígrafo',
    'separação', 'silábica', 'divisão', 'sílaba', 'sílabas',
    'morfologia', 'sintaxe', 'período', 'simples', 'composto', 'termos', 'essenciais', 'integrantes', 'acessórios',
    'sujeito', 'classificações', 'identificação', 'predicado',
    'classes', 'palavras', 'variáveis', 'invariáveis',
    'pronomes', 'substantivo', 'adjetivo', 'artigo', 'numeral', 'advérbio', 'preposição', 'conjunção', 'interjeição',
    'verbos', 'modos', 'verbais', 'flexão', 'verbal', 'tempos', 'correlação',
    'estrutura', 'formação', 'processos', 'prefixação', 'sufixação', 'parassíntese', 'composição', 'derivação',
    'regras', 'significação', 'construções', 'empregos', 'infinitivo', 'referenciação',
    'e', 'de', 'do', 'da', 'dos', 'das', 'a', 'o', 'as', 'os', 'em', 'para', 'com', 'por'
}

def clean_subject_tags_from_header(text):
    if not text:
        return ""
    text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', text, flags=re.IGNORECASE).strip()
    
    lines = text.split('\n')
    start_idx = 0
    for i, line in enumerate(lines[:6]):
        line_clean = line.strip()
        if not line_clean:
            start_idx = i + 1
            continue
        words = re.findall(r'[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+', line_clean.lower())
        if words and all(w in SUBJECT_TAG_WORDS for w in words):
            start_idx = i + 1
        else:
            break
            
    return '\n'.join(lines[start_idx:]).strip()

FLEXIBLE_COMMAND_PATTERNS = [
    r'[Aa]s palavras\b[^\n]{1,240}',
    r'[Oo]s vocábulos\b[^\n]{1,240}',
    r'[Aa] palavra\b[^\n]{1,240}',
    r'[Oo] vocábulo\b[^\n]{1,240}',
    r'[Oo] termo\b[^\n]{1,240}',
    r'[Oo]s termos\b[^\n]{1,240}',
    r'[Aa]s formas verbais\b[^\n]{1,240}',
    r'[Aa] forma verbal\b[^\n]{1,240}',
    r'[Oo] verbo\b[^\n]{1,240}',
    r'[Oo]s verbos\b[^\n]{1,240}',
    r'Assinale\b[^\n]{1,240}',
    r'Marque\b[^\n]{1,240}',
    r'Aponte\b[^\n]{1,240}',
    r'Indique\b[^\n]{1,240}',
    r'Identifique\b[^\n]{1,240}',
    r'Relacione\b[^\n]{1,240}',
    r'Complete\b[^\n]{1,240}',
    r'Coloque\b[^\n]{1,240}',
    r'Julgue\b[^\n]{1,240}',
    r'Qual\b[^\n]{1,240}',
    r'Dentre\b[^\n]{1,240}',
    r'Quanto\b[^\n]{1,240}',
    r'Em relação\b[^\n]{1,240}',
    r'De acordo com\b[^\n]{1,240}',
    r'Com base\b[^\n]{1,240}',
    r'Sobre o texto\b[^\n]{1,240}',
    r'A sequência\b[^\n]{1,240}',
    r'A alternativa\b[^\n]{1,240}',
    r'A opção\b[^\n]{1,240}',
    r'A única alternativa\b[^\n]{1,240}',
    r'A mesma regra\b[^\n]{1,240}',
    r'Em qual\b[^\n]{1,240}',
    r'Em que\b[^\n]{1,240}',
    r'Em quais\b[^\n]{1,240}',
    r'Sobre ele\b[^\n]{1,240}',
    r'Sobre ela\b[^\n]{1,240}',
    r'Sobre o\b[^\n]{1,240}',
    r'Sobre a\b[^\n]{1,240}',
    r'Sobre os\b[^\n]{1,240}',
    r'Sobre as\b[^\n]{1,240}',
    r'Em\s+[“"\'‘][^\n]{1,240}',
    r'No trecho\b[^\n]{1,240}',
    r'No texto\b[^\n]{1,240}',
    r'No período\b[^\n]{1,240}',
    r'Na oração\b[^\n]{1,240}',
    r'No excerto\b[^\n]{1,240}',
    r'Nos trechos\b[^\n]{1,240}',
    r'Tendo em vista\b[^\n]{1,240}',
    r'Considerando\b[^\n]{1,240}',
    r'Considere\b[^\n]{1,240}',
    r'Analise\b[^\n]{1,240}',
    r'Lido o texto\b[^\n]{1,240}',
    r'Após a leitura\b[^\n]{1,240}',
    r'Estão corretas\b[^\n]{1,240}',
    r'Está correto o que se afirma\b[^\n]{1,240}',
    r'Há verbo\b[^\n]{1,240}',
    r'Há frase\b[^\n]{1,240}',
    r'Há presença\b[^\n]{1,240}',
    r'Ao observar\b[^\n]{1,240}',
    r'A seguir,?\b[^\n]{1,240}'
]

def split_reading_statement_perfect(text):
    text = clean_subject_tags_from_header(text)

    if len(text) < 250:
        return None, text

    # 1. Check citation split at end of support text
    citation_patterns = [
        r'(?:Fonte:\s*https?://[^\s\n]+(?:\s*\n\s*[a-z0-9\-_/]+)?)',
        r'(?:Acess(?:o|ado)\s+em:?\s*\d{1,2}\s+[a-zç\.]+\s+\d{4}\.?)',
        r'(?:Disponível\s+em:?\s*(?:<[^>]+>|https?://[^\s\n]+(?:\s*\n\s*[a-z0-9\-_/]+)?)\.?)',
        r'\((?:ANDRADE|Disponível|Acesso|Fonte:|Adaptado|Superinteressante|Veja|Folha|Estadão|Globo|Paulo Mendes Campos|Fernando Sabino|Eduardo Galeano|Eduardo Portela|Clarice Lispector|Rubem Braga|Vinicius de Moraes|Carlos Drummond|[A-Z\s,]{3,}\.\s*[^)]+\d{4}[^)]*|\b\d{4}\b\s*\.\s*p\.[^)]*|\btexto adaptado\b|\bfragmento\b)\)'
    ]
    
    best_citation_end = -1
    for pat in citation_patterns:
        for m in re.finditer(pat, text, re.IGNORECASE):
            if m.end() < len(text) - 15 and m.start() > 100:
                best_citation_end = max(best_citation_end, m.end())
                
    if best_citation_end != -1:
        reading = text[:best_citation_end].strip()
        statement = text[best_citation_end:].strip()
        reading = clean_subject_tags_from_header(reading)
        statement = clean_subject_tags_from_header(statement)
        return reading, statement

    # 2. Search for question commands anywhere in the text
    best_cmd_start = -1
    for pat in FLEXIBLE_COMMAND_PATTERNS:
        for m in re.finditer(r'(?:\n|^|[.!?…][”"\')\]]?\s+)(' + pat + r')', text, re.IGNORECASE):
            if m.start() > 100:
                best_cmd_start = max(best_cmd_start, m.start(1))
                
    if best_cmd_start != -1:
        reading = text[:best_cmd_start].strip()
        statement = text[best_cmd_start:].strip()
        reading = clean_subject_tags_from_header(reading)
        statement = clean_subject_tags_from_header(statement)
        return reading, statement

    return None, text
