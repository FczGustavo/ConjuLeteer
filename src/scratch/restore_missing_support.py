"""Restore support passages that live on image-only PDF pages."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "src" / "data" / "questionBank.ts"

SUPPORT: dict[tuple[str, int], str] = {}
STATEMENTS: dict[tuple[str, int], str] = {}

SUPPORT[("pdf_4_classes_var", 2)] = """Texto II

A seguir, você lerá um trecho do livro Viagens de Gulliver, um clássico da literatura universal, escrito por Jonathan Swift, publicado em 1726. O trecho foi extraído da Parte III do Capítulo 5 do livro.

“Pediu então para que trinta e seis dos garotos lessem vagarosamente as diversas linhas, à medida que elas apareciam no painel...” (fl. 34-36)"""
STATEMENTS[("pdf_4_classes_var", 2)] = "O uso do acento indicativo de crase destacado no fragmento é"

SUPPORT[("pdf_4_classes_var", 39)] = """Texto I

Trecho da peça teatral A raposa e as uvas, escrita por Guilherme de Figueiredo. A ação ocorre na cidade de Samos (Grécia antiga), na casa de Xantós, um filósofo grego, que recebe o convidado Agnostos, um capitão ateniense. O jantar é servido por Esopo e Melita, escravos de Xantós.

(Entra Esopo, com um prato que coloca sobre a mesa. Está coberto com um pano. Xantós e Agnostos se dirigem para a mesa, o primeiro faz ao segundo um sinal para sentarem-se.)

XANTÓS (Descobrindo o prato) — Ah, língua! (Começa a comer com as mãos, e faz um sinal para que Melita sirva Agnostos. Este também começa a comer vorazmente, dando grunhidos de satisfação.) Fizeste bem em trazer língua, Esopo. É realmente uma das melhores coisas do mundo. (Sinal para que sirvam o vinho. Esopo serve, Xantós bebe.) Vês, estrangeiro, de qualquer modo é bom possuir riquezas. Não gostas de saborear esta língua e este vinho?

AGNOSTOS (A boca entupida, comendo) — Hum.

XANTÓS — Outro prato, Esopo. (Esopo sai à esquerda e volta imediatamente com outro prato coberto. Serve, Xantós de boca cheia.) Que é isto? Ah, língua de fumeiro! É bom língua de fumeiro, hein, amigo?

AGNOSTOS — Hum. (Xantós serve-se de vinho.) [...]

XANTÓS (A Esopo) — Serve outro prato. (Serve.) Que trazes aí?

ESOPO — Língua.

XANTÓS — Mais língua? Não te disse que trouxesse o que há de melhor para meu hóspede? Por que só trazes língua? Queres expor-me ao ridículo?

ESOPO — Que há de melhor do que a língua? A língua é o que nos une a todos, quando falamos. Sem a língua nada poderíamos dizer. A língua é a chave das ciências, o órgão da verdade e da razão. Graças à língua dizemos o nosso amor. Com a língua se ensina, se persuade, se instrui, se reza, se explica, se canta, se descreve, se elogia, se mostra, se afirma. É com a língua que dizemos sim. É a língua que ordena os exércitos à vitória, é a língua que descobre os versos de Homero. A língua cria o mundo de Ésquilo, a palavra de Demóstenes. Toda a Grécia, Xantós, das colunas do Partenon às estátuas de Pídias, dos deuses do Olimpo à glória sobre Tróia, da ode do poeta ao ensinamento do filósofo, toda a Grécia foi feita com a língua, a língua de belos gregos claros falando para a eternidade.

XANTÓS (Levantando-se, entusiasmado, já meio ébrio) — Bravo, Esopo. Realmente, tu nos trouxeste o que há de melhor. (Toma outro saco da cintura e atira-o ao escravo.) Vai agora ao mercado, e traze-nos o que houver de pior, pois quero ver a sua verdadeira história! [...]

XANTÓS — Agora que já sabemos o que há de melhor na terra, vamos ao que há de pior na opinião deste horrendo escravo! Língua, ainda? Mais língua? Não disseste que a língua era o que havia de melhor? Queres ser espancado?

ESOPO — A língua, senhor, é o que há de pior no mundo. É a fonte de todas as intrigas, o início de todos os processos, a mãe de todas as discussões. É a língua que usa os maus poetas que nos fatigam na praça, é a língua que usam os filósofos que não sabem pensar. É a língua que mente, que esconde, que tergiversa, que blasfema, que insulta, que se acovarda, que se mendiga, que impreca, que bajula, que destrói, que calunia, que vende, que seduz, é com a língua que dizemos morrer e canalha e corja. É com a língua que dizemos não. Com a língua Aquiles mostrou sua cólera, com a língua a Grécia vai tumultuar os pobres cérebros humanos para toda a eternidade! Aí está, Xantós, porque a língua é a pior de todas as coisas!

(FIGUEIREDO, Guilherme. A raposa e as uvas — peça em 3 atos. Cópia digitalizada pelo GETEB — Grupo de Estudos e Pesquisa em Teatro Brasileiro/UFSJ.)"""

IDOLO = """Texto II

O ídolo

Em um belo dia, a deusa dos ventos beija o pé do homem, o maltratado, desprezado pé, e, desse beijo, nasce o ídolo do futebol. Nasce em berço de palha e barraco de lata e vem ao mundo abraçado a uma bola.

Desde que aprende a andar, sabe jogar. Quando criança, alegra os descampados e os baldios, joga e joga nos ermos dos subúrbios até que a noite cai e ninguém mais consegue ver a bola, e, quando jovem, voa e faz voar nos estádios. Suas artes de malabarista convocam multidões, domingo após domingo, de vitória em vitória, de ovação em ovação.

A bola o procura, o reconhece, precisa dele. No peito de seu pé, ela descansa e se embala. Ele lhe dá brilho e a faz falar, e, neste diálogo entre os dois, milhões de mudos conseguem se expressar. Os zé-ninguém, os condenados a serem para sempre ninguém, podem sentir-se alguém por um momento, por obra e graça desses passes devolvidos num toque, essas fintas que desenham os zês na grama, esses golaços de calcanhar ou de bicicleta: quando ele joga o time tem doze jogadores.

— Doze? Tem quinze! Vinte!

A bola ri, radiante, no ar. Ele a amortece, a adormece, dá gargalhadas, dança com ela, e, vendo essas coisas nunca vistas, seus adoradores sentem piedade por seus netos ainda não nascidos, que não estão vendo o que acontece.

Mas o ídolo é ídolo apenas por um momento, humana eternidade, coisa de nada; e quando chega a hora do azar para o pé de ouro, a estrela conclui sua viagem do resplendor à escuridão. Esse corpo está com mais remendos que roupa de palhaço, o acrobata virou paralítico, o artista é uma besta:

— Com a ferradura, não!

A fonte da felicidade pública se transforma no paraíso do rancor público:

— Múmia!

Às vezes, o ídolo não cai inteiro. E, às vezes, quando se quebra, a multidão o devora aos pedaços.

(Eduardo Galeano. Futebol, ao sol e à sombra.)"""

SILENCIO = """Texto I

O silêncio incomoda

Como trabalho em casa, assisto a um grande número de jogos e programas esportivos, alguns porque gosto e outros para me manter atualizado, vejo ainda muitos noticiários, filmes, programas culturais (são pouquíssimos) e também, por curiosidade, muitas coisas ruins. Estou viciado em televisão.

Não suporto mais ver tantas tragédias, crimes, violências, falcatruas e tantas politicagens para a realização da Copa de 2014.

Estou sem paciência para assistir a tantas partidas tumultuadas no Brasil, consequência do estilo de jogar, da tolerância com a violência e do ambiente bélico em que se transforma o futebol, dentro e fora do campo.

Na transmissão das partidas, fala-se e grita-se demais. Não há um único instante de silêncio, nenhuma pausa. O barulho é cada dia maior no futebol, nas ruas, nos bares, nos restaurantes e em quase todos os ambientes. O silêncio incomoda as pessoas.

É óbvio que informações e estatísticas são importantíssimas. Mas exageram. Fala-se muito, mesmo com a bola rolando. Impressiona-me como se formam conceitos, dão opiniões, baseados em estatísticas que têm pouca ou nenhuma importância.

Na partida entre Escócia e Brasil, um repórter da TV Globo deu a “grande notícia”, que Neymar foi o primeiro jogador brasileiro a marcar dois gols contra a Escócia em uma mesma partida.

Parece haver uma disputa para saber quem dá mais informações e estatísticas, e outra, entre os narradores, para saber quem grita gol mais alto e prolongado. Se dizem que a imagem vale mais que mil palavras, por que se fala e se grita tanto?

Outra discussão chata, durante e após as partidas, é se um jogador teve a intenção de colocar a mão na bola e de fazer pênalti, e se outro teve a intenção de atingir o adversário. Com raríssimas exceções, ninguém é louco para fazer pênalti nem tão canalha para querer quebrar o outro jogador.

O que ocorre, com frequência, é o jogador, no impulso, sem pensar, soltar o braço na cara do outro. O impulso está à frente da consciência. Não sou também tão ingênuo para achar que todas as faltas violentas são involuntárias.

Não dá para o árbitro saber se a falta foi intencional ou não. Ele precisa julgar o fato, e não a intenção. Eles precisam também bom senso, o que é raro no ser humano, para saber a gravidade das faltas. Muitas parecem iguais, mas não são. Ter critério não é unificar as diferenças.

(Tostão, Folha de S.Paulo, caderno D, “esporte”, p. 11, 10/04/2011.)"""
for number in (58, 59):
    SUPPORT[("pdf_4_classes_var", number)] = IDOLO

for number in (60, 61, 62):
    SUPPORT[("pdf_4_classes_var", number)] = SILENCIO

STATEMENTS[("pdf_4_classes_var", 60)] = (
    "No contexto do seguinte trecho, extraído do 7º parágrafo do texto, analise a classe gramatical a que pertencem os termos grifados:\n\n"
    "“... para saber quem grita gol mais <u>alto</u> e <u>prolongado</u>.” (l. 31 e 32)\n\n"
    "Assinale a alternativa em que o termo sublinhado pertence àquela mesma classe."
)
STATEMENTS[("pdf_4_classes_var", 61)] = (
    "Sobre o fragmento do texto “O que ocorre, com frequência, é o jogador, no impulso, sem pensar, soltar o braço na cara do outro.” (l. 40 e 41), é correto afirmar que"
)
STATEMENTS[("pdf_4_classes_var", 62)] = (
    "Assinale a alternativa que traz uma explicação pertinente ao emprego de numerais ao longo do Texto I."
)

SUPPORT[("pdf_5_classes_invar", 25)] = SILENCIO
RETRATO = """Texto I

Eu não tinha este rosto de hoje,
Assim calmo, assim triste, assim magro,
Nem estes olhos tão vazios,
Nem o lábio amargo.
Eu não tinha estas mãos sem força,
Tão paradas e frias e mortas;
Eu não tinha este coração
Que nem se mostra.
Eu não dei por esta mudança,
Tão simples, tão certa, tão fácil:
— Em que espelho ficou perdida
a minha face?

(MEIRELES, Cecília. Obra Poética de Cecília Meireles. Rio de Janeiro: José Aguilar, 1958.)"""
SUPPORT[("pdf_6_pronomes", 45)] = RETRATO
STATEMENTS[("pdf_6_pronomes", 45)] = "Analisando os versos do poema ‘Retrato’, assinale a opção correta."

def load() -> list[dict]:
    source = BANK.read_text(encoding="utf-8")
    start = source.index(" = ", source.index("export const QUESTION_BANK")) + 3
    return json.loads(source[start:].rstrip().removesuffix(";"))

def save(data: list[dict]) -> None:
    source = BANK.read_text(encoding="utf-8")
    start = source.index(" = ", source.index("export const QUESTION_BANK")) + 3
    BANK.write_text(source[:start] + json.dumps(data, ensure_ascii=False, indent=2) + chr(10), encoding="utf-8")

def main() -> None:
    data = load()
    for question in data:
        key = (question.get("listId"), question.get("questionNumber"))
        if key in SUPPORT:
            question["readingText"] = SUPPORT[key]
        if key in STATEMENTS:
            question["statement"] = STATEMENTS[key]
    save(data)
    print("restored support records")

if __name__ == "__main__":
    main()
