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

def clean_subject_tags_from_header_fixed(text):
    if not text:
        return ""
    text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', text, flags=re.IGNORECASE).strip()
    
    lines = text.split('\n')
    start_idx = 0
    for i, line in enumerate(lines[:5]):
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

sample = """Português Fonema

Linguagem inclusiva e linguagem neutra: entenda a diferença!

Publicado em 9 de março de 2021

A linguagem inclusiva ou não sexista é aquela que busca comunicar sem excluir ou invisibilizar nenhum grupo e sem alterar o idioma como o conhecemos."""

cleaned = clean_subject_tags_from_header_fixed(sample)
print("=== CLEANED (WITH PRESERVED PARAGRAPHS) ===")
print(repr(cleaned))
