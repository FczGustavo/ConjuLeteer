import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from split_perfect import split_reading_statement_perfect

test_q46 = """Sobre a importância da ciência
Parece paradoxal que, no início deste milênio, durante o que chamamos com orgulho de “era da ciência”, tantos ainda acreditem em profecias de fim de mundo. Quem não se lembra do bug do milênio ou da enxurrada de absurdos ditos todos os dias sobre a previsão maia de fim de mundo no ano 2012? Existe um cinismo cada vez maior com relação à ciência, um senso de que fomos traídos, de que promessas não foram cumpridas. Afinal, lutamos para curar doenças apenas para descobrir outras novas. Criamos tecnologias que pretendem simplificar nossas vidas, mas passamos cada vez mais tempo no trabalho. Pior ainda: tem sempre tanta coisa nova e tentadora no mercado que fica impossível acompanhar o passo da tecnologia. Os mais jovens se comunicam de modo quase que incompreensível aos mais velhos, com Facebook, Twitter e textos em celulares. Podemos ir à Lua, mas a maior parte da população continua mal nutrida. Consumimos o planeta com um apetite insaciável, criando uma devastação ecológica sem precedentes. Isso tudo graças à ciência? Ao menos, é assim que pensam os descontentes, mas não é nada disso. Primeiro, a ciência não promete a redenção humana. Ela simplesmente se ocupa de compreender como funciona a natureza, ela é um corpo de conhecimento sobre o Universo e seus habitantes, vivos ou não, acumulado através de um processo constante de refinamento e testes conhecido como método científico. A prática da ciência provê um modo de interagir com o mundo, expondo a essência criativa da natureza. Disso, aprendemos que a natureza é transformação, que a vida e a morte são parte de uma cadeia de criação e destruição perpetuada por todo o cosmo, dos átomos às estrelas e à vida. Nossa existência é parte desta transformação constante da matéria, onde todo elo é igualmente importante, do que é criado ao que é destruído. A ciência pode não oferecer a salvação eterna, mas oferece a possibilidade de vivermos livres do medo irracional do desconhecido. Ao dar ao indivíduo a autonomia de pensar por si mesmo, ela oferece a liberdade da escolha informada. Ao transformar mistério em desafio, a ciência adiciona uma nova dimensão à vida, abrindo a porta para um novo tipo de espiritualidade, livre do dogmatismo das religiões organizadas. A ciência não diz o que devemos fazer com o conhecimento que acumulamos. Essa decisão é nossa, em geral tomada pelos políticos que elegemos, ao menos numa sociedade democrática. A culpa dos usos mais nefastos da ciência deve ser dividida por toda a sociedade. Inclusive, mas não exclusivamente, pelos cientistas. Afinal, devemos culpar o inventor da pólvora pelas mortes por tiros e explosivos ao longo da história? Ou o inventor do microscópio pelas armas biológicas? A ciência não contrariou nossas expectativas. Imagine um mundo sem antibióticos, TVs, aviões, carros. As pessoas vivendo no mato, sem os confortos tecnológicos modernos, caçando para comer. Quantos optariam por isso? A culpa do que fazemos com o planeta é nossa, não da ciência. Apenas uma sociedade versada na ciência pode escolher o seu destino responsavelmente. Nosso futuro depende disso.
As palavras “paradoxal” e “orgulho” contêm, respectivamente, o mesmo número de fonemas de"""

# Add regex pattern for "As palavras ... contêm"
m = re.search(r'(?:\n|^|[.!?…]\s+)(As palavras\b[^\n.]+)', test_q46, re.IGNORECASE)
if m:
    print("Found match:", m.group(1))
    r = test_q46[:m.start(1)].strip()
    s = test_q46[m.start(1):].strip()
    print("READING LENGTH:", len(r))
    print("STATEMENT:", s)
