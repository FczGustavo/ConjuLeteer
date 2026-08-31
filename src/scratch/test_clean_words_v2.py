import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Specific broken words dictionary covering all patterns from the exam lists
EXPLICIT_BROKEN_WORDS = {
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

def clean_broken_portuguese_words_v2(text):
    if not text:
        return ""

    # 1. Apply explicit broken words dictionary
    for pat, repl in EXPLICIT_BROKEN_WORDS.items():
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)

    # 2. Join single isolated consonant with following word chunk:
    # e.g. " r elação " -> " relação ", " p orvir " -> " porvir ", " d izer " -> " dizer ", " n ovo " -> " novo ", " l he " -> " lhe "
    def join_prefix_consonant(m):
        c = m.group(1)
        w = m.group(2)
        if c.lower() in ['i', 'v', 'x'] and w.isupper():
            return m.group(0)
        return c + w

    text = re.sub(r'(?<=\s)([bcdfghjklmnpqrstvxyzBCDFGHJKLMNPQRSTVXYZ])\s+([a-záéíóúâêîôûãõç]{2,})', join_prefix_consonant, text)

    # 3. Join word ending with single trailing consonant:
    # e.g. "Afina l" -> "Afinal", "conforto s" -> "confortos", "falamo s" -> "falamos", "Polític os" -> "Políticos", "út il" -> "útil"
    def join_suffix_consonant(m):
        w = m.group(1)
        c = m.group(2)
        return w + c

    text = re.sub(r'([a-záéíóúâêîôûãõç]{3,})\s+([bcdfghjklmnpqrstvxyz])(?=\s|[,.;:!?\-]|\b)', join_suffix_consonant, text)

    # 4. Clean space before punctuation: "palavra , conta" -> "palavra, conta"
    text = re.sub(r'\s+([,.;:!?])', r'\1', text)
    return text

test_s1 = 'Quando o inglês (nascido na Índia) George Orwell, n o final dos anos 40 do século passado, publicou a obra "1984" -uma assustadora utopia nega tiva quanto ao futuro das sociedades, nas quais não haveria liberdade, individualidade e priv acidade-, despontou no Ocidente um disfarçado e ansiado consenso (apoiado em uma simulada expecta tiva): tudo aquilo que ele colocara no livro jamais poderia acontecer nem se relacionava com o p orvir do mundo capitalista. No entanto a macabra história sobre uma sociedade totalitária va i além de fatos abstratos e atinge hoje, em cheio, o terreno da "mercadolatria". Orwell disse que, numa sociedade como a que prenunciou, "o crime de pensar não implica a morte, o crime de pensar é a própria morte". Pouco importa, dado que ser humano é ser capaz de d izer "não" ao que parece não ter alternativa. Apesar dos constrangimentos e da tentativa de sequestro da nossa subjetividade, pensar não é, de fato, crime e, por isso, claro, não se deve parar... _______________ MARIO SERGIO CORTELLA, filósofo, professor da PUC-SP e autor de "A Escola e o Conhecimento: Fundamentos Epistemológicos e Polític os" (ed. Cortez/IPF), entre outros, escreva aqui uma vez por mês.'

test_s2 = 'FONTE Segundo ativistas da comunicação inclusiva, a forma como falamos, escrevemos e nos comunicamos reproduz nossos valores e crenças. Entã o, muitos dos estereótipos que conhecemos são validados e perpetuados de forma qua se inconsciente. O que afirma esses ativistas é que embora a língua em si não seja sexi sta, nossa realidade é, logo a forma como nos expressamos reproduz essas desigualdades. Uma frase como "eles são os melhores trabalhadores que temos" não rePete de forma correta a diversidade e que o grupo de trabalhadores pode apresentar. Como podemos saber se há mulheres, pess oas não-binárias ou que se identificam de outra forma neste grupo? Será que essas pessoas se sentem representadas por essa generalização? Esses são alguns dos questionamentos que apresentam. (Disponível em <https://www.politize.com.br/linguag em-inclusiva-e-linguagem-neutra-entenda/> Acesso em 22 fev. 2021'

test_s3 = 'Sobre a importância da ciência Parece paradoxal que, no início deste milênio, durante o que chamamos com orgulho de “era da ciência”, tantos ainda acreditem em profecias de fim de mundo. Quem não se lembra do bug do milênio ou da enxurrada de absurdos ditos todos os dias sobre a previsão maia de fim de mundo no ano 2012? Existe um cinismo cada vez maior com r elação à ciência, um senso de que fomos traídos, de que promessas não foram cumpridas. Afina l, lutamos para curar doenças apenas para descobrir outras novas. Criamos tecnologias que pre tendem simplificar nossas vidas, mas passamos cada vez mais tempo no trabalho. Pior aind a: tem sempre tanta coisa nova e tentadora no mercado que fica impossível acompanhar o passo da tecnologia. Os mais jovens se comunicam de modo quase que incom preensível aos mais velhos, com Facebook, Twitter e textos em celulares. Podemos ir à Lua, mas a maior parte da população continua mal nutrida. Consumimos o planeta com um a petite insaciável, criando uma devastação ecológica sem precedentes. Isso tudo graças à ciênc ia? Ao menos, é assim que pensam os descontentes, mas não é nada disso. Primeiro, a ciê ncia não promete a redenção humana. Ela simplesmente se ocupa de compreender como funciona a natureza, ela é um corpo de conhecimento sobre o Universo e seus habitantes, vi vos ou não, acumulado através de um processo constante de refinamento e testes conhecido como método científico. A prática da ciência provê um modo de interagir com o mundo, expondo a essência criativa da natureza. Disso, aprendemos que a natureza é transf ormação, que a vida e a morte são parte de uma cadeia de criação e destruição perpetuada por todo o cosmo, dos átomos às estrelas e à vida. Nossa existência é parte desta transformação consta nte da matéria, onde todo elo é igualmente importante, do que é criado ao que é destruído. A ciência pode não oferecer a salvação eterna, mas oferece a possibilidade de vivermos livres do medo irracional do desconhecido. Ao dar ao indivídu o a autonomia de pensar por si mesmo, ela oferece a liberdade da escolha informada. Ao transf ormar mistério em desafio, a ciência adiciona uma nova dimensão à vida, abrindo a porta para um n ovo tipo de espiritualidade, livre do dogmatismo das religiões organizadas. A ciência não diz o que devemos fazer com o conhecimento que acumulamos. Essa decisão é nossa, em geral tomada pelos políticos que elegemos, ao menos numa sociedade democrática. A cu lpa dos usos mais nefastos da ciência deve ser dividida por toda a sociedade. Inclusive, mas não exclusivamente, pelos cientistas. Afinal, devemos culpar o inventor da pólvora pelas mortes p or tiros e explosivos ao longo da história? Ou o inventor do microscópio pelas armas biológicas? A ciência não contrariou nossas expectativas. Imagi ne um mundo sem antibióticos, TVs, aviões, carros. As pessoas vivendo no mato, sem os conforto s tecnológicos modernos, caçando para comer. Quantos optariam por isso? A culpa do que fazemos com o planeta é nossa, não da ciência. Apenas uma sociedade versada na ciência pode escolher o seu destino responsavelmente. Nosso futuro depende disso. As palavras “paradoxal” e “orgulho” contêm, respectivamente, o mesmo número de fonemas de'

print("=== SCREENSHOT 1 CLEANED V2 ===")
print(clean_broken_portuguese_words_v2(test_s1))
print("\n=== SCREENSHOT 2 CLEANED V2 ===")
print(clean_broken_portuguese_words_v2(test_s2))
print("\n=== SCREENSHOT 3 CLEANED V2 ===")
print(clean_broken_portuguese_words_v2(test_s3))
