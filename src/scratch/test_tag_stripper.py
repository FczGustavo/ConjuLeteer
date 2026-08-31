import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

SUBJECT_TAG_WORDS = {
    'português', 'fonema', 'fonemas', 'fonética', 'fonologia', 'acentuação', 
    'encontros', 'vocálicos', 'vocálico', 'consonantais', 'consonantal',
    'separação', 'silábica', 'divisão', 'sílaba', 'sílabas',
    'morfologia', 'sintaxe', 'período', 'simples', 'termos', 'essenciais',
    'sujeito', 'classificações', 'identificação', 'predicado',
    'classes', 'palavras', 'variáveis', 'invariáveis',
    'pronomes', 'substantivo', 'adjetivo', 'artigo', 'numeral', 'advérbio', 'preposição', 'conjunção', 'interjeição',
    'verbos', 'modos', 'verbais', 'flexão', 'verbal', 'tempos', 'correlação',
    'estrutura', 'formação', 'processos',
    'regras', 'significação', 'construções', 'empregos', 'infinitivo', 'referenciação',
    'e', 'de', 'do', 'da', 'dos', 'das', 'a', 'o', 'as', 'os', 'em', 'para'
}

def clean_subject_tags_from_header(text):
    text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', text, flags=re.IGNORECASE).strip()
    
    lines = text.split('\n')
    cleaned_lines = []
    skipped_header = False
    
    for i, line in enumerate(lines):
        line_clean = line.strip()
        if not line_clean:
            continue
            
        # Check if line is purely subject tags (usually first 1-3 lines)
        if i < 4 and not skipped_header:
            words = re.findall(r'[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+', line_clean.lower())
            if words and all(w in SUBJECT_TAG_WORDS for w in words):
                # This line is purely subject metadata
                continue
            else:
                skipped_header = True
                cleaned_lines.append(line)
        else:
            cleaned_lines.append(line)
            
    return '\n'.join(cleaned_lines).strip()

sample_headers = [
    "Questão 41\nPortuguês Fonema\nLinguagem inclusiva e linguagem neutra: entenda a diferença!",
    "Questão 42\nAcentuação Encontros vocálicos Fonética e fonologia\nAssinale a alternativa em que não há acentuação da vogal do hiato.",
    "Questão 43\nEncontros vocálicos Português\nLeia o trecho abaixo:",
    "Questão 44\nSeparação silábica Português\nLeia:\nO homem deixou a sala...",
    "Questão 39\nSujeito classificações e identificação Termos essenciais\nNo período “A segurança alimentar..."
]

for s in sample_headers:
    print("--- RESULT ---")
    print(clean_subject_tags_from_header(s))
    print()
