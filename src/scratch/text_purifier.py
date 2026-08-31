import re

BROKEN_WORDS_MAP = {
    r'\bh\s+omem\b': 'homem',
    r'\bh\s+omens\b': 'homens',
    r'\bestiv\s+esse\b': 'estivesse',
    r'\bestiv\s+essem\b': 'estivessem',
    r'\bcon(?:%|\*|@|fi|:)\s*ança\b': 'confiança',
    r'\bcinque\s+nta\b': 'cinquenta',
    r'\bcinquen\s+ta\b': 'cinquenta',
    r'\br\s+itmo\b': 'ritmo',
    r'\bsab\s+er\b': 'saber',
    r'\bvarand\s+a\b': 'varanda',
    r'\bút\s+il\b': 'útil',
    r'\bme\s+u\b': 'meu',
    r'\bd\s+e\b': 'de',
    r'\bnadand\s+o\b': 'nadando',
    r'\bnobrez\s+a\b': 'nobreza',
    r'\bsubstân\s+cia\b': 'substância',
    r'\bde\s+pois\b': 'depois',
    r'\bse\s+guinte\b': 'seguinte',
    r'\ba\s+s\s+eguinte\b': 'a seguinte',
    r'\bs\s+eguinte\b': 'seguinte',
    r'\bpro\s+paroxítona\b': 'proparoxítona',
    r'\bpa\s+roxítona\b': 'paroxítona',
    r'\box\s+ítona\b': 'oxítona',
    r'\bclassi\s*ficação\b': 'classificação',
    r'\bclassi\s*ficados\b': 'classificados',
    r'\bper\s+cebo\b': 'percebo',
    r'\bapre\s+senta\b': 'apresenta',
    r'\bap\s+resenta\b': 'apresenta',
    r'\bconsig\s+o\b': 'consigo',
    r'\baten\s+ção\b': 'atenção',
    r'\bsilen\s+cioso\b': 'silencioso',
    r'\birm\s+ão\b': 'irmão',
    r'\bbra\s+çada\b': 'braçada',
    r'\bbra\s+çadas\b': 'braçadas',
    r'\bdis\s+tância\b': 'distância',
    r'\bdesco\s+nhecido\b': 'desconhecido',
    r'\btrans\s+portar\b': 'transportar',
    r'\bres\s+ponda\b': 'responda',
    r'\bpro\s+posta\b': 'proposta',
    r'\bpro\s+posto\b': 'proposto',
    r'\bcon\s+serve\b': 'conserve',
    r'\bper\s+derei\b': 'perderei',
    r'\bescon\s+derá\b': 'esconderá',
    r'\bavan\s+ça\b': 'avança',
    r'\bener\s+gia\b': 'energia',
    r'\balter\s+nado\b': 'alternado',
    r'\bmovi\s+mento\b': 'movimento',
    r'\btran\s+quilo\b': 'tranquilo',
    r'\batingi\s+sse\b': 'atingisse',
    r'\bresi\s+de\b': 'reside',
    r'\bgra\s+ndeza\b': 'grandeza',
    r'\bfazen\s+do\b': 'fazendo',
    r'\balgu\s+ém\b': 'alguém',
    r'\bcons\s+truindo\b': 'construindo',
    r'\bcer\s+tamente\b': 'certamente',
    r'\bespe\s+rá-lo\b': 'esperá-lo',
    r'\bes\s+perá-lo\b': 'esperá-lo',
    r'\baper\s+tar\b': 'apertar',
    r'\besti\s+ma\b': 'estima',
    r'\bcor\s+reto\b': 'correto',
    r'\bconforto\s+s\s+tecnológicos\b': 'confortos tecnológicos',
    r'\bconforto\s+stecnológicos\b': 'confortos tecnológicos',
    r'\bc\s+ada\b': 'cada',
    r'\bdura\s+nte\b': 'durante',
    r'\bdeixand\s+o\b': 'deixando',
    r'\bb\s+usca\b': 'busca',
    r'\bconhecem\s+os\b': 'conhecemos',
    r'\bma\s+is\b': 'mais',
    r'\balime\s+ntam-se\b': 'alimentam-se',
    r'\bre\s+vira\b': 'revira',
    r'\bdesa(?:fi|%|@|:|\*)\s+o\b': 'desafio',
    r'\bdesa(?:fi|%|@|:|\*)\s+os\b': 'desafios',
    r'\bpolíti\s+cas\b': 'políticas',
    r'\bpúb\s+licas\b': 'públicas',
    r'\bo\s+bstinado\b': 'obstinado',
    r'\bc\s+om\b': 'com',
    r'\bacon\s+tece\b': 'acontece',
    r'\bregra\s+s\b': 'regras',
    r'\bdi\s+ferentes\b': 'diferentes',
    r'\balt\s+ernativas\b': 'alternativas',
    r'\bpossi\s+bilidades\b': 'possibilidades',
    r'\banô\s+nimo\b': 'anônimo',
    r'\bavan\s+çado\b': 'avançado',
    r'\bcompa\s+recimento\b': 'comparecimento',
    r'\bcom\s+preensão\b': 'compreensão',
    r'\bcomuni\s+cação\b': 'comunicação',
    r'\bde\s+finição\b': 'definição',
    r'\bexerci\s+tado\b': 'exercitado',
    r'\bexpli\s+cação\b': 'explicação',
    r'\bhipó\s+tese\b': 'hipótese',
    r'\biden\s+tificação\b': 'identificação',
    r'\bincor\s+reção\b': 'incorreção',
    r'\bmo\s+delo\b': 'modelo',
    r'\bneces\s+sidade\b': 'necessidade',
    r'\bobs\s+táculo\b': 'obstáculo',
    r'\bper\s+sonagem\b': 'personagem',
    r'\bpos\s+sível\b': 'possível',
    r'\bpro\s+blema\b': 'problema',
    r'\bqua\s+lidade\b': 'qualidade',
    r'\brea\s+lidade\b': 'realidade',
    r'\brela\s+cionado\b': 'relacionado',
    r'\bsigni\s*ficação\b': 'significação',
    r'\bsigni\s*ficativo\b': 'significativo',
    r'\bsitua\s+ção\b': 'situação',
    r'\bsubs\s+tituição\b': 'substituição',
    r'\btransfor\s+mação\b': 'transformação',
    r'\bva\s+lor\b': 'valor',
    r'\bve\s+lho\b': 'velho',
    r'\bvi\s+são\b': 'visão',
    r'\bvo\s+cábulo\b': 'vocábulo',
    r'\bvo\s+cábulos\b': 'vocábulos',
    r'\bnega\s+tiva\b': 'negativa',
    r'\bnega\s+tivo\b': 'negativo',
    r'\bpriv\s+acidade\b': 'privacidade',
    r'\bexpecta\s+tiva\b': 'expectativa',
    r'\bexpecta\s+tivas\b': 'expectativas',
    r'\bqua\s+se\b': 'quase',
    r'\bsexi\s+sta\b': 'sexista',
    r'\bsexi\s+stas\b': 'sexistas',
    r'\bpess\s+oas\b': 'pessoas',
    r'\bpre\s+tendem\b': 'pretendem',
    r'\bincom\s+preensível\b': 'incompreensível',
    r'\btransf\s+ormação\b': 'transformação',
    r'\btransf\s+ormar\b': 'transformar',
    r'\bconsta\s+nte\b': 'constante',
    r'\bcu\s+lpa\b': 'culpa',
    r'\bImagi\s+ne\b': 'Imagine',
    r'\ba\s+petite\b': 'apetite',
    r'\bciênc\s+ia\b': 'ciência',
    r'\bciê\s+ncia\b': 'ciência',
    r'\bvi\s+vos\b': 'vivos',
    r'\bre\s+Pete\b': 'reflete',
    r'\bPolític\s+os\b': 'Políticos',
    r'\bPolític\s+as\b': 'Políticas',
    r'\bEntã\s+o\b': 'Então',
    r'\bAfin\s+al\b': 'Afinal',
    r'\bAfina\s+l\b': 'Afinal',
    r'\baind\s+a\b': 'ainda',
    r'\bindivídu\s+o\b': 'indivíduo',
    r'\bn\s+ovo\b': 'novo',
    r'\bn\s+ova\b': 'nova',
    r'\bp\s+or\b': 'por',
    r'\bl\s+inguag\s+em\b': 'linguagem',
    r'\blinguag\s+em\b': 'linguagem',
    r'\br\s+elação\b': 'relação',
    r'\bd\s+izer\b': 'dizer',
    r'\bp\s+orvir\b': 'porvir',
    r'\bva\s+i\b': 'vai',
    r'\bn\s+o\s+final\b': 'no final'
}

def deep_clean_portuguese(text):
    if not text:
        return ""
        
    # 1. Remove student ID watermarks
    text = re.sub(r'\b\d{6,}\b', '', text)
    text = re.sub(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b', '', text)
    
    # 2. Universal (cid:XX) glyph code replacement
    text = re.sub(r'\(cid:80\)', 'fl', text)
    text = re.sub(r'\(cid:81\)', 'fl', text)
    text = re.sub(r'\(cid:82\)', 'fl', text)
    text = re.sub(r'\(cid:37\)', 'fi', text)
    text = re.sub(r'\(cid:58\)', 'fi', text)
    text = re.sub(r'\(cid:42\)', 'fi', text)
    text = re.sub(r'\(cid:\d+\)', 'fi', text)
    
    # 3. Fix specific 'fl' words with * or W or fi
    fl_words = {
        'refiete': 'reflete', 'refietem': 'refletem', 'refieto': 'refleto', 'refietido': 'refletido',
        'infiuência': 'influência', 'infiuencia': 'influência', 'infiuente': 'influente',
        'infiuenciar': 'influenciar', 'infiuenciadores': 'influenciadores', 'infiuenciador': 'influenciador',
        'infiuenciou': 'influenciou', 'infIuenciou': 'influenciou',
        'confiitante': 'conflitante', 'confiitantes': 'conflitantes', 'confiito': 'conflito', 'confiitos': 'conflitos',
        'afiição': 'aflição', 'afiições': 'aflições', 'afiito': 'aflito', 'afiitos': 'aflitos', 'afiita': 'aflita', 'afiitas': 'aflitas',
        'con*ito': 'conflito', 'con*itos': 'conflitos',
        're*exo': 'reflexo', 're*exos': 'reflexos', 're*exão': 'reflexão',
        'in*uenciou': 'influenciou', 'in*uencia': 'influência', 'in*uência': 'influência',
        'in*uente': 'influente', 'in*uxo': 'influxo',
        'a*ito': 'aflito', 'a*itos': 'aflitos', 'a*ição': 'aflição',
        '*ores': 'flores', '*or': 'flor', '*oresta': 'floresta',
        'inWuenciou': 'influenciou', 'inWuencia': 'influência', 'inWuência': 'influência',
        'inWuente': 'influente', 'inWuxo': 'influxo',
        'conWito': 'conflito', 'conWitos': 'conflitos',
        'ReWexo': 'Reflexo', 'reWexo': 'reflexo', 'reWexos': 'reflexos',
        'aWito': 'aflito', 'aWição': 'aflição',
        'Wores': 'flores', 'Wor': 'flor'
    }
    for bad, good in fl_words.items():
        text = text.replace(bad, good)
        text = text.replace(bad.capitalize(), good.capitalize())
        text = text.replace(bad.upper(), good.upper())
        
    # 3. Universal ligature replacement for * inside or starting words (always 'fi')
    text = re.sub(r'([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])\*([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])', r'\1fi\2', text)
    text = re.sub(r'(^|[\s\(\[\"\'“])\*([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)
    
    # 4. Universal ligature replacement for % inside words (always 'fi')
    text = re.sub(r'([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])%([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])', r'\1fi\2', text)
    text = re.sub(r'(^|[\s\(\[\"\'“])%([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)
    
    # 5. Universal ligature replacement for : inside words (like modi:cação -> modificação, :lósofo -> filósofo)
    text = re.sub(r'([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]):([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])', r'\1fi\2', text)
    text = re.sub(r'(^|[\s\(\[\"\'“]):([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)
    
    # 6. Universal ligature replacement for @ inside words (except neutral pronouns)
    def clean_at(match):
        w = match.group(0)
        if w.lower() in ['tod@s', 'el@s', 'amig@s', 'menin@s']:
            return w
        return w.replace('@', 'fi')
        
    text = re.sub(r'\b[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+@[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+\b', clean_at, text)
    text = re.sub(r'(^|[\s\(\[\"\'“])@([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)

    # 7. Apply explicit broken words dictionary
    for pat, repl in BROKEN_WORDS_MAP.items():
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)

    # 8. Join single isolated consonant with following word chunk
    def join_prefix_consonant(m):
        c = m.group(1)
        w = m.group(2)
        if c.lower() in ['i', 'v', 'x'] and w.isupper():
            return m.group(0)
        return c + w

    text = re.sub(r'(?<=\s)([bcdfghjklmnpqrstvxyzBCDFGHJKLMNPQRSTVXYZ])\s+([a-záéíóúâêîôûãõç]{2,})', join_prefix_consonant, text)

    # 9. Join word ending with single trailing consonant
    def join_suffix_consonant(m):
        w = m.group(1)
        c = m.group(2)
        return w + c

    text = re.sub(r'([a-záéíóúâêîôûãõç]{3,})\s+([bcdfghjklmnpqrstvxyz])(?=\s|[,.;:!?\-]|\b)', join_suffix_consonant, text)

    # 11. Normalize hyphen spacing in verbs and words (e.g. "encontram- se" -> "encontram-se")
    text = re.sub(r'([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)\s*-\s+([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1-\2', text)
    
    # 12. Strip leading dangling punctuation
    text = re.sub(r'^[)\].:;,\-\s]+', '', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
