import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

sample_headers = [
    "Questão 41\nPortuguês Fonema\nLinguagem inclusiva e linguagem neutra: entenda a diferença!",
    "Questão 42\nAcentuação Encontros vocálicos Fonética e fonologia\nAssinale a alternativa em que não há acentuação da vogal do hiato.",
    "Questão 43\nEncontros vocálicos Português\nLeia o trecho abaixo:",
    "Questão 44\nSeparação silábica Português\nLeia:\nO homem deixou a sala...",
    "Questão 39\nSujeito classificações e identificação Termos essenciais\nNo período “A segurança alimentar..."
]

def clean_question_header(text):
    text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', text, flags=re.IGNORECASE).strip()
    
    # Strip any line that only contains category keywords
    category_pattern = r'^(?:Português|Fonema|Fonética|Fonologia|Acentuação|Encontros vocálicos|Separação silábica|Morfologia|Sintaxe do período simples|Sintaxe|Sujeito classificações e identificação|Termos essenciais|Sujeito|Classes de palavras variáveis|Classes de palavras invariáveis|Classes variáveis|Classes invariáveis|Classes|Pronomes|Verbos|Modos Verbais|Estrutura da palavra|Estrutura e formação de palavras|Formação de palavras|Regras de acentuação|Significação a partir de construções verbais|Empregos do infinitivo|referenciação|Correlação de tempos e modos|[,\s\-/–—&])+\n+'
    
    while re.match(category_pattern, text, flags=re.IGNORECASE):
        text = re.sub(category_pattern, '', text, flags=re.IGNORECASE).strip()
        
    return text.strip()

for s in sample_headers:
    print("--- BEFORE ---")
    print(s[:60])
    print("--- AFTER ---")
    print(clean_question_header(s)[:60])
    print()
