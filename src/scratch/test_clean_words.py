import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Exclude valid standalone words: a, e, o, à, é, ó, u, em, um, no, na, de, do, da, se, me, te, os, as
STANDALONE_VALID = {'a', 'e', 'o', 'à', 'é', 'ó', 'u', 'em', 'um', 'no', 'na', 'de', 'do', 'da', 'se', 'me', 'te', 'os', 'as', 'ou', 'se', 'já', 'há', 'só'}

def clean_broken_portuguese_words(text):
    if not text:
        return ""

    # 1. Join single isolated consonant with following word chunk:
    # e.g. " r elação " -> " relação ", " p orvir " -> " porvir ", " d izer " -> " dizer ", " n ovo " -> " novo ", " l he " -> " lhe "
    # Note: excluding when followed by roman numerals like "I", "V", "X" in list markers
    def join_prefix_consonant(m):
        c = m.group(1)
        w = m.group(2)
        if c.lower() in ['i', 'v', 'x'] and w.isupper():
            return m.group(0) # Keep roman numerals
        return c + w

    text = re.sub(r'(?<=\s)([bcdfghjklmnpqrstvxyzBCDFGHJKLMNPQRSTVXYZ])\s+([a-záéíóúâêîôûãõç]{2,})', join_prefix_consonant, text)

    # 2. Join word with single trailing letter:
    # e.g. "Afina l" -> "Afinal", "conforto s" -> "confortos", "nadand o" -> "nadando", "indivídu o" -> "indivíduo", "Entã o" -> "Então"
    def join_suffix_letter(m):
        w = m.group(1)
        c = m.group(2)
        # Avoid joining if 'c' is 'a' / 'e' / 'o' and 'w' is a complete valid preposition/article/verb like "para", "com", "não", "sem", "sob", "sobre", "entre"
        if c.lower() in ['a', 'e', 'o'] and w.lower() in ['para', 'com', 'não', 'sem', 'sob', 'sobre', 'entre', 'contra', 'desde', 'após', 'até', 'como', 'todo', 'toda', 'esse', 'essa', 'este', 'esta', 'outro', 'outra', 'muito', 'muita', 'pouco', 'pouca']:
            return m.group(0)
        return w + c

    text = re.sub(r'([a-záéíóúâêîôûãõç]{2,})\s+([a-záéíóúâêîôûãõç])(?=\s|[,.;:!?\-]|\b)', join_suffix_letter, text)

    # 3. Known multi-letter broken syllables
    multi_map = {
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
        r'\bdesco\s+nhecido\b': 'desconhecido',
        r'\bestiv\s+esse\b': 'estivesse',
        r'\bestiv\s+essem\b': 'estivessem',
        r'\bcinque\s+nta\b': 'cinquenta',
        r'\bcinquen\s+ta\b': 'cinquenta',
        r'\bvarand\s+a\b': 'varanda',
        r'\bnadand\s+o\b': 'nadando',
        r'\bcon(?:%|\*|@|fi|:)\s*ança\b': 'confiança',
        r'\bút\s+il\b': 'útil',
        r'\bme\s+u\b': 'meu',
        r'\br\s+itmo\b': 'ritmo',
        r'\bsab\s+er\b': 'saber',
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
        r'\blinguag\s+em\b': 'linguagem'
    }
    for pat, repl in multi_map.items():
        text = re.sub(pat, repl, text, flags=re.IGNORECASE)

    # Fix space before punctuation: "palavra , conta" -> "palavra, conta"
    text = re.sub(r'\s+([,.;:!?])', r'\1', text)
    return text

# Test on the user's three screenshots!
test_s1 = 'Quando o inglês (nascido na Índia) George Orwell, n o final dos anos 40 do século passado, publicou a obra "1984" -uma assustadora utopia nega tiva quanto ao futuro das sociedades, nas quais não haveria liberdade, individualidade e priv acidade-, despontou no Ocidente um disfarçado e ansiado consenso (apoiado em uma simulada expecta tiva): tudo aquilo que ele colocara no livro jamais poderia acontecer nem se relacionava com o p orvir do mundo capitalista. No entanto a macabra história sobre uma sociedade totalitária va i além de fatos abstratos e atinge hoje, em cheio, o terreno da "mercadolatria". Orwell disse que, numa sociedade como a que prenunciou, "o crime de pensar não implica a morte, o crime de pensar é a própria morte". Pouco importa, dado que ser humano é ser capaz de d izer "não" ao que parece não ter alternativa. Apesar dos constrangimentos e da tentativa de sequestro da nossa subjetividade, pensar não é, de fato, crime e, por isso, claro, não se deve parar... _______________ MARIO SERGIO CORTELLA, filósofo, professor da PUC-SP e autor de "A Escola e o Conhecimento: Fundamentos Epistemológicos e Polític os" (ed. Cortez/IPF), entre outros, escreva aqui uma vez por mês.'

test_s2 = 'FONTE Segundo ativistas da comunicação inclusiva, a forma como falamos, escrevemos e nos comunicamos reproduz nossos valores e crenças. Entã o, muitos dos estereótipos que conhecemos são validados e perpetuados de forma qua se inconsciente. O que afirma esses ativistas é que embora a língua em si não seja sexi sta, nossa realidade é, logo a forma como nos expressamos reproduz essas desigualdades. Uma frase como "eles são os melhores trabalhadores que temos" não rePete de forma correta a diversidade e que o grupo de trabalhadores pode apresentar. Como podemos saber se há mulheres, pess oas não-binárias ou que se identificam de outra forma neste grupo? Será que essas pessoas se sentem representadas por essa generalização? Esses são alguns dos questionamentos que apresentam. (Disponível em <https://www.politize.com.br/linguag em-inclusiva-e-linguagem-neutra-entenda/> Acesso em 22 fev. 2021'

test_s3 = 'Sobre a importância da ciência Parece paradoxal que, no início deste milênio, durante o que chamamos com orgulho de “era da ciência”, tantos ainda acreditem em profecias de fim de mundo. Quem não se lembra do bug do milênio ou da enxurrada de absurdos ditos todos os dias sobre a previsão maia de fim de mundo no ano 2012? Existe um cinismo cada vez maior com r elação à ciência, um senso de que fomos traídos, de que promessas não foram cumpridas. Afina l, lutamos para curar doenças apenas para descobrir outras novas. Criamos tecnologias que pre tendem simplificar nossas vidas, mas passamos cada vez mais tempo no trabalho. Pior aind a: tem sempre tanta coisa nova e tentadora no mercado que fica impossível acompanhar o passo da tecnologia. Os mais jovens se comunicam de modo quase que incom preensível aos mais velhos, com Facebook, Twitter e textos em celulares. Podemos ir à Lua, mas a maior parte da população continua mal nutrida. Consumimos o planeta com um a petite insaciável, criando uma devastação ecológica sem precedentes. Isso tudo graças à ciênc ia? Ao menos, é assim que pensam os descontentes, mas não é nada disso. Primeiro, a ciê ncia não promete a redenção humana. Ela simplesmente se ocupa de compreender como funciona a natureza, ela é um corpo de conhecimento sobre o Universo e seus habitantes, vi vos ou não, acumulado através de um processo constante de refinamento e testes conhecido como método científico. A prática da ciência provê um modo de interagir com o mundo, expondo a essência criativa da natureza. Disso, aprendemos que a natureza é transf ormação, que a vida e a morte são parte de uma cadeia de criação e destruição perpetuada por todo o cosmo, dos átomos às estrelas e à vida. Nossa existência é parte desta transformação consta nte da matéria, onde todo elo é igualmente importante, do que é criado ao que é destruído. A ciência pode não oferecer a salvação eterna, mas oferece a possibilidade de vivermos livres do medo irracional do desconhecido. Ao dar ao indivídu o a autonomia de pensar por si mesmo, ela oferece a liberdade da escolha informada. Ao transf ormar mistério em desafio, a ciência adiciona uma nova dimensão à vida, abrindo a porta para um n ovo tipo de espiritualidade, livre do dogmatismo das religiões organizadas. A ciência não diz o que devemos fazer com o conhecimento que acumulamos. Essa decisão é nossa, em geral tomada pelos políticos que elegemos, ao menos numa sociedade democrática. A cu lpa dos usos mais nefastos da ciência deve ser dividida por toda a sociedade. Inclusive, mas não exclusivamente, pelos cientistas. Afinal, devemos culpar o inventor da pólvora pelas mortes p or tiros e explosivos ao longo da história? Ou o inventor do microscópio pelas armas biológicas? A ciência não contrariou nossas expectativas. Imagi ne um mundo sem antibióticos, TVs, aviões, carros. As pessoas vivendo no mato, sem os conforto s tecnológicos modernos, caçando para comer. Quantos optariam por isso? A culpa do que fazemos com o planeta é nossa, não da ciência. Apenas uma sociedade versada na ciência pode escolher o seu destino responsavelmente. Nosso futuro depende disso. As palavras “paradoxal” e “orgulho” contêm, respectivamente, o mesmo número de fonemas de'

print("=== SCREENSHOT 1 CLEANED ===")
print(clean_broken_portuguese_words(test_s1))
print("\n=== SCREENSHOT 2 CLEANED ===")
print(clean_broken_portuguese_words(test_s2))
print("\n=== SCREENSHOT 3 CLEANED ===")
print(clean_broken_portuguese_words(test_s3))
