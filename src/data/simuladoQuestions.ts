// Banco de Questões Autênticas com Separação de Texto de Apoio e Explicações Detalhadas por Alternativa

export interface SimuladoOption {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  correct: boolean;
  explanation: string;
}

export interface SimuladoQuestion {
  id: string;
  listId: 'pdf_7' | 'pdf_16' | 'pdf_17';
  listTitle: string;
  questionNumber: number;
  readingText?: string;
  statement: string;
  options: SimuladoOption[];
  correctLetter: 'A' | 'B' | 'C' | 'D' | 'E';
  banca: string;
}

export const SIMULADO_QUESTIONS: SimuladoQuestion[] = [
  {
    "id": "pdf7-q1",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 1,
    "readingText": "Texto I\nA complicada arte de ver\n\n1§ Ela entrou, deitou-se no divã e disse: “Acho que estou ficando louca”. Eu fiquei em silêncio\naguardando que ela me revelasse os sinais da sua loucura. “Um dos meus prazeres é cozinhar. Vou\npara a cozinha, corto as cebolas, os tomates, os pimentões – é uma alegria.\n\n2§ Entretanto, faz uns dias, eu fui para a cozinha para fazer aquilo que já fizera centenas de vezes:\ncortar cebolas. Ato banal sem surpresas. Mas, cortada a cebola, eu olhei para ela e tive um susto.\nPercebi que nunca havia visto uma cebola. Aqueles anéis perfeitamente ajustados, a luz se\nrefletindo neles: tive a impressão de estar vendo a rosácea de um vitral de catedral gótica.\n\n3§ De repente, a cebola, de objeto a ser comido, se transformou em obra de arte para ser vista! E o\npior é que o mesmo aconteceu quando cortei os tomates, os pimentões… agora, tudo o que vejo\nme causa espanto.” Ela se calou, esperando o meu diagnóstico. Eu me levantei, fui à estante de\nlivros e de lá retirei as “Odes Elementales”, de Pablo Neruda. Procurei a “Ode à Cebola” e lhe\ndisse: “Essa perturbação ocular que a acometeu é comum entre os poetas. Veja o que Neruda\ndisse de uma cebola igual àquela que lhe causou assombro: ‘Rosa de água com escamas de\ncristal’. Não, você não está louca. Você ganhou olhos de poeta…Os poetas ensinam a ver”.\n\n4§ Ver é muito complicado. Isso é estranho porque os olhos, de todos os órgãos dos sentidos, são\nos de mais fácil compreensão científica. A sua física é idêntica à física óptica de uma máquina\nfotográfica: o objeto do lado de fora aparece refletido do lado de dentro. Mas existe algo na visão\nque não pertence à física. William Blake sabia disso e afirmou: “A árvore que o sábio vê não é a\nmesma árvore que o tolo vê”. Sei disso por experiência própria. Quando vejo os ipês floridos,\nsinto-me como Moisés diante da sarça ardente: ali está uma epifania do sagrado. Mas uma mulher\nque vivia perto da minha casa decretou a morte de um ipê que florescia à frente de sua casa\nporque ele sujava o chão, dava muito trabalho para a sua vassoura. Seus olhos não viam a beleza.\nSó viam o lixo. Adélia Prado disse: “Deus de vez em quando me tira a poesia. Olho para uma pedra\ne vejo uma pedra”.\n\n5§ Drummond viu uma pedra e não viu uma pedra. A pedra que ele viu virou poema. Há muitas\npessoas de visão perfeita que nada veem.\n\n6§“Não é bastante não ser cego para ver as árvores e as flores. Não basta abrir a janela para ver os\ncampos e os rios”, escreveu Alberto Caeiro, heterônimo de Fernando Pessoa. O ato de ver não é\ncoisa natural. Precisa ser aprendido.\n\n7§ Nietzsche sabia disso e afirmou que a primeira tarefa da educação é ensinar a ver. O zen-budismo concorda, e toda a sua espiritualidade é uma busca da experiência chamada “satori”, a\nabertura do “terceiro olho”. Não sei se Cummings se inspirava no zen-budismo, mas o fato é que\nescreveu: “Agora os ouvidos dos meus ouvidos acordaram e agora os olhos dos meus olhos se\nabriram”.\n\n8§ Há um poema no Novo Testamento que relata a caminhada de dois discípulos na companhia de\nJesus ressuscitado. Mas eles não o reconheciam. Reconheceram-no subitamente: ao partir do\npão, “seus olhos se abriram”.\n\n9§ Vinicius de Moraes adota o mesmo mote em “Operário em Construção”: “De forma que, certo\ndia, à mesa ao cortar o pão, o operário foi tomado de uma súbita emoção, ao constatar\nassombrado que tudo naquela mesa – garrafa, prato, facão – era ele quem fazia. Ele, um humilde\noperário, um operário em construção”.\n\n10§ A diferença se encontra no lugar onde os olhos são guardados. (...) Os olhos que moram na\ncaixa de ferramentas são os olhos dos adultos. Os olhos que moram na caixa dos brinquedos, das\ncrianças. Para ter olhos brincalhões, é preciso ter as crianças por nossas mestras.\nRubem Alves Texto Adaptado (originalmente publicado no caderno “Sinapse” - “Folha de S.\nPaulo”, em 26/10/2004)",
    "statement": "Observe a conjugação do tempo composto sublinhado, no período a seguir, e indique qual forma\nverbal pertence ao mesmo tempo e modo.\n\"[...] Percebi que nunca <u>havia visto</u> uma cebola.[..]\"",
    "options": [
      {
        "letter": "A",
        "text": "Ela entrou, deitou-se no divã e <u>disse...</u>",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Eu <u>fiquei</u> em silêncio aguardando...",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Eu fiquei em silêncio aguardando que ela me <u>revelasse</u> os sinais da sua loucura.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Entretanto, <u>faz</u> uns dias, eu fui para a cozinha...",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Para fazer aquilo que já <u>fizera</u> centenas de vezes: cortar cebolas. ",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q2",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 2,
    "readingText": "As caridades odiosas\nClarice Lispector\nFoi uma tarde de sensibilidade ou de suscetibilidade? Eu passava pela rua depressa, emaranhada\nnos meus pensamentos, como às vezes acontece. Foi quando meu vestido me reteve: alguma\ncoisa se enganchara na minha saia. Voltei-me e\nvi que se tratava de uma mão pequena e escura. Pertencia a um menino a que a sujeira e o\nsangue interno davam um tom quente de pele. O menino estava de pé no degrau da grande\nconfeitaria. Seus olhos, mais do que suas palavras meio engolidas, informavam-me de sua paciente\naflição. Paciente demais. Percebi vagamente um pedido, antes de compreender o seu sentido\nconcreto. Um pouco aturdida eu o olhava, ainda em dúvida se fora a mão da criança o que me\nceifara os pensamentos.\n— Um doce, moça, compre um doce para mim.\nAcordei finalmente. O que estivera eu pensando antes de encontrar o menino? O fato é que o\npedido deste pareceu cumular uma lacuna, dar uma resposta que podia servir para qualquer\npergunta, assim como uma grande chuva pode matar a sede de quem queria uns goles de água.\nSem olhar para os lados, por pudor talvez, sem querer espiar as mesas da confeitaria onde\npossivelmente algum conhecido tomava sorvete, entrei, fui ao balcão e disse com uma dureza que\nsó Deus sabe explicar: um doce para o menino.\nDe que tinha eu medo? Eu não olhava a criança, queria que a cena, humilhante para mim,\nterminasse logo. Perguntei-lhe: que doce você...\nAntes de terminar, o menino disse apontando depressa com o dedo: aquelezinho ali, com\nchocolate por cima. Por um instante perplexa, eu me recompus logo e ordenei, com aspereza, à\ncaixeira que o servisse.\n— Que outro doce você quer? perguntei ao menino escuro.\nEste, que mexendo as mãos e a boca ainda esperava com ansiedade pelo primeiro, interrompeu-se, olhou-me um instante e disse com delicadeza insuportável, mostrando os dentes: não precisa\nde outro não. Ele poupava a minha bondade.\n— Precisa sim, cortei eu ofegante, empurrando-o para a frente. O menino hesitou e disse: aquele\namarelo de ovo. Recebeu um doce em cada mão, levantando as duas acima da cabeça, com medo\ntalvez de apertá-los. Mesmo os doces estavam tão acima do menino escuro. E foi sem olhar para\nmim que ele, mais do que foi embora, fugiu. A caixeirinha olhava tudo:\n— Afinal uma alma caridosa apareceu. Esse menino estava nesta porta há mais de uma hora,\npuxando todas as pessoas que passavam, mas ninguém quis dar.\nFui embora, com o rosto corado de vergonha. De vergonha mesmo? Era inútil querer voltar aos\npensamentos anteriores. Eu estava cheia de um sentimento de amor, gratidão, revolta e vergonha.\nMas, como se costuma dizer, o Sol parecia brilhar com mais força. Eu tivera a oportunidade de... E\npara isso fora necessário um menino magro e escuro... E para isso fora necessário que outros não\nlhe tivessem dado um doce.\nE as pessoas que tomavam sorvete? Agora, o que eu queria saber com autocrueldade era o\nseguinte: temera que os outros me vissem ou que os outros não me vissem? O fato é que, quando\natravessei a rua, o que teria sido piedade já se estrangulara sob outros sentimentos. E, agora\nsozinha, meus pensamentos voltaram lentamente a ser os anteriores, só que inúteis. Em vez de\ntomar um táxi, tomei um ônibus. Sentei-me.\n— Os embrulhos estão incomodando?\nEra uma mulher com uma criança no colo e, aos pés, vários embrulhos de jornal. Ah não, disse-lhes\neu. “Dá-dádá”, disse a menina no colo estendendo a mão e agarrando a manga de meu vestido.\n“Ela gostou da senhora”, disse a mulher rindo. Eu também sorri.\n— Estou desde manhã na rua, informou a mulher. Fui procurar umas amizades que não estavam\nem casa. Uma tinha ido almoçar fora, a outra foi com a família para fora.\n— E a menina?\n— É menino, corrigiu ela, está com roupa dada de menina, mas é menino. O menino comeu por aí\nmesmo. Eu é que não almocei até agora.\n— E seu neto?\n— Filho, é filho, tenho mais três. Olhe só como ele está gostando da senhora... Brinca com a moça,\nmeu filho! Imagine a senhora que moramos numa passagem de corredor e pagamos uma fortuna\npor mês. O aluguel passado não pagamos ainda. E este mês está vencendo. Ele quer despejar.\nMas se Deus quiser, ainda arranjarei os dois mil cruzeiros que faltam. Já tenho o resto. Mas ele não\nquer aceitar. Ele pensa que se receber uma parte eu fico descansada dizendo: alguma coisa já\npaguei e não penso em pagar o resto.\nComo a mulher velha estava ciente dos caminhos da desconfiança. Sabia de tudo, só que tinha de\nagir como se não soubesse — raciocínio de grande banqueiro. Raciocinava como raciocinaria um\nsenhorio desconfiado, e não se irritava. Mas de repente fiquei fria: tinha entendido. A mulher\ncontinuava a falar. Então tirei da bolsa os dois mil cruzeiros e com horror de mim passei-os à\nmulher. Esta não hesitou um segundo, pegou-os, meteu-os num bolso invisível entre o que me\npareceram inúmeras saias, quase derrubando na sua rapidez o menino-menina.\n— Deus nosso Senhor lhe favoreça, disse de repente com o automatismo de uma mendiga.\nVermelha, continuei sentada de braços cruzados. A mulher também continuava ao lado.\nSó que não nos falávamos mais. Ela era mais digna do que eu havia pensado: conseguido o\ndinheiro, nada mais quis me contar. E nem eu pude mais fazer festas ao menino vestido de menina.\nPois qualquer agrado seria agora de meu direito: eu o havia pago de antemão.\nUm laço de mal-estar estabelecera-se agora entre nós duas, entre a mulher e eu, quero dizer.\n— Deixe a moça em paz, Zezinho, disse a mulher.\nEvitávamos encostar os cotovelos. Nada mais havia a dizer, e a viagem era longa. Perturbada,\nolhei-a de través: velha e suja, como se dizem das coisas. E a mulher sabia que eu a olhara.\nEntão uma ponta de raiva nasceu entre nós duas. Só o pequeno ser híbrido, radiante, enchia a\ntarde com o seu suave martelar: “dá dá dá”.\nLispector, Clarice. Clarice na cabeceira: crônicas. Rio de Janeiro: Rocco, 2010.",
    "statement": "Assinale a opção em que a forma verbal sublinhada se apresenta em um tempo verbal diferente\ndos demais.",
    "options": [
      {
        "letter": "A",
        "text": "“Um pouco aturdida eu o olhava, ainda em dúvida se <u>fora</u> a mão da criança o que me ceifara os pensamentos.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Mas, como se costuma dizer, o Sol parecia brilhar com mais força. Eu <u>tivera</u> a oportunidade de",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“O fato é que, quando atravessei a rua, o que <u>teria sido</u> piedade já se estrangulara sob outros sentimentos.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“Pois qualquer agrado seria agora de meu direito: eu o <u>havia pago</u> de antemão.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Ela era mais digna do que eu <u>havia pensado:</u> conseguido o dinheiro, nada mais quis me contar”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q3",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 3,
    "readingText": "A CADEIRINHA\nNaquele fundo de sacristia, escondida ou arredada como se fora uma imagem quebrada cuja\nausência do altar o decoro do culto exige, encontrei a cadeirinha azul, forrada de damasco cor de\nouro velho. Na frente e no fundo, dois pequenos painéis pintados em madeira com traços finos e\nexpressivos. Representava cada qual uma dama do antigo regime. A da frente, vestida de seda\nbranca, contrastava a alvura do vestido e o tênue colorido da pele com o negrume dos cabelos\nrepuxados em trunfa alta e o vivo carmim dos lábios; tinha um ar desdenhoso e fatigado de fidalga\nelegante para quem os requintes da etiqueta e galanteios dos salões são já coisas velhas e\ncomezinhas. A outra, mais antiga ainda, trazia as melenas em cachos artísticos sobre as fontes e as\npequeninas orelhas; um leque de marfim semiaberto comprimia-lhe os lábios rebeldes que\nqueriam expandir-se num riso franco; os olhos grandes e negros tinham mais paixão e mais alma.\nEsta contemporânea de La Valliere, que o artista anônimo perpetuou na madeira da cadeirinha,\nnão se parecia muito com aquela meiga vítima da região concupiscência; ao contrário, um certo\narregaçado das narinas, uma ponta de ironia que lhe voejava na comissura da boca breve e\nenérgica — tudo isso mostrava estar ali naquele painel representada uma mulher meridional,\nardente e vivaz, pronta ao amor apaixonado ou a luta odienta. [...]\nSem querer acrescentar mais ao já dito sobre as damas, perguntava de mim para mim se o pintor\ndo século passado, ao tragar com tanta correção e finura os dois retratos de mulher, transmitindo-lhes em cada cabelo do pincel uma chama de vida, não estaria realmente diante de dois espécimes\nraros de filhas de Eva, de duas heroínas que por serem de comédia ou de ópera nem por isso\ndeixam de o ser da vida real?\n— Quem sabe se a Fontagens e a Montespan?\n— Qual! Impossível!\n— Impossível, não! Porque a cadeirinha podia perfeitamente ter sido pintada em França e era até\nmais natural crê-lo; porquanto a finura das tintas e a correção dos tragos pareciam indicar uns\nartistas das grandes cortes da época.\nE assim, em tais conjeturas, pus-me a examinar mais detidamente o velho e delicado veículo,\nrelíquia do século passado, sobrevivendo não sei por que na sacristia da igreja de um modesto\narraial mineiro, Os varais, conformes a moda bizarra do tempo, terminavam em cabeças de\ndragões com as faces abertas e sangrentas e os olhos com uma expressão de ferocidade estúpida,\nO forro de cima formava um pequeno dossel de torno senhorial; e o ouro velho do damasco que\nalcatifava também os dois assentos fronteiriços não tem igual nas casas de modas de agora.\nQual das matronas de Ouro Preto, ou das cidades que como esta alcançam mais de um século,\nnão tem vista, ou pelo menos ouvido falar com insistência, quando meninas, nas cadeirinhas\nconduzidas por lacaios de libré onde as moçoilas e as damas de outrora se faziam delicadamente\ntransportar?\nQuem não fará reviver na imaginação uma das cenas galantes da cortesia antiga em que, através\nda portinhola cortada de caprichosos lavores de talha, passava um rostozinho enrubescido e dois\nolhos de veludo a pousarem de leve sobre o cavalheiro de espadim com quem a misteriosa dama\ncruzava na passagem?\nTambém, ó pobre cadeirinha, lá terias o teu dia de caiporismo: havia de chegar a hora em que, em\nvez dos saltos vermelhos de um sapatinho de cetim calçando um pezinho delicado, teu fundo\nfosse calcado pela chanca esparramada de alguma cetácea obesa e tabaquista. [...]\nNem foram desses os teus piores dias, ó saudosa cadeirinha! Já pelos anos de tua velhice, quando,\ncoma agora, sobreviviam ao teu belo tempo passado, quando, perdidos teus antigos donos,\nalguém se lembrou de carregar-te para a sacristia da igreja, não te davam outro serviço que não o\nde transportares, como esquife, cadáveres de anjinhos pobres ao cemitério, ou semelhante às\nmacas das ambulâncias militares, o de conduzires ao hospital feridos ou enfermos desvalidos.\nQue cruel vingança não toma aquela época longínqua por lhe teres sobrevivido Coisa inteiramente\nfora da moda, o contraste Cagrante que formas com o mundo circundante é uma prova evidente\nde tua próxima eliminação, ó velha cadeirinha dos tempos mortos!\nMas é assim a vida: as espécies, como os indivíduos, vão desaparecendo ou se transformando em\noutras espécies e em outros indivíduos mais perfeitos, mais complicados, mais aptos para o meio\natual, porém muito menos grandiosos que os passados. Que figura faria o elefante de hoje, resto\nexótico da fauna terciária, ao lado do megatério? A de um filhote deste. E no entanto, bem cedo,\ntalvez nos nossos dias, desaparecerá o elefante, por já estar em desarmonia com a fauna atual, por\nconstituir já aquele doloroso contraste de que falamos acima e que é o primeiro sintoma da\npróxima eliminação do grande paquiderme. Parece que o progresso marcha para a dispersão, a\ndesagregação e o formigamento. Um grande organismo tomba e se decompõe e vai formar uma\ninumerável quantidade de seres ávidos de vida. A morte, essa grande ilusão humana, e o início\ndaquela dispersão, ou antes a fonte de muitas vidas. E que grande consoladora!\nLembra-me ter vista, há tempos, um octogenário de passo trôpego e cara rapada passeando em\ntrajes domingueiros a pedir uma carícia ao sol. Dirigi-lhe a palavra a detivemo-nos largo espaço a\nfalar dos costumes, das coisas e dos homens de outro tempo. Nisso surpreendeu-nos um magote\nde garotos que escaramuçou o velho a vaias. O pobre do ancião já ia seguindo seu caminho\nquando o abordou a meninada; não apressou o passo nem perdeu aquela serenidade de quem já\ntinha domado as férias das paixões com o vencer os anos. Vi-o ainda voltar-se com o rosto\nengelhado numa risada tristíssima, a comprida japona abanando ao vento e dizer, em torno de\nconvicção profunda: \"Ai dos velhos, se não fosse a morte!\" Parecia uma banalidade, mas não era\nsenão o apelo supremo, a prece fervente que esse exilado fazia a Deus para que <u>pusesse</u> termo ao\nseu exílio, onde ale estava fora dos seus amigos, dos seus costumes, de tudo quanto lhe podia falar\nao coração. [...].\nPor que, pois, a pobre cadeirinha, esse mimo de grata, esse traste casquilho, essa fiel companheira\nda vida de sociedade, da vida palaciana, da vida de carte com seus apuros e suas intrigas, suas\nvinganças pequeninas, seus amores, todavia sobrevive e por que a não pôs em pedaços um braço\nrobusto empunhando um machado benfazejo? Ao menos evitaria esse dolorosíssimo ridículo, essa\nexposição indecorosa de nudez de velha!\nJá tiveste dias de glória, cadeirinha de outros tempos! Pois bem: desaparece agora, vai ao fogo e\npede que te reduza a cinzas! E mil vezes preferível a essa decadência em que te achas e até\nmesmo a hipótese mais lisonjeira de te perpetuarem num museu. Deves preferir a paz do\naniquilamento a glória de figurares numa coleção de objetos antigos, exposta a curiosidade dos\npapalvos e as lorpas considerações dos burgueses, mofada e tristonha. Morre, desaparece, que\ntalvez para que não? — a tua dona mais gentil, aquela para quem tuas alcatifas tinham mais\ndelicada carícia ao receber-lhe o corpinho mimosa, aquela que recendia um perfume longínquo de\nroseira do Chiraz te conduza para alguma região ideal, dourada e fugidia, inacessível aos homens...\nARINOS, Affonso. Pelo Sertão. Minas Gerais: Itatiaia, 1981. (Texto adaptado)\nObserve a conjugação do verbo sublinhado no excerto a seguir.\n\"[...] a prece fervente que esse exilado fazia a Deus para que <u>pusesse</u> termo ao seu exílio [...]” (\n\n13°§)",
    "statement": "Assinale a opção em que o verbo destacado também foi conjugado corretamente.",
    "options": [
      {
        "letter": "A",
        "text": "Era preciso que as crianças se <u>entretessem.</u>",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Quando o senhor <u>rever</u> o relatório, entenderá.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Ele gostava de palavras que <u>proviessem</u> do grego.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Falaria com ele sobre o assunto assim que a <u>revesse.</u>",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Surpreendentemente, todos <u>conviram</u> com o chefe.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q4",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 4,
    "readingText": "Morte de uma baleia\nClarice Lispector\nEm minutos espalhara-se a notícia: uma baleia no Leme e outra no Leblon haviam surgido na\narrebentação de onde tinham tentado sair sem no entanto poder voltar. Eram descomunais apesar\nde apenas filhotes. Todos foram ver. Eu não fui: corria o boato de que ela agonizava já há oito\nhoras e que até atirar nela haviam atirado mas ela continuava agonizando e sem morrer.\nSenti um horror diante do que contavam e que talvez não fossem estritamente os fatos reais, mas\na lenda já estava formada em torno do extraordinário que enfim, enfim! Acontecia, pois por pura\nsede de vida melhor estamos sempre à espera do extraordinário que talvez nos salve de uma vida\ncontida. Se fosse um homem que estivesse agonizando na praia durante oito horas nós o\nsantificaríamos, tanto precisamos de crer no que é impossível.\nNão, não fui vê-la: detesto a morte. Deus, o que nos prometeis em troca de morrer? Pois o céu e o\ninferno nós já os conhecemos – cada um de nós em segredo quase de sonho já viveu um pouco\ndo próprio apocalipse. E a própria morte.\nFora das vezes em que quase morri para sempre, quantas vezes num silêncio humano – que é o\nmais grave de todos do reino animal –, quantas vezes num silêncio humano minha alma\nagonizando esperava por uma morte que não vinha. E como escárnio, por ser o contrário do\nmartírio em que minha alma sangrava, era quando o corpo mais florescia. Como se meu corpo\nprecisasse dar ao mundo uma prova contrária de minha morte interna para esta ser mais secreta\nainda. Morri de muitas mortes e mantê-las-ei em segredo até que a morte do corpo venha, e\nalguém, adivinhando, diga: esta, esta viveu.\nPorque aquele que mais experimenta o martírio é dele que se poderá dizer: este, sim, este viveu.\n(...)\nLembro-me agora de uma vez que ao olhar um pôr do sol interminável e escarlate também eu\nagonizei com ele lentamente e morri, e a noite veio para mim cobrindo-me de mistério, de insônia\nclarividente e, finalmente por cansaço, sucumbindo num sono que completava a minha morte. E\nquando acordei, surpreendi-me docemente. Nos primeiros ínfimos instantes de acordada pensei:\nentão quando se está morta se conserva a consciência? Até que o corpo habituado a mover-se\nautomaticamente me fez fazer um gesto muito meu: o de passar a mão pelos cabelos. Então num\nsusto percebi que meu corpo e minha alma tinham sobrevivido. Tudo isto – a certeza de estar\nmorta e a descoberta de que eu estava viva – tudo isto não durou, creio, mais que dois ínfimos\nsegundos ou talvez menos ainda. Mas que de hoje em diante todos saibam através de mim que\nnão estou mentindo: em menos de dois segundos podem-se viver uma vida e uma morte e uma\nvida de novo. Esses dois ínfimos segundos como forma de contar toscamente o tempo devem ser\na diferença entre o ser humano e o animal: assim como Deus talvez conte o tempo em frações de\nséculo dos séculos: cada século um instante. Quem sabe se Deus conta a nossa vida em termos de\ndois segundos: um para nascer e outro para morrer. E o intervalo, meu Deus, talvez seja a maior\ncriação do Homem: a vida, uma vida. Lembro-me de um amigo que há poucos dias citou o que\num dos apóstolos disse de nós: vós sois deuses.\nSim, juro que somos deuses. Porque eu também já morri de alegria muitas vezes na minha vida. E\nquando passava essa espécie de gloriosa e suave morte, eu me surpreendia de que o mundo\ncontinuasse ao meu redor, de que houvesse uma disciplina para cada coisa,\ne de que eu mesma, a começar por mim, tinha o meu nome e já entrara na rotina: pensara que o\ntempo tinha parado e os homens subitamente se tinham imobilizado no meio do gesto que\nestivessem executando – enquanto eu vivera a morte por alegria.\nNão fui ver a baleia que estava a bem dizer à porta de minha casa a morrer. Morte, eu te odeio.\nEnquanto isso as notícias misturadas com lendas corriam pela cidade do Leme. Uns diziam que a\nbaleia do Leblon ainda não morrera mas que sua carne retalhada em vida era vendida por quilos\npois carne de baleia era ótimo de se comer, e era barato, era isso que corria pela cidade do Leme.\nE eu pensei: maldito seja aquele que a comerá por curiosidade, só perdoarei quem tem fome,\naquela fome antiga dos pobres.\nOutros, no limiar do horror, contavam que também a baleia do Leme, embora ainda viva e arfante,\ntinha seus quilos cortados para serem vendidos. Como acreditar que não se espera nem a morte\npara um ser comer outro ser? Não quero acreditar que alguém desrespeite\ntanto a vida e a morte, nossa criação humana, e que coma vorazmente, só por ser uma iguaria,\naquilo que ainda agoniza, só porque é mais barato, só porque a fome humana é grande, só porque\nna verdade somos tão ferozes como um animal feroz, só porque queremos comer daquela\nmontanha de inocência que é uma baleia, assim como comemos a inocência cantante de um\npássaro. Eu ia dizer agora com horror: a viver desse modo, prefiro a morte.\nE exatamente não é verdade. Sou uma feroz entre os ferozes seres humanos – nós, os macacos de\nnós mesmos, nós, os macacos que idealizaram tornarem-se homens, e esta é também a nossa\ngrandeza. Nunca atingiremos em nós o ser humano: a busca e o esforço\nserão permanentes. E quem atinge o quase impossível estágio de Ser Humano, é justo que seja\nsantificado.\nPorque desistir de nossa animalidade é um sacrifício.\n(Disponível em <https://contobrasileiro.com.br/morte-de-uma-baleia-cronica-de-clarice-lispector/> Acesso em 16 abr. 2021)\n“(...) pensara que o tempo tinha parado e os homens subitamente se tinham imobilizado no meio\ndo gesto que estivessem executando – enquanto eu <u>vivera</u> a morte por alegria” (7º parágrafo)",
    "statement": "A forma verbal sublinhada no trecho acima constitui a forma sintética de um tempo verbal. Caso\nfosse escrita em sua forma composta, essa oração seria",
    "options": [
      {
        "letter": "A",
        "text": "“enquanto eu tinha vivido a morte por alegria”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“enquanto eu tiver vivido a morte por alegria”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“enquanto eu tenha vivido a morte por alegria”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“enquanto eu tive vivido a morte por alegria”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“enquanto eu teria vivido a morte por alegria”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q5",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 5,
    "readingText": "TEXTO III\nMulheres de Atenas\n\nMirem-se no exemplo\nDaquelas mulheres de Atenas\nVivem pros seus maridos\nOrgulho e raça de Atenas\n\nQuando amadas, se perfumam\nSe banham com leite, se arrumam\nSuas melenas\nQuando fustigadas não choram\nSe ajoelham, pedem, imploram\nMais duras penas; cadenas\n\nMirem-se no exemplo\nDaquelas mulheres de Atenas\nSofrem pros seus maridos\nPoder e força de Atenas\n(...)\n\nElas não têm gosto ou vontade\nNem defeito, nem qualidade\nTêm medo apenas\nNão têm sonhos, só têm presságios\nO seu homem, mares, naufrágios\nLindas sirenas, morenas\n\nMirem-se no exemplo\nDaquelas mulheres de Atenas\nTemem por seus maridos\nHeróis e amantes de Atenas\n\nAs jovens viúvas marcadas\nE as gestantes abandonadas\nNão fazem cenas\nVestem-se de negro, se encolhem\nSe conformam e se recolhem\nÀs suas novenas, serenas\n\n(HOLANDA, Chico Buarque de. Meus caros amigos. LP, 1976. Phonogram/Philips)",
    "statement": "Em relação à composição linguística do texto III, é INCORRETO afirmar que",
    "options": [
      {
        "letter": "A",
        "text": "as formas verbais “mirem” (v. 1), “vivem” (v. 3), “sofrem” (v. 14) e “têm” (v. 16) estão conjugadas no mesmo modo e tempo, além de possuírem o mesmo sujeito.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "levando em consideração o contexto, é possível considerar o sentido da palavra “fustigadas” (v. 09) como <u>castigadas.</u>",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "em “vivem <u>pros seus maridos”</u> (v. 3), o termo sublinhado é classificado pela gramática normativa como adjunto adverbial.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "na última estrofe, em todas as ocorrências, o vocábulo “se” é classificado como pronome reflexivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q6",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 6,
    "readingText": "Bons tempos aqueles em que a família em férias, no extenso litoral brasileiro, escolhia para locar\numa casa ou um resort por conta da proximidade com o mar, pelo acesso ao comércio e pelas\nbelezas naturais ao redor.\nAdaptado de WAGNER, Carlos. Mesmo sendo um paraíso, se não tiver internet, não leve os filhos\nnas férias. Observatório da Imprensa, 11/12/2018, edição 1017.\nDisponível em: <http://observatoriodaimprensa.com.br/dilemas-da-imprensa/mesmo-sendo-um-paraiso-se-nao-tiver-internet-nao-leve-os-filhos-nas-ferias/> Acesso em ago. 2020\nCaso o período em destaque no enunciado estivesse escrito na voz passiva, deveria ser",
    "statement": "Leia atentamente e assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Bons tempos, no extenso litoral brasileiro, aqueles em que uma casa ou resort foram escolhidos para locação pela família em férias por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Bons tempos aqueles em que uma casa ou resort eram escolhidos para serem locados, no extenso litoral brasileiro, pela família em férias por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Bons tempos aqueles em que escolhia, por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor, para locar uma casa ou um resort, a família em férias, no extenso litoral brasileiro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Bons tempos aqueles em que pela família em férias por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor, uma casa ou resort poderiam escolhidos para locar, no extenso litoral brasileiro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Bons tempos aqueles em se escolhia para locar uma casa ou um resort por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor, no extenso litoral brasileiro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q7",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 7,
    "readingText": "O homem deve reencontrar o Paraíso...\nRubem Alves\nEra uma família grande, todos amigos. Viviam como todos nós: moscas presas na enorme teia de\naranha que é a vida da cidade. Todos os dias a aranha lhes arrancava um pedaço. Ficaram\ncansados. Resolveram mudar de vida: um sonho louco: navegar! Um barco, o mar, o céu, as\nestrelas, os horizontes sem fim: liberdade. Venderam o que tinham, compraram um barco capaz de\natravessar mares e sobreviver tempestades.\nMas para navegar não basta sonhar. É preciso saber. São muitos os saberes necessários para se\nnavegar. Puseram-se então a estudar cada um aquilo que teria de fazer no barco: manutenção do\ncasco, instrumentos de navegação, astronomia, meteorologia, as velas, as cordas, as polias e\nroldanas, os mastros, o leme, os parafusos, o motor, o radar, o rádio, as ligações elétricas, os\nmares, os mapas... Disse certo o poeta: Navegar é preciso, a ciência da navegação é saber preciso,\nexige aparelhos, números e medições. Barcos se fazem com precisão, astronomia se aprende com\no rigor da geometria, velas se fazem com saberes exatos sobre tecidos, cordas e ventos,\ninstrumentos de navegação não informam mais ou menos. Assim, eles se tomaram cientistas,\nespecialistas, cada um na sua - juntos para navegar.\nChegou então o momento da grande decisão - para onde navegar. Um sugeria as geleiras do sul\ndo Chile, outro os canais dos fiordes da Noruega, um outro queria conhecer os exóticos mares e\npraias das ilhas do Pacífico, e houve mesmo quem quisesse navegar nas rotas de Colombo. E foi\nentão que compreenderam que, quando o assunto era a escolha do destino, as ciências que\nconheciam para nada serviam.\nDe nada valiam números, tabelas, gráficos, estatísticas. Os computadores, coitados, chamados a\ndar o seu palpite, ficaram em silêncio. Os computadores não têm preferências - falta-lhes essa sutil\ncapacidade de gostar, que é a essência da vida humana. Perguntados sobre o porto de sua\nescolha, disseram que não entendiam a pergunta, que não lhes importava para onde se estava\nindo.\nSe os barcos se fazem com ciência, a navegação faz-se com os sonhos. Infelizmente a ciência,\nutilíssima, especialista em saber como as coisas funcionam, tudo ignora sobre o coração humano.\nE preciso sonhar para se decidir sobre o destino da navegação. Mas o coração humano, lugar dos\nsonhos, ao contrário da ciência, é coisa imprecisa. Disse certo o poeta: Viver não é preciso.\nPrimeiro vem o impreciso desejo. Primeiro vem o impreciso desejo de navegar. Só depois vem a\nprecisa ciência de navegar.\nNaus e navegação têm sido uma das mais poderosas imagens na mente dos poetas. Ezra Pound\ninicia seus Cânticos dizendo: E pois com a nau no mar/assestamos a quilha contra as vagas...\nCecília Meireles: Foi, desde sempre, o mar! A solidez da terra, monótona/parece-nos fraca ilusão!\nQueremos a ilusão do grande mar/multiplicada em suas malhas de perigo. E Nietzsche: Amareis a\nterra de vossos filhos, terra não descoberta, no mar mais distante. Que as vossas velas não se\ncansem de procurar esta terra! O nosso leme nos conduz para a terra dos nossos filhos... Viver é\nnavegar no grande mar!\nNão só os poetas: C. Wright Mills, um sociólogo sábio, comparou a nossa civilização a uma galera\nque navega pelos mares. Nos porões estão os remadores. Remam com precisão cada vez maior. A\ncada novo dia recebem remos novos, mais perfeitos. O ritmo das remadas acelera. Sabem tudo\nsobre a ciência do remar. A galera navega cada vez mais rápido. Mas, perguntados sobre o porto\ndo destino, respondem os remadores: O porto não nos importa. O que importa é a velocidade com\nque navegamos.\nC. Wright Mills usou esta metáfora para descrever a nossa civilização por meio duma imagem\nplástica: multiplicam-se os meios técnicos e científicos ao nosso dispor, que fazem com que as\nmudanças sejam cada vez mais rápidas; mas não temos ideia alguma de para onde navegamos.\nPara onde? Somente um navegador louco ou perdido navegaria sem ter ideia do para onde. Em\nrelação à vida da sociedade, ela contém a busca de uma utopia. Utopia, na linguagem comum, é\nusada como sonho impossível de ser realizado. Mas não é isso. Utopia é um ponto inatingível que\nindica uma direção.\nMário Quintana explicou a utopia com um verso: Se as coisas são inatingíveis... ora!/Não é motivo\npara não querê-las... Que tristes os caminhos, se não fora/ A mágica presença das estrelas! Karl\nMannheim, outro sociólogo sábio que poucos leem, já na década de 1920 diagnosticava a doença\nda nossa civilização: Não temos consciência de direções, não escolhemos direções. Faltam-nos\nestrelas que nos indiquem o destino.\nHoje, ele dizia, as únicas perguntas que são feitas, determinadas pelo pragmatismo da tecnologia\n(o importante é produzir o objeto) e pelo objetivismo da ciência (o importante é saber como\nfunciona), são: Como posso fazer tal coisa? Como posso resolver este problema concreto\nparticular? E conclui: E em todas essas perguntas sentimos o eco otimista: não preciso de me\npreocupar com o todo, ele tomará conta de si mesmo.\nEm nossas escolas é isso que se ensina: a precisa ciência da navegação, sem que os estudantes\nsejam levados a sonhar com as estrelas. A nau navega veloz e sem rumo. Nas universidades, essa\ndoença assume a forma de peste epidêmica: cada especialista se dedica, com paixão e\ncompetência, a fazer pesquisas sobre o seu parafuso, sua polia, sua vela, seu mastro.\nDizem que seu dever é produzir conhecimento. Se forem bem-sucedidas, suas pesquisas serão\npublicadas em revistas internacionais. Quando se lhes pergunta: Para onde seu barco está\nnavegando?, eles respondem: Isso não é científico. Os sonhos não são objetos de conhecimento\ncientífico...\nE assim ficam os homens comuns abandonados por aqueles que, por conhecerem mares e\nestrelas, lhes poderiam mostrar o rumo. Não posso pensar a missão das escolas, começando com\nas crianças e continuando com os cientistas, como outra que não a da realização do dito do poeta:\nNavegar é preciso. Viver não é preciso.\nÉ necessário ensinar os precisos saberes da navegação enquanto ciência. Mas é necessário\napontar com imprecisos sinais para os destinos da navegação: A terra dos filhos dos meus filhos, no\nmar distante... Na verdade, a ordem verdadeira é a inversa. Primeiro, os homens sonham com\nnavegar. Depois aprendem a ciência da navegação. E inútil ensinar a ciência da navegação a quem\nmora nas montanhas...\nO meu sonho para a educação foi dito por Bachelard: O universo tem um destino de felicidade. O\nhomem deve reencontrar o Paraíso. O paraíso é jardim, lugar de felicidade, prazeres e alegrias para\nos homens e mulheres. Mas há um pesadelo que me atormenta: o deserto. Houve um momento\nem que se viu, por entre as estrelas, um brilho chamado progresso. Está na bandeira nacional... E,\nquilha contra as vagas, a galera navega em direção ao progresso, a uma velocidade cada vez\nmaior, e ninguém questiona a direção. E assim que as florestas são destruídas, os rios se\ntransformam em esgotos de fezes e veneno, o ar se enche de gases, os campos se cobrem de lixo\n- e tudo ficou feio e triste.\nSugiro aos educadores que pensem menos nas tecnologias do ensino - psicologias e quinquilharias\n- e tratem de sonhar, com os seus alunos, sonhos de um Paraíso.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nMario Quintana <u>explicou</u> a utopia com um verso (...) Analisando-se os fragmentos que se seguem,\na regência da forma verbal que difere do exemplo acima aparece na alternativa",
    "options": [
      {
        "letter": "A",
        "text": "Venderam o que tinham, compraram um barco capaz de atravessar mares e sobreviver (...)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Resolveram mudar de vida: um sonho louco: navegar!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Mas para navegar não <u>basta</u> sonhar. E preciso saber.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Houve um momento em que se viu, por entre as estrelas, um brilho chamado progresso.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "(...) e tratem de <u>sonhar,</u> com os seus alunos, sonhos de um Paraíso.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q8",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 8,
    "readingText": "O homem deve reencontrar o Paraíso...\nRubem Alves\nEra uma família grande, todos amigos. Viviam como todos nós: moscas presas na enorme teia de\naranha que é a vida da cidade. Todos os dias a aranha lhes arrancava um pedaço. Ficaram\ncansados. Resolveram mudar de vida: um sonho louco: navegar! Um barco, o mar, o céu, as\nestrelas, os horizontes sem fim: liberdade. Venderam o que tinham, compraram um barco capaz de\natravessar mares e sobreviver tempestades.\nMas para navegar não basta sonhar. É preciso saber. São muitos os saberes necessários para se\nnavegar. Puseram-se então a estudar cada um aquilo que teria de fazer no barco: manutenção do\ncasco, instrumentos de navegação, astronomia, meteorologia, as velas, as cordas, as polias e\nroldanas, os mastros, o leme, os parafusos, o motor, o radar, o rádio, as ligações elétricas, os\nmares, os mapas... Disse certo o poeta: Navegar é preciso, a ciência da navegação é saber preciso,\nexige aparelhos, números e medições. Barcos se fazem com precisão, astronomia se aprende com\no rigor da geometria, velas se fazem com saberes exatos sobre tecidos, cordas e ventos,\ninstrumentos de navegação não informam mais ou menos. Assim, eles se tomaram cientistas,\nespecialistas, cada um na sua - juntos para navegar.\nChegou então o momento da grande decisão - para onde navegar. Um sugeria as geleiras do sul\ndo Chile, outro os canais dos fiordes da Noruega, um outro queria conhecer os exóticos mares e\npraias das ilhas do Pacífico, e houve mesmo quem quisesse navegar nas rotas de Colombo. E foi\nentão que compreenderam que, quando o assunto era a escolha do destino, as ciências que\nconheciam para nada serviam.\nDe nada valiam números, tabelas, gráficos, estatísticas. Os computadores, coitados, chamados a\ndar o seu palpite, ficaram em silêncio. Os computadores não têm preferências - falta-lhes essa sutil\ncapacidade de gostar, que é a essência da vida humana. Perguntados sobre o porto de sua\nescolha, disseram que não entendiam a pergunta, que não lhes importava para onde se estava\nindo.\nSe os barcos se fazem com ciência, a navegação faz-se com os sonhos. Infelizmente a ciência,\nutilíssima, especialista em saber como as coisas funcionam, tudo ignora sobre o coração humano.\nE preciso sonhar para se decidir sobre o destino da navegação. Mas o coração humano, lugar dos\nsonhos, ao contrário da ciência, é coisa imprecisa. Disse certo o poeta: Viver não é preciso.\nPrimeiro vem o impreciso desejo. Primeiro vem o impreciso desejo de navegar. Só depois vem a\nprecisa ciência de navegar.\nNaus e navegação têm sido uma das mais poderosas imagens na mente dos poetas. Ezra Pound\ninicia seus Cânticos dizendo: E pois com a nau no mar/assestamos a quilha contra as vagas...\nCecília Meireles: Foi, desde sempre, o mar! A solidez da terra, monótona/parece-nos fraca ilusão!\nQueremos a ilusão do grande mar/multiplicada em suas malhas de perigo. E Nietzsche: Amareis a\nterra de vossos filhos, terra não descoberta, no mar mais distante. Que as vossas velas não se\ncansem de procurar esta terra! O nosso leme nos conduz para a terra dos nossos filhos... Viver é\nnavegar no grande mar!\nNão só os poetas: C. Wright Mills, um sociólogo sábio, comparou a nossa civilização a uma galera\nque navega pelos mares. Nos porões estão os remadores. Remam com precisão cada vez maior. A\ncada novo dia recebem remos novos, mais perfeitos. O ritmo das remadas acelera. Sabem tudo\nsobre a ciência do remar. A galera navega cada vez mais rápido. Mas, perguntados sobre o porto\ndo destino, respondem os remadores: O porto não nos importa. O que importa é a velocidade com\nque navegamos.\nC. Wright Mills usou esta metáfora para descrever a nossa civilização por meio duma imagem\nplástica: multiplicam-se os meios técnicos e científicos ao nosso dispor, que fazem com que as\nmudanças sejam cada vez mais rápidas; mas não temos ideia alguma de para onde navegamos.\nPara onde? Somente um navegador louco ou perdido navegaria sem ter ideia do para onde. Em\nrelação à vida da sociedade, ela contém a busca de uma utopia. Utopia, na linguagem comum, é\nusada como sonho impossível de ser realizado. Mas não é isso. Utopia é um ponto inatingível que\nindica uma direção.\nMário Quintana explicou a utopia com um verso: Se as coisas são inatingíveis... ora!/Não é motivo\npara não querê-las... Que tristes os caminhos, se não fora/ A mágica presença das estrelas! Karl\nMannheim, outro sociólogo sábio que poucos leem, já na década de 1920 diagnosticava a doença\nda nossa civilização: Não temos consciência de direções, não escolhemos direções. Faltam-nos\nestrelas que nos indiquem o destino.\nHoje, ele dizia, as únicas perguntas que são feitas, determinadas pelo pragmatismo da tecnologia\n(o importante é produzir o objeto) e pelo objetivismo da ciência (o importante é saber como\nfunciona), são: Como posso fazer tal coisa? Como posso resolver este problema concreto\nparticular? E conclui: E em todas essas perguntas sentimos o eco otimista: não preciso de me\npreocupar com o todo, ele tomará conta de si mesmo.\nEm nossas escolas é isso que se ensina: a precisa ciência da navegação, sem que os estudantes\nsejam levados a sonhar com as estrelas. A nau navega veloz e sem rumo. Nas universidades, essa\ndoença assume a forma de peste epidêmica: cada especialista se dedica, com paixão e\ncompetência, a fazer pesquisas sobre o seu parafuso, sua polia, sua vela, seu mastro.\nDizem que seu dever é produzir conhecimento. Se forem bem-sucedidas, suas pesquisas serão\npublicadas em revistas internacionais. Quando se lhes pergunta: Para onde seu barco está\nnavegando?, eles respondem: Isso não é científico. Os sonhos não são objetos de conhecimento\ncientífico...\nE assim ficam os homens comuns abandonados por aqueles que, por conhecerem mares e\nestrelas, lhes poderiam mostrar o rumo. Não posso pensar a missão das escolas, começando com\nas crianças e continuando com os cientistas, como outra que não a da realização do dito do poeta:\nNavegar é preciso. Viver não é preciso.\nÉ necessário ensinar os precisos saberes da navegação enquanto ciência. Mas é necessário\napontar com imprecisos sinais para os destinos da navegação: A terra dos filhos dos meus filhos, no\nmar distante... Na verdade, a ordem verdadeira é a inversa. Primeiro, os homens sonham com\nnavegar. Depois aprendem a ciência da navegação. E inútil ensinar a ciência da navegação a quem\nmora nas montanhas...\nO meu sonho para a educação foi dito por Bachelard: O universo tem um destino de felicidade. O\nhomem deve reencontrar o Paraíso. O paraíso é jardim, lugar de felicidade, prazeres e alegrias para\nos homens e mulheres. Mas há um pesadelo que me atormenta: o deserto. Houve um momento\nem que se viu, por entre as estrelas, um brilho chamado progresso. Está na bandeira nacional... E,\nquilha contra as vagas, a galera navega em direção ao progresso, a uma velocidade cada vez\nmaior, e ninguém questiona a direção. E assim que as florestas são destruídas, os rios se\ntransformam em esgotos de fezes e veneno, o ar se enche de gases, os campos se cobrem de lixo\n- e tudo ficou feio e triste.\nSugiro aos educadores que pensem menos nas tecnologias do ensino - psicologias e quinquilharias\n- e tratem de sonhar, com os seus alunos, sonhos de um Paraíso.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nA falta de certa precisão quanto aos tempos, utilizam-se algumas locuções verbais que traduzem\nmais adequadamente o aspecto verbal. Assim, a construção que expressa melhor a noção de\ninício de uma ação aparece no fragmento da alternativa",
    "options": [
      {
        "letter": "A",
        "text": "Mas para navegar não basta sonhar. E preciso saber. São muitos os saberes necessários para se navegar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Puseram-se então a estudar cada um aquilo que teria de fazer no barco: manutenção do casco, instrumentos de navegação, astronomia, meteorologia, as velas, as cordas, as polias e roldanas, os mastros, o leme, os parafusos (...)",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Os computadores, coitados, chamados a dar o seu palpite, ficaram em silêncio.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Naus e navegação têm sido uma das mais poderosas imagens na mente dos poetas.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Não posso pensar a missão das escolas, começando com as crianças e continuando com os cientistas, como outra que não a da realização do dito do poeta (...)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q9",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 9,
    "readingText": "Laivos de memória\n\"...e quando tiverem chegado, vitoriosamente, ao fim dessa primeira etapa, mais ainda se\nconvenceram de que abraçaram uma carreira difícil, árdua, cheia de sacrifícios, mas útil, nobre e,\nsobretudo bela.\"\n(NOSSA VOGA, Escola Naval, Ilha de Villegagnon, 1964)\nHA quase 50 anos, experimentei um misto de angústia, tristeza e ansiedade que meu jovem\ncoração de adolescente soube suportar com bravura.\nNaquela ocasião, despedi-me dos amigos de infância e da família e deixava para trás bucólica\ncidadezinha da região serrana Fluminense. A motivação que me levava a abandonar gentes e\ncoisas tão caras era, naquele momento, suficientemente forte para respaldar a decisão tomada de\ndar novos rumos a minha vida. Meu mundo de então se tornara pequeno demais para as minhas\naspirações. Meus desejos e sonhos projetavam horizontes que iam muito além das montanhas que\ncircundam minha terra natal.\nComo resistir a sedução e ao fascínio que a vida no mar desperta nos corações dos jovens?\nHavia, portanto, uma convicção: aquelas despedidas, ainda que dolorosas - e despedidas são\nsempre dolorosas - não seriam certamente em vão. Não tinha dividas de que os sonhos que\nacalentam meu coração pouco a pouco iriam se converter em realidade.\nEm março de 1962, desembarcávamos do Aviso Rio das Contas na ponte de atração do Colégio\nNaval, como integrantes de mais uma turma desse tradicional estabelecimento de ensino da\nMarinha do Brasil.\nAinda que a ansiedade persistisse oprimindo o peito dos novos e orgulhosos Alunos do Colégio\nNaval, nado posso negar que a tristeza, que antes havia ocupado espaço em nossos corações, era\nnaquele momento substituída pelo contentamento peculiar dos vitoriosos. E o sentimento de\nperda, experimentado por ocasião das despedidas, provara-se equivocado: As nossas caras\nfamílias de origem agregava-se uma nova, a Família Naval, composta pelos recém-chegados\ncompanheiros; e às respectivas cidades de nascimento, como a minha bucólica Bom Jardim,\njuntava-se, naquele instante, a bela e graciosa enseada Batista das Neves em Angra dos Reis,\ncomo mais tarde se agregaria a histórica Villegagnon em meio a sublime baía de Guanabara.\nAo todo foram seis anos de companheirismo e feliz convivência, tanto no Colégio como na Escola\nNaval. Seis anos de aprendizagem científica, humanística e, sobretudo, militar-naval. Seis anos\nentremeados de aulas, festivais de provas, práticas esportivas, remo, vela, cabo de guerra,\nnavegação, marinharia, ordem-unida, atividades extraclasses, recreativas, culturais e sociais, que\ndeixaram marcas indeléveis.\nEstes e tantos outros símbolos, objetos e acontecimentos passados desfilam hoje, deliciosa e\ninexoravelmente distantes, em meio a saudosos devaneios.\nAinda como alunos do Colégio Naval, os contatos preliminares com a vida de bordo e as primeiras\nidas para o mar — a razão de ser da carreira naval.\nComo Aspirantes, derrotas mais longas e as primeiras descobertas: Santos, Salvador, Recife e\nFortaleza!\nFechando o ciclo das Viagens de Instrução, o tão sonhado embarque no Navio-Escola. Viagem\nmaravilhosa! Nós, da Turma Miguens, Guardas-Marinha de 1967, tivemos a oportunidade ímpar e\nrara de participar de um cruzeiro ao redor do mundo em 1968: a Quinta Circum-navegação da\nMarinha Brasileira.\nApós o regresso, as platinas de Segundo-Tenente, o primeiro embarque efetivo e o verdadeiro\ninício da vida profissional - no meu caso, a bordo do cruzador Tamandaré, o inesquecível C-12. Era\na inevitável separação da Turma do CN-62/63 e da EN-64/67.\nNovamente um misto de satisfação e ansiedade tomou conta do coração, agora do jovem\nTenente, ao se apresentar para servir a bordo de um navio de nossa Esquadra. Após proveitosos,\nmas descontraídos estágios de instrução como Aspirante e Guarda-Marinha, quando as\nresponsabilidades eram restritas a compromissos curriculares, as platinas de Oficial começariam,\nfinalmente, a pesar forte em nossos ombros. Sobre essa transição do status de Guarda-Marinha\npara Tenente, o notável escritor-marinheiro Gastão Penalva escrevera com muita propriedade: \"...é a fase inesquecível de nosso ofício. Coincide exatamente com a adolescência, primavera da vida.\nTudo são flores e ilusões... Depois começam a despontar as responsabilidades, as agruras de\nnovos cargos, o acúmulo de deveres novos\".\nE esses novos cargos e deveres novos, que foram se multiplicando a bordo de velhos e saudosos\nnavios, deixariam agradáveis e duradouras lembranças em nossa memória. Com o passar dos\ntempos, inúmeros Conveses e Praça d'Armas, hoje saudosos, foram se incorporando ao acervo\nprofissional-afetivo de cada um dos integrantes daquela Turma de Guardas-Marinha de 1967.\nAh! Como é gratificante, ainda que melancólico, repassar tantas lembranças, tantos termos\nexpressivos, tanta gíria maruja, tantas tradições, fainas e eventos tão intensamente vividos a bordo\nde inesquecíveis e saudosos navios...\nE as viagens foram se multiplicando ao longo de bem aproveitados anos de embarque, de\ncentenas de dias de mar e de milhares de milhas navegadas em alto mar, singrando as extensas\nmassas líquidas que formam os grandes oceanos, ou ao longo das Águas costeiras que banham os\nrecortados litorais, com passagens, visitas e arribadas em um sem número de enseadas, baías,\nbarras, angras, estreitos, furos e canais espalhados pelos quatro cantos do mundo, percorridos\nnem sempre com mares bonaçosos e ventos tranquilos e favoráveis.\nInúmeros foram também os portos e cidades visitadas, não só no Brasil como no exterior, o que\nsempre nos proporciona inestimáveis é valiosos conhecimentos, principalmente graças ao contato\ncom povos diferentes e até mesmo de culturas exóticas e hábitos às vezes totalmente diversos\ndos nossos, como os ribeirinhos amazonenses ou os criadores de serpentes da antiga Taprobana,\nex-Ceilão e hoje Siri Lanka.\nComo foi fascinante e delicioso navegar por todos esses cantos. Cada novo mar percorrido, cada\nnova enseada, estreito ou porto visitado tinha sempre um gosto especial de descoberta... Sim,\npois, como dizia Câmara Cascudo, \"o mar não guarda os vestígios das quilhas que o atravessam.\nCada marinheiro tem a ilusão cordial do descobrimento\".\n(CESAR, CMG (RM1) William Carmo. Laivos de memória. In: Revista de Villegagnon, Ano IV, n° 4,\n2009. p. 42-50. Texto adaptado)",
    "statement": "Marque a opção em que a reescritura do trecho \"Meu mundo de então se tornara pequeno demais\npara as minhas aspirações\" (2°§) mantém seu sentido original e respeita a norma gramatical.",
    "options": [
      {
        "letter": "A",
        "text": "Meu mundo, então, tinha se tornado pequeno, demais para as minhas aspirações.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Meu mundo de, então, tornara-se pequeno, demais, para as minhas aspirações.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Meu mundo de então tinha se tornado pequeno demais para as minhas aspirações.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Meu mundo, então, tornar-se-á pequeno demais para as minhas aspirações.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Meu mundo, então, tornou-se pequeno, demais para as minhas aspirações.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q10",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 10,
    "readingText": "UM CINTURÃO\nGraciliano Ramos\nAs minhas primeiras relações com a justiça foram dolorosas e deixaram-me funda impressão. Eu\ndevia ter quatro ou cinco anos, por aí, e figurei na qualidade de réu. Certamente já me haviam feito\nrepresentar esse papel, mas ninguém me dera a entender que se tratava de julgamento. Batiam-me porque podiam bater-me, e isto era natural.\nOs golpes que recebi antes do caso do cinturão, puramente físicos, desapareciam quando findava\na dor. Certa vez minha mãe surrou-me com uma corda nodosa que me pintou as costas de\nmanchas sangrentas. Moído, virando a cabeça com dificuldade, eu distinguia nas costelas grandes\nlanhos vermelhos. Deitaram-me, enrolaram-me em panos molhados com água de sal – e houve\numa discussão na família. Minha avó, que nos visitava, condenou o procedimento da filha e esta\nafligiu-se. Irritada, ferira-me à toa, sem querer. Não guardei ódio a minha mãe: o culpado era o nó.\nSe não fosse ele, a Cagelação me haveria causado menor estrago. E estaria esquecida. A história\ndo cinturão, que veio pouco depois, avivou-a.\nMeu pai dormia na rede, armada na sala enorme. Tudo é nebuloso. Paredes extraordinariamente\nafastadas, rede infinita, os armadores longe, e meu pai acordando, levantando-se de mau humor,\nbatendo com os chinelos no chão, a cara enferrujada. Naturalmente não me lembro da ferrugem,\ndas rugas, da voz áspera, do tempo que ele consumiu rosnando uma exigência. Sei que estava\nbastante zangado, e isto me trouxe a covardia habitual. Desejei vê-lo dirigir-se a minha mãe e a\nJosé Baía, pessoas grandes, que não levavam pancada. Tentei ansiosamente fixar-me nessa\nesperança frágil. A força de meu pai encontraria resistência e gastar-se-ia em palavras.\nDébil e ignorante, incapaz de conversa ou defesa, fui encolher-me num canto, para lá dos caixões\nverdes. Se o pavor não me segurasse, tentaria escapulir-me: pela porta da frente chegaria ao\naçude, pela do corredor acharia o pé de turco. Devo ter pensado nisso, imóvel, atrás dos caixões.\nSó queria que minha mãe, sinhá Leopoldina, Amaro e José Baía surgissem de repente, me\nlivrassem daquele perigo.\nNinguém veio, meu pai me descobriu acocorado e sem fôlego, colado ao muro, e arrancou-me\ndali violentamente, reclamando um cinturão. Onde estava o cinturão? Eu não sabia, mas era difícil\nexplicar-me: atrapalhava-me, gaguejava, embrutecido, sem atinar com o motivo da raiva. Os\nmodos brutais, coléricos, atavam-me; os sons duros morriam, desprovidos de significação.\nNão consigo reproduzir toda a cena. Juntando vagas lembranças dela a fatos que se deram\ndepois, imagino os berros de meu pai, a zanga terrível, a minha tremura infeliz. Provavelmente fui\nsacudido. O assombro gelava-me o sangue, escancarava-me os olhos.\nOnde estava o cinturão? Impossível responder. Ainda que tivesse escondido o infame objeto,\nemudeceria, tão apavorado me achava. Situações deste gênero constituíram as maiores torturas\nda minha infância, e as consequências delas me acompanharam.\nO homem não me perguntava se eu tinha guardado a miserável correia: ordenava que a\nentregasse imediatamente. Os seus gritos me entravam na cabeça, nunca ninguém se esgoelou de\nsemelhante maneira.\nOnde estava o cinturão? Hoje não posso ouvir uma pessoa falar alto. O coração bate-me forte,\ndesanima, como se fosse parar, a voz emperra, a vista escurece, uma cólera doida agita coisas\nadormecidas cá dentro. A horrível sensação de que me furam os tímpanos com pontas de ferro.\nOnde estava o cinturão? A pergunta repisada ficou-me na lembrança: parece que foi pregada a\nmartelo.\nA fúria louca ia aumentar, causar-me sério desgosto. Conservar-me-ia ali desmaiado, encolhido,\nmovendo os dedos frios, os beiços trêmulos e silenciosos. Se o moleque José ou um cachorro\nentrasse na sala, talvez as pancadas se transferissem. O moleque e os cachorros eram inocentes,\nmas não se tratava disto. Responsabilizando qualquer deles, meu pai me esqueceria, deixar-me-ia\nfugir, esconder-me na beira do açude ou no quintal. Minha mãe, José Baía, Amaro, sinhá\nLeopoldina, o moleque e os cachorros da fazenda abandonaram-me. Aperto na garganta, a casa a\ngirar, o meu corpo a cair lento, voando, abelhas de todos os cortiços enchendo-me os ouvidos –\ne, nesse zunzum, a pergunta medonha. Náusea, sono. Onde estava o cinturão? Dormir muito, atrás\nde caixões, livre do martírio.\nHavia uma neblina, e não percebi direito os movimentos de meu pai. Não o vi aproximar-se do\ntorno e pegar o chicote. A mão cabeluda prendeu-me, arrastou-me para o meio da sala, a folha de\ncouro fustigou-me as costas. Uivos, alarido inútil, estertor. Já então eu devia saber que gogos e\nadulações exasperavam o algoz. Nenhum socorro. José Baía, meu amigo, era um pobre-diabo.\nAchava-me num deserto. A casa escura, triste; as pessoas tristes. Penso com horror nesse ermo,\nrecordo-me de cemitérios e de ruínas mal-assombradas. Cerravam-se as portas e as janelas, do\nteto negro pendiam teias de aranha. Nos quartos lúgubres minha irmãzinha engatinhava,\ncomeçava a aprendizagem dolorosa.\nJunto de mim, um homem furioso, segurando-me um braço, açoitando-me. Talvez as vergastadas\nnão fossem muito fortes: comparadas ao que senti depois, quando me ensinaram a carta de ABC,\nvaliam pouco. Certamente o meu choro, os saltos, as tentativas para rodopiar na sala como\ncarrapeta eram menos um sinal de dor que a explosão do medo reprimido. Estivera sem bulir,\nquase sem respirar. Agora esvaziava os pulmões, movia-me num desespero.\nO suplício durou bastante, mas, por muito prolongado que tenha sido, não igualava a mortificação\nda fase preparatória: o olho duro a magnetizar-me, os gestos ameaçadores, a voz rouca a mastigar\numa interrogação incompreensível.\nSolto, fui enroscar-me perto dos caixões, coçar as pisaduras, engolir soluços, gemer baixinho e\nembalar-me com os gemidos. Antes de adormecer, cansado, vi meu pai dirigir-se à rede, afastar\nas varandas, sentar-se e logo se levantar, agarrando uma tira de sola, o maldito cinturão, a que\ndesprendera a fivela quando se deitara. Resmungou e entrou a passear agitado. Tive a impressão\nde que ia falar-me: baixou a cabeça, a cara enrugada serenou, os olhos esmoreceram, procuraram\no refúgio onde me abatia, aniquilado.\nPareceu-me que a figura imponente minguava – e a minha desgraça diminuiu. Se meu pai se\ntivesse chegado a mim, eu o teria recebido sem o arrepio que a presença dele sempre me deu.\nNão se aproximou: conservou-se longe, rondando, inquieto. Depois se afastou.\nSozinho, vi-o de novo cruel e forte, soprando, espumando. E ali permaneci, miúdo, insignificante,\ntão insignificante e miúdo como as aranhas que trabalhavam na telha negra. Foi esse o primeiro\ncontato que tive com a justiça.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nAssinale a opção em que a forma verbal sublinhada <u>NÃO</u> se encontra no pretérito mais-que-perfeito.",
    "options": [
      {
        "letter": "A",
        "text": "Certamente já me <u>haviam</u> <u>feito</u> representar esse papel (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Irritada, <u>ferira-me</u> à toa, sem querer.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Se não fosse ele, a flagelação me <u>haveria causado</u> menor estrago.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Ainda que <u>tivesse</u> <u>escondido</u> o infame objeto, emudeceria (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "<u>Estivera</u> sem bulir, quase sem respirar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q11",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 11,
    "readingText": "VELHO MARINHEIRO\nHomenagem aos marinheiros de sempre... e para sempre.\nSou marinheiro porque um dia, muito jovem, estendi meu braço diante da bandeira e jurei lhe dar\nminha vida.\nNaquele dia de sol a pino, com meu novo uniforme branco, senti-me homem de verdade, como se\nestivesse dando adeus aos tempos de garoto. Ao meu lado, as vozes de outros jovens soavam em\nuníssono com a minha, vibrantes, e terminamos com emoção, de peitos estufados e orgulhosos.\nAo final, minha mãe veio em minha direção, apressada em me dar um beijo. Acariciou-me o rosto\ne disse que eu estava lindo de uniforme. O dia acabou com a família em festa; eu lembro-me bem,\nfiquei de uniforme até de tarde...\nSou marinheiro, porque aprendi, naquela Escola, o significado nobre de companheirismo. Juntos\nno sofrimento e na alegria, um safando o outro, leais e amigos. Aprendi o que é civismo, respeito e\ndisciplina, no princípio, exigidos a cada dia; depois, como parte do meu ser e, assim, para sempre.\nA cada passo havia um novo esforço esperando e, depois dele, um pequeno sucesso. Minha vida,\nagora que olho para trás, foi toda de pequenos sucessos. A soma deles foi a minha carreira.\nNo meu primeiro navio, logo cedo, percebi que era novamente aluno. Todos sabiam das coisas\nmais do que eu havia aprendido. Só que agora me davam tarefas, influmbências, e esperavam que\neu as cumprisse bem. Pouco a pouco, passei a ser parte da equipe, a ser chamado para ajudar, a\nser necessário. Um dia vi-me ensinando aos novatos e dei-me conta de que me tornara marinheiro,\nde fato e de direito, um profissional! O navio passou a ser minha segunda casa, onde eu\npermanecia mais tempo, Às vezes, do que na primeira. Conhecia todos, alguns mais até do que\nmeus parentes. Sabia de suas manhas, cacoetes, preocupações e de seus sonhos. Sem dar conta,\nmeu mundo acabava no costado do navio.\nA soma de tudo que fazemos e vivemos, pelo navio, é uma das coisas mais belas, que só há entre\nnós, em mais nenhum outro lugar. Por isso sou marinheiro, porque sei o que é espírito de navio.\nBons tempos aqueles das viagens, dávamos um duro danado no mar, em serviço, postos de\ncombate, adestramento de guerra, dia e noite. O interessante é que em toda nossa vida, quando\nbuscamos as boas recordações, elas vêm desse tempo, das viagens e dos navios. Até as durezas\npor que passamos são saborosas ao lembrar, talvez porque as vencemos e fomos adiante.\nÉ aquela história dos pequenos sucessos.\nA volta ao porto era um acontecimento gostoso, sempre figurando a mulher. Primeiro a mãe,\ndepois a namorada, a noiva, a esposa. Muita coisa a contar, a dizer, surpresas de carinho. A comida\npreferida, o abraço apertado, o beijo quente... e o filho que, na ausência, foi ensinado a dizer\npapai.\nNo início, eu voltava com muitos retratos, principalmente quando vinha do estrangeiro, depois,\ncom o tempo, eram poucos, até que deixei de levar a máquina. Engraçado, vocês já perceberam\nque marinheiro velho dificilmente baixa a terra com máquina fotográfica? Foi assim comigo.\nHoje os navios são outros, os marinheiros são outros - sinto-os mais preparados do que eu era -\nmas a vida no mar, as viagens, os portos, a volta, estou certo de que são iguais. Sou marinheiro,\npor isso sei como é.\nFico agora em casa, querendo saber das coisas da Marinha. E a cada pedagogo que algo de um\namigo, que leio, que vejo, me dá um orgulho que às vezes chega a entalar na garganta. Há pouco\ntempo, voltei a entrar em um navio. Que coisa linda! Sofisticado, limpíssimo, nas mãos de uma\ntripulação que pode ser muito competente para mantê-lo pronto. Do que me mostraram eu não\nsabia muito. Basta dizer que o último navio em que servi já deu baixa. Quando sai de bordo, parei\nno portaló, voltei para a bandeira, inclinei a cabeça... e, minha garganta entalou outra vez.\nIsso é corporativismo; não aquele enxovalhado, que significa o bem de cada um, protegido A custa\ndo desmerecimento da instituindo; Mas o puro, que significa o bem da instituição, protegido pelo\nmerecimento de cada um.\nSou marinheiro e, portanto, sou corporativista. Muitas vezes a lembrança me retorna aos dias da\nativa e morro de saudades. Que bom se pudesse voltar ao começo, vestir aquele uniforme novinho\n- até um pouco grande, ainda recordo - Jurar Bandeira, ser beijado pela minha falecida mãe...\nSei que, quando minha hora chegar, no último instante, verei, em velocidade desconhecida, o\nnavio com meus amigos, minha mulher, meus filhos, singrando para sempre, indo aonde o mar\nencontra o céu... e, se São Pedro estiver no portaló, direi:\n- Sou marinheiro, estou embarcando.\n(Autor desconhecido. In: Língua portuguesa: leitura e produção de texto. Rio de Janeiro: Marinha\ndo Brasil, Escola Naval, 2011. p. 6-8)\nGLOSSÁRIO\nPortaló - abertura no casco de um navio, ou passagem junto à balaustrada, por onde as pessoas\ntransitam para fora ou para dentro, e por onde se pode movimentar carga leve.",
    "statement": "“Sei que quando minha hora chegar, no último instante, <u>verei,</u> em velocidade desconhecida, o\nnavio [...].\" (15°§). Em que opção está corretamente justificado o emprego do tempo verbal\ndestacado nesse segmento?",
    "options": [
      {
        "letter": "A",
        "text": "Indica um desejo que será realizado de forma irresoluta em muito pouco tempo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Marca a probabilidade de uma ação que, tudo indica, é iminente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Sugere a esperança improvável de uma condição que se deseja.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Expressa a certeza de um acontecimento que ainda está por vir.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "Enfatiza a necessidade de um fato pelo qual se espera desesperadamente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q12",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 12,
    "readingText": "ESPERA UMA CARTA\nCarlos Drummond de Andrade\nAgora sei por que não vieste, depois de tanto e tanto te esperar. Cheguei a supor que não\nexistisses. Imaginei, às vezes, que foras ter a outra porta, e alguém se beneficiava de ti. Era o\nequívoco mais consolador, afinal não se perderia a mensagem. Eu indagava os rostos, pesquisava\nneles a furtiva iluminação, o traço de beatitude, que indicasse conhecimento de teu segredo. Não\ndistinguia bem, as pessoas se afastavam ou escondiam tão finamente tua posse, que a dúvida\nficava enrodilhada à minha esquerda. O desengano, à direita. E não havia combate entre eles.\nCoexistiam, mais a cabeçuda esperança.\nTodas as manhãs te aguardava. Ao meio-dia já era certo que não vinhas. O resto do dia era neutro.\nRestava amanhã. E outro amanhã. E depois. Repousava, aos domingos, dessa expectação sem\nlimites. Via-te aparecer em sonho, e fechava os olhos como quem soubesse que não te merecia,\nou quisesse retardar o instante de comunicação. Esperar era quase receber. Cismava que te\nrecebera havia longos anos, mas era menino e sem condições de avaliar-te, ou vieras em código, e\neu, sem possuir a chave, me quedava mirando-te e remirando-te como à estrela intocável.\nMuitas recebi durante esse prazo. Não se confundiam contigo. Traziam palavras boas ou más,\nindiferentes, quaisquer. E o receio de que entre elas rolasses perdida, fosses considerada\ninsignificante? Desprezada, como impresso de propaganda?\nAs dádivas que devias trazer-me, quais seriam? Nunca imaginei ao certo o que de grande me\nreservavas. Quem sabe se a riqueza, de que eu tinha medo, mas revestida de doçura e imaginação,\na resumir os prazeres do despojamento? Ou a glória espiritual, sem seus gêmeos a jactância e o\norgulho? Ou o amor – e esta só palavra me fazia curvar a cabeça, ao peso de sua magnificência.\nEu não escolhia nem hesitava. O dom seria perfeito, sem proporção com o ente gratificado. E\ninfinito, a envolver minha finitude.\nMas agora sei por que não vieste nem virás. Estavas entre inúmeras companheiras, jogadas em\nsacos espessos, por sua vez afundados num subterrâneo. E dizer que todos os dias passei por tuas\nproximidades, até mesmo em cima de ti, sem discernir tua pulsação. Servidores infiéis ou cansados\nforam acumulando debaixo do chão o monte de notícias, lamentos, beijos, ameaças, faturas,\nordens, saudades, sobre o qual os caminhões passavam, os dias passavam, passavam os governos\ne suas reformas. Escondida, esmagada no monte, sem sombra de movimento, lá te deixaste jazer,\nenquanto eu conjeturava mil formas de extravio e omissão. Cheguei a desconfiar de ti, a crer que\nzombavas de minha urgência, distraindo-te por itinerários loucos. Suspeitei que te recusavas,\nquase desejei que fogo ou água te liquidassem, já que te esquivavas a tua missão.\nE foi o que aconteceu, sem dúvida. A umidade e os ratos de esgoto te consumiram. Restam – se\nrestarem – fragmentos que nada contam ou explicam, senão que uma carta maravilhosa, esperada\ndesde a eternidade, por mim e por outro qualquer homem igual a mim, foi escrita em alguma parte\ndo mundo e não chegou a destino, porque o Correio a jogou fora, entre trezentas mil ou trezentos\nmilhões de cartas.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\n(...) mas era menino e sem condições de avaliar-te, ou vieras em código, e eu, sem possuir a chave,\n<u>me</u> <u>quedava</u> mirando-te e remirando-te (...). Nessa passagem, a forma verbal sublinhada tem o\nsentido de",
    "options": [
      {
        "letter": "A",
        "text": "me debruçava.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "permanecia.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "me inquietava.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "me desesperava.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "caía.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q13",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 13,
    "readingText": "ESPERA UMA CARTA\nCarlos Drummond de Andrade\nAgora sei por que não vieste, depois de tanto e tanto te esperar. Cheguei a supor que não\nexistisses. Imaginei, às vezes, que foras ter a outra porta, e alguém se beneficiava de ti. Era o\nequívoco mais consolador, afinal não se perderia a mensagem. Eu indagava os rostos, pesquisava\nneles a furtiva iluminação, o traço de beatitude, que indicasse conhecimento de teu segredo. Não\ndistinguia bem, as pessoas se afastavam ou escondiam tão finamente tua posse, que a dúvida\nficava enrodilhada à minha esquerda. O desengano, à direita. E não havia combate entre eles.\nCoexistiam, mais a cabeçuda esperança.\nTodas as manhãs te aguardava. Ao meio-dia já era certo que não vinhas. O resto do dia era neutro.\nRestava amanhã. E outro amanhã. E depois. Repousava, aos domingos, dessa expectação sem\nlimites. Via-te aparecer em sonho, e fechava os olhos como quem soubesse que não te merecia,\nou quisesse retardar o instante de comunicação. Esperar era quase receber. Cismava que te\nrecebera havia longos anos, mas era menino e sem condições de avaliar-te, ou vieras em código, e\neu, sem possuir a chave, me quedava mirando-te e remirando-te como à estrela intocável.\nMuitas recebi durante esse prazo. Não se confundiam contigo. Traziam palavras boas ou más,\nindiferentes, quaisquer. E o receio de que entre elas rolasses perdida, fosses considerada\ninsignificante? Desprezada, como impresso de propaganda?\nAs dádivas que devias trazer-me, quais seriam? Nunca imaginei ao certo o que de grande me\nreservavas. Quem sabe se a riqueza, de que eu tinha medo, mas revestida de doçura e imaginação,\na resumir os prazeres do despojamento? Ou a glória espiritual, sem seus gêmeos a jactância e o\norgulho? Ou o amor – e esta só palavra me fazia curvar a cabeça, ao peso de sua magnificência.\nEu não escolhia nem hesitava. O dom seria perfeito, sem proporção com o ente gratificado. E\ninfinito, a envolver minha finitude.\nMas agora sei por que não vieste nem virás. Estavas entre inúmeras companheiras, jogadas em\nsacos espessos, por sua vez afundados num subterrâneo. E dizer que todos os dias passei por tuas\nproximidades, até mesmo em cima de ti, sem discernir tua pulsação. Servidores infiéis ou cansados\nforam acumulando debaixo do chão o monte de notícias, lamentos, beijos, ameaças, faturas,\nordens, saudades, sobre o qual os caminhões passavam, os dias passavam, passavam os governos\ne suas reformas. Escondida, esmagada no monte, sem sombra de movimento, lá te deixaste jazer,\nenquanto eu conjeturava mil formas de extravio e omissão. Cheguei a desconfiar de ti, a crer que\nzombavas de minha urgência, distraindo-te por itinerários loucos. Suspeitei que te recusavas,\nquase desejei que fogo ou água te liquidassem, já que te esquivavas a tua missão.\nE foi o que aconteceu, sem dúvida. A umidade e os ratos de esgoto te consumiram. Restam – se\nrestarem – fragmentos que nada contam ou explicam, senão que uma carta maravilhosa, esperada\ndesde a eternidade, por mim e por outro qualquer homem igual a mim, foi escrita em alguma parte\ndo mundo e não chegou a destino, porque o Correio a jogou fora, entre trezentas mil ou trezentos\nmilhões de cartas.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "A forma verbal que pertence à <u>segunda</u> conjugação aparece na opção:",
    "options": [
      {
        "letter": "A",
        "text": "Imaginei, às vezes, que foras ter a outra porta, e alguém se beneficiava de ti.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "<u>Via-te</u> aparecer em sonho, e (...).",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "(...) mas era menino e sem condições de avaliar-te, ou <u>vieras</u> em código, (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Coexistiam, mais a cabeçuda esperança.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "(...) até mesmo em cima de ti, sem <u>discernir</u> tua pulsação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q14",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 14,
    "readingText": "A ÚLTIMA CRÔNICA\nA caminho de casa, entro num botequim da Gávea para tomar um café junto ao balcão. Na\nrealidade estou adiando o momento de escrever. A perspectiva me assusta. Gostaria de estar\ninspirado, de coroar com êxito mais um ano nesta busca pitoresco ou do irrisório no cotidiano de\ncada um. Eu pretendia apenas recolher da vida diária algo de seu disperso conteúdo humano, fruto\nda convivência, que a faz mais digna de ser vivida. Visava ao circunstancial, ao episódico. Nesta\nperseguição do acidental, quer num Cagrante de esquina, quer nas palavras de uma criança ou\nnum acidente doméstico, torno-me simples espectador e perco a noção do essencial. Sem mais\nnada contar, curvo a cabeça e tomo meu café, enquanto o verso do poeta se reflete na\nlembrança: “assim eu quereria o meu último poema”. Não sou poeta e estou sem assunto. Lanço\nentão um último olhar fora de mim, onde vivem os assuntos que merecem uma crônica.\nAo fundo do botequim um casal de pretos acaba de sentar-se, numa das últimas mesas de\nmármore ao longo da parede de espelhos. A compostura da humildade, na contenção de gestos e\npalavras, deixa-se acentuar pela presença de uma negrinha de seus três anos, laço na cabeça, toda\narrumadinha no vestido pobre, que se instalou também à mesa: mal ousa balançar as perninhas\ncurtas ou correr os olhos grandes de curiosidade ao redor. Três seres esquivos que compõem em\ntorno à mesa a instituição tradicional da família, célula da sociedade. Vejo, porém, que se\npreparam para algo mais que matar a fome.\nPasso a observá-los. O pai, depois de contar o dinheiro que discretamente retirou do bolso, aborda\no garçom, inclinando-se para trás na cadeira, e aponta no balcão um pedaço de bolo sob a\nredoma. A mãe limita-se a ficar olhando imóvel, vagamente ansiosa, como se aguardasse a\naprovação do garçom. Este ouve, concentrado, o pedido do homem e depois se afasta para\natendê-lo. A mulher suspira, olhando para os lados, a reassegurar-se da naturalidade de sua\npresença ali. A meu lado o garçom encaminha a ordem do freguês. O homem atrás do balcão\napanha a porção do bolo com a mão, larga-o no pratinho — um bolo simples, amarelo-escuro,\napenas uma pequena fatia triangular.\nA negrinha, contida na sua expectativa, olha a garrafa de coca-cola e o pratinho que o garçom\ndeixou à sua frente. Por que não começa a comer? Vejo que os três, pai, mãe e filha, obedecem\nem torno à mesa a um discreto ritual. A mãe remexe na bolsa de plástico preto e brilhante, retira\nqualquer coisa. O pai se mune de uma caixa de fósforos, e espera. A filha aguarda também, atenta\ncomo um animalzinho. Ninguém mais os observa além de mim.\nSão três velinhas brancas, minúsculas, que a mãe espeta caprichosamente na fatia do bolo. E\nenquanto ela serve a coca-cola, o pai risca o fósforo e acende as velas. Como a um gesto\nensaiado, a menininha repousa o queixo no mármore e sopra com força, apagando as chamas.\nImediatamente põe-se a bater palmas, muito compenetrada, cantando num balbucio, a que os pais\nse juntam, discretos: “parabéns pra você, parabéns pra você...“ Depois a mãe recolhe as velas,\ntorna a guardá-las na bolsa. A negrinha agarra finalmente o bolo com as duas mãos sôfregas e\npõe-se a comê-lo. A mulher está olhando para ela com ternura — ajeita-lhe a fitinha no cabelo\ncrespo, limpa o farelo de bolo que lhe cai ao colo, O pai corre os olhos pelo botequim, satisfeito,\ncomo a se convencer intimamente do sucesso da celebração. De súbito, dá comigo a observá-lo,\nnossos olhos se encontram, ele se perturba, constrangido — vacila, ameaça abaixar a cabeça, mas\nacaba sustentando o olhar e enfim se abre num sorriso.\nAssim eu quereria a minha última crônica: que fosse pura como esse sorriso.\n(SABINO, Fernando. A companheira de viagem. Rio de Janeiro: Ed. Record, 1972)",
    "statement": "Assinale a opção que apresenta a forma verbal na terceira conjugação.",
    "options": [
      {
        "letter": "A",
        "text": "“(...) torno-me simples espectador (...)”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“(...) e perco a noção do essencial”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“O pai se mune de uma caixa (...)”.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“Vejo, porém, que (...)”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Três seres esquivos que compõem (...)”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q15",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 15,
    "statement": "“Às crianças daqui de casa tocaram um bicudo e um canário.” O sentido da forma verbal nessa\npassagem é o mesmo que aparece no exemplo seguinte:",
    "options": [
      {
        "letter": "A",
        "text": "Pai, dá-me parte do patrimônio que me toca.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Os passarinhos não tocaram no alpiste que lhes foi dado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "A banda da escola tocou com maestria no baile de formatura.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "A chegada dos passarinhos à casa tocou profundamente as crianças.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Eles realmente não se tocaram com o problema.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q16",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 16,
    "readingText": "Homem no Mar\nRubem Braga\nDe minha varanda vejo, entre árvores e telhados, o mar. Não há ninguém na praia, que resplende\nao sol. O vento é nordeste, e vai tangendo, aqui e ali, no belo azul das águas, pequenas espumas\nque marcham alguns segundos e morrem, como bichos alegres e humildes; perto da terra a onda é\nverde.\nMas percebo um movimento em um ponto do mar; é um homem nadando. Ele nada a uma certa\ndistância da praia, em braçadas pausadas e fortes; nada a favor das águas e do vento, e as\npequenas espumas que nascem e somem parecem ir mais depressa do que ele. Justo: espumas\nsão leves, não são feitas de nada, toda sua substância é água e vento e luz, e o homem tem sua\ncarne, seus ossos, seu coração, todo seu corpo a transportar na água.\nEle usa os músculos com uma calma energia; avança. Certamente não suspeita que um\ndesconhecido o vê e o admira porque ele está nadando em uma praia deserta. Não sei de onde\nvem essa admiração, mas encontro nesse homem uma nobreza calma, sinto-me solidário com ele,\nacompanho o seu esforço solitário como se ele estivesse cumprindo uma bela missão. Já nadou\nem minha presença uns trezentos metros; antes, não sei, duas vezes o perdi de vista, quando ele\npassou atrás das árvores, mas esperei com toda confiança que reaparecesse sua cabeça, e o\nmovimento alternado de seus braços. Mais uns cinquenta metros, e o perderei de vista, pois um\ntelhado o esconderá. Que ele nade bem esses cinquenta ou sessenta metros, isto me parece\nimportante, é preciso que conserve a mesma batida de sua braçada, que eu o veja desaparecer\nassim como o VI aparecer, no mesmo rumo, no mesmo ritmo, forte, lento, sereno. Será perfeito; a\nimagem desse homem me faz bem.\nÉ apenas a imagem de um homem, e eu não poderia saber sua idade, nem sua cor, nem os traços\nde sua cara. Estou solitário com ele, e espero que ele esteja comigo. Que ele atinja o telhado\nvermelho, e então eu poderei sair da varanda tranquilo, pensando – “vi um homem sozinho,\nnadando no mar; quando o VI ele já estava nadando; acompanhei-o com atenção durante todo o\ntempo, e testemunho que ele nadou sempre com firmeza e correção; esperei que ele atingisse um\ntelhado vermelho, e ele atingiu”.\nAgora não sou mais responsável por ele; cumpri o meu dever, e ele cumpriu o seu. Admiro-o. Não\nconsigo saber em que reside, para mim, a grandeza de sua tarefa; ele não estava fazendo nenhum\ngesto a favor de alguém, nem construindo algo útil; mas certamente fazia uma coisa bela, e a fazia\nde um modo puro e viril.\nNão desço para ir esperá-lo na praia e lhe apertar mão; mas dou meu silencioso apoio, minha\natenção e minha estima a esse desconhecido, a esse nobre animal, a esse homem, a esse correto\nirmão.\n(Fonte: BRAGA, Rubem. O verão e as mulheres. 10 ed. Rio de Janeiro: Record, 2008. Texto\nadaptado.)",
    "statement": "Assinale a opção em que o verbo em destaque foi empregado no modo indicativo:",
    "options": [
      {
        "letter": "A",
        "text": "“[…] que <u>resplende</u> ao sol.” (1º §)",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“Que ele <u>nade</u> bem [...]” (3º §)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“[…] que <u>conserve</u> a mesma batida [...]” (3º §)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“[…] que ele <u>esteja</u> comigo.” (4º §)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“ Que ele <u>atinja</u> o telhado [...]” (4º §)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q17",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 17,
    "readingText": "Recado pro bolsinho da camisa\nLourenço Diaféria\nNão sei como você se chama, garoto, mas te vi um dia atravessando o viaduto de concreto.\nCaía chuvisco.\nTeus cabelos estavam ensopados e a camisa de brim grudada no teu corpo magro e ágil como\nflecha disparada pelo arco do trabalho.\nVocê corria saltando no reflexo do asfalto molhado, como bolinha de gude rolada na infância.\nNão deu tempo para perguntar teu nome. Tuas pernas finas tinham pressa. Você carregava a\nmaleta de mão com fecho cromado, e dentro dela havia o peso da responsabilidade de papéis\nsérios e urgentes, que deveriam chegar a um ponto qualquer da Cidade, antes que se fechassem\nos guichês e portarias.\nOutra vez te vi, garoto.\nFazia então um sol redondo e cheio pendurado no travessão do espaço.\nOutra vez, teus cabelos úmidos de suor, a camisa de brim manchada, as calças rústicas mostrando\na marca da barra que tua mãe soltou de noite, fio por fio, com um sorriso e um orgulho:\n— O moleque está crescendo!\nNão sei como você se chama, garoto.\nTe conheço de vista escalando os edifícios, alpinista de elevadores, abridor de picadas na\nmultidão, ponta de lança rompedor nesta briga de foice que são as ruas da Cidade.\nGaroto que cresce sob o sol e chuva carregando na maleta cheques, duplicatas, títulos, recibos,\ncartas, telegramas, tutu, bufunfa, grana e um retrato da menina que te espera na lanchonete.\nTeu nome é: — gente.\nInventaram outro nome enrolado para dizer que você é garoto do batente.\nOffice-boy.\nGuri que finta banco, escritório, repartição, fila, balcão, pedido de certidão, imposto a pagar, taxa\nde conservação, título no protesto e que mata no peito e baixa no terreno quando encontra os\nolhos da garota da caixa, que pergunta de modo muito legal:\n—Tem dois cruzeiros trocados?\nMoleque valente que acorda cedo, engole café com pão, fala tchau mesmo, vai pro ponto do\nônibus ou estação, se pendura na condução, se vira mais que pião, tem sua turma, conta\nvantagem, lê jornal na banca, esquenta a marmita, discute a seleção, e depois do almoço bebe um\nrefrigerante gelado e pede uma esfirra com limão.\nE depois toca de novo a zunir pela Cidade, conhecido em tudo que é esquina, oi daqui, oi dali, até\nque a tarde chega e o garoto sai correndo de volta pra casa, vestir o guarda-pó, apanhar a\nesferográfica, enfiar os cadernos na sacola e enfrentar a escola, o sono, a voz do professor, o\nquadro-negro, a equação de duas incógnitas, depois de ter passado o dia inteiro gastando sola.\nGuri, teu nome é: — gente.\nMenino de escritório, menino do batente, que agarra o trabalho com unhas e dentes, sem você a\nCidade amanheceria paralisada como bicho enorme ao qual houvessem cortado as pernas.\nPois bem: este recado não é para ser entregue a ninguém, a não ser a você mesmo.\nSe quiser, guarde-o no bolsinho da camisa.\nUm dia, quando você estiver completamente crescido, quando tiver bigodes, telefones, papéis\nimportantes para preencher, alguns cabelos brancos; e sua mãe não precisar (ou não puder mais)\ndesmanchar a barra de suas calças que ficaram curtas; quando você tiver de dar ordens de serviço\na outros garotos da Cidade, saberá que, para chegar a qualquer lugar, o segredo é não desistir no\nmeio do caminho.\nMas não se esqueça nunca de que as oportunidades não apenas se recebem ou se conquistam.\nAs oportunidades também devem ser oferecidas para que as pessoas pequenas saibam que seu\nnome é: — gente.\nNo futebol da vida, garoto, a parada é dura e a bola, dividida. Jogue o jogo mais limpo que você\ntiver. Jogue sério.\nNão afrouxe se o passe recebido parecer longo demais.\nOs mais bonitos gols da vida são marcados pelos que acreditam na força de seu pique.\nPonha esse recado no bolsinho da camisa, guri.\nUm dia você descobrirá que a vida nem sempre é a conquista da taça.\nA vida é participar do campeonato.\nVai nela, garotão!\n(Antologia da crônica brasileira — de Machado de Assis a Lourenço Diaféria. São Paulo: Moderna,\n2005. p. 196-9.)\nFonte: Livro- Português: Linguagem, 3/ William Roberto Cereja, Thereza Cochar Magalhães, 11.ed\n— São Paulo: Saraiva, 2016. p.35-7.\n“Se quiser, <u>guarde-o</u> no bolsinho da camisa.”",
    "statement": "Assinale a opção que apresenta uma forma verbal com a mesma regência do verbo sublinhado\nno fragmento acima.",
    "options": [
      {
        "letter": "A",
        "text": "<u>“Inventaram</u> outro nome enrolado para dizer que você é garoto do batente.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“Moleque valente que <u>acorda</u> cedo, engole café com pão [...]”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“[...] e o garoto <u>sai correndo</u> de volta pra casa [...]\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“[...] quando você tiver de <u>dar</u> ordens de serviço a outros garotos da Cidade [...]”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“A vida é <u>participar</u> do campeonato.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q18",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 18,
    "readingText": "Recado pro bolsinho da camisa\nLourenço Diaféria\nNão sei como você se chama, garoto, mas te vi um dia atravessando o viaduto de concreto.\nCaía chuvisco.\nTeus cabelos estavam ensopados e a camisa de brim grudada no teu corpo magro e ágil como\nflecha disparada pelo arco do trabalho.\nVocê corria saltando no reflexo do asfalto molhado, como bolinha de gude rolada na infância.\nNão deu tempo para perguntar teu nome. Tuas pernas finas tinham pressa. Você carregava a\nmaleta de mão com fecho cromado, e dentro dela havia o peso da responsabilidade de papéis\nsérios e urgentes, que deveriam chegar a um ponto qualquer da Cidade, antes que se fechassem\nos guichês e portarias.\nOutra vez te vi, garoto.\nFazia então um sol redondo e cheio pendurado no travessão do espaço.\nOutra vez, teus cabelos úmidos de suor, a camisa de brim manchada, as calças rústicas mostrando\na marca da barra que tua mãe soltou de noite, fio por fio, com um sorriso e um orgulho:\n— O moleque está crescendo!\nNão sei como você se chama, garoto.\nTe conheço de vista escalando os edifícios, alpinista de elevadores, abridor de picadas na\nmultidão, ponta de lança rompedor nesta briga de foice que são as ruas da Cidade.\nGaroto que cresce sob o sol e chuva carregando na maleta cheques, duplicatas, títulos, recibos,\ncartas, telegramas, tutu, bufunfa, grana e um retrato da menina que te espera na lanchonete.\nTeu nome é: — gente.\nInventaram outro nome enrolado para dizer que você é garoto do batente.\nOffice-boy.\nGuri que finta banco, escritório, repartição, fila, balcão, pedido de certidão, imposto a pagar, taxa\nde conservação, título no protesto e que mata no peito e baixa no terreno quando encontra os\nolhos da garota da caixa, que pergunta de modo muito legal:\n—Tem dois cruzeiros trocados?\nMoleque valente que acorda cedo, engole café com pão, fala tchau mesmo, vai pro ponto do\nônibus ou estação, se pendura na condução, se vira mais que pião, tem sua turma, conta\nvantagem, lê jornal na banca, esquenta a marmita, discute a seleção, e depois do almoço bebe um\nrefrigerante gelado e pede uma esfirra com limão.\nE depois toca de novo a zunir pela Cidade, conhecido em tudo que é esquina, oi daqui, oi dali, até\nque a tarde chega e o garoto sai correndo de volta pra casa, vestir o guarda-pó, apanhar a\nesferográfica, enfiar os cadernos na sacola e enfrentar a escola, o sono, a voz do professor, o\nquadro-negro, a equação de duas incógnitas, depois de ter passado o dia inteiro gastando sola.\nGuri, teu nome é: — gente.\nMenino de escritório, menino do batente, que agarra o trabalho com unhas e dentes, sem você a\nCidade amanheceria paralisada como bicho enorme ao qual houvessem cortado as pernas.\nPois bem: este recado não é para ser entregue a ninguém, a não ser a você mesmo.\nSe quiser, guarde-o no bolsinho da camisa.\nUm dia, quando você estiver completamente crescido, quando tiver bigodes, telefones, papéis\nimportantes para preencher, alguns cabelos brancos; e sua mãe não precisar (ou não puder mais)\ndesmanchar a barra de suas calças que ficaram curtas; quando você tiver de dar ordens de serviço\na outros garotos da Cidade, saberá que, para chegar a qualquer lugar, o segredo é não desistir no\nmeio do caminho.\nMas não se esqueça nunca de que as oportunidades não apenas se recebem ou se conquistam.\nAs oportunidades também devem ser oferecidas para que as pessoas pequenas saibam que seu\nnome é: — gente.\nNo futebol da vida, garoto, a parada é dura e a bola, dividida. Jogue o jogo mais limpo que você\ntiver. Jogue sério.\nNão afrouxe se o passe recebido parecer longo demais.\nOs mais bonitos gols da vida são marcados pelos que acreditam na força de seu pique.\nPonha esse recado no bolsinho da camisa, guri.\nUm dia você descobrirá que a vida nem sempre é a conquista da taça.\nA vida é participar do campeonato.\nVai nela, garotão!\n(Antologia da crônica brasileira — de Machado de Assis a Lourenço Diaféria. São Paulo: Moderna,\n2005. p. 196-9.)\nFonte: Livro- Português: Linguagem, 3/ William Roberto Cereja, Thereza Cochar Magalhães, 11.ed\n— São Paulo: Saraiva, 2016. p.35-7.",
    "statement": "Assinale a opção em que o termo sublinhado NÃO é uma forma verbal.",
    "options": [
      {
        "letter": "A",
        "text": "“[...] um retrato da menina que te <u>espera</u> na lanchonete.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Guri que finta banco, escritório, repartição, fila, balcão, <u>pedido</u> de certidão, imposto a pagar, [...]\"",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "“[...] os olhos da garota da caixa, que <u>pergunta</u> de modo muito legal [...]”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Moleque valente que acorda cedo, <u>engole</u> café com pão [...]”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“As oportunidades também devem ser <u>oferecidas</u> para que as pessoas pequenas saibam que seu nome é: — gente”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q19",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 19,
    "readingText": "Recado pro bolsinho da camisa\nLourenço Diaféria\nNão sei como você se chama, garoto, mas te vi um dia atravessando o viaduto de concreto.\nCaía chuvisco.\nTeus cabelos estavam ensopados e a camisa de brim grudada no teu corpo magro e ágil como\nflecha disparada pelo arco do trabalho.\nVocê corria saltando no reflexo do asfalto molhado, como bolinha de gude rolada na infância.\nNão deu tempo para perguntar teu nome. Tuas pernas finas tinham pressa. Você carregava a\nmaleta de mão com fecho cromado, e dentro dela havia o peso da responsabilidade de papéis\nsérios e urgentes, que deveriam chegar a um ponto qualquer da Cidade, antes que se fechassem\nos guichês e portarias.\nOutra vez te vi, garoto.\nFazia então um sol redondo e cheio pendurado no travessão do espaço.\nOutra vez, teus cabelos úmidos de suor, a camisa de brim manchada, as calças rústicas mostrando\na marca da barra que tua mãe soltou de noite, fio por fio, com um sorriso e um orgulho:\n— O moleque está crescendo!\nNão sei como você se chama, garoto.\nTe conheço de vista escalando os edifícios, alpinista de elevadores, abridor de picadas na\nmultidão, ponta de lança rompedor nesta briga de foice que são as ruas da Cidade.\nGaroto que cresce sob o sol e chuva carregando na maleta cheques, duplicatas, títulos, recibos,\ncartas, telegramas, tutu, bufunfa, grana e um retrato da menina que te espera na lanchonete.\nTeu nome é: — gente.\nInventaram outro nome enrolado para dizer que você é garoto do batente.\nOffice-boy.\nGuri que finta banco, escritório, repartição, fila, balcão, pedido de certidão, imposto a pagar, taxa\nde conservação, título no protesto e que mata no peito e baixa no terreno quando encontra os\nolhos da garota da caixa, que pergunta de modo muito legal:\n—Tem dois cruzeiros trocados?\nMoleque valente que acorda cedo, engole café com pão, fala tchau mesmo, vai pro ponto do\nônibus ou estação, se pendura na condução, se vira mais que pião, tem sua turma, conta\nvantagem, lê jornal na banca, esquenta a marmita, discute a seleção, e depois do almoço bebe um\nrefrigerante gelado e pede uma esfirra com limão.\nE depois toca de novo a zunir pela Cidade, conhecido em tudo que é esquina, oi daqui, oi dali, até\nque a tarde chega e o garoto sai correndo de volta pra casa, vestir o guarda-pó, apanhar a\nesferográfica, enfiar os cadernos na sacola e enfrentar a escola, o sono, a voz do professor, o\nquadro-negro, a equação de duas incógnitas, depois de ter passado o dia inteiro gastando sola.\nGuri, teu nome é: — gente.\nMenino de escritório, menino do batente, que agarra o trabalho com unhas e dentes, sem você a\nCidade amanheceria paralisada como bicho enorme ao qual houvessem cortado as pernas.\nPois bem: este recado não é para ser entregue a ninguém, a não ser a você mesmo.\nSe quiser, guarde-o no bolsinho da camisa.\nUm dia, quando você estiver completamente crescido, quando tiver bigodes, telefones, papéis\nimportantes para preencher, alguns cabelos brancos; e sua mãe não precisar (ou não puder mais)\ndesmanchar a barra de suas calças que ficaram curtas; quando você tiver de dar ordens de serviço\na outros garotos da Cidade, saberá que, para chegar a qualquer lugar, o segredo é não desistir no\nmeio do caminho.\nMas não se esqueça nunca de que as oportunidades não apenas se recebem ou se conquistam.\nAs oportunidades também devem ser oferecidas para que as pessoas pequenas saibam que seu\nnome é: — gente.\nNo futebol da vida, garoto, a parada é dura e a bola, dividida. Jogue o jogo mais limpo que você\ntiver. Jogue sério.\nNão afrouxe se o passe recebido parecer longo demais.\nOs mais bonitos gols da vida são marcados pelos que acreditam na força de seu pique.\nPonha esse recado no bolsinho da camisa, guri.\nUm dia você descobrirá que a vida nem sempre é a conquista da taça.\nA vida é participar do campeonato.\nVai nela, garotão!\n(Antologia da crônica brasileira — de Machado de Assis a Lourenço Diaféria. São Paulo: Moderna,\n2005. p. 196-9.)\nFonte: Livro- Português: Linguagem, 3/ William Roberto Cereja, Thereza Cochar Magalhães, 11.ed\n— São Paulo: Saraiva, 2016. p.35-7.",
    "statement": "Analise os trechos a seguir:\nI- “Menino de escritório, menino do batente, que agarra o trabalho com unhas e dentes, sem você\na Cidade amanheceria paralisada como bicho enorme ao qual <u>houvessem cortado</u> as pernas.”\nII- “Um dia, quando você <u>estiver</u> completamente crescido, quando tiver bigodes, telefones,\npapéis importantes para preencher, alguns cabelos brancos [...]\"\nIII- “As oportunidades também devem ser oferecidas para que as pessoas pequenas <u>saibam</u> que\nseu nome é: — gente.”\nOs verbos ou locuções verbais em destaque nos trechos correspondem, respectivamente, a\nque tempos verbais do subjuntivo?",
    "options": [
      {
        "letter": "A",
        "text": "I- pretérito imperfeito, II-pretérito mais-que-perfeito e III-futuro simples.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "I- futuro composto, II-presente e III-pretérito perfeito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "I- pretérito perfeito, II-pretérito imperfeito e III-pretérito mais-que-perfeito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "I- pretérito mais-que-perfeito, II-futuro simples e III-presente.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "I- presente, II-pretérito perfeito e III-pretérito imperfeito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q20",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 20,
    "readingText": "Texto 2\n**A LIBERDADE DE LER**\nGabriel Perissé\nHá quem afirme a necessidade de lermos um livro de cada vez, de cabo a rabo, nunca, jamais\npulando páginas, e muito menos desistindo da leitura. Mais uma obrigatoriedade! Conheci\ninúmeros seguidores dessa lei que, empolgados marinheiros de primeira viagem, embarcaram num\nOs Buddenbrooks, de Thomas Mann, ou num A cidadela, de Saint-Exupéry, ou num Grande\nsertão: veredas, de Guimarães Rosa, ou num O jogo da amarelinha, de Júlio Cortázar, e trinta\npáginas depois já estavam encalhados para sempre, sem ânimo de ir em frente e sem coragem de\nabandonar o navio.\nNão é necessário levar uma leitura até o fim, embora se trate de clássico consagrado, ou até por\nisso mesmo, uma vez que os clássicos não são mero jornal (ler os clássicos é ler uma espécie de\njornal complexo e instigante), e mais vale ler e entender duas linhas de Dom Quixote a ler todas as\nnotícias de um ano sobre política ou economia. Também podemos pular as páginas do livro que\nfor, quantas quisermos, e ler o final do romance assim que se começar, enfim: liberdade.\nNinguém precisa ficar compromissado com um único livro. Podemos ler simultaneamente dois,\ntrês livros, com objetivos diferentes, em diferentes momentos do dia: ler uma biografia no ônibus,\npela manhã, prosseguir um pouco mais num livro de ensaios filosóficos após o almoço, e ir\ntraçando um romance em algum momento da noite.\nLer é uma arte, e, como toda arte, requer de seu artista sábia flexibilidade, capacidade de utilizar\nos meios de acordo com a finalidade primordial a ser alcançada. Leio para crescer, viver melhor,\nme ampliar, me expandir, me superar, me realizar.\nTal crescimento não exclui o esforço, constante, obstinado, até mesmo heroico, de concluir uma\nleitura exigente, para não dizer desagradável, mas que tenho consciência de ser basilar para minha\nformação, ou fundamental para realizar um trabalho acadêmico, realizar alguma tarefa, ou mesmo\nde participar de um concurso, de um vestibular com suas leituras obrigatórias. Ao contrário de um\nobstáculo paralisante, certos livros são desafio necessário para a continuidade de nosso\ndesenvolvimento como leitores, desafio do qual fugir seria realmente retroceder.\nAbrir mão de muitos livros (ou nem sequer conhecê-los...) faz parte de nossa vida de leitores, e ao\nmesmo tempo ter sempre à mão, trazer sempre para perto de nós um livro (ou mais de um) que de\nfato nos motive a pensar, a imaginar, a sentir, a desejar (a desejar utopias!), a pôr em ação nossa\ninterioridade. Um livro que nos acompanhe na sala de espera do dentista, na rodoviária, na estação\ndo metrô, no aeroporto... Livro que emprestaremos para alguém, livro que promoveremos como\npudermos, livro que fará parte de nossa biografia. O essencial é encontrá-lo e incorporá-lo à nossa\nvida.\nA arte de ler gera, com o tempo, uma segunda natureza, Ao nosso “eu” acrescentam-se e\nmesclam-se contribuições vivas de outras cabeças e outros corações. Assimilando e digerindo\nessas contribuições, estaremos nos autoeducando em vista de um aperfeiçoamento que, por sua\nvez, se refletirá em nossas ações, e, dentre elas, em tudo aquilo que dissermos e escrevermos.\nNa biblioteca particular de Guimarães Rosa, encontrou-se, conforme nos conta Suzi Frankl Sperber\nem seu livro Caos e cosmos, um exemplar de Devoirs, escrito pelo pensador francês Antoine D.\nSertillanges, com vários trechos sublinhados pelo escritor mineiro. Eis um deles: “O ser que\nrecebemos ao nascer não é definitivo; é embrionário, plástico”. Ora, lendo Grande sertão: veredas,\nvamos deparar com esta mesma ideia, ficcionalizada, retraduzida, reformulada: “Mire veja: o mais\nimportante e bonito, do mundo, é isto: que as pessoas não estão sempre iguais, ainda não foram\nterminadas - mas que elas vão sempre mudando. Afinam ou desafinam. Verdade maior.”\nA leitura daquele livro influenciou o autor mineiro de tal modo que uma das passagens que o\nimpressionou, e foi por ele grifada a fim de poder reencontrá-la e nela meditar, tornou-se conatural\nao escritor e aflorou espontaneamente (ou talvez nem tanto...) quando produzia seu próprio texto.\nO mesmo acontece conosco. Lendo, estamos apostando na construção de nós mesmos e, por\nconseguinte, também em nossa expressão verbal e escrita. Quem quiser melhorar seus textos\nprecisará humanizar-se, tornar mais lúcida sua visão de mundo, trabalhar a fonte daquilo que\nescreve - sua própria interioridade.\nPERISSE, Gabriel. Ler, pensar e escrever. São Paulo: Saraiva, 2011 (Texto adaptado)\nAnalise o trecho abaixo.\n“Ler é uma arte, e, como toda arte, requer de seu artista sabia flexibilidade, capacidade de utilizar\nos meios de acordo com a finalidade primordial a ser alcançada.” (\n\n4º§)",
    "statement": "No trecho acima, ao se flexionar o verbo destacado no pretérito perfeito do indicativo, tem-se a\nforma:",
    "options": [
      {
        "letter": "A",
        "text": "requis.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "requereu.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "requeriu.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "requeria.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "requerera.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q21",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 21,
    "readingText": "A Última Crônica\nFernando Sabino\nA caminho de casa, entro num botequim da Gávea para tomar um café junto ao balcão. Na\nrealidade estou adiando o momento de escrever. A perspectiva me assusta. Gostaria de estar\ninspirado, de coroar com êxito mais um ano nesta busca do pitoresco ou do irrisório no cotidiano\nde cada um. Eu pretendia apenas recolher da vida diária algo de seu disperso conteúdo humano,\nfruto da convivência, que a faz mais digna de ser vivida. Visava ao circunstancial, ao episódico.\nNesta perseguição do acidental, quer num Cagrante de esquina, quer nas palavras de uma criança\nou num acidente doméstico, torno-me simples espectador e perco a noção do essencial. Sem\nmais nada para contar, curvo a cabeça e tomo meu café, enquanto o verso do poeta se reflete na\nlembrança: “assim eu quereria o meu último poema”. Não sou poeta e estou sem assunto. Lanço\nentão um último olhar fora de mim, onde vivem os assuntos que merecem uma crônica.\nAo fundo do botequim um casal de pretos acaba de sentar-se, numa das últimas mesas de\nmármore ao longo da parede de espelhos. A compostura da humildade, na contenção de gestos e\npalavras, deixa-se acrescentar pela presença de uma negrinha de seus três anos, laço na cabeça,\ntoda arrumadinha no vestido pobre, que se instalou também à mesa: mal ousa balançar as\nperninhas curtas ou correr os olhos grandes de curiosidade ao redor. Três seres esquivos que\ncompõem em torno à mesa a instituição tradicional da família, célula da sociedade. Vejo, porém,\nque se preparam para algo mais que matar a fome.\nPasso a observá-los. O pai, depois de contar o dinheiro que discretamente retirou do bolso,\naborda o garçom, inclinando-se para trás na cadeira, e aponta no balcão um pedaço de bolo sob a\nredoma. A mãe limita-se a ficar olhando imóvel, vagamente ansiosa, como se aguardasse a\naprovação do garçom. Este ouve, concentrado, o pedido do homem e depois se afasta para\natendê-lo. A mulher suspira, olhando para os lados, a reassegurar-se da naturalidade de sua\npresença ali. A meu lado o garçom encaminha a ordem do freguês. O homem atrás do balcão\napanha a porção do bolo com a mão, larga-o no pratinho – um bolo simples, amarelo-escuro,\napenas uma pequena fatia triangular.\nA negrinha, contida na sua expectativa, olha a garrafa de Coca-Cola e o pratinho que o\ngarçom deixou à sua frente. Por que não começa a comer? Vejo que os três, pai, mãe e filha,\nobedecem em torno à mesa um discreto ritual. A mãe remexe na bolsa de plástico preto e\nbrilhante, retira qualquer coisa. O pai se mune de uma caixa de fósforos, e espera. A filha aguarda\ntambém, atenta como um animalzinho. Ninguém mais os observa além de mim.\nSão três velinhas brancas, minúsculas, que a mãe espeta caprichosamente na fatia do bolo. E\nenquanto ela serve a Coca-Cola, o pai risca o fósforo e acende as velas. Como a um gesto\nensaiado, a menininha repousa o queixo no mármore e sopra com força, apagando as chamas.\nImediatamente põe-se a bater palmas, muito compenetrada, cantando num balbucio, a que os pais\nse juntam, discretos: “Parabéns pra você, parabéns pra você…”\nDepois a mãe recolhe as velas, torna a guardá-las na bolsa. A negrinha agarra finalmente o\nbolo com as duas mãos sôfregas e põe-se a comê-lo. A mulher está olhando para ela com ternura\n– ajeita-lhe a fitinha no cabelo crespo, limpa o farelo de bolo que lhe cai ao colo. O pai corre os\nolhos pelo botequim, satisfeito, como a se convencer intimamente do sucesso da celebração. Dá\ncomigo de súbito, a observá-lo, nossos olhos se encontram, ele se perturba, constrangido – vacila,\nameaça abaixar a cabeça, mas acaba sustentando o olhar e enfim se abre num sorriso.",
    "statement": "Considere o trecho: \"O pai se mune de uma caixa de fósforos, e espera.\". Aqui, \"espera\" está na\nterceira pessoa do singular do presente do indicativo. Qual das seguintes opções apresenta um\nverbo no futuro do presente composto do indicativo, na terceira pessoa do singular, que poderia\nsubstituir \"espera\", ainda que não mantivesse a coerência do texto?",
    "options": [
      {
        "letter": "A",
        "text": "Terá esperado",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Tinha esperado",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Estará esperando",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Havia esperado",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Teria esperado",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q22",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 22,
    "readingText": "Texto II\nGrande Sertão, Veredas (João Guimarães Rosa)\n“… a gente quer passar um rio a nado, e passa:\nmas vai dar na outra banda é um ponto muito mais em baixo,\nbem diverso do em que primeiro se pensou.\nViver nem não é muito perigoso?”\n“(…) a colheita é comum, mas o capinar é sozinho.”\n“(…) o mais importante e bonito, do mundo, é isto:\nque as pessoas não estão sempre iguais, ainda não foram terminadas,\nmas que elas vão sempre mudando.\nAfinam ou desafinam. Verdade maior.”\n“(…) Viver é muito perigoso; e não é não.\nNem sei explicar estas coisas.\nUm sentir é o do sentente, mas outro é do sentidor.”\n\"A vida inventa! A gente principia as coisas,\nno não saber por que, e desde aí perde\no poder de continuação, porque a vida é\nmutirão de todos, por todos remexida e temperada.”\n“Dói sempre na gente, alguma vez, todo amor achável,\nque algum dia se desprezou…\nQualquer amor já é um pouquinho de saúde,\num descanso na loucura.”\n“O correr da vida embrulha tudo,\na vida é assim: esquenta e esfria,\naperta e daí afrouxa, sossega e depois desinquieta.\nO que ela quer da gente é coragem.\nO que Deus quer é ver a gente aprendendo a ser capaz\nde ficar alegre a mais, no meio da alegria,\ne inda mais alegre ainda no meio da tristeza!”\n“O que era isso,\nque a desordem da vida podia sempre mais que a gente?”\n“Quem muito se evita, se convive.”\n“Todo caminho da gente é resvaloso.\nMas, também, cair não prejudica demais\n– a gente levanta, a gente sobe, a gente volta.”\n“Não ter vergonha como homem é fácil;\ndificultoso e bom era poder não se ter\nvergonha feito os bichos animais.”\n\"Sossego traz desejos.”",
    "statement": "No trecho \"O correr da vida embrulha tudo, a vida é assim: <u>esquenta</u> e <u>esfria,</u> <u>aperta</u> e daí <u>afrouxa,</u>\n<u>sossega</u> e depois <u>desinquieta\",</u> os verbos destacados indicam predominantemente uma ação:",
    "options": [
      {
        "letter": "A",
        "text": "Habitual",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Instantânea",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Progressiva",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Conclusiva",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Contínua",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q23",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 23,
    "readingText": "Você é dono do seu tempo?\nUma das queixas mais frequentes dos homens e mulheres, de todas as idades, que tenho\npesquisado é: “falta de tempo”.\nEles dizem que gostariam de fazer cursos de filosofia e história, ler mais livros, escrever, dançar,\npraticar esportes, fazer musculação e pilates, aprender a tocar piano e cantar, estudar inglês e\nfrancês, sair com os amigos, namorar, viajar, ir ao teatro e cinema, conhecer lugares novos,\ncaminhar na praia, participar de palestras, fazer um trabalho voluntário e muitas outras atividades\ninteressantes, diferentes e prazerosas. [...]\nEles vivem uma espécie de escravidão: o tempo deles é regulado por demandas externas, não\ninternas. Afirmam que não sobra tempo livre para eles, já que precisam responder a intermináveis\nobrigações sociais, profissionais e familiares. É um tempo para os outros, que pertence a outros.\nEles gastam o tempo agradando, cuidando e atendendo às necessidades dos filhos, cônjuges,\nnetos, pais, irmãos, amigos, colegas de trabalho. Sentem-se “sem tempo para mais nada, nem para\ndormir direito”. Estão “cansados, exaustos, esgotados, sugados, vampirizados, massacrados”.\nUma psicóloga de 62 anos disse: “A desculpa de falta de tempo é a prova do nosso medo de\nfazer aquilo que realmente desejamos. Não temos coragem de dizer não, queremos agradar a\ntodo mundo e esquecemos que precisamos agradar, em primeiro lugar, a nós mesmos. Ser livre\npara priorizar as próprias escolhas e desejos, e usar o tempo para concretizá-los, é arriscado e dá\nmuito trabalho. É mais fácil ser escravo do tempo dos outros do que senhor do próprio tempo”.\n(GOLDENBERG, M. Você é dono do seu tempo? Folha de São Paulo, 21/02/2017. Disponível em:\n>http://www1.folha.uol.com.br/colunas/ miriangoldenberg/2017/02/-voce-e-o-dono-do-seu-tempo.shtml>. Acessado em 10 jul. 2017).",
    "statement": "Dentre as frases retiradas do texto, há uma em que o verbo diverge dos demais do ponto de vista\nda sua transitividade.",
    "options": [
      {
        "letter": "A",
        "text": "“queremos agradar a todo mundo.\"",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“... para priorizar as próprias escolhas e desejos...\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "\"... usar o tempo para concretizá-los...\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Eles gastam o tempo...\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q24",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 24,
    "readingText": "Oração ao tempo\nCaetano Veloso e A outra Banda da Terra\n\"És um senhor tão bonito\nQuanto a cara do meu filho\nTempo, tempo, tempo, tempo\nVou te fazer um pedido\nTempo, tempo, tempo, tempo\nCompositor de destinos\nTambor de todos os ritmos\nTempo, tempo, tempo, tempo\nEntro num acordo contigo\nTempo, tempo, tempo, tempo\nNão és carrasco nem és deus\nNão és o tempo dos fracos\nNão és o tempo dos fortes\nTempo, tempo, tempo, tempo\nÉs o tempo da espera\nO tempo da consulta\nTempo, tempo, tempo, tempo\nÉs o tempo da canção\nNo tempo da palavra\nTempo, tempo, tempo, tempo\nÉs o tempo de amor\nTempo, tempo, tempo, tempo\nTempo, tempo, tempo, tempo\"",
    "statement": "Com base ainda na letra da música \"Oração ao Tempo\", é possível inferir que:",
    "options": [
      {
        "letter": "A",
        "text": "O tempo é um elemento que não pode ser controlado pelos seres humanos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "O tempo é um elemento que pode ser utilizado de maneira criativa.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "O tempo é um elemento que pode ser interpretado de maneiras distintas por cada indivíduo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O tempo é um elemento que é capaz de transformar as pessoas, tornando-as melhores.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q25",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 25,
    "readingText": "Texto para responder à questão\n“[...] O fascínio que a linguagem sempre exerceu sobre o homem vem desse poder que permite\nnão só nomear/criar/transformar o universo real, mas também possibilita trocar experiências, falar\nsobre o que existiu, poderá vir a existir e até mesmo imaginar o que não precisa nem pode existir.\nA linguagem verbal é, então, a matéria do pensamento e o veículo da comunicação social. Assim\ncomo não há sociedade sem linguagem, não há sociedade sem comunicação. Tudo o que se\nproduz como linguagem ocorre em sociedade, para ser comunicado e, como tal, constitui uma\nrealidade material que se relaciona com o que lhe é exterior, com o que existe\nindependentemente da linguagem. Como realidade material - organização de sons, palavras,\nfrases - a linguagem é relativamente autónoma; como expressão de emoções, ideias, propósitos,\nno entanto, ela é orientada pela visão de mundo, pelas injunções da realidade social, histórica e\ncultural de seu falante. [...]\"\n(Margarida Petter)\nFonte: FIORIN, José Luiz. Introdução à Linguística. São Paulo: Contexto, 2012.",
    "statement": "Há frase na voz passiva na alternativa:",
    "options": [
      {
        "letter": "A",
        "text": "\"... a linguagem sempre exerceu sobre o homem...\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "\" O fascínio que a linguagem sempre exerceu sobre o homem vem desse poder...\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "\"Tudo o que se produz como linguagem ocorre em sociedade\"",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "\"... uma realidade material que se relaciona com o que lhe é exterior...\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "\"... com o que existe independentemente da linguagem.\"",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q26",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 26,
    "readingText": "As caridades odiosas\nClarice Lispector\nFoi uma tarde de sensibilidade ou de suscetibilidade? Eu passava pela rua depressa, emaranhada\nnos meus pensamentos, como às vezes acontece. Foi quando meu vestido me reteve: alguma\ncoisa se enganchara na minha saia. Voltei-me e\nvi que se tratava de uma mão pequena e escura. Pertencia a um menino a que a sujeira e o\nsangue interno davam um tom quente de pele. O menino estava de pé no degrau da grande\nconfeitaria. Seus olhos, mais do que suas palavras meio engolidas, informavam-me de sua paciente\naflição. Paciente demais. Percebi vagamente um pedido, antes de compreender o seu sentido\nconcreto. Um pouco aturdida eu o olhava, ainda em dúvida se fora a mão da criança o que me\nceifara os pensamentos.\n— Um doce, moça, compre um doce para mim.\nAcordei finalmente. O que estivera eu pensando antes de encontrar o menino? O fato é que o\npedido deste pareceu cumular uma lacuna, dar uma resposta que podia servir para qualquer\npergunta, assim como uma grande chuva pode matar a sede de quem queria uns goles de água.\nSem olhar para os lados, por pudor talvez, sem querer espiar as mesas da confeitaria onde\npossivelmente algum conhecido tomava sorvete, entrei, fui ao balcão e disse com uma dureza que\nsó Deus sabe explicar: um doce para o menino.\nDe que tinha eu medo? Eu não olhava a criança, queria que a cena, humilhante para mim,\nterminasse logo. Perguntei-lhe: que doce você...\nAntes de terminar, o menino disse apontando depressa com o dedo: aquelezinho ali, com\nchocolate por cima. Por um instante perplexa, eu me recompus logo e ordenei, com aspereza, à\ncaixeira que o servisse.\n— Que outro doce você quer? perguntei ao menino escuro.\nEste, que mexendo as mãos e a boca ainda esperava com ansiedade pelo primeiro, interrompeu-se, olhou-me um instante e disse com delicadeza insuportável, mostrando os dentes: não precisa\nde outro não. Ele poupava a minha bondade.\n— Precisa sim, cortei eu ofegante, empurrando-o para a frente. O menino hesitou e disse: aquele\namarelo de ovo. Recebeu um doce em cada mão, levantando as duas acima da cabeça, com medo\ntalvez de apertá-los. Mesmo os doces estavam tão acima do menino escuro. E foi sem olhar para\nmim que ele, mais do que foi embora, fugiu. A caixeirinha olhava tudo:\n— Afinal uma alma caridosa apareceu. Esse menino estava nesta porta há mais de uma hora,\npuxando todas as pessoas que passavam, mas ninguém quis dar.\nFui embora, com o rosto corado de vergonha. De vergonha mesmo? Era inútil querer voltar aos\npensamentos anteriores. Eu estava cheia de um sentimento de amor, gratidão, revolta e vergonha.\nMas, como se costuma dizer, o Sol parecia brilhar com mais força. Eu tivera a oportunidade de... E\npara isso fora necessário um menino magro e escuro... E para isso fora necessário que outros não\nlhe tivessem dado um doce.\nE as pessoas que tomavam sorvete? Agora, o que eu queria saber com autocrueldade era o\nseguinte: temera que os outros me vissem ou que os outros não me vissem? O fato é que, quando\natravessei a rua, o que teria sido piedade já se estrangulara sob outros sentimentos. E, agora\nsozinha, meus pensamentos voltaram lentamente a ser os anteriores, só que inúteis. Em vez de\ntomar um táxi, tomei um ônibus. Sentei-me.\n— Os embrulhos estão incomodando?\nEra uma mulher com uma criança no colo e, aos pés, vários embrulhos de jornal. Ah não, disse-lhes\neu. “Dá-dádá”, disse a menina no colo estendendo a mão e agarrando a manga de meu vestido.\n“Ela gostou da senhora”, disse a mulher rindo. Eu também sorri.\n— Estou desde manhã na rua, informou a mulher. Fui procurar umas amizades que não estavam\nem casa. Uma tinha ido almoçar fora, a outra foi com a família para fora.\n— E a menina?\n— É menino, corrigiu ela, está com roupa dada de menina, mas é menino. O menino comeu por aí\nmesmo. Eu é que não almocei até agora.\n— E seu neto?\n— Filho, é filho, tenho mais três. Olhe só como ele está gostando da senhora... Brinca com a moça,\nmeu filho! Imagine a senhora que moramos numa passagem de corredor e pagamos uma fortuna\npor mês. O aluguel passado não pagamos ainda. E este mês está vencendo. Ele quer despejar.\nMas se Deus quiser, ainda arranjarei os dois mil cruzeiros que faltam. Já tenho o resto. Mas ele não\nquer aceitar. Ele pensa que se receber uma parte eu fico descansada dizendo: alguma coisa já\npaguei e não penso em pagar o resto.\nComo a mulher velha estava ciente dos caminhos da desconfiança. Sabia de tudo, só que tinha de\nagir como se não soubesse — raciocínio de grande banqueiro. Raciocinava como raciocinaria um\nsenhorio desconfiado, e não se irritava. Mas de repente fiquei fria: tinha entendido. A mulher\ncontinuava a falar. Então tirei da bolsa os dois mil cruzeiros e com horror de mim passei-os à\nmulher. Esta não hesitou um segundo, pegou-os, meteu-os num bolso invisível entre o que me\npareceram inúmeras saias, quase derrubando na sua rapidez o menino-menina.\n— Deus nosso Senhor lhe favoreça, disse de repente com o automatismo de uma mendiga.\nVermelha, continuei sentada de braços cruzados. A mulher também continuava ao lado.\nSó que não nos falávamos mais. Ela era mais digna do que eu havia pensado: conseguido o\ndinheiro, nada mais quis me contar. E nem eu pude mais fazer festas ao menino vestido de menina.\nPois qualquer agrado seria agora de meu direito: eu o havia pago de antemão.\nUm laço de mal-estar estabelecera-se agora entre nós duas, entre a mulher e eu, quero dizer.\n— Deixe a moça em paz, Zezinho, disse a mulher.\nEvitávamos encostar os cotovelos. Nada mais havia a dizer, e a viagem era longa. Perturbada,\nolhei-a de través: velha e suja, como se dizem das coisas. E a mulher sabia que eu a olhara.\nEntão uma ponta de raiva nasceu entre nós duas. Só o pequeno ser híbrido, radiante, enchia a\ntarde com o seu suave martelar: “dá dá dá”.\nLispector, Clarice. Clarice na cabeceira: crônicas. Rio de Janeiro: Rocco, 2010.\n“Seus olhos, mais do que suas palavras meio engolidas, <u>informavam-me</u> de sua paciente aflição.”",
    "statement": "Assinale a opção que apresenta uma forma verbal com a mesma regência do verbo sublinhado no\nfragmento acima.",
    "options": [
      {
        "letter": "A",
        "text": "“Então tirei da bolsa os dois mil cruzeiros e com horror de mim <u>passei-os</u> à mulher.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“ Antes de terminar, o menino <u>disse</u> apontando depressa com o dedo [...]”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“— Precisa sim, <u>cortei</u> eu ofegante, empurrando-o para a frente.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Uma <u>tinha ido almoçar</u> fora, a outra foi com a família para fora.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“O que estivera eu pensando antes de <u>encontrar</u> o menino?”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q27",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 27,
    "readingText": "A solidão amiga\nA noite chegou, o trabalho acabou, é hora de voltar para casa. Lar, doce lar? Mas a casa está\nescura, a televisão apagada e tudo é silêncio. Ninguém para abrir a porta, ninguém à espera. Você\nestá só. Vem a tristeza da solidão... O que mais você deseja é não estar em solidão...\nMas deixa que eu lhe diga: sua tristeza não vem da solidão. Vem das fantasias que surgem na\nsolidão. Lembro-me de um jovem que amava a solidão: ficar sozinho, ler, ouvir, música... Assim,\naos sábados, ele se preparava para uma noite de solidão feliz. Mas bastava que ele se assentasse\npara que as fantasias surgissem. Cenas. De um lado, amigos em festas felizes, em meio ao\nfalatório, os risos, a cervejinha. Aí a cena se alterava: ele, sozinho naquela sala. Com certeza\nninguém estava se lembrando dele. Naquela festa feliz, quem se lembraria dele? E aí a tristeza\nentrava e ele não mais podia curtir a sua amiga solidão. O remédio era sair, encontrar-se com a\nturma para encontrar a alegria da festa. Vestia-se, saía, ia para a festa... Mas na festa ele percebia\nque festas reais não são iguais às festas imaginadas. Era um desencontro, uma impossibilidade de\ncompartilhar as coisas da sua solidão... A noite estava perdida.\nFaço-lhe uma sugestão: leia o livro A chama de uma vela, de Bachelard. É um dos livros mais\nsolitários e mais bonitos que jamais li. A chama de uma vela, por oposição às luzes das lâmpadas\nelétricas, é sempre solitária. A chama de uma vela cria, ao seu redor, um círculo de claridade\nmansa que se perde nas sombras. Bachelard medita diante da chama solitária de uma vela. Ao seu\nredor, as sombras e o silêncio. Nenhum falatório bobo ou riso fácil para perturbar a verdade da sua\nalma. Lendo o livro solitário de Bachelard eu encontrei comunhão. Sempre encontro comunhão\nquando o leio. As grandes comunhões não acontecem em meio aos risos da festa. Elas\nacontecem, paradoxalmente, na ausência do outro. Quem ama sabe disso. É precisamente na\nausência que a proximidade é maior. Bachelard, ausente: eu o abracei agradecido por ele assim\nme entender tão bem. Como ele observa, \"parece que há em nós cantos sombrios que toleram\napenas uma luz bruxoleante. Um coração sensível gosta de valores frágeis\". A vela solitária de\nBachelard iluminou meus cantos sombrios, fez-me ver os objetos que se escondem quando há\nmais gente na cena. E ele faz uma pergunta que julgo fundamental e que proponho a você, como\nmotivo de meditação: \"Como se comporta a Sua Solidão?\" Minha solidão? Há uma solidão que é\nminha, diferente das solidões dos outros? A solidão se comporta? Se a minha solidão se comporta,\nela não é apenas uma realidade bruta e morta. Ela tem vida.\nEntre as muitas coisas profundas que Sartre disse, essa é a que mais amo: \"Não importa o que\nfizeram com você. O que importa é o que você faz com aquilo que fizeram com você.\" Pare. Leia\nde novo. E pense. Você lamenta essa maldade que a vida está fazendo com você, a solidão. Se\nSartre está certo, essa maldade pode ser o lugar onde você vai plantar o seu jardim.\nComo é que a sua solidão se comporta? Ou, talvez, dando um giro na pergunta: Como você se\ncomporta com a sua solidão? O que é que você está fazendo com a sua solidão? Quando você a\nlamenta, você está dizendo que gostaria de se livrar dela, que ela é um sofrimento, uma doença,\numa inimiga... Aprenda isso: as coisas são os nomes que lhe damos. Se chamo minha solidão de\ninimiga, ela será minha inimiga. Mas será possível chamá-la de amiga? Drummond acha que sim:\n\"Por muito tempo achei que a ausência é falta./ E lastimava, ignorante, a falta./ Hoje não a\nlastimo./ Não há falta na ausência. A ausência é um estar em mim./ E sinto-a, branca, tão pegada,\naconchegada nos meus braços,/ que rio e danço e invento exclamações alegres,/ porque a\nausência, essa ausência assimilada,/ ninguém a rouba mais de mim.!\"\nNietzsche também tinha a solidão como sua companheira. Sozinho, doente, tinha enxaquecas\nterríveis que duravam três dias e o deixavam cego. Ele tirava suas alegrias de longas caminhadas\npelas montanhas, da música e de uns poucos livros que ele amava. Eis aí três companheiras\nmaravilhosas! Vejo, frequentemente, pessoas que caminham por razões da saúde. Incapazes de\ncaminhar sozinhas, vão aos pares, aos bandos. E vão falando, falando, sem ver o mundo\nmaravilhoso que as cerca. Falam porque não suportariam caminhar sozinhas. E, por isso mesmo,\nperdem a maior alegria das caminhadas, que é a alegria de estar em comunhão com a natureza.\nElas não veem as árvores, nem as flores, nem as nuvens e nem sentem o vento. Que troca infeliz!\nTrocam as vozes do silêncio pelo falatório vulgar. Se estivessem a sós com a natureza, em silêncio,\nsua solidão tornaria possível que elas ouvissem o que a natureza tem a dizer. O estar juntos não\nquer dizer comunhão. O estar juntos, frequentemente, é uma forma terrível de solidão, um artifício\npara evitar o contato conosco mesmos. Sartre chegou ao ponto de dizer que \"o inferno é o outro.\"\nSobre isso, quem sabe, conversaremos outro dia... Mas, voltando a Nietzsche, eis o que ele\nescreveu sobre a sua solidão:\n\"Ó solidão! Solidão, meu lar!... Tua voz - ela me fala com ternura e felicidade!\nNão discutimos, não queixamos e muitas vezes caminhamos juntos através de portas abertas.\nPois onde quer que estás, ali as coisas são abertas e luminosas. E até mesmo as horas caminham\ncom pés saltitantes.\nAli as palavras e os tempos/poemas de todo o ser se abrem diante de mim. Ali todo ser deseja\ntransformar-se em palavra, e toda mudança pede para aprender de mim a falar.\"\nE o Vinícius? Você se lembra do seu poema O operário em construção? Vivia o operário em meio\na muita gente, trabalhando, falando. E enquanto ele trabalhava e falava ele nada via, nada\ncompreendia. Mas aconteceu que, \"certo dia, à mesa, ao cortar o pão, o operário foi tomado de\numa súbita emoção ao constatar assombrado que tudo naquela casa - garrafa, prato, facão - era\nele que os fazia, ele, um humilde operário, um operário em construção (...) Ah! Homens de\npensamento, não sabereis nunca o quanto aquele humilde operário soube naquele momento!\nNaquela casa vazia que ele mesmo levantara, um mundo novo nascia de que nem sequer\nsuspeitava. O operário emocionado olhou sua própria mão, sua rude mão de operário, e olhando\nbem para ela teve um segundo a impressão de que não havia no mundo coisa que fosse mais bela.\nFoi dentro da compreensão desse instante solitário que, tal sua construção, cresceu também o\noperário. (...) E o operário adquiriu uma nova dimensão: a dimensão da poesia.\"\nRainer Maria Rilke, um dos poetas mais solitários e densos que conheço, disse o seguinte: \"As\nobras de arte são de uma solidão infinita.\" É na solidão que elas são geradas. Foi na casa vazia,\nnum momento solitário, que o operário viu o mundo pela primeira vez e se transformou em poeta.\nE me lembro também de Cecília Meireles, tão lindamente descrita por Drummond:\n\"...Não me parecia criatura inquestionavelmente real; e por mais que aferisse os traços positivos de\nsua presença entre nós, marcada por gestos de cortesia e sociabilidade, restava-me a impressão\nde que ela não estava onde nós a víamos... Distância, exílio e viagem transpareciam no seu sorriso\nbenevolente? Por onde erraria a verdadeira Cecília...\"\nSim, lá estava ela delicadamente entre os outros, participando de um jogo de relações gregárias\nque a delicadeza a obrigava a jogar. Mas a verdadeira Cecília estava longe, muito longe, num lugar\nonde ela estava irremediavelmente sozinha.\nO primeiro filósofo que li, o dinamarquês Soeren Kiekeggard, um solitário que me faz companhia\naté hoje, observou que o início da infelicidade humana se encontra na comparação. Experimentei\nisso em minha própria carne. Foi quando eu, menino caipira de uma cidadezinha do interior de\nMinas, me mudei para o Rio de Janeiro, que conheci a infelicidade. Comparei-me com eles:\ncariocas, espertos, bem falantes, ricos. Eu diferente, sotaque ridículo, gaguejando de vergonha,\npobre: entre eles eu não passava de um patinho feio que os outros se compraziam em bicar.\nNunca fui convidado a ir à casa de qualquer um deles. Nunca convidei nenhum deles a ir à minha\ncasa. Eu não me atreveria. Conheci, então, a solidão. A solidão de ser diferente. E sofri muito. E\nnem sequer me atrevi a compartilhar com meus pais esse meu sofrimento. Seria inútil. Eles não\ncompreenderiam. E mesmo que compreendessem, eles nada podiam fazer. Assim, tive de sofrer a\nminha solidão duas vezes sozinho. Mas foi nela que se formou aquele que sou hoje. As\ncaminhadas pelo deserto me fizeram forte. Aprendi a cuidar de mim mesmo. E aprendi a buscar as\ncoisas que, para mim, solitário, faziam sentido. Como, por exemplo, a música clássica, a beleza que\ntorna alegre a minha solidão...\nA sua infelicidade com a solidão: não se deriva ela, em parte, das comparações? Você compara a\ncena de você, só, na casa vazia, com a cena (fantasiada) dos outros, em celebrações cheias de\nrisos... Essa comparação é destrutiva porque nasce da inveja. Sofra a dor real da solidão, porque a\nsolidão dói. Dói uma dor da qual pode nascer a beleza. Mas não sofra a dor da comparação. Ela\nnão é verdadeira.\nMas essa conversa não acabou: vou falar depois sobre os companheiros que fazem minha solidão\nfeliz.\nRubem Alves",
    "statement": "Em “Mas deixa que eu lhe <u>diga:</u> sua tristeza não vem da solidão.”, a forma verbal está no:",
    "options": [
      {
        "letter": "A",
        "text": "presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "futuro do presente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "infinitivo pessoal.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "presente do subjuntivo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "imperativo afirmativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q28",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 28,
    "readingText": "Texto I\nO Trabalho Escravo no Brasil (1500 – 1888)\nA história colonial do Brasil ocorreu entre os séculos XVI e XIX. Em 1534, quando o rei de Portugal,\nD. João III, dividiu o território em 14 capitanias hereditárias, a colonização efetivamente se iniciou.\nNo início do século XVI, a economia do Brasil baseou-se na extração de pau-brasil, na produção\nde açúcar, de tabaco e de algodão. O Brasil tornou-se o maior produtor mundial de açúcar da\népoca. No final do século XVII, com o declínio das exportações de açúcar, a economia extrativista\nda colônia adentrou no ciclo do ouro, sempre sob a administração colonial portuguesa.\nA mão de obra escrava foi o pilar das relações de trabalho no período colonial. Incialmente os\ncolonizadores portugueses se apropriaram da escravidão indígena já existente entre as tribos\nnativas. Todavia, a escravização dos índios foi dificultada, especialmente, pelas epidemias de\ndoenças que causaram baixas demográficas intensas, extinguindo até aldeias inteiras – o que\nexigia constante substituição de mão de obra na montagem dos engenhos de açúcar –, e pelos\ninteresses divergentes existentes entre a Coroa portuguesa e missionários jesuítas, que\npretendiam torná-los súditos cristãos e força de trabalho, e os colonos, que se interessavam em\nmantê-los como mão de obra.\nCom a expansão mercantilista portuguesa, em meados do século XVI, o tráfico de escravos negros\nafricanos para o Brasil colônia passou a ser realizado para suprir a necessidade de mão de obra.\nEstima-se que 35,3% dos escravos envolvidos no comércio triangular entre os continentes\nafricano, europeu e americano vieram para o Brasil, ou seja, mais de 4 milhões de pessoas de\norigem africana foram escravizadas no País.\nA partir do fim do século XVII, por múltiplos fatores, inclusive por pressão diplomática do Reino\nUnido em razão de seus interesses econômicos, a ordem social escravista brasileira articulou-se\nentre o intenso tráfico de escravos e o número constante de alforrias.\nEm 1808, o exército do imperador francês Napoleão Bonaparte invadiu Portugal e a família real\nportuguesa estabeleceu a sede oficial do Império português no Rio de Janeiro. Em 1815, D. João VI\nelevou o status do Brasil de colônia a Reino Unido de Portugal, Brasil e Algarves. Em 1821, a Corte\nretornou para Portugal e D. Pedro I, herdeiro de D. João VI, permaneceu no Brasil para governá-lo\ncomo regente.\nEm 1822, sob a ameaça de perda da limitada autonomia política concedida a partir de 1808, líderes\nbrasileiros convenceram D. Pedro Ia declarar a independência, tornando-oo primeiro imperador\ndo recém-criado Império do Brasil.\nO período imperial, de 1822 a 1889, além de preservar por várias décadas a escravidão (até 1888),\nnão prestigiou o surgimento de um processo de industrialização e de urbanização da economia\nbrasileira, nem instituiu, por consequência, um Direito do Trabalho no Brasil.\nA Constituição Imperial de 1824 não fazia referência a direitos trabalhistas. Tampouco a Lei de\nLocação de Serviços, de 1830, que regulava o contrato de prestação de serviços exercido por\nbrasileiros ou estrangeiros. Somente em 1850 surgiu uma legislação que fez referência ao trabalho,\nao regulamentar a profissão do comerciante; trata-se do Código Comercial daquele ano,\ndocumento normativo que não estipulava direitos efetivamente trabalhistas.\nNo final do período imperial, o País começou a experimentar um surto de progresso, em torno dos\nanos 1880, com a economia e a sociedade se desenvolvendo mais rapidamente do que nas\ndécadas anteriores.\nEntretanto, o fim da escravatura, no País, foi extremamente lento, bastante gradual e\nsignificativamente tardio, sendo o último dos estados latino-americanos a abolir a escravidão\ndentro de suas fronteiras.\nEm 1850, foi aprovada a Lei Eusébio de Queiroz, que estabeleceu medidas para a repressão do\ntráfico de africanos para o Brasil, sendo que sua promulgação é relacionada, sobretudo, às\npressões britânicas sobre o governo brasileiro para a extinção da escravidão no País. Em 1871, foi\naprovada a Lei do Ventre Livre, que decretava que todos os filhos de escravos nascidos no Brasil, a\npartir daquele ano, seriam considerados livres; e, em 1885, a Lei dos Sexagenários, que garantiu\nliberdade aos escravos com 60 anos de idade ou mais. Por fim, em 1888, foi aprovada a Lei Áurea,\nque decretava a abolição imediata da escravidão no Brasil.\nAlém de promulgar essas leis nacionais, as quais tinham efeitos parciais nos índices de escravatura,\no Governo imperial transferiu o controle da população escrava e dos homens livres para a\ncompetência dos municípios. A propósito, tanto no Império como na primeira República, o\nGoverno central delegava parcelas importantes de poder aos governos locais, com isso elevando o\nseu poder sobre as populações; em contrapartida, recebia o pleno apoio dos coronéis municipais.\nO Brasil foi o último país ocidental a abolir oficialmente a escravatura, que ocorreu com a Lei\nÁurea, de 13 de maio de 1888.\nA abolição da escravatura, todavia, restringiu-se a conceder liberdade formal aos ex-escravos,\nsem implementar quaisquer políticas públicas inclusivas relacionadas, como, por exemplo, a\nreforma agrária, a ampliação do mercado de trabalho para os libertos, o acesso à educação, à\nsaúde etc. Se partirmos da premissa de que, “como alguns estudos recentes demonstraram, a\nliberdade era (eé) não uma categoria clara e definida, mas, ao invés disto, um emaranhado de\nconcepções sobre direitos e proteções”, poder-se-ia afirmar que nem a prerrogativa básica de\ncidadania, a liberdade, foi efetivamente concedida.\nA despeito das inúmeras discussões historiográficas que permeiam o estudo da escravidão no\nBrasil, o fato é que o Brasil tem a sua história marcada por quase quatro séculos de escravidão,\ncaracterizados pela ausência de garantia de direitos humanos básicos, exploração, violência e\nsegregação racial e social.\n(Disponível em <https://www.tst.jus.br/memoriaviva/-/asset_publisher/LGQDwoJD0LV2/content/ev-jt-80-02> Acesso em 31 mai. 2022)",
    "statement": "Dentre as alternativas apresentadas a seguir, assinale aquela em que há construção de partícula\n“se” como pronome integrante do verbo.",
    "options": [
      {
        "letter": "A",
        "text": "“Estima-se que 35,3% dos escravos envolvidos no comércio triangular entre os continentes africano, europeu e americano vieram para o Brasil”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“O Brasil tornou-se o maior produtor mundial de açúcar da época.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "“(...) torná-los súditos cristãos e força de trabalho, e os colonos, que se interessavam em mantê-los como mão de obra.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“No início do século XVI, a economia do Brasil baseou-se na extração de pau-brasil, na produção de açúcar, de tabaco e de algodão.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q29",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 29,
    "readingText": "Texto I\nO Trabalho Escravo no Brasil (1500 – 1888)\nA história colonial do Brasil ocorreu entre os séculos XVI e XIX. Em 1534, quando o rei de Portugal,\nD. João III, dividiu o território em 14 capitanias hereditárias, a colonização efetivamente se iniciou.\nNo início do século XVI, a economia do Brasil baseou-se na extração de pau-brasil, na produção\nde açúcar, de tabaco e de algodão. O Brasil tornou-se o maior produtor mundial de açúcar da\népoca. No final do século XVII, com o declínio das exportações de açúcar, a economia extrativista\nda colônia adentrou no ciclo do ouro, sempre sob a administração colonial portuguesa.\nA mão de obra escrava foi o pilar das relações de trabalho no período colonial. Incialmente os\ncolonizadores portugueses se apropriaram da escravidão indígena já existente entre as tribos\nnativas. Todavia, a escravização dos índios foi dificultada, especialmente, pelas epidemias de\ndoenças que causaram baixas demográficas intensas, extinguindo até aldeias inteiras – o que\nexigia constante substituição de mão de obra na montagem dos engenhos de açúcar –, e pelos\ninteresses divergentes existentes entre a Coroa portuguesa e missionários jesuítas, que\npretendiam torná-los súditos cristãos e força de trabalho, e os colonos, que se interessavam em\nmantê-los como mão de obra.\nCom a expansão mercantilista portuguesa, em meados do século XVI, o tráfico de escravos negros\nafricanos para o Brasil colônia passou a ser realizado para suprir a necessidade de mão de obra.\nEstima-se que 35,3% dos escravos envolvidos no comércio triangular entre os continentes\nafricano, europeu e americano vieram para o Brasil, ou seja, mais de 4 milhões de pessoas de\norigem africana foram escravizadas no País.\nA partir do fim do século XVII, por múltiplos fatores, inclusive por pressão diplomática do Reino\nUnido em razão de seus interesses econômicos, a ordem social escravista brasileira articulou-se\nentre o intenso tráfico de escravos e o número constante de alforrias.\nEm 1808, o exército do imperador francês Napoleão Bonaparte invadiu Portugal e a família real\nportuguesa estabeleceu a sede oficial do Império português no Rio de Janeiro. Em 1815, D. João VI\nelevou o status do Brasil de colônia a Reino Unido de Portugal, Brasil e Algarves. Em 1821, a Corte\nretornou para Portugal e D. Pedro I, herdeiro de D. João VI, permaneceu no Brasil para governá-lo\ncomo regente.\nEm 1822, sob a ameaça de perda da limitada autonomia política concedida a partir de 1808, líderes\nbrasileiros convenceram D. Pedro Ia declarar a independência, tornando-oo primeiro imperador\ndo recém-criado Império do Brasil.\nO período imperial, de 1822 a 1889, além de preservar por várias décadas a escravidão (até 1888),\nnão prestigiou o surgimento de um processo de industrialização e de urbanização da economia\nbrasileira, nem instituiu, por consequência, um Direito do Trabalho no Brasil.\nA Constituição Imperial de 1824 não fazia referência a direitos trabalhistas. Tampouco a Lei de\nLocação de Serviços, de 1830, que regulava o contrato de prestação de serviços exercido por\nbrasileiros ou estrangeiros. Somente em 1850 surgiu uma legislação que fez referência ao trabalho,\nao regulamentar a profissão do comerciante; trata-se do Código Comercial daquele ano,\ndocumento normativo que não estipulava direitos efetivamente trabalhistas.\nNo final do período imperial, o País começou a experimentar um surto de progresso, em torno dos\nanos 1880, com a economia e a sociedade se desenvolvendo mais rapidamente do que nas\ndécadas anteriores.\nEntretanto, o fim da escravatura, no País, foi extremamente lento, bastante gradual e\nsignificativamente tardio, sendo o último dos estados latino-americanos a abolir a escravidão\ndentro de suas fronteiras.\nEm 1850, foi aprovada a Lei Eusébio de Queiroz, que estabeleceu medidas para a repressão do\ntráfico de africanos para o Brasil, sendo que sua promulgação é relacionada, sobretudo, às\npressões britânicas sobre o governo brasileiro para a extinção da escravidão no País. Em 1871, foi\naprovada a Lei do Ventre Livre, que decretava que todos os filhos de escravos nascidos no Brasil, a\npartir daquele ano, seriam considerados livres; e, em 1885, a Lei dos Sexagenários, que garantiu\nliberdade aos escravos com 60 anos de idade ou mais. Por fim, em 1888, foi aprovada a Lei Áurea,\nque decretava a abolição imediata da escravidão no Brasil.\nAlém de promulgar essas leis nacionais, as quais tinham efeitos parciais nos índices de escravatura,\no Governo imperial transferiu o controle da população escrava e dos homens livres para a\ncompetência dos municípios. A propósito, tanto no Império como na primeira República, o\nGoverno central delegava parcelas importantes de poder aos governos locais, com isso elevando o\nseu poder sobre as populações; em contrapartida, recebia o pleno apoio dos coronéis municipais.\nO Brasil foi o último país ocidental a abolir oficialmente a escravatura, que ocorreu com a Lei\nÁurea, de 13 de maio de 1888.\nA abolição da escravatura, todavia, restringiu-se a conceder liberdade formal aos ex-escravos,\nsem implementar quaisquer políticas públicas inclusivas relacionadas, como, por exemplo, a\nreforma agrária, a ampliação do mercado de trabalho para os libertos, o acesso à educação, à\nsaúde etc. Se partirmos da premissa de que, “como alguns estudos recentes demonstraram, a\nliberdade era (eé) não uma categoria clara e definida, mas, ao invés disto, um emaranhado de\nconcepções sobre direitos e proteções”, poder-se-ia afirmar que nem a prerrogativa básica de\ncidadania, a liberdade, foi efetivamente concedida.\nA despeito das inúmeras discussões historiográficas que permeiam o estudo da escravidão no\nBrasil, o fato é que o Brasil tem a sua história marcada por quase quatro séculos de escravidão,\ncaracterizados pela ausência de garantia de direitos humanos básicos, exploração, violência e\nsegregação racial e social.\n(Disponível em <https://www.tst.jus.br/memoriaviva/-/asset_publisher/LGQDwoJD0LV2/content/ev-jt-80-02> Acesso em 31 mai. 2022)",
    "statement": "Em qual das alternativas a seguir há construção de uma locução verbal que forma noção de voz\npassiva?",
    "options": [
      {
        "letter": "A",
        "text": "“No final do período imperial, o País começou a experimentar um surto de progresso, em torno dos anos 1880 (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“(...) o tráfico de escravos negros africanos para o Brasil colônia passou a ser realizado para suprir a necessidade de mão de obra.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“(...) e pelos interesses divergentes existentes entre a Coroa portuguesa e missionários jesuítas, que pretendiam torná-los súditos cristãos e força de trabalho (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Todavia, a escravização dos índios foi dificultada, especialmente, pelas epidemias de doenças (...)”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q30",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 30,
    "readingText": "Texto para a questão\nA morte vista de perto\n(Fernando Sabino)\nFoi em Londres. Eu vinha de uma reunião em que tivera a notícia da morte de um amigo no Rio.\nVoltava de carro para casa e era tarde. Uma noite escura, chuvosa, permeada de neblina — dessas\nnoites londrinas que impregnam nossa alma de tédio e abatimento. Éo sentimento a que os\ningleses chamam de spleen, e que não tem correspondente na língua portuguesa. Em noites assim,\na nossa realidade interior se mistura à atmosfera que o fog torna ainda mais densa, apagando os\ncontornos da vida. O silêncio ao redor de nós como que se materializa. Os movimentos se fazem\nem câmera lenta, como o dos peixes no mundo das águas. Somos ectoplasmas de nós mesmos,\nflutuando no ar, integrados à eternidade do nada.\nNesse espírito é que eu voltava para casa pelas ruas desertas, pensando na morte do amigo e na\nmorte em si, com uma certeza de sua existência inexorável.\nExtravagante foi a sensação que me veio então: a de que a morte existia, não apenas como o fim\npara todos nós, sem exceção, mas como alguma coisa concreta, visível, corporificada em alguém\ncom quem eu poderia esbarrar a qualquer momento.\nNaquele instante, ao voltar a cabeça, dei com ela a me olhar.\nEu havia parado num sinal vermelho, e embora não houvesse na rua o menor movimento, esperava\npacientemente que ele se abrisse, como exigem as regras inglesas do bom proceder. O que me\nchamou a atenção foi um táxi que acabara de se emparelhar a meu carro, um pouco à frente,\ndeixando-me lado a lado com o passageiro. Que era uma mulher.\nUma mulher já sem idade de tão velha, e ainda assim horrivelmente pintada, como um espantalho:\ntinha os lábios borrados de batom, duas rodelas vermelhas nas faces murchas, as sobrancelhas\npinçadas, os olhos empastelados de rímel. Eu a olhava também, fascinado: mas o que era aquilo?\nFoi quando ela, a dois palmos de mim, piscou um olho e franziu lascivamente os lábios numa\ncareta, como um simulacro de beijo.\nAturdido, arranquei com o carro, como se fugisse de um filme de terror de Alberto Cavalcanti na\nsolidão da noite. Nem esperei mais que o sinal se abrisse — com isso me arriscava a ser detido\nlogo adiante pelo policial que em Londres está sempre presente em cada esquina. Pouco\nimportava; o que desejava era fugir dali, como uma presença amaldiçoada. Que queria de mim\naquela bruxa? Certamente não se oferecia como mulher, a velha múmia — condição que já se\nperdera para ela num passado sem memória. Quem era, senão a própria morte em que eu vinha\npensando, materializada na forma decrépita de uma megera? Senti um frio na espinha ao ver, pelo\nespelhinho, o táxi à minha retaguarda seguindo na mesma direção. Acelerei, para perdê-lo logo de\nvista.\nEm pouco percebi, aliviado, que ganhava distância e ele desaparecia na cerração.\nEu morava numa rua meio remota, ao norte de Londres, e à noite o lúgubre caminho para a minha\ncasa passava até por um velho cemitério no pátio de uma igreja. Ao chegar, fui direto para o quarto\nno segundo andar, disposto a espantar de mim a lembrança daquela visão.\nSó quando me preparava para dormir me lembrei que não havia apagado a luz da sala, lá embaixo.\nDesci de pijama, e fui até a janela para fechar a cortina.\nFiquei só na intenção. Ao olhar para fora, vi, em meio à neblina, parado na rua molhada em frente\nde casa, o táxi negro de pouco antes, com a velha debruçada contra o vidro, a boca arreganhada\nnum sorriso para mim.\nEntão subi correndo e me tranquei no quarto, para tentar dormir e na manhã seguinte pensar que\nfora apenas um sonho.\n(Disponível em: cronicabrasileira.org.br)",
    "statement": "04. (Estratégia Militares/2022 – Questão Inédita – Prof. Wagner Santos) Com relação à\nsignificação dos tempos e ao uso dos verbos, marque a alternativa em que há marcação de tempo\nque indica anterioridade entre ações.",
    "options": [
      {
        "letter": "A",
        "text": "“Foi quando ela, a dois palmos de mim, piscou um olho e franziu lascivamente os lábios numa careta, como um simulacro de beijo.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Nesse espírito é que eu voltava para casa pelas ruas desertas, pensando na morte do amigo e na morte em si, com uma certeza de sua existência inexorável.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Em noites assim, a nossa realidade interior se mistura à atmosfera que o fog torna ainda mais densa, apagando os contornos da vida.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Foi em Londres. Eu vinha de uma reunião em que tivera a notícia da morte de um amigo no Rio.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "“Uma noite escura, chuvosa, permeada de neblina — dessas noites londrinas que impregnam nossa alma de tédio e abatimento.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q31",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 31,
    "readingText": "Texto\n– Maria!\nA desgraçada estremeceu; e com as mãos hirtas, estiradas, afastou de si o rosto que se inclinara\nsobre ela. Nas torturas do pesadelo, parecia-lhe que beiços roxos, sedentos e viscosos lhe\nbuscavam os lábios...\n– Maria, sou eu... – refletiu Milkau.\nEla abriu os olhos e ficou deslumbrada. A sua mão agora branda e lânguida tateava incerta para se\ncertificar da súbita e estranha aparição do amigo. E gestos infantis e leves roçavam pela barba de\nMilkau numa inconsciente carícia...\n– Vamos! Levanta-te... – disse-lhe ele, baixo e com firmeza, sacudindo o morno carinho,\nrecolhendo e enfeixando com energia as suas forças mais intensas.\nObedecendo, Maria ergueu-se; e pela mão de Milkau foi seguindo pela casa meio escura. No\ncorredor, a claridade da noite, que entrava pela porta da rua, aberta como de costume, deixava ver\no corpo de um soldado negro dormindo numa postura brutal, como uma figura tosca e arcaica. A\nprisioneira alarmada quis recuar; Milkau tomou-lhe as mãos com império e passou com ela sereno\ne forte ao lado da sentinela, conduzindo-a para a noite e para a liberdade.\nFora, o ar sutil e frio que lhe penetrava nas carnes sonolentas e tépidas, o céu cristalino, a\ncintilação das estrelas, a largueza, a imensidade do espaço davam à fugitiva uma deliciosa\nvertigem, e, num esmorecido colapso, ela vacilou e veio se apoiar nos braços de Milkau, que a foi\narrastando vagarosamente.\nEnlaçados, caminhavam pela cidade calada e adormecida. Iam morosos; os passos dela eram\nvacilantes, e os pés, por tanto tempo entorpecidos, tropeçavam nas pedras soltas da rua. O\nsilêncio inquietador enchia-lhe o espírito do antigo pavor que se não extingue nunca. Uma ou outra\nvez, cães sonolentos despertavam com o passar dos vultos, e ladrando se arremessavam em vão\ncontra eles. E depois tudo voltava ao sossego ameaçador, que parecia ser a cada instante\nbruscamente interrompido pelas vozes da perseguição surgindo das casas acordadas... Mas só\nlhes chegava o chiar monótono e eterno da cachoeira. Dobraram de cautela, espiando com os\nolhos imensos e dilatados pela treva, as formas apagadas e sinistras do mundo. Era no ouvido delas\nassustadiça e trêmula, que Milkau ia falando:\n– Fujamos para sempre de tudo o que te persegue; vamos além, aos outros homens, em outra\nparte, onde a bondade corra espontânea e abundante, como a água sobre a terra. Vem... Subamos\nàquelas montanhas de esperança. Repousemos depois na perpétua alegria... Vamos... corre...\nDeixaram a cidade, e agora sem receio de despertá-la galgavam a montanha, lépidos e radiantes.\nA fria rigidez, criada pelo terror, se fora dos braços de Maria, que se prendiam aos de Milkau,\ntépidos e brandos.\nSubindo, perdiam eles de instante a instante a vista do Cachoeiro, embaixo aos seus pés, coberto\npelo manto cinzento e vaporoso da bruma, sobre que passava a luz exausta da noite úmida,\nlevantando ali uma fosforescência vaga de nebulosa... E debaixo desse manto se desenhavam\nseres fantásticos, colossais, gigantescos, sem forma ainda imaginada... Um trecho do Santa Maria,\nlívido, morto, cortava como um gládio fumegante a várzea do Queimado, onde as colinas baixas\nsemelhavam corpos deitados de heróis antigos e mutilados, corcundas e aleijões... Depois, nada\nmais viram; subiram ainda e entraram no bojo da mata. Os braços de Maria retesaram-se de novo\ne apertaram os de Milkau. Havia um rumor contínuo e aflitivo de vento mau nas folhas da grande\nmassa. Iam inquietos, afundando os olhos na infindável negrura, donde vinha o clamor do mistério\ne do sofrimento das árvores castigadas. E o vento implacável ia passando, fazendo-as gemer\nrumorosamente... No vão das trevas, de espaço a espaço, pelas frestas descia a claridade, e do\njorro de luz se formava dentro da floresta uma coluna alevantada do chão para o céu,\natravessando o teto ondeante, e docemente iluminada pelos reflexos das árvores espectrais...\nEstreitados um ao outro, aspirando o aroma capitoso e perturbador que se desprendia das flores\nnoturnas, caminhavam velozes. Milkau refletia no ouvido da companheira o seu apelo de sedução.\n– é a felicidade que te prometo. Ela é da Terra, e havemos de achá-la... Quando vier a luz,\nencontraremos outros homens, outro mundo, e aí... é a felicidade... Vem, vem...\n(Graça Aranha. Canaã. Fragmento.)",
    "statement": "Assinale a alternativa em que há construção de voz em que o sujeito pratica, em si mesmo, a ação\nverbal.",
    "options": [
      {
        "letter": "A",
        "text": "“Obedecendo, Maria ergueu-se; e pela mão de Milkau foi seguindo pela casa meio escura.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“E o vento implacável ia passando, fazendo-as gemer rumorosamente...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Estreitados um ao outro, aspirando o aroma capitoso e perturbador que se desprendia das flores noturnas, caminhavam velozes.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Milkau refletia no ouvido da companheira o seu apelo de sedução.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Ela é da Terra, e havemos de achá-la... Quando vier a luz, encontraremos outros homens, outro mundo, e aí...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q32",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 32,
    "statement": "Em qual das alternativas a seguir há voz verbal igual à encontrada em <u>“Mudam-se os planos</u>\nhabituais do conhecimento como numa acrobacia aérea.”",
    "options": [
      {
        "letter": "A",
        "text": "Vivia-se como um rei naquela região de Minas Gerais, conforme o combinado entre eles.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Seriam trazidos, caso houvesse a permissão do rei, mais alguns trabalhadores livres.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Havia muitos alunos on-line durante a aula daquele excelente professor de matemática.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Prepararam-se durante muitos meses para a competição daquele final de ano.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Os meninos abraçaram-se longamente depois de tanto tempo separados pela pandemia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q33",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 33,
    "readingText": "Por que acontecem enchentes?\nÉ comum que aconteçam enchentes e cheias - o problema é quando os seus desdobramentos\nafetam cidades e outras áreas de circulação urbana, alagando-as. \"As enchentes na prática são os\neventos naturais dos rios. Eles sempre enchem nos períodos das chuvas e esvaziam nos períodos\ndas secas\", esclarece o arquiteto paisagista Paulo Pellegrino, professor da FAUUSP (Faculdade de\nArquitetura e Urbanismo da Universidade de São Paulo).\nDesse modo, não é incomum encontrar próximo aos rios as chamadas planícies de inundação,\náreas tomadas pela água quando há períodos maiores e mais intensos de chuvas. Isso seria algo\ncorriqueiro se não houvesse construções urbanas ocupando indevidamente esse espaço.\nQuando as inundações se tornam um problema?\nPara Pellegrino, a principal preocupação deve ser com as inundações e os alagamentos em que as\náguas atingem as estruturas construídas, como ruas, avenidas e edificações, causando prejuízos.\nSegundo ele, as inundações são criadas pela intervenção errônea do ser humano ao ocupar áreas\ndas cheias dos rios. \"Em São Paulo, quando ocupamos as várzeas, estamos nos colocando em\nrisco. As áreas baixas, fundos e vales são locais que naturalmente estão sujeitos a esses problemas\ntrazidos pela lógica de como foi feita a ocupação da cidade\", completa.\nAinda tomando São Paulo como exemplo, o arquiteto paisagista lembra que a ocupação das\nvárzeas foi feita de forma deliberada a partir de um projeto de drenagem das áreas planas. \"Muito\natraente para o mercado imobiliário, foi feito todo um plano que atrelou as avenidas de fundo de\nvárzea a essas áreas de cheias das águas e ocasionou o problema que temos hoje\", aponta.\nAdemais, vale lembrar que há diferentes tipos de alagamentos e inundações. Os causados por\nerros de planejamento humano se referem geralmente à falta de capacidade do sistema de\ndrenagem, absorção do solo e escoamento das águas das chuvas, bem como ao rompimento de\nbarragens e comportas. Além das inundações causadas pela cheia dos rios nas áreas de várzea,\nainda existem as causadas por eventos marítimos.\nComo evitar as inundações nas cidades?\nEm parte, a solução do problema ocasionado pelas cheias dos rios nas cidades é contornada ou\namenizada com a construção de piscinões. No entanto, essa válvula de escape nem sempre é\nsuficiente.\n\"A chuva deveria ser absorvida onde ela cai e não ter um escoamento superficial que vai rodar pela\ncidade até encontrar uma válvula de escape, que às vezes é o sistema de água pluviais e outras\nvezes é o transbordamento\", aponta Denise Duarte, membro da Coalizão Ciência e Sociedade e\nprofessora do Laboratório de Conforto Ambiental e Eficiência Energética da USP.\n(Disponível em <uol.com.br/ecoa/ultimas-noticias/2022/01/09/por-que-tantas-enchentes-estao-acontecendo-no-brasil.htm> Acesso em 15 mar. 2023)",
    "statement": "Em qual das alternativas a seguir, há construção de um verbo de ligação?",
    "options": [
      {
        "letter": "A",
        "text": "“(...) o arquiteto paisagista lembra que a ocupação das várzeas foi feita de forma deliberada a partir de um projeto de drenagem das áreas planas.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Quando as inundações se tornam um problema?”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "“Em São Paulo, quando ocupamos as várzeas, estamos nos colocando em risco.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Eles sempre enchem nos períodos das chuvas e esvaziam nos períodos das secas (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q34",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 34,
    "readingText": "BONS DIAS!\n<u>Hão de reconhecer</u> que sou bem-criado. Podia entrar aqui, chapéu à banda, e ir logo dizendo o\nque me parecesse; depois ia-me embora, para voltar na outra semana. Mas, não senhor; chego à\nporta, e o meu primeiro cuidado é dar-lhe os bons dias. Agora, se o leitor não me disser a mesma\ncousa, em resposta, é porque é um grande malcriado, um grosseirão de borla e capelo; ficando,\ntodavia, entendido que há leitor e leitor, e que eu, explicando-me com tão nobre franqueza, não\nme refiro ao leitor, que está agora com este papel na mão, mas ao seu vizinho. Ora bem!\nFeito esse cumprimento, que não é do estilo, mas é honesto declaro que não apresento programa.\nDepois de um recente discurso proferido no Beethoven, acho perigoso que uma pessoa diga\nclaramente o que é que vai fazer; o melhor é fazer calado. Nisto pareço-me com o príncipe\n(sempre é bom parecer-se a gente com príncipes, em alguma cousa, dá certa dignidade), e faz\nlembrar um sujeito muito alto e louro parecidíssimo com o imperador, que há cerca de trinta anos\nia a todas as festas da Capela Imperial, pour étonner de bourgeois; os fiéis levavam a olhar para um\ne para outro, e a compará-los, admirados, e ele teso, grave, movendo a cabeça à maneira de Sua\nMajestade. São gostos de Bismark. O príncipe de Bismark tem feito tudo sem programa público; a\núnica orelha que o ouviu, foi a do finado imperador, — e talvez só a direita, com ordem de o não\nrefletir à esquerda. O parlamento e o país viram só o resto\nDeus fez programa, é verdade (\"E Deus disse: Façamos o homem, à nossa imagem e semelhança,\npara que presida\" etc. Gênesis, I, 26): mas é preciso ler esse programa com muita cautela.\nRigorosamente, era um modo de persuadir ao homem a alta linhagem de seu nariz. Sem aquele\ntexto, nunca o homem atribuiria ao Criador, nem a sua gaforinha, nem a sua fraude. É certo que a\nfraude, e, a rigor, a gaforinha são obras do diabo, segundo as melhores interpretações; mas não é\nmenos certo que essa opinião é só dos homens bons; os maus creem-se filhos do céu — tudo por\ncausa do versículo da Escritura.\nPortanto, bico calado. No mais é o que se está vendo; cá virei uma vez por semana com o meu\nchapéu na mão, e os bons dias na boca. Se lhes disser desde já, que não tenho papas na língua,\nnão me tomem por homem despachado, que vem dizer coisas amargas aos outros. Não, senhor,\nnão tenho papas na língua, eé para vir a tê-las que escrevo. Se as tivesse, engolia-as e estava\nacabado. Mas aqui está o que é, eu sou um pobre relojoeiro, que, cansado de ver que os relógios\ndeste mundo não marcam a mesma hora, descri do ofício. A única explicação dos relógios era\nserem igualzinhos, sem discrepância: desde que discrepam, fica-se sem saber nada, porque tão\ncerto pode ser o meu relógio, como o do meu barbeiro.\nUm exemplo. O Partido, Liberal, segundo li, estava encasacado e pronto para sair com o relógio na\nmão, porque a hora pingava. Faltava-lhe só o chapéu, que seria o chapéu Dantas, ou o chapéu\nSaraiva (ambos da chapelaria Aristocrata): era só pô-lo na cabeça, e sair. Nisto passa o carro do\npaço com outra pessoa, e ele descobre que ou o seu relógio está adiantado, ou o de Sua Alteza é\nque se atrasara. Quem os porá de acordo?\nFoi por essas e outras que descri do ofício; e. na alternativa de ir à fava ou ser escritor, preferi o\nsegundo alvitre; é mais fácil e vexa menos. Aqui me terão, portanto, com certeza até à chegada do\nBendegó, mas provavelmente ate à escolha do Sr. Guaí, e talvez mais tarde. Não digo mais nada\npara os não aborrecer, e porque já me chamaram para o almoço.\nTalvez o que aí fica, saia muito curtinho depois de impresso. Como eu não tenho hábito de\nperiódicos, não posso calcular entre a letra de mão e a letra de forma. Se aqui estivesse o meu\namigo Fulano (não ponho o nome, para que cada um tome para si esta lembrança delicada), diria\nlogo que ele só pode calcular com letras de câmbio —trocadilho que fede como o diabo. Já falei\ntrês vezes no diabo em tão poucas linhas, e mais esta, quatro; é demais.\nBoas noites\nAtente-se para o trecho a seguir, com o verbo em destaque.\nHão de reconhecer que sou bem-criado. Podia entrar aqui, chapéu à banda, e ir logo dizendo o\nque me parecesse; depois ia-me embora, para voltar na outra semana.",
    "statement": "Em qual das alternativas a seguir há verbo que apresente mesmo tempo e mesmo modo do\ndestacado acima?",
    "options": [
      {
        "letter": "A",
        "text": "A prova está no mesmo nível das aulas apresentadas aos alunos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "A apresentação do trabalho foi adiada para a semana do dia 12, meninos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "O aluno compreenderá o assunto assim que assistir à nossa aula.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "A aula de hoje está preparada para tirar as dúvidas dos alunos envolvidos",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Ao sair, o menino levou consigo todo o material disponível para a prova.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q35",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 35,
    "readingText": "“Nunca passamos por situação tão séria”, diz especialista sobre a fome no Brasil\nÚltimos dados da Rede Penssan apontaram para 19 milhões de brasileiros passando fome; 55%\ndas famílias estão em insegurança alimentar\nLeonardo Lopes\nDados divulgados recentemente pela Rede Brasileira de Pesquisa em Soberania e Segurança\nAlimentar e Nutricional (Rede Penssan) apontaram que o Brasil tem pelo menos 19 milhões de\npessoas passando fome, e 55% das famílias estão em insegurança alimentar – sem acesso regular\ne permanente a alimentos.\nA professora da Escola de Nutrição da UFBA destacou que, diante da instabilidade do ambiente\neconômico e ausência de perspectivas de mudança no curto prazo, dois conceitos são\nfundamentais: solidariedade e responsabilidade do Estado.\n“A solidariedade tem sido fundamental para garantir a sobrevivência desses milhões de brasileiros\nque passam fome. Temos 119 milhões de brasileiros com alguma privação alimentar, e 19 milhões\npassando fome, sem saber quando voltará a se alimentar. A solidariedade é fundamental, mas\ninsuficiente”, disse.\nPor ser insuficiente, Sandra Chaves afirma que há uma necessidade do Estado ter responsabilidade\ne garantir programas de transferência de renda dignos. Ela pontua que o valor da cesta básica de\nalimentos cresceu mais de 30% nos últimos 12 meses, chegando a preços acima de 700 reais em\nalguns estados.\nA pesquisadora explica que os dados desse levantamento divulgado pela Rede Penssan foram\ncolhidos em dezembro de 2020. “Estava vigente o auxílio de 300 reais para um número\nrelativamente grande de pessoas e famílias. Depois disso, ficamos três meses sem nenhum auxílio,\ndepois ele retornou num valor muito baixo. Agora, estamos nesse vazio até ser retomado no valor\nque está previsto de 400 reais”, declarou Sandra.\nAlém da solidariedade da sociedade, e da responsabilidade estatal em programas de transferência\nde renda, a vice-coordenadora da Rede Penssan afirma que são necessárias medidas ativas do\ngoverno na regulamentação de preços, para garantir o acesso da população aos alimentos, além\nde programas de emprego e renda.\n“Ter um botijão do gás a R$ 120 é muito grave. O quilo do feijão e arroz a R$ 9 em algumas\ncapitais. O preço absurdo do quilo da carne. Em 1974, foi feito o primeiro estudo nacional de\ndespesa familiar. Lá, foi demonstrado uma situação de fome desse nível que estamos vendo agora.\nFamílias faziam sopa de papelão pelo país. Nós estamos vendo isso agora. Nunca passamos por\numa situação tão seria”, afirmou Sandra Chaves.\n(Disponível em <https://www.cnnbrasil.com.br/saude/nunca-passamos-por-situacao-tao-seria-diz-especialista-sobre-a-fome-no-brasil/> Acesso em 06 jan. 2021)",
    "statement": "Assinale, a seguir, a alternativa em que há elipse de um verbo anteriormente presente no contexto.",
    "options": [
      {
        "letter": "A",
        "text": "“Além da solidariedade da sociedade, e da responsabilidade estatal em programas de transferência de renda, a vice-coordenadora da Rede Penssan afirma que são necessárias medidas ativas do governo na regulamentação de preços, para garantir o acesso da população aos alimentos, além de programas de emprego e renda.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Por ser insuficiente, Sandra Chaves afirma que há uma necessidade do Estado ter responsabilidade e garantir programas de transferência de renda dignos. Ela pontua que o valor da cesta básica de alimentos cresceu mais de 30% nos últimos 12 meses, chegando a preços acima de 700 reais em alguns estados.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "‘(...) “Temos 119 milhões de brasileiros com alguma privação alimentar, e 19 milhões passando fome, sem saber quando voltará a se alimentar. A solidariedade é fundamental, mas insuficiente”, disse.’",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“A professora da Escola de Nutrição da UFBA destacou que, diante da instabilidade do ambiente econômico e ausência de perspectivas de mudança no curto prazo, dois conceitos são fundamentais: solidariedade e responsabilidade do Estado.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q36",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 36,
    "readingText": "[..] os circunstantes bem-educados se sentiriam na obrigação de desviar <u>a vista</u> e mudar de\nassunto.",
    "statement": "Tendo em vista outros empregos da expressão sublinhada, deve ocorrer o uso do acento grave\nsomente em:",
    "options": [
      {
        "letter": "A",
        "text": "Era maravilhosa a vista da janela daquele quarto.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Usar computador constantemente pode prejudicar a vista.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Quando será realizada a vista de prova?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Dói-me a vista esquerda.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "A gasolina está no fim e não há um Posta de combustível a vista.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q37",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 37,
    "statement": "Assinale a opção em que uma forma verbal tem um valor coesivo por ser um verbo vicário.",
    "options": [
      {
        "letter": "A",
        "text": "Se agora o conto é porque a moça é morta e a sua cicatriz já estará em nada [... ].",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Conheci uma moça que escondia como um crime certa feia cicatriz de queimadura que tinha no corpo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Antigamente havia as doenças secretas, que só se nomeavam em segredo ou sob pseudônimo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Falava daquilo com mal disfarçado orgulho, como se ter coração defeituoso fosse uma distinção aristocrática [... ].",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Mulheres discutem com prazer seus casos ginecológicos; uma diz abertamente que já não tem um ovário [... ].",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q38",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 38,
    "statement": "Assinale a opção em que a oração NÃO se encontra na voz passiva,",
    "options": [
      {
        "letter": "A",
        "text": "[... ] uma distinção aristocrática que se ganha de nascença e não está ao alcance de qualquer um.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "[...] mas a má formação interna é marca de originalidade, que se descreve aos outros com evidente orgulho.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Antigamente havia as doenças secretas, que só se nomeavam em segredo ou sob pseudônimo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Falava daquilo com mal disfarçado orgulho, como se ter coração defeituoso fosse uma distinção aristocrática [...].",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "[...] e constatem de perto que realmente não se nota diferença nenhuma com o olho são.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q39",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 39,
    "readingText": "OS BICHOS QUE AMAMOS TANTO\nQualquer um de nós que habitualmente faça exercícios físicos nos parques conhece dois grupos\nde frequentadores que dividem conosco o prazer do sol de inverno: os que se dedicam aos gatos\ne os que se dedicam aos cachorros. Cruzo, diariamente, com uma senhora que conversa com o\nseu \"Alfredo, querido\", que ouve, com paciência, queixas sobre netos ausentes ou sobre os efeitos\nde um milagroso diurético! Outras senhoras alimentam, com cuidados maternos, gatos vira-latas.\nOs bichos parecem estar ali para nos lembrar que, se ao longo de milhares de anos, eles puderam\nviver sem os homens, nós, ao contrário, não pudemos viver sem eles, de quem fomos em muitos\ncasos vítimas.\n\"O gato — brinca o antropólogo Marcel Mauss — foi o único animal que domesticou o homem.\"\nBrinca por saber que o felino permanece como uma espécie de \"prisioneiro selvagem\". Animal\nfilosófico, tranquilo, independente, senhor de seus hábitos, pode tornar-se um amigo, nunca um\nescravo. Sua história é tão enigmática quanto sua imagem. Seu ancestral tinha entre 8 e 18 quilos.\nE quase um metro de comprimento.\nSeus primeiros retratos aparecem nos sarcófagos e pirâmides egípcias. Visto como enviado dos\ndeuses pela proteção que dava às crianças e aos alimentos da casa, lutando contra cobras e ratos,\ntinha tanta importância entre egípcios que, se um gato morresse, toda a família ficaria enlutada,\nraspando as sobrancelhas em sinal de dor. Em caso de incêndio, salvava-se, primeiro, o totêmico\nbichano. Se alguém, de propósito ou sem querer, matasse um deles, era passível de condenação à\nmorte por apedrejamento. No mundo muçulmano, Maomé tinha uma gata — a bela Buezza —, e\nos felinos eram identificados com a lua que brilha sobre os desertos e os djins, espíritos aéreos.\nPor outro lado, as tradições indo-europeias preferiram transmitir a imagem do selvagem predador,\npreguiçoso durante o dia para melhor viver à noite. Noite identificada, no imaginário de nossos\nantepassados, com os demônios, vampiros e feiticeiras. Compreende-se que o cristianismo,\nvitorioso no mundo ocidental, tenha desenvolvido uma viva desconfiança em relação a um animal\nvindo das sombras do mundo pagão, habitado pela luxúria tentadora das filhas de Eva, donas,\ncomo os gatos, de uma pelugem afrodisíaca, capaz de fazer sucumbir o homem, representado\npelo honesto cão.\nO cachorro, por sua vez, depende da ação humana... e por isso desempenha tantas e tão\ndiversificadas funções: late à noite, vigia residências, fareja drogas, guia cegos, busca o jornal, faz\nanúncios para a televisão e, é bom não esquecer, foi pioneiro nas viagens espaciais. É graças a\nessa formidável colaboração que marcou tanto nossa vida e nosso vocabulário: \"fiel como um\ncão\", \"cão que ladra não morde\", \"cachorro bom de tatu, morre de cobra\".\nSua personalidade e seu psiquismo variam ao infinito, às vezes tão sutil quanto o do seu dono, pois\n\"tal dono, tal cão\". Hoje herói de cinema, multiplica-se em Rintintins, Milous, Snoopys e Plutos,\ndeixando para trás a imagem de lutadores aguerridos que enfrentavam, nas arenas romanas, ursos\ne leões ou, nas feiras medievais, touros e bois bravos. Pinturas na Espanha comprovam que sua\ndomesticação teria ocorrido há cerca de 10 mil anos. Escavações arqueológicas revelam que eram\nenterrados junto com seus donos e, entre o Egito e a Grécia, os cultos ao deus Chacal e a Argos\n— o cão de Ulisses — comprovam a fecundidade das representações sobre a ligação homem/cão.\nMas ele também inspira sentimentos contraditórios. Isso porque nossa sociedade vem dando um\nlugar especial aos animais domésticos. Muitas vezes ter cachorro ou gato pode, também,\nfuncionar como derivativo para a solidão e a insegurança. A necessidade de autoridade, de\ndominação, de apropriação, bem como a angústia, a agressividade, a riqueza de uma vida\nexcessivamente interiorizada ou a timidez e dificuldade de comunicação, as frustrações afetivas ou\nsexuais de um casal desunido, separado ou sem crianças, a velhice em que as pessoas se sentem\nabandonadas pelos filhos, o narcisismo, mas também as tensões sociais e profissionais, todas\nessas motivações geradoras de desequilíbrio podem levar à aquisição de um cachorro,\nresponsabilizado em alguns casos por comportamentos antissociais.\nAs prefeituras, por sua vez, têm de enfrentar consideráveis tarefas de limpeza. Em Paris,\nprovavelmente cidade recordista, são 2 mil toneladas de caca e urina por dia! Nova York\nradicalizou: os americanos não podem circular sem estar munidos de sacos para recolher os\ndejetos do melhor amigo, cujas infrações, aliás, montam a US$ 100. Nas nossas grandes cidades, a\niniciativa fica por conta de associações de bairros ou de proprietários mais zelosos com o bem\ncomum. A verdade é que, a despeito dos inconvenientes, das despesas, da irritação crescente da\ncoletividade pela falta de campanhas publicitárias que eduquem donos, cães e gatos seguem se\nmultiplicando.\nVerdadeiros lembretes para a solidão, o abandono e a insegurança em que vivem alguns dos\ncidadãos das metrópoles, podiam usar sua simpática imagem para lembrar aos donos expressões\ncomo: \"limpo como um gato\" ou \"totó educado não suja a casa do dono\", evitando que deliciosos\nquadrúpedes como o pachorrento Alfredo nos obrigassem a lavar o tênis a cada vez que voltamos\ndo parque!",
    "statement": "Assinale, a seguir, a alternativa em que há oração reduzida e não locução verbal no trecho\ndestacado.",
    "options": [
      {
        "letter": "A",
        "text": "“Os bichos <u>parecem estar</u> ali para nos lembrar que, se ao longo de milhares de anos, eles puderam viver sem os homens, nós (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Animal filosófico, tranquilo, independente, senhor de seus hábitos, <u>pode tornar-se</u> um amigo, nunca um escravo.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "<u>“Brinca por saber</u> que o felino permanece como uma espécie de ‘prisioneiro selvagem’.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“(...) os americanos não podem circular sem <u>estar munidos</u> de sacos para recolher os dejetos do melhor amigo, cujas infrações, aliás, montam a US$ 100.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Verdadeiros lembretes para a solidão, o abandono e a insegurança em que vivem alguns dos cidadãos das metrópoles, <u>podiam usar</u> sua simpática imagem (...)” ",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q40",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 40,
    "statement": "No trecho a seguir, a construção verbal em destaque deve ser classificada de que maneira, quanto\nao tempo?\n<u>Hão de me perguntar</u> por que tomo conta do mundo: é que nasci assim, influmbida.",
    "options": [
      {
        "letter": "A",
        "text": "Pretérito perfeito",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Futuro do pretérito",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Presente do indicativo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Futuro do subjuntivo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Futuro do indicativo",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q41",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 41,
    "readingText": "TEXTO I\nO Cândido me pede um texto de/ou sobre humor.\nPensei em falar sobre o desprezo dos acadêmicos (e os jurados de prêmios) em geral para com os\nescritores que trabalham com o humor. Fiz até algumas pesquisas entre os Nobel da Literatura e\nos Pullitzer americanos. Tirando o Dario Fo, o García Márquez e o Bernard Shaw, só sobram\nsaramagos, sartres, pasternaks, graas e vargasllosa depois de velho. Mesmo o Ernest que era\nmuito engraçadinho bebendo no bar, ficava seríssimo em alto mar. Enfim, os intemeratos,\nempolados e glorificados como salvadores da pátria sem chuteira é que são considerados os\ngrandes mestres da literatura. Desde aqueles gregos. Barão de Itararé, Millôr Fernandes, Luis\nFernando Verissimo não ganham prêmios nem no Brasil. São menosprezados pela academia, como\nse fácil fosse fazer humor. Nenhum deles esteve nas listas dos “vinte melhores escritores\nbrasileiros do século XX”, que proliferaram no começo deste século.\nVou contar uma historinha despretensiosa que eu acho engraçada e envolve um grande poliglota\nacadêmico (e político) brasileiro, o doutor Rui Barbosa, também conhecido como A Águia de Haia.\nFoi considerado agora em 2013, por uma pesquisa do jornal A Tarde, da Bahia, como o maior\nbaiano de todos os tempos (não em tamanho, pois tinha um metro e cinquenta e oito e pesava 48\nquilos), deixando para trás Jorge Amado, ACM, Anísio Teixeira, Obina e outros menos votados.\nMas trata-se, sem nenhuma dúvida, de um brasileiro importante não só na Bahia, como no Brasil\n(foi três vezes candidato à presidência da República). Polímata, tendo se destacado principalmente\ncomo jurista, político, diplomata, escritor, filólogo, tradutor, orador, ministro, embaixador,\ndeputado, escritor e chato, só não foi jogador de futebol porque não tentou a ponta-direita do\nVitória. E no exterior, abafou falando até em latim.\nFoi na Holanda, em Haia, onde aconteceu o fato que passo a narrar que foi protagonizado por ele,\no Rui, um dos fundadores da Academia Brasileira de Letras.\nQuem me contou a história foi o escritor, jornalista e biógrafo Fernando Morais. E quem contou\npara ele foi o também jornalista e escritor Moacir Werneck de Castro que, por sua vez, jurava ter\nouvindo do próprio personagem do caso, o doutor Rui. Fiz um Google rápido e descobri que\nquando Rui Barbosa morreu, aos 73 anos, em 1929, o menino Moacir tinha oito anos. Como ambos\nmoravam no Rio, sei lá, podiam ser amiguinhos. Deviam ter a mesma altura, quem sabe? Ou talvez\no Rui contou para alguém que passou para o Moacir alguns anos depois.\nVamos lá. Todo mundo sabe que o Rui Barbosa chegou na IIª Conferência da Paz em Haia, em\n1907, carteando marra. Na hora de fazer o seu discurso, petulante, indagou:\n— Em quem língua quereis que eu fale? Pode?\nDizem que falou em latim e arrasou. De noite, o Czar Nicolau II, o último dos czares (pai da\nprincesa Anastácia, lembra?) deu uma festa no consulado da Rússia. Nosso poliglota foi\nconvidado. Havia uma fila enorme de gente do mundo todo para cumprimentar o Nicolau. O\nsujeito chegava perto, um ajudante de ordem dizia o nome e o país do cidadão e Lalau falava na\nlíngua do elemento. O Rui Barbosa, que estava na fila, foi ficando impressionado com aquilo. O\nhomem falava mais línguas do que ele? Impossível! Quando ele chegou, foi anunciado:\n— Rui Barbosa, Brasil. E o czar, em português:\n— Como vai aquela terra maravilhosa? Copacabana continua linda? Como vai o presidente\nAfonso Pena?\nO nosso diplomata respondeu e se despediram. Mas o Rui ficou invocado (gíria daquela década)\ncom aquilo.\nResolveu testar o czar. Deu a volta e pegou a fila de novo. Quando chegou, foi anunciado: — Rui\nBarbosa, Brasil.\nE ele perguntou ao czar:\n— Nicolau, Nicolau, vamos comer mingau? O russo apertou a mão dele e respondeu:\n— Só se for de araruta, seu filho outra! (um de nós mentiu).",
    "statement": "Assinale a alternativa em que há verbo que apresenta o mesmo comportamento que o do verbo\n“haver” em “Havia uma fila enorme de gente do mundo todo para cumprimentar o Nicolau” com\nrelação ao sujeito.",
    "options": [
      {
        "letter": "A",
        "text": "Estava muito frio quando chegamos em Brasília.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Existe uma boa quantidade de pessoas envolvidas na prova.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Coma, antes que a comida esfrie, Marcelino!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O chefe trovejou palavrões para os funcionários da casa.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Choveram reclamações com relação ao atraso do jogo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q42",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 42,
    "readingText": "TEXTO I\nO Cândido me pede um texto de/ou sobre humor.\nPensei em falar sobre o desprezo dos acadêmicos (e os jurados de prêmios) em geral para com os\nescritores que trabalham com o humor. Fiz até algumas pesquisas entre os Nobel da Literatura e\nos Pullitzer americanos. Tirando o Dario Fo, o García Márquez e o Bernard Shaw, só sobram\nsaramagos, sartres, pasternaks, graas e vargasllosa depois de velho. Mesmo o Ernest que era\nmuito engraçadinho bebendo no bar, ficava seríssimo em alto mar. Enfim, os intemeratos,\nempolados e glorificados como salvadores da pátria sem chuteira é que são considerados os\ngrandes mestres da literatura. Desde aqueles gregos. Barão de Itararé, Millôr Fernandes, Luis\nFernando Verissimo não ganham prêmios nem no Brasil. São menosprezados pela academia, como\nse fácil fosse fazer humor. Nenhum deles esteve nas listas dos “vinte melhores escritores\nbrasileiros do século XX”, que proliferaram no começo deste século.\nVou contar uma historinha despretensiosa que eu acho engraçada e envolve um grande poliglota\nacadêmico (e político) brasileiro, o doutor Rui Barbosa, também conhecido como A Águia de Haia.\nFoi considerado agora em 2013, por uma pesquisa do jornal A Tarde, da Bahia, como o maior\nbaiano de todos os tempos (não em tamanho, pois tinha um metro e cinquenta e oito e pesava 48\nquilos), deixando para trás Jorge Amado, ACM, Anísio Teixeira, Obina e outros menos votados.\nMas trata-se, sem nenhuma dúvida, de um brasileiro importante não só na Bahia, como no Brasil\n(foi três vezes candidato à presidência da República). Polímata, tendo se destacado principalmente\ncomo jurista, político, diplomata, escritor, filólogo, tradutor, orador, ministro, embaixador,\ndeputado, escritor e chato, só não foi jogador de futebol porque não tentou a ponta-direita do\nVitória. E no exterior, abafou falando até em latim.\nFoi na Holanda, em Haia, onde aconteceu o fato que passo a narrar que foi protagonizado por ele,\no Rui, um dos fundadores da Academia Brasileira de Letras.\nQuem me contou a história foi o escritor, jornalista e biógrafo Fernando Morais. E quem contou\npara ele foi o também jornalista e escritor Moacir Werneck de Castro que, por sua vez, jurava ter\nouvindo do próprio personagem do caso, o doutor Rui. Fiz um Google rápido e descobri que\nquando Rui Barbosa morreu, aos 73 anos, em 1929, o menino Moacir tinha oito anos. Como ambos\nmoravam no Rio, sei lá, podiam ser amiguinhos. Deviam ter a mesma altura, quem sabe? Ou talvez\no Rui contou para alguém que passou para o Moacir alguns anos depois.\nVamos lá. Todo mundo sabe que o Rui Barbosa chegou na IIª Conferência da Paz em Haia, em\n1907, carteando marra. Na hora de fazer o seu discurso, petulante, indagou:\n— Em quem língua quereis que eu fale? Pode?\nDizem que falou em latim e arrasou. De noite, o Czar Nicolau II, o último dos czares (pai da\nprincesa Anastácia, lembra?) deu uma festa no consulado da Rússia. Nosso poliglota foi\nconvidado. Havia uma fila enorme de gente do mundo todo para cumprimentar o Nicolau. O\nsujeito chegava perto, um ajudante de ordem dizia o nome e o país do cidadão e Lalau falava na\nlíngua do elemento. O Rui Barbosa, que estava na fila, foi ficando impressionado com aquilo. O\nhomem falava mais línguas do que ele? Impossível! Quando ele chegou, foi anunciado:\n— Rui Barbosa, Brasil. E o czar, em português:\n— Como vai aquela terra maravilhosa? Copacabana continua linda? Como vai o presidente\nAfonso Pena?\nO nosso diplomata respondeu e se despediram. Mas o Rui ficou invocado (gíria daquela década)\ncom aquilo.\nResolveu testar o czar. Deu a volta e pegou a fila de novo. Quando chegou, foi anunciado: — Rui\nBarbosa, Brasil.\nE ele perguntou ao czar:\n— Nicolau, Nicolau, vamos comer mingau? O russo apertou a mão dele e respondeu:\n— Só se for de araruta, seu filho outra! (um de nós mentiu).",
    "statement": "Assinale, dentre os trechos apresentados a seguir, aquele em que há construção de voz passiva.",
    "options": [
      {
        "letter": "A",
        "text": "“Ou talvez o Rui contou para alguém que passou para o Moacir alguns anos depois.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“— Em quem língua quereis que eu fale?”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Foi considerado agora em 2013, por uma pesquisa do jornal A Tarde, da Bahia, como o maior baiano de todos os tempos (...)”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“Havia uma fila enorme de gente do mundo todo para cumprimentar o Nicolau.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“— Como vai aquela terra maravilhosa? Copacabana continua linda? Como vai o presidente Afonso Pena?”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q43",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 43,
    "readingText": "Por que o frio é ideal para comer pratos mais calóricos\n30 de jun de 2021\nAlém de usar mais camadas de roupas, temos mecanismos corporais que são ativados para nos\nmanter aquecidos\nEm 1937, uma dupla de pesquisadores nos EUA buscou determinar a zona de termoneutralidade\nde seres humanos, ou a temperatura do ambiente em que a nossa produção de calor basal\ncorresponde ao necessário e suficiente para que nossos corpos se mantenham na sua temperatura\nnormal de funcionamento, de cerca de 37°C. Descobriram que para homens nus (o estudo não\nenvolveu mulheres) sem nenhuma atividade física, temperaturas ambientes de cerca de 30°C os\nmantinham termoneutros. Nesta temperatura e condições, não se observava a ativação de\nestratégias para aumentar nem diminuir a temperatura corporal – a produção de suor, por\nexemplo, é uma forma de evitar superaquecimento.\nQuando estamos vestidos, as roupas retêm significativamente o calor gerado pelos nossos corpos.\nEsse fator, aliado à presença de algum tipo de movimentação física, determina que a temperatura\nde ambientes internos em que a maioria das pessoas se sente confortável é entre 20°Ce 25°C\n(dependendo de características da pessoa e da vestimenta usada).\nBoa parte do Brasil, nesta semana, se encontra com temperaturas significativamente inferiores a\n20°C. E boa parte do Brasil não possui calefação em ambientes internos, realidade que causa\nespanto em muitos visitantes estrangeiros, ao se darem conta que passam mais frio aqui do que\nem países temperados, pelo simples fato de serem expostos a temperaturas baixas o tempo todo.\nMas isso não significa que todos vamos ver nossos corpos esfriar abaixo dos 37°C, pois, além de\nnos vestirmos com mais camadas de roupas para evitar a perda de calor dos nossos corpos, temos\nmecanismos que podem ser ativados para nos manter aquecidos.\nUm mecanismo para manter nossos corpos aquecidos é evitar a perda de calor através da\nvasoconstrição periférica, ou a diminuição da chegada de sangue (quente) nos vasos das nossas\nextremidades, como mãos e pés, onde o calor pode ser perdido para o ambiente. Esse mecanismo\npoupa o calor para as partes centrais do corpo, onde também ficam os órgãos mais vitais. É por\ncausa desta constrição de vasos que nossas mãos e pés ficam gelados quando estamos com frio.\nÉ também por causa deste mecanismo que a mania de estabelecimentos brasileiros de aferir a\ntemperatura corporal no punho dos clientes em vez da testa é inapropriada, além de anticientífica.\nFragmento retirado de nexojornal.com.br",
    "statement": "Assinale, a seguir, a alternativa em que há construção de agente da passiva.",
    "options": [
      {
        "letter": "A",
        "text": "“Quando estamos vestidos, as roupas retêm significativamente o calor gerado pelos nossos corpos.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“Esse fator, aliado à presença de algum tipo de movimentação física, determina que a temperatura de ambientes internos em que a maioria das pessoas se sente confortável é entre 20°C e 25°C (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Nesta temperatura e condições, não se observava a ativação de estratégias para aumentar nem diminuir a temperatura corporal – a produção de suor, por exemplo, é uma forma de evitar superaquecimento.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Descobriram que para homens nus (o estudo não envolveu mulheres) sem nenhuma atividade física, temperaturas ambientes de cerca de 30°C os mantinham termoneutros.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Em 1937, uma dupla de pesquisadores nos EUA buscou determinar a zona de termoneutralidade de seres humanos (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q44",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 44,
    "statement": "Assinale, a seguir, a alternativa em que o elemento “se” deve ser classificado como o elemento\nresponsável pela construção de voz passiva.",
    "options": [
      {
        "letter": "A",
        "text": "“Um texto pode se prolongar e sofrer diversas revisões, um filme pode ser editado e reeditado tantas vezes quanto necessário (...)”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“A tempo de manter a integridade da obra. A eternidade da obra. Sua genialidade, se ela a tiver.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Como saber se o corte de dois parágrafos deixaria um conto de Dalton Trevisan ainda mais preciso?”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Não há um alarme sonoro que avise que chegamos ao limite, ainda mais em se tratando de arte.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Parar a tempo uma discussão antes que acabe em pancadaria. Parar a tempo uma relação desgastada, antes que os dois comecem a se odiar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q45",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 45,
    "statement": "Assinale a opção em que o verbo está flexionado nos mesmos tempo e modo do destacado em\n“[...]Lá, nos deparamos com um dilema: como surgiu a primeira entidade viva, se nada vivo <u>havia</u>\npara gerá-la?”",
    "options": [
      {
        "letter": "A",
        "text": "Ele <u>antevira</u> o desastre.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "<u>Estavam</u> muito perplexos com a situação de xenofobia.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Gostaria de que o mundo <u>fosse</u> menos desigual.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Não <u>podem</u> simplesmente ignorar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Ainda <u>foram</u> capazes de maltratá-lo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q46",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 46,
    "statement": "Assinale a alternativa em que há voz passiva pronominal.",
    "options": [
      {
        "letter": "A",
        "text": "O menino tornou-se muito ágil com o passar dos anos. Impressionante!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Passaram-se horas antes de eu conseguir usar meu login e minha senha.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Assistiu-se a muitos filmes antes do Oscar, que foi surpreendente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Esqueceu-se de dizer o que seria feito após o isolamento da pandemia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Pode-se dizer que todos estão preparados para a prova que virá.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q47",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 47,
    "readingText": "Texto I\nPortões fechados e alunos distantes das salas de aulas. Esse cenário com milhares de escolas\nfechadas em diversos países não se refletia desde a Segunda Guerra Mundial, evidenciando\nnovamente todo o zelo que devemos ter com o ensino, que desta vez foi escancarado pela\nrelação indireta entre Educação e Coronavírus.\nDe acordo com a Organização das Nações Unidas para a Educação, a Ciência e a Cultura\n(UNESCO), agência da ONU responsável por acompanhar e apoiar a educação, comunicação e\ncultura no mundo, a pandemia da COVID-19 já impactou os estudos de mais de 1,5 bilhão de\nestudantes em 188 países – o que representa cerca de 91% do total de estudantes no planeta.\nEm meio a esse panorama assustador e conturbado, não apenas na questão de saúde mas\ntambém do aprendizado das crianças e dos jovens, os impactos no ensino são vários. Enquanto\nalguns escancaram alguns problemas na área da Educação, outros podem ser oportunidades de\ncrescimento e evolução, basta que saibamos trabalhar de maneira coordenada, colaborativa e\ninovadora.\nNesta matéria discutiremos exatamente isso: os principais malefícios e benefícios trazidos pelo\nCoronavírus para as nossas escolas, quais pontos precisamos corrigir com urgência e quais\ncaminhos podemos seguir com os ensinamentos trazidos pelas dificuldades que estamos\nenfrentando.\nOs impactos negativos do Coronavírus na Educação\nDespreparo das escolas, professores e alunos\nA verdade é que, para não dizer ninguém, pouquíssimas pessoas imaginavam uma pandemia com\nas proporções que a COVID-19 alcançou. Como consequência disso, praticamente organização\nnenhuma estava preparada para lidar com as consequências naturais impostas pelo\ndistanciamento e isolamento social.\nInúmeros setores estão sofrendo para se adaptar e encontrar formas de superar essa situação\natribulada. A área da Educação não teria como escapar desses enormes desafios, os quais\nmostram o despreparo de toda a comunidade escolar para um cenário em que a tecnologia pode\nser um instrumento facilitador do processo de aprendizagem.\nA maioria das escolas não conta com o suporte necessário para o oferecimento do ensino remoto\nou a distância. Apesar de até estarem mais presentes em instituições do Ensino Superior, as\nplataformas digitais eram aproveitadas pela minoria dos estudantes da Educação Básica. E do dia\npara a noite as escolas precisaram encontrar maneiras de se adaptar a essas “novas tecnologias” –\nque não são tão novas assim.\nAlém disso, são poucos os professores que tiveram a formação adequada para lecionar a distância.\nPreparar uma aula remota é bem diferente da prática presencial de sala de aula – e nós já\npublicamos um artigo completo explicando como montar planos de aulas remotas –, a dinâmica\nde interação com os alunos é outra, as formas de comunicação com familiares muda e o\nconhecimento das tecnologias educacionais é imprescindível.\nAs crianças e os jovens também não estavam acostumados a rotinas mais pesadas de estudos em\ncasa, ambiente no qual normalmente priorizavam atividades de descanso e entretenimento. De\nmaneira geral, os estudantes não possuíam a maturidade para lidar com a autonomia implícita no\nensino a distância, em especial os alunos da Educação Infantil e do Ensino Fundamental.\nAs dificuldades são várias, mas são normais. Não devemos nos assustar, esse cenário de educação\ne coronavírus é novo para todos. O importante é que saibamos, com humildade, identificar essas\nfalhas e dediquemos esforços para corrigi-las.\nEducação e Coronavírus: As famílias estavam distantes da escola\nO afastamento das escolas, levando as crianças e os jovens a estudarem em casa, mostrou em\nmuitos casos o quanto as famílias estavam até então afastadas da escola e do aprendizado de seus\nfilhos. Ao terem que acompanhar mais de perto a rotina de estudos deles, pais e mães perceberam\na necessidade de estarem mais próximos e inteirados do material didático, das metodologias\nadotadas e dos professores.\nEsse processo tem seus desgastes para ambos os lados. Os familiares e responsáveis se vêem\nsobrecarregados com essa nova demanda combinada ao trabalho no formato home office e\nafazeres do lar, mas passam a valorizar mais os professores e a escola. Do outro lado, as\ninstituições de ensino passam a ser mais cobradas por pais e mães agora com melhor\nentendimento da aprendizagem dos estudantes.\nApesar de alguns entraves, o balanço dessa quarentena pode e deve ser positivo. No fim, todos\nquerem e estão buscando o melhor ensino para as crianças e os jovens, portanto precisamos\nestabelecer relacionamentos respeitosos, transparentes e objetivos.\nInacessibilidade a tecnologias educacionais\nOutro problema que no fundo todos temos ciência, mas que foi escancarado pela pandemia do\nCoronavírus na Educação, é a desigualdade social e de acesso a tecnologias, o que na área da\nEducação causa um abismo entre aqueles que podem dar continuidade ao seu processo de\naprendizagem e outros que sequer possuem um dispositivo eletrônico com conexão à internet\ndentro de casa.\nAs tecnologias educacionais são a principal solução para a situação que vivemos e de maior\npotencial de inovação na maneira como ensinamos crianças e jovens. Contudo, a realidade\nbrasileira está bem longe de ser igualitária, infelizmente.\nSegundo pesquisa do IBGE, apenas 57% da população do nosso país possui um computador em\ncondições de executar softwares mais recentes. Outro estudo realizado em 2018, a Pesquisa TIC\nDomicílio, aponta que mais de 30% dos lares no Brasil não possuem acesso à internet, que é\npraticamente indispensável para o serviço de ensino remoto.\nO resultado disso é uma inevitável acentuação da desigualdade de acesso não só ao ensino de\nqualidade, mas do ensino básico, causando um déficit de aprendizagem ainda maior do que já\ntemos entre alunos do sistema público e da rede particular.\nDisponível em: sae.digital/educação-e-coronavirus/",
    "statement": "Assinale, a seguir, a alternativa em que o trecho do texto apresenta um agente da passiva.",
    "options": [
      {
        "letter": "A",
        "text": "“A maioria das escolas não conta com o suporte necessário para o oferecimento do ensino remoto ou a distância.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Inúmeros setores estão sofrendo para se adaptar e encontrar formas de superar essa situação atribulada.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“(...) a pandemia da COVID-19 já impactou os estudos de mais de 1,5 bilhão de estudantes em 188 países (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“(...) o zelo que devemos ter com o ensino, que desta vez foi escancarado pela relação indireta entre Educação e Coronavírus.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "“Esse cenário com milhares de escolas fechadas em diversos países não se refletia desde a Segunda Guerra Mundial (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q48",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 48,
    "readingText": "Texto II\nLIVROS-REFÚGIO: UM CONVITE A SER\nCarolina Walliter\nDas poucas lembranças nítidas que tenho da minha infância, uma delas é a estante de livros daqui\nde casa, repleta de lombadas coloridas que tentam se manter enfileiradas, até que um ou outro\ntítulo rebelde se desgarra, jogado em cima dos outros ou enfiado forçosamente entre um “tijolaço”\ne outro. Eu mal sabia ler e já me hipnotizava por essa visão, como se pudesse ouvir o burburinho\ndos títulos, me chamando para conhecer suas histórias.\nEssa recordação sempre aqueceu meu coração e me é definidora: eu sou uma pessoa de livros,\nsempre fui e serei. Pois vejo neles meu meio genuíno de me expressar para o mundo e conhecê-lo\nmelhor: a escrita. Não vou mentir, sempre achei essa coisa de “gostar de ler” um baita elogio e\nfonte de orgulho próprio, mas não somente pelos motivos que vocês estão pensando – pagar de\ninteligente (porque né, quem nunca?!) –, mas por outros, muito mais especiais. Porque, na boa,\nlivros são e vão muito além de um símbolo socialmente construído de intelecto.\nA primeira coisa que aprendi que livros podem ser é refúgio. Na adolescência, eu me envolvi\nmuito com os livros do Harry Potter: cresci com os personagens, frequentei as aulas de Hogwarts,\nvibrei com as partidas de quadribol (nível “pulando na cama enquanto lê e comemora”). Através da\nHermione Granger, eu construí minha identidade infanto-juvenil, aprendi a entender melhor minha\nrelação com meus melhores amigos e com meus nem tão amigos. Eu realmente encarava a leitura\nda série como usar um par de óculos mágico que me permitisse enxergar melhor a minha própria\nrealidade adolescente e ficar mais em paz, menos confusa, mais confiante. Pegar nos livros,\ncheirar as páginas me fazia sentir protegida, compreendida e no meu lugar.\nDo livro-refúgio, logo em seguida descobri que o livro é casa. É aquele cantinho aconchegante\nque a sua mente pode repousar e simplesmente ser do jeito que ela é, com todas as suas dúvidas,\nmedos e receios, sem travas e filtros. E por permitirem tamanho conforto, senti que os livros\ntambém são catarse: ler é concordar ou discordar agressivamente, refletir, ponderar, se\ntransformar, perceber que mudou de ideia, ficar insegura por ter mudado de ideia, mas se\nacostumar com essa\nnova linha de raciocínio conforme a história “assenta” em você.\nE nessa coisa de me revoltar em leituras silenciosas (ou barulhentas, já que eu sempre gostei de ler\nem voz alta), me dei conta de que os livros também são o buraco na fechadura, onde\nbisbilhotamos, curiosas, o que passa no mundo do autor, como ele enxerga a própria realidade,\nseja ela distante ou próxima a nossa. Mas eles também são espelhos, inteiros ou rachados,\ndepende de quem e quando os lê. Eles refletem e trazem à tona muito do que somos, do que\nqueremos ser e\ndo que negamos ser, consciente ou inconscientemente.\nEu fui me apercebendo dessas coisas todas que os livros são em uma onda de autoconhecimento,\nsabe? E talvez o que livros sejam, mais que tudo, é encontro. Seu consigo, teu com outros. É por\nisso tudo que nós acabamos cultivando relações íntimas com eles: algumas de nós os deixamos\nintocáveis, não queremos nem abri-los muito para não perderem o viço de novos. Porém, em um\nlampejo de mudança, decidimos usar e abusar daquelas páginas, rabiscando, desenhando,\ndestacando passagens, como se fossem recados ao nosso futuro eu, que daqui a alguns anos, se\nreencontrará naquelas páginas.\nEu gosto mesmo é do livro que deixa claro para o mundo que é rodado, sabe? Éo livro que mais\nencerra histórias, não apenas aquela impressa em suas páginas, mas aquelas de seus leitores,\nacumuladas em pontinhas de páginas dobradas, manchas de café, borrões de lágrimas. Éo livro\nque ultrapassou seu mero propósito de entreter e convidou o leitor a ser.\n(Disponível em <http://www.revistacapitolina.com.br/livros-refugio-um-convite-a-ser/> Acesso e\n24 abr. 2021)\nLeia: “Porém, em um lampejo de mudança, decidimos usar e abusar daquelas páginas, rabiscando,\ndesenhando, destacando passagens, como se fossem recados ao nosso futuro eu, que daqui a\nalguns anos, se <u>reencontrará</u> naquelas páginas”",
    "statement": "A forma verbal sublinhada está na sua forma simples. Assinale a alternativa que apresente o\nmesmo tempo verbal, porém em sua forma composta.",
    "options": [
      {
        "letter": "A",
        "text": "A mulher tem pensado muito no ex-namorado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Eu teria falado com ele se ele tivesse chegado mais cedo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "O professor tinha marcado a data da prova para a semana seguinte.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Até a hora de sair para a festa, ela terá terminado tudo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "A mãe teria dito a verdade, caso confiasse no pai.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q49",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 49,
    "readingText": "Texto I\nO primeiro livro de cada uma das minhas vidas\nClarice Lispector\nPerguntaram-me uma vez qual fora o primeiro livro de minha vida. Prefiro falar do primeiro livro de\ncada uma das minhas vidas. Busco na memória e tenho a sensação quase física nas mãos ao\nsegurar aquela preciosidade: um livro fininho que contava a história do patinho feio e da lâmpada\nde Aladim. Eu lia e relia as duas histórias, criança não tem disso de só ler uma vez: criança quase\naprende de cor e, mesmo quase sabendo de cor, relê com muito da excitação da primeira vez. A\nhistória do patinho que era feio no meio dos outros bonitos, mas quando cresceu revelou o\nmistério: ele não era pato e sim um belo cisne. Essa história me fez meditar muito, e identifiquei-me com o sofrimento do patinho feio – quem sabe se eu era um cisne?\nQuanto a Aladim, soltava minha imaginação para as lonjuras do impossível a que eu era crédula: o\nimpossível naquela época estava ao meu alcance. A ideia do gênio que dizia: pede de mim o que\nquiseres, sou teu servo – isso me fazia cair em devaneio. Quieta no meu canto, eu pensava se\nalgum dia um gênio me diria: “Pede de mim o que quiseres.” Mas desde então revelava-se que sou\ndaqueles que têm que usar os próprios recursos para terem o que querem, quando conseguem.\nTive várias vidas. Em outra de minhas vidas, o meu livro sagrado foi emprestado porque era muito\ncaro: Reinações de Narizinho. Já contei o sacrifício de humilhações e perseveranças pelo qual\npassei, pois, já pronta para ler Monteiro Lobato, o livro grosso pertencia a uma menina cujo pai\ntinha uma livraria. A menina gorda e muito sardenta se vingara tornando-se sádica e, ao descobrir\no que valeria para mim ler aquele livro, fez um jogo de “amanhã venha em casa que eu empresto”.\nQuando eu ia, com o coração literalmente batendo de alegria, ela me dizia: “Hoje não posso\nemprestar, venha amanhã.” Depois de cerca de um mês de venha amanhã, o que eu, embora altiva\nque era, recebia com humildade para que a menina não me cortasse de vez a esperança, a mãe\ndaquele primeiro monstrinho de minha vida notou o que se passava e, um pouco horrorizada com\na própria filha, deu-lhe ordens para que naquele mesmo momento me fosse emprestado o livro.\nNão o li de uma vez: li aos poucos, algumas páginas de cada vez para não gastar. Acho que foi o\nlivro que me deu mais alegria naquela vida.\nEm outra vida que tive, eu era sócia de uma biblioteca popular de aluguel. Sem guia, escolhia os\nlivros pelo título. E eis que escolhi um dia um livro chamado O lobo da estepe, de Herman Hesse.\nO título me agradou, pensei tratar-se de um livro de aventuras tipo Jack London. O livro, que li\ncada vez mais deslumbrada, era de aventura sim, mas outras aventuras. E eu, que já escrevia\npequenos contos, dos 13 aos 14 anos fui germinada por Herman Hesse e comecei a escrever um\nlongo conto imitando-o: a viagem interior me fascinava. Eu havia entrado em contato com a\ngrande literatura.\nEm outra vida que tive, aos 15 anos, com o primeiro dinheiro ganho por trabalho meu, entrei altiva\nporque tinha dinheiro, numa livraria, que me pareceu o mundo onde eu gostaria de morar. Folheei\nquase todos os livros dos balcões, lia algumas linhas e passava para outro. E de repente, um dos\nlivros que abri continha frases tão diferentes que fiquei lendo, presa, ali mesmo. Emocionada, eu\npensava: mas esse livro sou eu! E, contendo um estremecimento de profunda emoção, comprei-o.\nSó então vim a saber que a autora não era anônima, sendo, ao contrário, considerada um dos\nmelhores escritores de sua época: Katherine Mansfield.\n(Disponível em <https://contobrasileiro.com.br/o-primeiro-livro-de-cada-uma-das-minhas-vidas-clarice-lispector/> Acesso em 24 abr. 2021)",
    "statement": "Assinale a alternativa que apresenta verbo flexionado no infinitivo pessoal.",
    "options": [
      {
        "letter": "A",
        "text": "“Perguntaram-me uma vez qual fora o primeiro livro de minha vida.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Prefiro falar do primeiro livro de cada uma das minhas vidas.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“sou daqueles que têm que usar os próprios recursos para terem o que querem”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“pede de mim o que quiseres, sou teu servo – isso me fazia cair em devaneio.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“comecei a escrever um longo conto imitando-o”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q50",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 50,
    "readingText": "Texto I\nO primeiro livro de cada uma das minhas vidas\nClarice Lispector\nPerguntaram-me uma vez qual fora o primeiro livro de minha vida. Prefiro falar do primeiro livro de\ncada uma das minhas vidas. Busco na memória e tenho a sensação quase física nas mãos ao\nsegurar aquela preciosidade: um livro fininho que contava a história do patinho feio e da lâmpada\nde Aladim. Eu lia e relia as duas histórias, criança não tem disso de só ler uma vez: criança quase\naprende de cor e, mesmo quase sabendo de cor, relê com muito da excitação da primeira vez. A\nhistória do patinho que era feio no meio dos outros bonitos, mas quando cresceu revelou o\nmistério: ele não era pato e sim um belo cisne. Essa história me fez meditar muito, e identifiquei-me com o sofrimento do patinho feio – quem sabe se eu era um cisne?\nQuanto a Aladim, soltava minha imaginação para as lonjuras do impossível a que eu era crédula: o\nimpossível naquela época estava ao meu alcance. A ideia do gênio que dizia: pede de mim o que\nquiseres, sou teu servo – isso me fazia cair em devaneio. Quieta no meu canto, eu pensava se\nalgum dia um gênio me diria: “Pede de mim o que quiseres.” Mas desde então revelava-se que sou\ndaqueles que têm que usar os próprios recursos para terem o que querem, quando conseguem.\nTive várias vidas. Em outra de minhas vidas, o meu livro sagrado foi emprestado porque era muito\ncaro: Reinações de Narizinho. Já contei o sacrifício de humilhações e perseveranças pelo qual\npassei, pois, já pronta para ler Monteiro Lobato, o livro grosso pertencia a uma menina cujo pai\ntinha uma livraria. A menina gorda e muito sardenta se vingara tornando-se sádica e, ao descobrir\no que valeria para mim ler aquele livro, fez um jogo de “amanhã venha em casa que eu empresto”.\nQuando eu ia, com o coração literalmente batendo de alegria, ela me dizia: “Hoje não posso\nemprestar, venha amanhã.” Depois de cerca de um mês de venha amanhã, o que eu, embora altiva\nque era, recebia com humildade para que a menina não me cortasse de vez a esperança, a mãe\ndaquele primeiro monstrinho de minha vida notou o que se passava e, um pouco horrorizada com\na própria filha, deu-lhe ordens para que naquele mesmo momento me fosse emprestado o livro.\nNão o li de uma vez: li aos poucos, algumas páginas de cada vez para não gastar. Acho que foi o\nlivro que me deu mais alegria naquela vida.\nEm outra vida que tive, eu era sócia de uma biblioteca popular de aluguel. Sem guia, escolhia os\nlivros pelo título. E eis que escolhi um dia um livro chamado O lobo da estepe, de Herman Hesse.\nO título me agradou, pensei tratar-se de um livro de aventuras tipo Jack London. O livro, que li\ncada vez mais deslumbrada, era de aventura sim, mas outras aventuras. E eu, que já escrevia\npequenos contos, dos 13 aos 14 anos fui germinada por Herman Hesse e comecei a escrever um\nlongo conto imitando-o: a viagem interior me fascinava. Eu havia entrado em contato com a\ngrande literatura.\nEm outra vida que tive, aos 15 anos, com o primeiro dinheiro ganho por trabalho meu, entrei altiva\nporque tinha dinheiro, numa livraria, que me pareceu o mundo onde eu gostaria de morar. Folheei\nquase todos os livros dos balcões, lia algumas linhas e passava para outro. E de repente, um dos\nlivros que abri continha frases tão diferentes que fiquei lendo, presa, ali mesmo. Emocionada, eu\npensava: mas esse livro sou eu! E, contendo um estremecimento de profunda emoção, comprei-o.\nSó então vim a saber que a autora não era anônima, sendo, ao contrário, considerada um dos\nmelhores escritores de sua época: Katherine Mansfield.\n(Disponível em <https://contobrasileiro.com.br/o-primeiro-livro-de-cada-uma-das-minhas-vidas-clarice-lispector/> Acesso em 24 abr. 2021)",
    "statement": "Leia: “E eu, que já escrevia pequenos contos, dos 13 aos 14 anos <u>fui germinada</u> por Herman Hesse\ne comecei a escrever um longo conto imitando-o: a viagem interior me fascinava.”\nA construção verbal em destaque, se escrita na voz ativa, poderia ser substituída por um sinônimo,\nprovocaria a seguinte reescrita:",
    "options": [
      {
        "letter": "A",
        "text": "“Herman Hesse foi influenciado por mim”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Herman Hesse produziu para mim”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Herman Hesse foi brotado por mim”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Herman Hesse me plantou”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Herman Hesse me inspirou”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q51",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 51,
    "readingText": "Texto 01\nSou uma pessoa muito ocupada: tomo conta do mundo. Todos os dias olho pelo terraço para o\npedaço de praia com mar, e vejo às vezes que as espumas parecem mais brancas e que às vezes\ndurante a noite as águas avançaram inquietas, vejo isso pela marca que as ondas deixaram na\nareia. Olho as amendoeiras de minha rua. Presto atenção se o céu de noite, antes de eu dormir e\ntomar conta do mundo em forma de sonho, se o céu de noite está estrelado e azul-marinho,\nporque em certas noites em vez de negro parece azul-marinho.\nO cosmos me dá muito trabalho, sobretudo porque vejo que Deus é o cosmos. Disso eu tomo\nconta com alguma relutância.\nObservo o menino de uns dez anos, vestido de trapos e macérrimo. Terá futura tuberculose, se é\nque já não a tem.\nNo Jardim Botânico, então, eu fico exaurida, tenho que tomar conta com o olhar das mil plantas e\nárvores, e sobretudo das vitórias-régias.\nQue se repare que não menciono nenhuma vez as minhas impressões emotivas: lucidamente\napenas falo de algumas das milhares de coisas e pessoas de quem eu tomo conta. Também não se\ntrata de um emprego pois dinheiro não ganho por isso. Fico apenas sabendo como é o mundo.\nSe tomar conta do mundo dá trabalho? Sim. E lembro-me de um rosto terrivelmente inexpressível\nde uma mulher que vi na rua. Tomo conta dos milhares de favelados pelas encostas acima.\nObservo em mim mesma as mudanças de estação: eu claramente mudo com elas.\nHão de me perguntar por que tomo conta do mundo: é que nasci assim, influmbida. E sou\nresponsável por tudo o que existe, inclusive pelas guerras e pelos crimes de lesa-corpo e lesa-alma. Sou inclusive responsável pelo Deus que está em constante cósmica evolução para melhor.\nTomo desde criança conta de uma fileira de formigas: elas andam em fila indiana carregando um\npedacinho de folha, o que não impede que cada uma, encontrando uma fila de formigas que venha\nde direção oposta, pare para dizer alguma coisa às outras.\nLi o livro célebre sobre as abelhas, e tomei desde então conta das abelhas, sobretudo da rainha-mãe. As abelhas voam e lidam com flores: isto eu constatei. Mas as formigas têm uma cintura\nmuito fininha. Nela, pequena, como é, cabe todo um mundo que, se eu não tomar cuidado, me\nescapa: senso instintivo de organização, linguagem para além do supersônico aos nossos ouvidos,\ne provavelmente para sentimentos instintivos de amor-sentimento, já que falam. Tomei muita coisa\ndas formigas quando era pequena, e agora, que eu queria tanto poder revê-las, não encontro uma.\nQue não houve matança delas, eu sei porque se tivesse havido eu já teria sabido.\nTomar conta do mundo exige também muita paciência: tenho que esperar pelo dia em que me\napareça uma formiga. Paciência: observar as flores imperceptivelmente e lentamente se abrindo.\nSó não encontrei ainda a quem prestar contas.\nClarice Lispector, do livro “Aprendendo a viver”. Rio de Janeiro: editora Rocco, 2004. [Crônica de\nClarice Lispector, publicada originalmente no ‘Jornal do Brasil, 4 de março de 1970]",
    "statement": "A forma verbal “Hão de me perguntar”, encontrada no texto, apresenta-se como uma locução\nverbal. Assinale, a seguir, a alternativa em que há verbo que, em tempo simples, apresenta o\nmesmo valor da expressão.",
    "options": [
      {
        "letter": "A",
        "text": "Gostaríamos de encontrar uma pessoa para cumprir a função indicada.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Dir-se-ia que estamos entrando em uma fase perigosa da pandemia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Caso tivéssemos uma boa procura, nos menteríamos no negócio de bolos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Enviamos os trabalhos ao professor durante aquela manhã.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Dar-te-ei uma nova chance de entrega do documento atrasado.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q52",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 52,
    "readingText": "Texto 01\nSou uma pessoa muito ocupada: tomo conta do mundo. Todos os dias olho pelo terraço para o\npedaço de praia com mar, e vejo às vezes que as espumas parecem mais brancas e que às vezes\ndurante a noite as águas avançaram inquietas, vejo isso pela marca que as ondas deixaram na\nareia. Olho as amendoeiras de minha rua. Presto atenção se o céu de noite, antes de eu dormir e\ntomar conta do mundo em forma de sonho, se o céu de noite está estrelado e azul-marinho,\nporque em certas noites em vez de negro parece azul-marinho.\nO cosmos me dá muito trabalho, sobretudo porque vejo que Deus é o cosmos. Disso eu tomo\nconta com alguma relutância.\nObservo o menino de uns dez anos, vestido de trapos e macérrimo. Terá futura tuberculose, se é\nque já não a tem.\nNo Jardim Botânico, então, eu fico exaurida, tenho que tomar conta com o olhar das mil plantas e\nárvores, e sobretudo das vitórias-régias.\nQue se repare que não menciono nenhuma vez as minhas impressões emotivas: lucidamente\napenas falo de algumas das milhares de coisas e pessoas de quem eu tomo conta. Também não se\ntrata de um emprego pois dinheiro não ganho por isso. Fico apenas sabendo como é o mundo.\nSe tomar conta do mundo dá trabalho? Sim. E lembro-me de um rosto terrivelmente inexpressível\nde uma mulher que vi na rua. Tomo conta dos milhares de favelados pelas encostas acima.\nObservo em mim mesma as mudanças de estação: eu claramente mudo com elas.\nHão de me perguntar por que tomo conta do mundo: é que nasci assim, influmbida. E sou\nresponsável por tudo o que existe, inclusive pelas guerras e pelos crimes de lesa-corpo e lesa-alma. Sou inclusive responsável pelo Deus que está em constante cósmica evolução para melhor.\nTomo desde criança conta de uma fileira de formigas: elas andam em fila indiana carregando um\npedacinho de folha, o que não impede que cada uma, encontrando uma fila de formigas que venha\nde direção oposta, pare para dizer alguma coisa às outras.\nLi o livro célebre sobre as abelhas, e tomei desde então conta das abelhas, sobretudo da rainha-mãe. As abelhas voam e lidam com flores: isto eu constatei. Mas as formigas têm uma cintura\nmuito fininha. Nela, pequena, como é, cabe todo um mundo que, se eu não tomar cuidado, me\nescapa: senso instintivo de organização, linguagem para além do supersônico aos nossos ouvidos,\ne provavelmente para sentimentos instintivos de amor-sentimento, já que falam. Tomei muita coisa\ndas formigas quando era pequena, e agora, que eu queria tanto poder revê-las, não encontro uma.\nQue não houve matança delas, eu sei porque se tivesse havido eu já teria sabido.\nTomar conta do mundo exige também muita paciência: tenho que esperar pelo dia em que me\napareça uma formiga. Paciência: observar as flores imperceptivelmente e lentamente se abrindo.\nSó não encontrei ainda a quem prestar contas.\nClarice Lispector, do livro “Aprendendo a viver”. Rio de Janeiro: editora Rocco, 2004. [Crônica de\nClarice Lispector, publicada originalmente no ‘Jornal do Brasil, 4 de março de 1970]",
    "statement": "Em qual das alternativas a seguir, há uma formação verbal que se comporta como impessoal.",
    "options": [
      {
        "letter": "A",
        "text": "“Que não houve matança delas (...)”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“Também não se trata de um emprego pois dinheiro não ganho por isso.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Hão de me perguntar por que tomo conta do mundo: (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Tomei muita coisa das formigas quando era pequena (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Paciência: observar as flores imperceptivelmente e lentamente se abrindo.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q53",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 53,
    "readingText": "Texto 1\nO bobo, por não se ocupar com ambições, tem tempo para ver, ouvir e tocar o mundo. O bobo é\ncapaz de ficar sentado quase sem se mexer por duas horas. Se perguntado por que não faz alguma\ncoisa, responde: “Estou fazendo. Estou pensando.” Ser bobo às vezes oferece um mundo de saída\nporque os espertos só se lembram de sair por meio da esperteza, e o bobo tem originalidade,\nespontaneamente lhe vem a ideia.\nO bobo tem oportunidade de ver coisas que os espertos não veem. Os espertos estão sempre tão\natentos às espertezas alheias que se descontraem diante dos bobos, e estes os veem como\nsimples pessoas humanas. O bobo ganha utilidade e sabedoria para viver. O bobo nunca parece\nter tido vez. No entanto, muitas vezes, o bobo é um Dostoievski.\nHá desvantagem, obviamente. Uma boba, por exemplo, confiou na palavra de um desconhecido\npara a compra de um ar refrigerado de segunda mão: ele disse que o aparelho era novo,\npraticamente sem uso porque se mudara para a Gávea onde é fresco. Vai a boba e compra o\naparelho sem vê-lo sequer. Resultado: não funciona. Chamado um técnico, a opinião deste era de\nque o aparelho estava tão estragado que o conserto seria caríssimo: mais valia comprar outro.\nMas, em contrapartida, a vantagem de ser bobo é ter boa-fé, não desconfiar, e portanto estar\ntranquilo. Enquanto o esperto não dorme à noite com medo de ser ludibriado. O esperto vence\ncom úlcera no estômago. O bobo não percebe que venceu.\nAviso: não confundir bobos com burros. Desvantagem: pode receber uma punhalada de quem\nmenos espera. É uma das tristezas que o bobo não prevê. César terminou dizendo a célebre frase:\n“Até tu, Brutus?” Bobo não reclama. Em compensação, como exclama!\nOs bobos, com todas as suas palhaçadas, devem estar todos no céu. Se Cristo tivesse sido esperto\nnão teria morrido na cruz.\nO bobo é sempre tão simpático que há espertos que se fazem passar por bobos. Ser bobo é uma\ncriatividade e, como toda criação, é difícil. Por isso é que os espertos não conseguem passar por\nbobos. Os espertos ganham dos outros. Em compensação os bobos ganham a vida. Bem-aventurados os bobos porque sabem sem que ninguém desconfie. Aliás não se importam que\nsaibam que eles sabem.\nBobo é Chagall, que põe vaca no espaço, voando por cima das casas. É quase impossível evitar\nexcesso de amor que o bobo provoca. É que só o bobo é capaz de excesso de amor. E só o amor\nfaz o bobo.\nLISPECTOR, Lispector. A descoberta do mundo. Rio de Janeiro: Rocco, 1984.",
    "statement": "Em “Há desvantagem, obviamente”, caso o verbo “haver” seja trocado pelo verbo existir, a análise\nsintática seria",
    "options": [
      {
        "letter": "A",
        "text": "verbo transitivo direto e sujeito simples.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "verbo intransitivo e sujeito inexistente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "verbo de ligação e sujeito simples.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "verbo intransitivo e sujeito simples.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "verbo transitivo direto e sujeito inexistente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q54",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 54,
    "readingText": "A solidão amiga\nA noite chegou, o trabalho acabou, é hora de voltar para casa. Lar, doce lar? Mas a casa está\nescura, a televisão apagada e tudo é silêncio. Ninguém para abrir a porta, ninguém à espera. Você\nestá só. Vem a tristeza da solidão... O que mais você deseja é não estar em solidão...\nMas deixa que eu lhe diga: sua tristeza não vem da solidão. Vem das fantasias que surgem na\nsolidão. Lembro-me de um jovem que amava a solidão: ficar sozinho, ler, ouvir, música... Assim,\naos sábados, ele se preparava para uma noite de solidão feliz. Mas bastava que ele se assentasse\npara que as fantasias surgissem. Cenas. De um lado, amigos em festas felizes, em meio ao\nfalatório, os risos, a cervejinha. Aí a cena se alterava: ele, sozinho naquela sala. Com certeza\nninguém estava se lembrando dele. Naquela festa feliz, quem se lembraria dele? E aí a tristeza\nentrava e ele não mais podia curtir a sua amiga solidão. O remédio era sair, encontrar-se com a\nturma para encontrar a alegria da festa. Vestia-se, saía, ia para a festa... Mas na festa ele percebia\nque festas reais não são iguais às festas imaginadas. Era um desencontro, uma impossibilidade de\ncompartilhar as coisas da sua solidão... A noite estava perdida.\nFaço-lhe uma sugestão: leia o livro A chama de uma vela, de Bachelard. É um dos livros mais\nsolitários e mais bonitos que jamais li. A chama de uma vela, por oposição às luzes das lâmpadas\nelétricas, é sempre solitária. A chama de uma vela cria, ao seu redor, um círculo de claridade\nmansa que se perde nas sombras. Bachelard medita diante da chama solitária de uma vela. Ao seu\nredor, as sombras e o silêncio. Nenhum falatório bobo ou riso fácil para perturbar a verdade da sua\nalma. Lendo o livro solitário de Bachelard eu encontrei comunhão. Sempre encontro comunhão\nquando o leio. As grandes comunhões não acontecem em meio aos risos da festa. Elas\nacontecem, paradoxalmente, na ausência do outro. Quem ama sabe disso. É precisamente na\nausência que a proximidade é maior. Bachelard, ausente: eu o abracei agradecido por ele assim\nme entender tão bem. Como ele observa, \"parece que há em nós cantos sombrios que toleram\napenas uma luz bruxoleante. Um coração sensível gosta de valores frágeis\". A vela solitária de\nBachelard iluminou meus cantos sombrios, fez-me ver os objetos que se escondem quando há\nmais gente na cena. E ele faz uma pergunta que julgo fundamental e que proponho a você, como\nmotivo de meditação: \"Como se comporta a Sua Solidão?\" Minha solidão? Há uma solidão que é\nminha, diferente das solidões dos outros? A solidão se comporta? Se a minha solidão se comporta,\nela não é apenas uma realidade bruta e morta. Ela tem vida.\nEntre as muitas coisas profundas que Sartre disse, essa é a que mais amo: \"Não importa o que\nfizeram com você. O que importa é o que você faz com aquilo que fizeram com você.\" Pare. Leia\nde novo. E pense. Você lamenta essa maldade que a vida está fazendo com você, a solidão. Se\nSartre está certo, essa maldade pode ser o lugar onde você vai plantar o seu jardim.\nComo é que a sua solidão se comporta? Ou, talvez, dando um giro na pergunta: Como você se\ncomporta com a sua solidão? O que é que você está fazendo com a sua solidão? Quando você a\nlamenta, você está dizendo que gostaria de se livrar dela, que ela é um sofrimento, uma doença,\numa inimiga... Aprenda isso: as coisas são os nomes que lhe damos. Se chamo minha solidão de\ninimiga, ela será minha inimiga. Mas será possível chamá la de amiga? Drummond acha que sim:\n\"Por muito tempo achei que a ausência é falta./ E lastimava, ignorante, a falta./ Hoje não a\nlastimo./ Não há falta na ausência. A ausência é um estar em mim./ E sinto-a, branca, tão pegada,\naconchegada nos meus braços,/ que rio e danço e invento exclamações alegres,/ porque a\nausência, essa ausência assimilada,/ ninguém a rouba mais de mim.!\"\nNietzsche também tinha a solidão como sua companheira. Sozinho, doente, tinha enxaquecas\nterríveis que duravam três dias e o deixavam cego. Ele tirava suas alegrias de longas caminhadas\npelas montanhas, da música e de uns poucos livros que ele amava. Eis aí três companheiras\nmaravilhosas! Vejo, frequentemente, pessoas que caminham por razões da saúde. Incapazes de\ncaminhar sozinhas, vão aos pares, aos bandos. E vão falando, falando, sem ver o mundo\nmaravilhoso que as cerca. Falam porque não suportariam caminhar sozinhas. E, por isso mesmo,\nperdem a maior alegria das caminhadas, que é a alegria de estar em comunhão com a natureza.\nElas não veem as árvores, nem as flores, nem as nuvens e nem sentem o vento. Que troca infeliz!\nTrocam as vozes do silêncio pelo falatório vulgar. Se estivessem a sós com a natureza, em silêncio,\nsua solidão tornaria possível que elas ouvissem o que a natureza tem a dizer. O estar juntos não\nquer dizer comunhão. O estar juntos, frequentemente, é uma forma terrível de solidão, um artifício\npara evitar o contato conosco mesmos. Sartre chegou ao ponto de dizer que \"o inferno é o outro.\"\nSobre isso, quem sabe, conversaremos outro dia... Mas, voltando a Nietzsche, eis o que ele\nescreveu sobre a sua solidão: \"Ó solidão! Solidão, meu lar!... Tua voz – ela me fala com ternura e\nfelicidade!”\nNão discutimos, não queixamos e muitas vezes caminhamos juntos através de portas abertas.\nPois onde quer que estás, ali as coisas são abertas e luminosas. E até mesmo as horas caminham\ncom pés saltitantes.\nAli as palavras e os tempos/poemas de todo o ser se abrem diante de mim. Ali todo ser deseja\ntransformar se em palavra, e toda mudança pede para aprender de mim a falar.\nRubem Alves. Disponível em: www.pensador.com/crônicas_de_rubem_alves/. Acessado em\n10/03/2021.",
    "statement": "Em qual das orações a seguir há representação de voz passiva no enunciado?",
    "options": [
      {
        "letter": "A",
        "text": "“Ali as palavras e os tempos/poemas de todo o ser se abrem diante de mim.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“O remédio era sair, encontrar-se com a turma para encontrar a alegria da festa.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Sobre isso, quem sabe, conversaremos outro dia...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Não discutimos, não queixamos e muitas vezes caminhamos juntos através de portas abertas.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Quando você a lamenta, você está dizendo que gostaria de se livrar dela, que ela é um sofrimento, uma doença, uma inimiga...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q55",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 55,
    "readingText": "A solidão amiga\nA noite chegou, o trabalho acabou, é hora de voltar para casa. Lar, doce lar? Mas a casa está\nescura, a televisão apagada e tudo é silêncio. Ninguém para abrir a porta, ninguém à espera. Você\nestá só. Vem a tristeza da solidão... O que mais você deseja é não estar em solidão...\nMas deixa que eu lhe diga: sua tristeza não vem da solidão. Vem das fantasias que surgem na\nsolidão. Lembro-me de um jovem que amava a solidão: ficar sozinho, ler, ouvir, música... Assim,\naos sábados, ele se preparava para uma noite de solidão feliz. Mas bastava que ele se assentasse\npara que as fantasias surgissem. Cenas. De um lado, amigos em festas felizes, em meio ao\nfalatório, os risos, a cervejinha. Aí a cena se alterava: ele, sozinho naquela sala. Com certeza\nninguém estava se lembrando dele. Naquela festa feliz, quem se lembraria dele? E aí a tristeza\nentrava e ele não mais podia curtir a sua amiga solidão. O remédio era sair, encontrar-se com a\nturma para encontrar a alegria da festa. Vestia-se, saía, ia para a festa... Mas na festa ele percebia\nque festas reais não são iguais às festas imaginadas. Era um desencontro, uma impossibilidade de\ncompartilhar as coisas da sua solidão... A noite estava perdida.\nFaço-lhe uma sugestão: leia o livro A chama de uma vela, de Bachelard. É um dos livros mais\nsolitários e mais bonitos que jamais li. A chama de uma vela, por oposição às luzes das lâmpadas\nelétricas, é sempre solitária. A chama de uma vela cria, ao seu redor, um círculo de claridade\nmansa que se perde nas sombras. Bachelard medita diante da chama solitária de uma vela. Ao seu\nredor, as sombras e o silêncio. Nenhum falatório bobo ou riso fácil para perturbar a verdade da sua\nalma. Lendo o livro solitário de Bachelard eu encontrei comunhão. Sempre encontro comunhão\nquando o leio. As grandes comunhões não acontecem em meio aos risos da festa. Elas\nacontecem, paradoxalmente, na ausência do outro. Quem ama sabe disso. É precisamente na\nausência que a proximidade é maior. Bachelard, ausente: eu o abracei agradecido por ele assim\nme entender tão bem. Como ele observa, \"parece que há em nós cantos sombrios que toleram\napenas uma luz bruxoleante. Um coração sensível gosta de valores frágeis\". A vela solitária de\nBachelard iluminou meus cantos sombrios, fez-me ver os objetos que se escondem quando há\nmais gente na cena. E ele faz uma pergunta que julgo fundamental e que proponho a você, como\nmotivo de meditação: \"Como se comporta a Sua Solidão?\" Minha solidão? Há uma solidão que é\nminha, diferente das solidões dos outros? A solidão se comporta? Se a minha solidão se comporta,\nela não é apenas uma realidade bruta e morta. Ela tem vida.\nEntre as muitas coisas profundas que Sartre disse, essa é a que mais amo: \"Não importa o que\nfizeram com você. O que importa é o que você faz com aquilo que fizeram com você.\" Pare. Leia\nde novo. E pense. Você lamenta essa maldade que a vida está fazendo com você, a solidão. Se\nSartre está certo, essa maldade pode ser o lugar onde você vai plantar o seu jardim.\nComo é que a sua solidão se comporta? Ou, talvez, dando um giro na pergunta: Como você se\ncomporta com a sua solidão? O que é que você está fazendo com a sua solidão? Quando você a\nlamenta, você está dizendo que gostaria de se livrar dela, que ela é um sofrimento, uma doença,\numa inimiga... Aprenda isso: as coisas são os nomes que lhe damos. Se chamo minha solidão de\ninimiga, ela será minha inimiga. Mas será possível chamá la de amiga? Drummond acha que sim:\n\"Por muito tempo achei que a ausência é falta./ E lastimava, ignorante, a falta./ Hoje não a\nlastimo./ Não há falta na ausência. A ausência é um estar em mim./ E sinto-a, branca, tão pegada,\naconchegada nos meus braços,/ que rio e danço e invento exclamações alegres,/ porque a\nausência, essa ausência assimilada,/ ninguém a rouba mais de mim.!\"\nNietzsche também tinha a solidão como sua companheira. Sozinho, doente, tinha enxaquecas\nterríveis que duravam três dias e o deixavam cego. Ele tirava suas alegrias de longas caminhadas\npelas montanhas, da música e de uns poucos livros que ele amava. Eis aí três companheiras\nmaravilhosas! Vejo, frequentemente, pessoas que caminham por razões da saúde. Incapazes de\ncaminhar sozinhas, vão aos pares, aos bandos. E vão falando, falando, sem ver o mundo\nmaravilhoso que as cerca. Falam porque não suportariam caminhar sozinhas. E, por isso mesmo,\nperdem a maior alegria das caminhadas, que é a alegria de estar em comunhão com a natureza.\nElas não veem as árvores, nem as flores, nem as nuvens e nem sentem o vento. Que troca infeliz!\nTrocam as vozes do silêncio pelo falatório vulgar. Se estivessem a sós com a natureza, em silêncio,\nsua solidão tornaria possível que elas ouvissem o que a natureza tem a dizer. O estar juntos não\nquer dizer comunhão. O estar juntos, frequentemente, é uma forma terrível de solidão, um artifício\npara evitar o contato conosco mesmos. Sartre chegou ao ponto de dizer que \"o inferno é o outro.\"\nSobre isso, quem sabe, conversaremos outro dia... Mas, voltando a Nietzsche, eis o que ele\nescreveu sobre a sua solidão: \"Ó solidão! Solidão, meu lar!... Tua voz – ela me fala com ternura e\nfelicidade!”\nNão discutimos, não queixamos e muitas vezes caminhamos juntos através de portas abertas.\nPois onde quer que estás, ali as coisas são abertas e luminosas. E até mesmo as horas caminham\ncom pés saltitantes.\nAli as palavras e os tempos/poemas de todo o ser se abrem diante de mim. Ali todo ser deseja\ntransformar se em palavra, e toda mudança pede para aprender de mim a falar.\nRubem Alves. Disponível em: www.pensador.com/crônicas_de_rubem_alves/. Acessado em",
    "statement": "10/03/2021.\nNo penúltimo parágrafo do texto, o autor escolhe a forma “estás” em lugar de “estejas”, que\natenderia à norma culta. Essa escolha, no âmbito do texto, justifica-se porque o autor",
    "options": [
      {
        "letter": "A",
        "text": "não aceita o posicionamento passivo das pessoas na situação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "indica a certeza de que as pessoas não estão na situação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "entende que as pessoas querem mudar sua situação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "não indica dúvida da noção de estar, mas certeza.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "não acredita que as pessoas estarão na situação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q56",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 56,
    "readingText": "Texto I\nFigura o anúncio em um jornal que o amigo me mandou, e está assim redigido:\nÀ procura de uma besta. – A partir de 6 de outubro do ano cadente, sumiu-me uma besta\nvermelho-escura com os seguintes característicos: calçada e ferrada de todos os membros\nlocomotores, um pequeno quisto na base da orelha direita e crina dividida em duas seções em\nconsequência de um golpe, cuja extensão pode alcançar de quatro a seis centímetros, produzido\npor jumento.\nEssa besta, muito domiciliada nas cercanias deste comércio, é muito mansa e boa de sela, e tudo\nme induz ao cálculo de que foi roubada, assim que hão sido falhas todas as indagações.\nQuem, pois, apreendê-la em qualquer parte e a fizer entregue aqui ou pelo menos notícia exata\nministrar, será razoavelmente remunerado. Itambé do Mato Dentro, 19 de novembro de 1899. (a)\nJoão Alves Júnior.\nCinquenta e cinco anos depois, prezado João Alves Júnior, tua besta vermelho-escura, mesmo\nque tenha aparecido, já é pó no pó. E tu mesmo, se não estou enganado, repousas suavemente no\npequeno cemitério de Itambé. Mas teu anúncio continua um modelo no gênero, se não para ser\nimitado, ao menos como objeto de admiração literária.\nReparo antes de tudo na limpeza de tua linguagem. Não escreveste apressada e toscamente,\ncomo seria de esperar de tua condição rural. Pressa, não a tiveste, pois o animal desapareceu a 6\nde outubro, e só a 19 de novembro recorreste à Cidade de Itabira. Antes, procedeste a\nindagações. Falharam. Formulaste depois um raciocínio: houve roubo. Só então pegaste da pena,\ne traçaste um belo e nítido retrato da besta.\nNão disseste que todos os seus cascos estavam ferrados; preferiste dizê-lo “de todos os seus\nmembros locomotores”. Nem esqueceste esse pequeno quisto na orelha e essa divisão da crina\nem duas seções, que teu zelo naturalista e histórico atribuiu com segurança a um jumento.\nPor ser “muito domiciliada nas cercanias deste comércio”, isto é, do povoado e sua feirinha\nsemanal, inferiste que não teria fugido, mas antes foi roubada. Contudo, não oafirmas em tom\nperemptório: “tudo me induz a esse cálculo”. Revelas aí a prudência mineira, que não avança (ou\nnão avançava) aquilo que não seja a evidência mesma. É cálculo, raciocínio, operação mental e\ndesapaixonada como qualquer outra, e não denúncia formal.\nFinalmente – deixando de lado outras excelências de tua prosa útil – a declaração final: quem a\napreender ou pelo menos “notícia exata ministrar”, será “razoavelmente remunerado”. Não\nprometes recompensa tentadora; não fazes praça de generosidade ou largueza; acenas com o\nrazoável, com a justa medida das coisas, que deve prevalecer mesmo no caso de bestas perdidas\ne entregues.\nJá é muito tarde para sairmos à procura de tua besta, meu caro João Alves do Itambé; entretanto\nessa criação volta a existir, porque soubeste descrevê-la com decoro e propriedade, num dia\nremoto, e o jornal a guardou e alguém hoje a descobre, e muitos outros são informados da\nocorrência. Se lesses os anúncios de objetos e animais perdidos, na imprensa de hoje, ficarias\ntriste. Já não há essa precisão de termos e essa graça no dizer, nem essa moderação nem essa\natitude crítica. Não há, sobretudo, esse amor à tarefa bem-feita, que se pode manifestar até\nmesmo num anúncio de besta sumida.\n(Carlos Drummond de Andrade. Fala, amendoeira, 2012.)",
    "statement": "Assinale a opção a seguir em que a voz verbal seja a mesma da encontrada no trecho apresentado.\nNão há, sobretudo, esse amor à tarefa bem-feita, <u>que se pode manifestar até mesmo num</u>\nanúncio de besta sumida.",
    "options": [
      {
        "letter": "A",
        "text": "Vive-se ao ar livre, come-se ao ar livre, dorme-se ao ar livre.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Foi-se feliz demais durante aquele tempo casados.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Devem-se manifestar todas as opiniões sobre um assunto antes da conclusão.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Encontrou-se com o amigo depois de muitos anos da conclusão dos estudos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Abraçaram-se longamente depois daquele tempo todo de pandemia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q57",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 57,
    "statement": "Assinale, a seguir, o enunciado em que há um verbo com dupla complementação.",
    "options": [
      {
        "letter": "A",
        "text": "Roubaram-lhe a carteira na viagem de trem.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Compramos muitos livros durante o período da pandemia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Eles viraram rapidamente para a esquerda em busca do professor.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Ele se transformou rapidamente em um estudante exemplar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Eles enviaram-me, rapidamente, os exercícios para a correção.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q58",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 58,
    "readingText": "Crianças precisam de educação física, mesmo fora da escola\nFalta de atividades estruturadas, seja por causa do isolamento social ou das férias, contribuem\npara o sedentarismo\nCollin A. Webster, traduzido por Nexo\nQuando notei que meu filho de 12 anos passava cerca de sete horas por dia fazendo seus deveres\nescolares online devido à pandemia da covid-19, me preocupei de imediato. Como pesquisador\ncom foco em ‘como tornar as crianças mais ativas fisicamente’, eu sabia que meu filho e seus\ncolegas de classe estavam sedentários por muito tempo.\nSer fisicamente ativo é bom para a saúde física e mental de todos, incluindo crianças de todas as\nidades e habilidades.\nCrianças mais ativas fisicamente tendem a obter notas melhores e a desenvolver a autoconfiança\nque poderá capacitá-las a ter sucesso mais tarde em suas vidas.\nNo caso de pessoas com deficiências, a atividade física pode ajudá-las a obter certa\nindependência.\nA chegada das férias de verão (no hemisfério norte) diminui um pouco as preocupações dos pais\nsobre os filhos estarem sedentários demais. Lembro das férias de verão como uma pausa bem-vinda ao hábito de ficar sentado o dia inteiro na escola e estar confinado a um ambiente fechado.\nNo entanto, o inverso pode acabar sendo verdadeiro para muitas crianças atualmente.\nNos EUA, um estudo com 18.170 crianças pequenas mostrou que a parcela das que são obesas\naumenta de 8,9% para 11,5% entre o jardim de infância e a segunda série. Este aumento em geral\nocorre durante o verão, e não quando as crianças estão na escola.\nPesquisadores acham que a falta de atividades estruturadas no verão pode levar crianças a\nfazerem escolhas pouco saudáveis. Essa ideia é reforçada por uma publicação de 37 estudos\nrevelando que crianças são menos ativas nos finais de semana do que nos dias de aulas escolares.\nPesquisas também apontam que as crianças passam mais tempo em frente às telas no verão do\nque durante o ano letivo.\nO Departamento de Saúde e Serviços Humanos americano recomenda que crianças e\nadolescentes passem pelo menos uma hora por dia correndo, andando de bicicleta ou fazendo\nqualquer atividade física. No entanto, de acordo com o Centro de Controle e Prevenção de\nDoenças (CDC), apenas uma em cada quatro crianças entre 6 e 17 anos estava cumprindo essa\nrecomendação antes da pandemia.\nMesmo crianças que participam de esportes organizados podem não estar atingindo os 60\nminutos de atividade por dia prescritos. Um estudo descobriu que crianças em ligas de futebol-bandeira (uma variação menos violenta do futebol americano) passavam apenas 20 minutos se\nexercitando durante os treinos em equipe. Essa descoberta é bastante consistente em outros\nesportes também, como futebol e basquete, onde não mais da metade do tempo de treino era\ndedicada à prática de exercícios físicos.\nO nível de atividade física despenca quando as crianças chegam ao ensino fundamental, não\nfazendo muita diferença se elas estão em equipes competitivas ou não. Um estudo em San Diego\ndescobriu que crianças entre 11 e 14 anos gastam um total de sete minutos a menos em atividade\nfísica, do que crianças entre 7 e 10 anos, durante práticas esportivas.\nAinda assim, crianças e adolescentes gastam em torno de oito horas por dia em ocupações como\nassistir a TV, usar smartphones e jogar videogame.(...)\nNo geral, a maioria dos sistemas escolares não estava fazendo o suficiente para manter as crianças\nem forma antes da covid-19 dar início a meses de aprendizado remoto improvisado. O CDC deu\nàs escolas uma nota D- por seus esforços nessa frente.\nEm resumo, a grande maioria das crianças precisa gastar mais tempo sendo ativa tanto na escola\nquanto em casa. O tempo adicional gasto nas aulas de educação física aumenta a capacidade dos\nalunos de aprender as habilidades para se manterem ativos quando adultos.\nA educação física oferece às crianças mais do que apenas exercícios, e é por isso que atividades\ncomo banda marcial e até esportes coletivos são, na minha opinião, um substituto ruim para a\ndisciplina.\nNo ensino infantil, a educação física deveria apoiar principalmente o desenvolvimento de\nhabilidades motoras fundamentais, como pular, chutar, arremessar e receber, que são essenciais\npara uma grande variedade de atividades, como a maioria dos esportes coletivos, dança e\nginástica. Crianças que dominarem essas habilidades quando pequenas serão mais ativas\nfisicamente do que aquelas que não.\nOs programas de educação física dos ensinos fundamental e médio deveriam focar em manter as\ncrianças motivadas a permanecerem ativas. Como os adolescentes são mais motivados a serem\nfisicamente ativos quando sentem que estão no controle de seu aprendizado, é preciso dar-lhes\nautonomia para escolher o que fazer. Como crianças diferentes têm interesses diferentes, o\ncurrículo de educação física deveria abranger não apenas esportes coletivos, mas também\natividades que demandam menos participantes, como tênis e golfe.\nEstudantes de todos os níveis de ensino deveriam ter oportunidades para desenvolver suas\naptidões físicas, especialmente sua resistência aeróbica, força muscular e flexibilidade.\n(...)\nNunca esqueça disso: a atividade física é um hábito e a forma física é uma condição (adquirida\ncomo consequência). Nenhum dos dois é sinônimo de educação física, mas um bom programa\najudará a promover ambos. Collin A. Webster é reitor da Faculdade de Educação Associada para\nPesquisa e Inovação e professor de educação física da Universidade da Carolina do Sul\n(Disponível em <https://www.nexojornal.com.br/externo/2020/06/05/Crian%C3%A7as-precisam-de-educa%C3%A7%C3%A3o-f%C3%ADsica-mesmo-fora-da-escola> Acesso em 09\njun. 2021)",
    "statement": "Assinale a opção em que se encontra uma oração na voz passiva.",
    "options": [
      {
        "letter": "A",
        "text": "Essa ideia é reforçada por uma publicação de 37 estudos revelando que crianças são menos ativas nos finais de semana do que nos dias de aulas escolares.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Mesmo crianças que participam de esportes organizados podem não estar atingindo os 60 minutos de atividade por dia prescritos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Um estudo descobriu que crianças em ligas de futebol-bandeira (uma variação menos violenta do futebol americano) passavam apenas 20 minutos se exercitando durante os treinos em equipe.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O tempo adicional gasto nas aulas de educação física aumenta a capacidade dos alunos de aprender as habilidades para se manterem ativos quando adultos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "O CDC deu às escolas uma nota D- por seus esforços nessa frente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q59",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 59,
    "statement": "Assinale, a seguir, o enunciado em que o verbo “haver” poderia sofrer concordância de número\ncom o sujeito.",
    "options": [
      {
        "letter": "A",
        "text": "Havia estudado muito durante todo aquele ano.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Há mil anos que não vejo a minha família de Portugal.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Deve haver muito cuidado com a saúde durante a pandemia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Havia muita vacina a ser aplicada ainda no Brasil.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Haja vista a sentença do juiz, podemos seguir para o recurso.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q60",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 60,
    "statement": "A transposição da voz passiva para a ativa em “E as notícias foram agrupadas em cinco grandes\ncategorias: negócios e dinheiro, saúde, ciência e tecnologia, esportes e mundo” está correta na\nalternativa:",
    "options": [
      {
        "letter": "A",
        "text": "Agrupou as notícias em cinco grandes categorias: negócios e dinheiro, saúde, ciência e tecnologia, esportes e mundo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Agrupou-se, em cinco grandes categorias, as notícias: negócios e dinheiro, saúde, ciência e tecnologia, esportes e mundo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "As notícias agruparam-se em cinco grandes categorias: negócios e dinheiro, saúde, ciência e tecnologia, esportes e mundo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Agruparam-se as notícias em cinco grandes categorias: negócios e dinheiro, saúde, ciência e tecnologia, esportes e mundo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Agruparam as notícias em cinco grandes categorias: negócios e dinheiro, saúde, ciência e tecnologia, esportes e mundo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q61",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 61,
    "readingText": "Uma Galinha\nClarice Lispector\nEra uma galinha de domingo. Ainda viva porque não passava de nove horas da manhã.\nParecia calma. Desde sábado encolhera-se num canto da cozinha. Não olhava para ninguém,\nninguém olhava para ela. Mesmo quando a escolheram, apalpando sua intimidade com\nindiferença, não souberam dizer se era gorda ou magra. Nunca se adivinharia nela um anseio.\nFoi pois uma surpresa quando a viram abrir as asas de curto vôo, inchar o peito e, em dois ou três\nlances, alcançar a murada do terraço. Um instante ainda vacilou — o tempo da cozinheira dar um\ngrito — e em breve estava no terraço do vizinho, de onde, em outro vôo desajeitado, alcançou um\ntelhado. Lá ficou em adorno deslocado, hesitando ora num, ora noutro pé. A família foi chamada\ncom urgência e consternada viu o almoço junto de uma chaminé. O dono da casa, lembrando-se\nda dupla necessidade de fazer esporadicamente algum esporte e de almoçar, vestiu radiante um\ncalção de banho e resolveu seguir o itinerário da galinha: em pulos cautelosos alcançou o telhado\nonde esta, hesitante e trêmula, escolhia com urgência outro rumo. A perseguição tornou-se mais\nintensa. De telhado a telhado foi percorrido mais de um quarteirão da rua. Pouco afeita a uma luta\nmais selvagem pela vida, a galinha tinha que decidir por si mesma os caminhos a tomar, sem\nnenhum auxílio de sua raça. O rapaz, porém, era um caçador adormecido. E por mais ínfima que\nfosse a presa o grito de conquista havia soado.\nSozinha no mundo, sem pai nem mãe, ela corria, arfava, muda, concentrada. Às vezes, na fuga,\npairava ofegante num beiral de telhado e enquanto o rapaz galgava outros com dificuldade tinha\ntempo de se refazer por um momento.\nE então parecia tão livre.\nEstúpida, tímida e livre. Não vitoriosa como seria um galo em fuga. Que é que havia nas suas\nvísceras que fazia dela um ser? A galinha é um ser. É verdade que não se poderia contar com ela\npara nada. Nem ela própria contava consigo, como o galo crê na sua crista. Sua única vantagem é\nque havia tantas galinhas que morrendo uma surgiria no mesmo instante outra tão igual como se\nfora a mesma.\nAfinal, numa das vezes em que parou para gozar sua fuga, o rapaz alcançou-a. Entre gritos e\npenas, ela foi presa. Em seguida carregada em triunfo por uma asa através das telhas e pousada no\nchão da cozinha com certa violência.\nAinda tonta, sacudiu-se um pouco, em cacarejos roucos e indecisos. Foi então que aconteceu. De\npura afobação a galinha pôs um ovo. Surpreendida, exausta. Talvez fosse prematuro. Mas logo\ndepois, nascida que fora para a maternidade, parecia uma velha mãe habituada. Sentou-se sobre o\novo e assim ficou, respirando, abotoando e desabotoando os olhos. Seu coração, tão pequeno\nnum prato, solevava e abaixava as penas, enchendo de tepidez aquilo que nunca passaria de um\novo. Só a menina estava perto e assistiu a tudo estarrecida. Mal porém conseguiu desvencilhar-se\ndo acontecimento, despregou-se do chão e saiu aos gritos:\n— Mamãe, mamãe, não mate mais a galinha, ela pôs um ovo! ela quer o nosso bem!\nTodos correram de novo à cozinha e rodearam mudos a jovem parturiente. Esquentando seu filho,\nesta não era nem suave nem arisca, nem alegre, nem triste, não era nada, era uma galinha. O que\nnão sugeria nenhum sentimento especial. O pai, a mãe e a filha olhavam já há algum tempo, sem\npropriamente um pensamento qualquer. Nunca ninguém acariciou uma cabeça de galinha. O pai\nafinal decidiu-se com certa brusquidão:\n— Se você mandar matar esta galinha nunca mais comerei galinha na minha vida!\n— Eu também! jurou a menina com ardor. A mãe, cansada, deu de ombros.\nInconsciente da vida que lhe fora entregue, a galinha passou a morar com a família. A menina, de\nvolta do colégio, jogava a pasta longe sem interromper a corrida para a cozinha. O pai de vez em\nquando ainda se lembrava: “E dizer que a obriguei a correr naquele estado!” A galinha tornara-se a\nrainha da casa. Todos, menos ela, o sabiam. Continuou entre a cozinha e o terraço dos fundos,\nusando suas duas capacidades: a de apatia e a do sobressalto.\nMas quando todos estavam quietos na casa e pareciam tê-la esquecido, enchia-se de uma\npequena coragem, resquícios da grande fuga — e circulava pelo ladrilho, o corpo avançando atrás\nda cabeça, pausado como num campo, embora a pequena cabeça a traísse: mexendo-se rápida e\nvibrátil, com o velho susto de sua espécie já mecanizado.\nUma vez ou outra, sempre mais raramente, lembrava de novo a galinha que se recortara contra o\nar à beira do telhado, prestes a anunciar. Nesses momentos enchia os pulmões com o ar impuro\nda cozinha e, se fosse dado às fêmeas cantar, ela não cantaria mas ficaria muito mais contente.\nEmbora nem nesses instantes a expressão de sua vazia cabeça se alterasse. Na fuga, no descanso,\nquando deu à luz ou bicando milho — era uma cabeça de galinha, a mesma que fora desenhada\nno começo dos séculos.\nAté que um dia mataram-na, comeram-na e passaram-se anos.\nTexto extraído do livro “Laços de Família”, Editora Rocco — Rio de Janeiro, 1998, pág. 30.\nSelecionado por Ítalo Moriconi, figura na publicação “Os Cem Melhores Contos Brasileiros do\nSéculo”.",
    "statement": "Assinale a opção em que o termo destacado exerce a função de partícula apassivadora.",
    "options": [
      {
        "letter": "A",
        "text": "Desde sábado encolhera-<u>se</u> num canto da cozinha",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "O dono da casa, lembrando-<u>se</u> da dupla necessidade de fazer esporadicamente algum esporte e de almoçar (...)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "A perseguição tornou-<u>se</u> mais intensa.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "<u>Se</u> você mandar matar esta galinha nunca mais comerei galinha na minha vida!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Até que um dia mataram-na, comeram-na e passaram-<u>se</u> anos.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q62",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 62,
    "readingText": "TEXTO 2\nO que explica nosso fascínio com Frankenstein, 200 anos após sua criação?\nLucy Todd, BBC\n3 janeiro 2018\nOs filmes de terror estabeleceram a ideia de Frankenstein como a história de um monstro\nassassino e irracional criado pelo homem. Mas a criação de Shelley era bem diferente.\nShelley lida com os mesmos temas tratados pelos gregos”, diz Patricia MacCormack, professora\nde Filosofia da Universidade Anglia Ruskin, no Reino Unido, e autora de estudos sobre obras de\nterror.\n“As boas versões cinematográficas trazem a mesma visão crítica sobre a vida, a nossa busca por\npropósito e os papéis que desempenhamos. O monstro não escolheu existir e questiona sua\nprópria existência: ‘Como me torno uma boa pessoa?’”\nNa obra original, o cientista Victor Frankenstein dá vida a uma criatura com nuances, sensível e\ncuriosa. MacCormack diz que o monstro lida com as mais fundamentais questões humanas: “é a\nideia de perguntar ao seu criador qual é seu propósito. Por que estamos aqui? O que podemos\nfazer?”. (...)\nO romance de Shelley contém elementos fantásticos e de horror, e a combinação deles que\ntornam a história um sucesso.\n“Ele nos fascina porque fala da relação entre vida e morte”, diz Sorcha Ni Fhlainn, palestrante de\nEstudos de Cinema da Universidade Metropolitana de Manchester, no Reino Unido, e integrante\ndo Centro de Estudos Góticos de Manchester.\n“A morte é absoluta. Então, a ideia de que você pode reanimar a carne é ao mesmo tempo\nchocante e arrebatadora.”\n(Disponível em: <https://www.bbc.com/portuguese/geral42537245> Acesso em 26 mai. 2020)",
    "statement": "O trecho “Na obra original, o cientista Victor Frankenstein dá vida a uma criatura com nuances,\nsensível e curiosa” pode ser inteiramente reescrito, na <u>voz passiva,</u> em",
    "options": [
      {
        "letter": "A",
        "text": "Na obra original, dá-se vida a uma criatura com nuances, sensível e curiosa, pelo cientista Victor Frankenstein.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "A uma criatura com nuances, sensível e curiosa é dada vida, na obra original, pelo cientista Victor Frankenstein.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Ao cientista Victor Frankenstein, é dada vida a uma criatura com nuances, sensível e curiosa, na obra original",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O cientista Victor Frankenstein dá-se vida a uma criatura com nuances, sensível e curiosa, na obra original.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q63",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 63,
    "readingText": "Texto 2\nA Cartomante (Fragmento)\nHamlet observa a Horácio que há mais cousas no céu e na terra do que sonha a nossa filosofia. Era\na mesma explicação que dava a bela Rita ao moço Camilo, numa sexta-feira de novembro de 1869,\nquando este ria dela, por ter ido na véspera consultar uma cartomante; a diferença é que o fazia\npor outras palavras.\n— Ria, ria. Os homens são assim; não acreditam em nada. Pois saiba que fui, e que ela adivinhou o\nmotivo da consulta, antes mesmo que eu lhe dissesse o que era. Apenas começou a botar as\ncartas, disse-me: \"A senhora gosta de uma pessoa...\" Confessei que sim, e então ela continuou a\nbotar as cartas, combinou-as, e no fim declarou-me que eu tinha medo de que você me\nesquecesse, mas que não era verdade...\n— Errou! interrompeu Camilo, rindo.\n— Não diga isso, Camilo. Se você soubesse como eu tenho andado, por sua causa. Você sabe; já\nlhe disse. Não ria de mim, não ria...\nCamilo pegou-lhe nas mãos, e olhou para ela sério e fixo. Jurou que lhe queria muito, que os seus\nsustos pareciam de criança; em todo o caso, quando tivesse algum receio, a melhor cartomante\nera ele mesmo. Depois, repreendeu-a; disse-lhe que era imprudente andar por essas casas. Vilela\npodia sabê-lo, e depois...\n— Qual saber! tive muita cautela, ao entrar na casa.\n— Onde é a casa?\n— Aqui perto, na Rua da Guarda Velha; não passava ninguém nessa ocasião. Descansa; eu não sou maluca.\n(DE ASSIS, Machado. Obra Completa. Rio de Janeiro: Nova Aguilar 1994. v. II.)",
    "statement": "O verbo “observa”, no primeiro período do texto, pode ser entendido como:",
    "options": [
      {
        "letter": "A",
        "text": "um verbo que indica desconhecimento da vida por parte de Horácio.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "um verbo que indica um conselho sobre a vida de Horácio.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "um verbo que indica uma ordem do primeiro ao segundo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "um verbo que indica a ideia que ambos observam o céu.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "um verbo que indica que Hamlet explica algo a Horácio.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q64",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 64,
    "readingText": "Texto II\nFolia agigantada\nDiante do maior Carnaval de sua história, São Paulo precisa cuidar da organização\nSão Paulo prepara-se para ser palco do maior Carnaval de rua de sua história. Pela primeira vez, a\ncidade, que já foi apelidada de “túmulo do samba”, terá desfiles em todas as suas 32\nsubprefeituras.\nTambém em número de blocos, a folia promete expansão inédita. Os números são preliminares,\nmas as 490 agremiações do ano passado deverão ser largamente suplantadas – o aumento\nprevisto é de 70%.\nNovas atrações também animarão a festa, como o famoso Galo da Madrugada, de Pernambuco.\nLevantamentos preliminares sugerem que a capital paulista poderá ser o principal destino turístico\ndo país durante os festejos, suplantando Rio de Janeiro e Salvador. Com isso, projeta-se aumento\nda circulação de dinheiro, em favor de hotéis, bares, comércio etc.\nNo cenário animador, um certo clima de ufanismo parece contagiar quadros da prefeitura, que\ntem em seus membros um carnavalesco conhecido – o secretário de Cultura, Alê Youssef,\nfundador do bloco Acadêmicos do Baixo Augusta.\nYoussef, que representa uma face mais progressista do governo municipal, vê no Carnaval\ntambém um meio de manifestação política – que, aliás, se potencializa em ano eleitoral. O\nsecretário já declarou que pretende fazer com que a festa seja um contraponto a ameaças à\nliberdade de expressão.\nA expansão do Carnaval de rua é um fenômeno que se observa há anos em diversas cidades. No\nRio, por exemplo, os blocos começaram a reconquistar as ruas a partir da primeira década do\nséculo. O retorno do que seria um tipo mais autêntico de comemoração provocou simpatias e\nelogios da população e de cronistas da festa.\nCom o tempo, contudo, a outra face do crescimento da folia foi-se mostrando problemática – a\ninsuficiência de banheiros públicos, o aumento de furtos, o trânsito interrompido, as áreas\nprotegidas ocupadas por blocos não autorizados e o excesso de barulho.\nA Prefeitura de São Paulo afirma que reestruturou o planejamento do evento com vistas a diminuir\nos transtornos. Ao longo de 37 reuniões, os trajetos passaram pelo crivo de diversos órgãos, como\nCET, SPTrans (responsável pelos ônibus), polícia e GCM (Guarda Civil Metropolitana). Medidas\nem outras áreas também foram anunciadas.\nCabe às autoridades, agora, fazer com que a propalada reorganização saia do papel e garanta à\ncidade e a seus moradores um padrão aceitável de funcionamento.\nhttps://www1.folha.uol.com.br/opiniao/2020/02/folia-agigantada.shtml?origin=folha",
    "statement": "A organização discursiva passa pela escolha adequada dos tempos verbais. As formas verbais\n“sugerem” (4º parágrafo) e “parece” (5º parágrafo) indicam:",
    "options": [
      {
        "letter": "A",
        "text": "uma ação simultânea que aconteceu num tempo passado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "uma ação que ocorreu antes de outra ação passada.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "uma ação ocorrida no passado, porém não foi completamente concluída.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "uma ação já concluída, tendo o seu início e o seu fim no passado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "uma ação que ocorre simultaneamente à fala.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q65",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 65,
    "readingText": "Mulher na Marinha\nA data de 7 de julho é um dia de júbilo para a Marinha do Brasil, com a comemoração do\nAniversário de Ingresso das Mulheres em suas fileiras. Como resultado da visão e do empenho do\nentão Ministro de Estado da Marinha, Almirante de Esquadra Maximiano Eduardo da Silva\nFonseca, ao se alinhar aos anseios da sociedade brasileira e à crescente participação da mulher no\nmercado de trabalho, foi promulgada a Lei n° 6.807, de 7 de julho de 1980, criando o Corpo\nAuxiliar Feminino da Reserva da Marinha (CAFRM), marco inicial e pioneiro da participação da\nmulher nas Forças Armadas brasileiras.\nA Lei nº 9.519, de 26 de novembro de 1997, que reestruturou os Corpos e Quadros de Oficiais e\nPraças da Marinha, além de extinguir o CAFRM, ampliou significativamente a participação da\nmulher nas atividades da Força Naval. Em consequência, outrora pertencente a um único Corpo\nAuxiliar, as Oficiais e Praças da Marinha do Brasil (MB) passaram a prestar serviços no Corpo de\nIntendentes da Marinha (IM), no Corpo de Engenheiros da Marinha (EN), nos Quadros do Corpo\nde Saúde da Marinha, nos Quadros Técnico e Auxiliar da Armada do Corpo Auxiliar da Marinha,\nno Corpo Auxiliar de Praças e no Quadro de Músicos do Corpo de Praças de Fuzileiros Navais.\nEm novembro de 2012, foi assinada a promoção da primeira mulher a ocupar um cargo de Oficial\nGeneral das Forças Armadas Brasileiras, a Contra-Almirante (Md) Dalva Maria Carvalho Mendes.\nAssim, a MB reafirmou seu pioneirismo, pois foi também a primeira Força que admitiu mulheres\nmilitares em seus quadros.\nComo parte do contínuo processo de atualização e aprimoramento da administração do seu\npessoal, a Força Naval admitiu, em 2014, a primeira turma de Aspirantes femininas da Escola\nNaval.\nForam 12 vagas específicas para o Corpo de IM, destinadas a candidatas com idade entre 18 e 23\nanos, que tivessem concluído o ensino médio.\nAlém da formação profissional-militar, as Aspirantes recebem aulas de Educação Física e, de\nacordo com seu desempenho, podem integrar uma das várias equipes esportivas, como: esgrima,\nvela, remo, vôlei, basquete, orientação, atletismo, judô e tiro. As futuras Oficiais poderão participar,\nainda, de diversos grêmios, como: línguas, xadrez, comunicações, aviação, mergulho, música,\nfotografia, etc.\nAo final do curso, foram declaradas Guardas-Marinha e embarcaram no Navio-Escola “Brasil”,\nonde realizaram uma viagem de instrução de duração aproximada de seis meses, durante a qual,\ncomplementaram sua formação profissional e cultural, tendo a oportunidade de visitar países das\nAméricas, Europa, percorrendo os Oceanos Atlântico e Pacífico, e o Mar Mediterrâneo.\nApós o regresso da viagem de instrução, as Guardas-Marinha foram nomeadas Oficiais – no posto\nde 2º Tenente – e designadas para exercerem atividades nas diversas Organizações Militares da\nMB distribuídas ao longo de todo o território nacional.\nPor meio do Memorando n° 1, de 10 de abril de 2017, o então Comandante da Marinha, Almirante\nde Esquadra Eduardo Bacellar Leal Ferreira, decidiu ampliar a participação de Oficiais e Praças\nfemininas em atividades de aplicação efetiva do Poder Naval, autorizando o embarque em navios\ne unidades de tropa. Dessa forma, as Oficiais passarão a ingressar nos Corpos da Armada (CA) e\nde Fuzileiros Navais (CFN), a partir da Escola Naval, além de fazerem parte do Corpo de\nIntendentes da Marinha (CIM), opção já aceita. As Praças femininas, também, poderão fazer parte\ndo Corpo de Praças da Armada, o que permitirá o embarque em meios do Setor Operativo.\nO Edital de 2018 trouxe vagas específicas para as mulheres. Ingressando na Escola Naval no ano\nde 2019, ao início do 3° ano letivo, elas farão a opção de curso e habilitação, de acordo com sua\nordem de classificação obtida no segundo ano letivo.\nAo longo dos anos, a participação das mulheres foi sendo ampliada para diversas áreas de atuação,\nincluindo a Direção de importantes Organizações Militares. Com equilíbrio e competência, a\nmulher marinheira vem consolidando cada vez mais sua participação nos diversos Corpos e\nQuadros dos Oficiais e Praças da Marinha do Brasil, contribuindo, sobremaneira, para o\ncumprimento das mais variadas tarefas da nossa Força, com maior eficiência e eficácia.\nhttps://www.marinha.mil.br/mulher-na-marinha",
    "statement": "Marque a alternativa que apresenta predicado verbo-nominal:",
    "options": [
      {
        "letter": "A",
        "text": "“...as Aspirantes recebem aulas de Educação Física e, de acordo com seu desempenho, podem integrar uma das várias equipes esportivas...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“As futuras Oficiais poderão participar, ainda, de diversos grêmios, como: línguas, xadrez, comunicações, aviação, mergulho, música, fotografia, etc.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "...onde realizaram uma viagem de instrução de duração aproximada de seis meses''",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Após o regresso da viagem de instrução, as Guardas-Marinha foram nomeadas Oficiais – no posto de 2º Tenente – e designadas para exercerem atividades nas diversas Organizações Militares da MB.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "“...o então Comandante da Marinha, Almirante de Esquadra Eduardo Bacellar Leal Ferreira, decidiu ampliar a participação de Oficiais e Praças femininas em atividades de aplicação efetiva do Poder Naval.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q66",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 66,
    "readingText": "Mulher na Marinha\nA data de 7 de julho é um dia de júbilo para a Marinha do Brasil, com a comemoração do\nAniversário de Ingresso das Mulheres em suas fileiras. Como resultado da visão e do empenho do\nentão Ministro de Estado da Marinha, Almirante de Esquadra Maximiano Eduardo da Silva\nFonseca, ao se alinhar aos anseios da sociedade brasileira e à crescente participação da mulher no\nmercado de trabalho, foi promulgada a Lei n° 6.807, de 7 de julho de 1980, criando o Corpo\nAuxiliar Feminino da Reserva da Marinha (CAFRM), marco inicial e pioneiro da participação da\nmulher nas Forças Armadas brasileiras.\nA Lei nº 9.519, de 26 de novembro de 1997, que reestruturou os Corpos e Quadros de Oficiais e\nPraças da Marinha, além de extinguir o CAFRM, ampliou significativamente a participação da\nmulher nas atividades da Força Naval. Em consequência, outrora pertencente a um único Corpo\nAuxiliar, as Oficiais e Praças da Marinha do Brasil (MB) passaram a prestar serviços no Corpo de\nIntendentes da Marinha (IM), no Corpo de Engenheiros da Marinha (EN), nos Quadros do Corpo\nde Saúde da Marinha, nos Quadros Técnico e Auxiliar da Armada do Corpo Auxiliar da Marinha,\nno Corpo Auxiliar de Praças e no Quadro de Músicos do Corpo de Praças de Fuzileiros Navais.\nEm novembro de 2012, foi assinada a promoção da primeira mulher a ocupar um cargo de Oficial\nGeneral das Forças Armadas Brasileiras, a Contra-Almirante (Md) Dalva Maria Carvalho Mendes.\nAssim, a MB reafirmou seu pioneirismo, pois foi também a primeira Força que admitiu mulheres\nmilitares em seus quadros.\nComo parte do contínuo processo de atualização e aprimoramento da administração do seu\npessoal, a Força Naval admitiu, em 2014, a primeira turma de Aspirantes femininas da Escola\nNaval.\nForam 12 vagas específicas para o Corpo de IM, destinadas a candidatas com idade entre 18 e 23\nanos, que tivessem concluído o ensino médio.\nAlém da formação profissional-militar, as Aspirantes recebem aulas de Educação Física e, de\nacordo com seu desempenho, podem integrar uma das várias equipes esportivas, como: esgrima,\nvela, remo, vôlei, basquete, orientação, atletismo, judô e tiro. As futuras Oficiais poderão participar,\nainda, de diversos grêmios, como: línguas, xadrez, comunicações, aviação, mergulho, música,\nfotografia, etc.\nAo final do curso, foram declaradas Guardas-Marinha e embarcaram no Navio-Escola “Brasil”,\nonde realizaram uma viagem de instrução de duração aproximada de seis meses, durante a qual,\ncomplementaram sua formação profissional e cultural, tendo a oportunidade de visitar países das\nAméricas, Europa, percorrendo os Oceanos Atlântico e Pacífico, e o Mar Mediterrâneo.\nApós o regresso da viagem de instrução, as Guardas-Marinha foram nomeadas Oficiais – no posto\nde 2º Tenente – e designadas para exercerem atividades nas diversas Organizações Militares da\nMB distribuídas ao longo de todo o território nacional.\nPor meio do Memorando n° 1, de 10 de abril de 2017, o então Comandante da Marinha, Almirante\nde Esquadra Eduardo Bacellar Leal Ferreira, decidiu ampliar a participação de Oficiais e Praças\nfemininas em atividades de aplicação efetiva do Poder Naval, autorizando o embarque em navios\ne unidades de tropa. Dessa forma, as Oficiais passarão a ingressar nos Corpos da Armada (CA) e\nde Fuzileiros Navais (CFN), a partir da Escola Naval, além de fazerem parte do Corpo de\nIntendentes da Marinha (CIM), opção já aceita. As Praças femininas, também, poderão fazer parte\ndo Corpo de Praças da Armada, o que permitirá o embarque em meios do Setor Operativo.\nO Edital de 2018 trouxe vagas específicas para as mulheres. Ingressando na Escola Naval no ano\nde 2019, ao início do 3° ano letivo, elas farão a opção de curso e habilitação, de acordo com sua\nordem de classificação obtida no segundo ano letivo.\nAo longo dos anos, a participação das mulheres foi sendo ampliada para diversas áreas de atuação,\nincluindo a Direção de importantes Organizações Militares. Com equilíbrio e competência, a\nmulher marinheira vem consolidando cada vez mais sua participação nos diversos Corpos e\nQuadros dos Oficiais e Praças da Marinha do Brasil, contribuindo, sobremaneira, para o\ncumprimento das mais variadas tarefas da nossa Força, com maior eficiência e eficácia.\nhttps://www.marinha.mil.br/mulher-na-marinha",
    "statement": "A transposição da voz ativa da oração “que reestruturou os Corpos e Quadros de Oficiais e Praças\nda Marinha” (2º parágrafo) para a passiva resulta no seguinte:",
    "options": [
      {
        "letter": "A",
        "text": "que os Corpos e Quadros de Oficiais e Praças da Marinha reestruturou-se",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "as quais foram reestruturadas pelos Corpos e Quadros de Oficiais e Praças da Marinha.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "que serão reestruturados pelos Corpos e Quadros de Oficiais e Praças da Marinha.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "pela qual foram reestruturados os Corpos e Quadros de Oficiais e Praças da Marinha.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "onde acabam sendo reestruturados os Corpos e Quadros de Oficiais e Praças da Marinha.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q67",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 67,
    "readingText": "Mulher na Marinha\nA data de 7 de julho é um dia de júbilo para a Marinha do Brasil, com a comemoração do\nAniversário de Ingresso das Mulheres em suas fileiras. Como resultado da visão e do empenho do\nentão Ministro de Estado da Marinha, Almirante de Esquadra Maximiano Eduardo da Silva\nFonseca, ao se alinhar aos anseios da sociedade brasileira e à crescente participação da mulher no\nmercado de trabalho, foi promulgada a Lei n° 6.807, de 7 de julho de 1980, criando o Corpo\nAuxiliar Feminino da Reserva da Marinha (CAFRM), marco inicial e pioneiro da participação da\nmulher nas Forças Armadas brasileiras.\nA Lei nº 9.519, de 26 de novembro de 1997, que reestruturou os Corpos e Quadros de Oficiais e\nPraças da Marinha, além de extinguir o CAFRM, ampliou significativamente a participação da\nmulher nas atividades da Força Naval. Em consequência, outrora pertencente a um único Corpo\nAuxiliar, as Oficiais e Praças da Marinha do Brasil (MB) passaram a prestar serviços no Corpo de\nIntendentes da Marinha (IM), no Corpo de Engenheiros da Marinha (EN), nos Quadros do Corpo\nde Saúde da Marinha, nos Quadros Técnico e Auxiliar da Armada do Corpo Auxiliar da Marinha,\nno Corpo Auxiliar de Praças e no Quadro de Músicos do Corpo de Praças de Fuzileiros Navais.\nEm novembro de 2012, foi assinada a promoção da primeira mulher a ocupar um cargo de Oficial\nGeneral das Forças Armadas Brasileiras, a Contra-Almirante (Md) Dalva Maria Carvalho Mendes.\nAssim, a MB reafirmou seu pioneirismo, pois foi também a primeira Força que admitiu mulheres\nmilitares em seus quadros.\nComo parte do contínuo processo de atualização e aprimoramento da administração do seu\npessoal, a Força Naval admitiu, em 2014, a primeira turma de Aspirantes femininas da Escola\nNaval.\nForam 12 vagas específicas para o Corpo de IM, destinadas a candidatas com idade entre 18 e 23\nanos, que tivessem concluído o ensino médio.\nAlém da formação profissional-militar, as Aspirantes recebem aulas de Educação Física e, de\nacordo com seu desempenho, podem integrar uma das várias equipes esportivas, como: esgrima,\nvela, remo, vôlei, basquete, orientação, atletismo, judô e tiro. As futuras Oficiais poderão participar,\nainda, de diversos grêmios, como: línguas, xadrez, comunicações, aviação, mergulho, música,\nfotografia, etc.\nAo final do curso, foram declaradas Guardas-Marinha e embarcaram no Navio-Escola “Brasil”,\nonde realizaram uma viagem de instrução de duração aproximada de seis meses, durante a qual,\ncomplementaram sua formação profissional e cultural, tendo a oportunidade de visitar países das\nAméricas, Europa, percorrendo os Oceanos Atlântico e Pacífico, e o Mar Mediterrâneo.\nApós o regresso da viagem de instrução, as Guardas-Marinha foram nomeadas Oficiais – no posto\nde 2º Tenente – e designadas para exercerem atividades nas diversas Organizações Militares da\nMB distribuídas ao longo de todo o território nacional.\nPor meio do Memorando n° 1, de 10 de abril de 2017, o então Comandante da Marinha, Almirante\nde Esquadra Eduardo Bacellar Leal Ferreira, decidiu ampliar a participação de Oficiais e Praças\nfemininas em atividades de aplicação efetiva do Poder Naval, autorizando o embarque em navios\ne unidades de tropa. Dessa forma, as Oficiais passarão a ingressar nos Corpos da Armada (CA) e\nde Fuzileiros Navais (CFN), a partir da Escola Naval, além de fazerem parte do Corpo de\nIntendentes da Marinha (CIM), opção já aceita. As Praças femininas, também, poderão fazer parte\ndo Corpo de Praças da Armada, o que permitirá o embarque em meios do Setor Operativo.\nO Edital de 2018 trouxe vagas específicas para as mulheres. Ingressando na Escola Naval no ano\nde 2019, ao início do 3° ano letivo, elas farão a opção de curso e habilitação, de acordo com sua\nordem de classificação obtida no segundo ano letivo.\nAo longo dos anos, a participação das mulheres foi sendo ampliada para diversas áreas de atuação,\nincluindo a Direção de importantes Organizações Militares. Com equilíbrio e competência, a\nmulher marinheira vem consolidando cada vez mais sua participação nos diversos Corpos e\nQuadros dos Oficiais e Praças da Marinha do Brasil, contribuindo, sobremaneira, para o\ncumprimento das mais variadas tarefas da nossa Força, com maior eficiência e eficácia.\nhttps://www.marinha.mil.br/mulher-na-marinha",
    "statement": "Marque a alternativa que indica corretamente o emprego da locução verbal “vem consolidando”\nno último parágrafo do texto:",
    "options": [
      {
        "letter": "A",
        "text": "ação passada anterior a outra.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "ação que se iniciou no passado e continua até o presente.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "ação em desenvolvimento no passado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "ação pontual no passado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "início de ação no passado, mas que já foi finalizada.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q68",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 68,
    "readingText": "No entanto, era preciso precaver-se contra essas amarras do passado...",
    "statement": "A respeito do verbo <u>precaver-se,</u> é correto afirmar que se trata de verbo",
    "options": [
      {
        "letter": "A",
        "text": "defectivo, uma vez que só se conjuga nas formas arrizotônicas.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "regular, com conjugação seguindo o padrão dos verbos da segunda conjugação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "irregular, com conjugação seguindo o padrão de ver, por ser dele derivado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "defectivo, já que não possui somente a primeira pessoa do presente do Indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "defectivo, visto que só se conjuga nas formas rizotônicas.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q69",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 69,
    "statement": "No período composto \"Da mesma maneira que não existem progressos sem esforços, não existe\nciência sem educação.\", o verbo <u>existir</u> está no presente do indicativo. Considere sua reescritura a\nseguir, bem como a substituição do tempo verbal pelo pretérito perfeito do indicativo e assinale,\nentão, a opção que completa as lacunas corretamente.\n\"Assim como nunca ________ progressos sem esforços, nunca _______ ciência sem educação.\"",
    "options": [
      {
        "letter": "A",
        "text": "existiriam / existiu",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "existe / existirá",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "existiam / existiriam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "existira / existe",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "existiram / existiu",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q70",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 70,
    "statement": "Marque a alternativa em que o verbo destacado está na voz passiva pronominal.",
    "options": [
      {
        "letter": "A",
        "text": "As informações transmitidas pelos grandes meios de comunicação não <u>são recebidas</u> de forma automática e da mesma maneira por todos os telespectadores.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "A síntese e as conclusões que um indivíduo vai realizar depois de assistir a uma novela não <u>podem ser antecipadas</u> por outros meios.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Os diversos tipos de receptor <u>situam-se</u> numa complexa rede de telecomunicação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Diante da situação, <u>fomentou-se</u> a crença de que a televisão seria capaz de manipular de forma incondicionalmente uma audiência submissa, passiva e acrítica.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "A mídia é definida no contexto atual como uma complexa rede de referências em que a comunicação interpessoal e a midiática <u>se completam</u> e transformam.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q71",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 71,
    "statement": "Quando há falta de certa precisão quanto aos tempos, utilizam-se algumas locuções verbais que\ntraduzem mais adequadamente o aspecto verbal. Diante disso, a construção que expressa melhor\n<u>a noção de início de uma ação</u> aparece no fragmento da alternativa",
    "options": [
      {
        "letter": "A",
        "text": "Puseram-se então a analisar cada um aquilo que teria de fazer no navio, ou seja, a manutenção da estrutura interna; instrumentos de orientação para a navegação, astronomia, meteorologia; as velas, as cordas, as polias e roldanas, além dos mastros, o leme e os parafusos.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "As embarcações e a própria navegação em si têm sido uma das mais poderosas imagens na mente dos escritores.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Não posso nem pensar na missão das escolas, as quais começam com as crianças e continuam com os cientistas, como outra que não a da realização do dito do poeta.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Os navegadores, pobres estruturas, chamados a dar o seu palpite, ficaram em silêncio diante da situação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Dessa forma, para navegar não basta acreditar. É preciso entender. São muitos os ensinamentos necessários para se concretizar esse fenômeno.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q72",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 72,
    "statement": "Qual das alternativas abaixo apresenta a forma verbal destacada com o mesmo tempo e modo\nque a destacada no período:\n\"No entanto, não se exala o mesmo ar, mesmo que já se <u>possa</u> ver o outro.”",
    "options": [
      {
        "letter": "A",
        "text": "Naquele momento, pude presenciar, ao vivo, uma cena que já me <u>tinham descrito</u> sobre aquele rapaz.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Ao serem postos nessa situação, talvez <u>acabassem</u> por argumentar algo a respeito do assunto.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "O compartilhamento do mesmo espaço social, <u>diria,</u> é que nos proporciona a internet.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Aquele medo que lhe está tirando a tranquilidade talvez não <u>seja</u> fácil como os outros pensam.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "E, assim, terminou a reunião, uma vez que nos <u>tornamos</u> merecedores da confiança um do outro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q73",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 73,
    "statement": "Assinale a alternativa correta em relação à forma verbal destacada.",
    "options": [
      {
        "letter": "A",
        "text": "Os alfaiates <u>embanham</u> os ternos com rapidez.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Tendo em vista os riscos, eu <u>ópto</u> por não realizar a prova.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "As alunas <u>interviram</u> na discussão entre os diretores.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "As mulheres <u>aguam</u> as orquídeas diariamente pela manhã.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Eu <u>remedeio</u> minhas ansiedades com uma boa corrida matinal.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q74",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 74,
    "readingText": "Um dia de procissão foi sempre nesta cidade um dia de grande festa, de lufa-lufa, de movimento e\nde agitação; e se ainda é hoje o que os nossos leitores bem sabem, na época em que viveram as\npersonagens desta história a coisa subia de ponto; enchiam-se as ruas de povo, especialmente de\nmulheres de mantilha; armavam-se as casas, penduravam-se às janelas magníficas colchas de\nseda, de damasco de todas as cores, e armavam-se coretos em quase todos os cantos.\n(Memórias de um sargento de milícias, Manuel Antonio de Almeida)",
    "statement": "Leia atentamente e assinale a alternativa correta.\nAs formas verbais predominantes do texto indicam que a situação relatada",
    "options": [
      {
        "letter": "A",
        "text": "ocorria de modo cotidiano no passado.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "ocorreu de modo pontual no passado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "indica um passado muito distante.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "projeta uma situação hipotética.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "indica um desejo passado do narrador.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q75",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 75,
    "readingText": "Cumpre-nos agora dizer alguma coisa a respeito de uma personagem que representará no correr\ndesta história um importante papel, e que o leitor apenas conhece, porque nela tocamos de\npassagem no primeiro capítulo: é a comadre, a parteira que, como dissemos, servira de madrinha\nao nosso memorando.\nEra a comadre uma mulher baixa, excessivamente gorda, bonachona, ingênua ou tola até um certo\nponto, e finória até outro; vivia do oficio de parteira, que adotara por curiosidade, e benzia de\nquebranto; todos a conheciam por muito beata e pela mais desabrida papa-missas da cidade. Era a\nfolhinha mais exata de todas as festas religiosas que aqui se faziam; sabia de cor os dias em que se\ndizia missa em tal ou tal igreja, como a hora e até o nome do padre; era pontual à ladainha, ao\nterço, à novena, ao setenário; não lhe escapava via-sacra, procissão, nem sermão; trazia o tempo\nhabilmente distribuído e as horas combinadas, de maneira que nunca lhe aconteceu chegar à\nigreja e achar já a missa no altar. De madrugada começava pela missa da Lapa; apenas acabava ia\nà das 8 na Sé, e daí saindo pilhava ainda a das 9 em Santo Antônio. O seu traje habitual era, como\no de todas as mulheres da sua condição e esfera, uma saia de lila preta, que se vestia sobre um\nvestido qualquer, um lenço branco muito teso e engomado ao pescoço, outro na cabeça, um\nrosário pendurado no cós da saia, um raminho de arruda atrás da orelha, tudo isto coberto por uma\nclássica mantilha, junto à renda da qual se pregava uma pequena figa de ouro ou de osso. Nos dias\ndúplices, em vez de lenço à cabeça, o cabelo era penteado, e seguro por um enorme pente\ncravejado de crisólitas.\n(Memórias de um sargento de milícias, Manuel Antonio de Almeida)",
    "statement": "Assinale a única alternativa que apresenta uma construção na voz passiva.",
    "options": [
      {
        "letter": "A",
        "text": "Era a comadre uma mulher baixa, excessivamente gorda",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Era a folhinha mais exata de todas as festas religiosas",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "era pontual à ladainha, ao terço, à novena, ao setenário",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O seu traje habitual era, como o de todas as mulheres da sua condição e esfera, uma saia de lila preta",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "em vez de lenço à cabeça, o cabelo era penteado, e seguro por um enorme pente cravejado de crisólitas.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q76",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 76,
    "readingText": "Texto 1\n**DISCURSO SOBRE A SERVIDÃO VOLUNTÁRIA**\nQuero para já, se possível, esclarecer tão-somente o fato de tantos homens, tantas vilas, cidades e\nnações suportarem às vezes um tirano que não tem outro poder de prejudicá-los enquanto eles\nquiserem suportá-lo; que só lhes pode fazer mal enquanto eles preferem aguentá-lo a contrariá-lo.\nDigno de espanto, se bem que vulgaríssimo, e tão doloroso quanto impressionante, é ver milhões\nde homens a servir, miseravelmente curvados ao peso do jugo, esmagados não por uma força\nmuito grande, mas aparentemente dominados e encantados apenas pelo nome de um só homem\ncujo poder não deveria assustá-los, visto que é um só, e cujas qualidades não deveriam prezar\nporque os trata desumana e cruelmente.\nTal é a fraqueza humana: temos frequentemente de nos curvar perante a força, somos obrigados a\ncontemporizar, não podemos ser sempre os mais fortes.\nSe, portanto, uma nação é pela força da guerra obrigada a servir a um só, como a cidade de\nAtenas aos trinta tiranos, não nos espanta que ela se submeta; devemos antes lamentá-la; ou\nentão, não nos espantarmos nem lamentarmos mas sofrermos com paciência e esperarmos que o\nfuturo traga dias mais felizes.\nEstá na nossa natureza o deixarmos que os deveres da amizade ocupem boa parte da nossa vida.\nÉ justo amarmos a virtude, estimarmos as boas ações, ficarmos gratos aos que fazem o bem,\nrenunciarmos a certas comodidades para melhor honrarmos e favorecermos aqueles a quem\namamos e que o merecem. Assim também, quando os habitantes de um país encontram uma\npersonagem notável que dê provas de ter sido previdente a governá-los, arrojado a defendê-los e\ncuidadoso a guiá-los, passam a obedecer-lhe em tudo e a conceder-lhe certas prerrogativas; é\numa prática reprovável, porque vão acabar por afastá-lo da prática do bem e empurrá-lo para o\nmal. Mas em tais casos julga-se que poderá vir sempre bem e nunca mal de quem um dia nos fez\nbem.\n(...)\nMas parece que vos sentis felizes por serdes senhores apenas de metade dos vossos haveres, das\nvossas famílias e das vossas vidas; e todo esse estrago, essa desgraça, essa ruína provêm afinal\nnão dos seus inimigos, mas de um só inimigo, daquele mesmo cuja grandeza lhe é dada só por vós,\npor amor de quem marchais corajosamente para a guerra, por cuja grandeza não recusais entregar\nà morte as vossas próprias pessoas.\nEsse que tanto vos humilha tem só dois olhos e duas mãos, tem um só corpo e nada possui que o\nmais ínfimo entre os ínfimos habitantes das vossas cidades não possua também; uma só coisa ele\ntem mais do que vós e o poder de vos destruir, poder que vós lhe concedestes.\nOnde iria ele buscar os olhos com que vos espia se vós não lhos désseis?\nOnde teria ele mãos para vos bater se não tivesse as vossas?\nOs pés com que ele esmaga as vossas cidades de quem são se não vossos?\nQue poder tem ele sobre vós que de vós não venha?\nComo ousaria ele perseguir-vos sem a vossa própria conivência?\nQue poderia ele fazer se vós não **fôsseis** encobridores daquele que vos rouba, cúmplices do\nassassino que vos mata e traidores de vós mesmos?\nDE LA BOETIE, Etienne**. Discurso sobre a servidão voluntária.** São Paulo: Edipro, 2017.\nObserve o trecho do texto 1 abaixo destacado:\nQue poderia ele fazer se vós não **fôsseis** encobridores daquele que vos rouba, cúmplices do\nassassino que vos mata e traidores de vós mesmos? (linhas 36 e 37)",
    "statement": "A forma verbal **fôsseis**, destacada no trecho acima,",
    "options": [
      {
        "letter": "A",
        "text": "fala de algo que é incerto.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "expressa uma relação de condição.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "indica ideia de ordem ou determinação.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "introduz um pedido formal.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "trata de acontecimentos hipotéticos do futuro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q77",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 77,
    "readingText": "TEXTO 01\nFelicidade clandestina\nEla era gorda, baixa, sardenta e de cabelos excessivamente crespos, meio arruivados. Tinha um\nbusto enorme; enquanto nós todas ainda éramos achatadas. Como se não bastasse, enchia os dois\nbolsos da blusa, por cima do busto, com balas. Mas possuía o que qualquer criança devoradora de\nhistórias gostaria de ter: um pai dono de livraria.\nPouco aproveitava. E nós menos ainda: até para aniversário, em vez de pelo menos um livrinho\nbarato, ela nos entregava em mãos um cartão-postal da loja do pai. Ainda por cima era de\npaisagem do Recife mesmo, onde morávamos, com suas pontes mais do que vistas. Atrás escrevia\ncom letra bordadíssima palavras como \"data natalícia\" e \"saudade\".\nMas que talento tinha para a crueldade. Ela toda era pura vingança, chupando balas com barulho.\nComo essa menina devia nos odiar, nós que éramos imperdoavelmente bonitinhas, esguias,\naltinhas, de cabelos livres. Comigo exerceu com calma ferocidade o seu sadismo. Na minha ânsia\nde ler, eu nem notava as humilhações a que ela me submetia: continuava a implorar-lhe\nemprestados os livros que ela não lia.\nAté que veio para ela o magno dia de começar a exercer sobre mim uma tortura chinesa. Como\ncasualmente, informou-me que possuía “As reinações de Narizinho\", de Monteiro Lobato.\nEra um livro grosso, meu Deus, era um livro para se ficar vivendo com ele, comendo-o, dormindo-o. E completamente acima de minhas posses. Disse-me que eu passasse pela sua casa no dia\nseguinte e que ela o emprestaria.\nAté o dia seguinte eu me transformei na própria esperança da alegria: eu não vivia, eu nadava\ndevagar num mar suave, as ondas me levavam e me traziam.\nNo dia seguinte fui à sua casa, literalmente correndo. Ela não morava num sobrado como eu, e sim\nnuma casa. Não me mandou entrar. Olhando bem para meus olhos, disse-me que havia\nemprestado o livro a outra menina, e que eu voltasse no dia seguinte para buscá-lo. Boquiaberta,\nsaí devagar, mas em breve a esperança de novo me tomava toda e eu recomeçava na rua a andar\npulando, que era o meu modo estranho de andar pelas ruas de Recife. Dessa vez nem caí: guiava\nme a promessa do livro, o dia seguinte viria, os dias seguintes seriam mais tarde a minha vida\ninteira, o amor pelo mundo me esperava, andei pulando pelas ruas como sempre e não caí\nnenhuma vez.\nMas não ficou simplesmente nisso. O plano secreto da filha do dono de livraria era tranquilo e\ndiabólico. No dia seguinte lá estava eu à porta de sua casa, com um sorriso e o coração batendo.\nPara ouvir a resposta calma: o livro ainda não estava em seu poder, que eu voltasse no dia\nseguinte. Mal sabia eu como mais tarde, no decorrer da vida, o drama do \"dia seguinte\" com ela ia\nse refletir com meu coração batendo.\nE assim continuou. Quanto tempo? Não sei. Ela sabia que era tempo indefinido, enquanto o fel não\nescorresse todo de seu corpo grosso. Eu já começara a adivinhar que ela me escolhera para eu\nsofrer, às vezes adivinho. Mas, adivinhando mesmo, às vezes aceito: como se quem quer me fazer\nsofrer esteja precisando danadamente que eu sofra.\nQuanto tempo? Eu ia diariamente à sua casa, sem faltar um dia sequer. Às vezes ela dizia: pois o\nlivro esteve comigo ontem de tarde, mas você só veio de manhã, de modo que o emprestei a\noutra menina. E eu, que não era dada a olheiras, sentia as olheiras se cavando sob os meus olhos\nespantados.\nAté que um dia, quando eu estava à porta de sua casa, ouvindo humilde e silenciosa a sua recusa,\napareceu sua mãe. Ela devia estar estranhando a aparição muda e diária daquela menina à porta de\nsua casa. Pediu explicações a nós duas. Houve uma confusão silenciosa, entrecortada de palavras\npouco elucidativas. A senhora achava cada vez mais estranho o fato de não estar entendendo. Até\nque essa mãe boa entendeu. Voltou-se para a filha e com enorme surpresa exclamou: mas este\nlivro nunca saiu daqui de casa e você nem quis ler!\nE o pior para essa mulher não era a descoberta do que acontecia. Devia ser a descoberta\nhorrorizada da filha que tinha. Ela nos espiava em silêncio: a potência de perversidade de sua filha\ndesconhecida e a menina loura em pé à porta, exausta, ao vento das ruas de Recife. Foi então que,\nfinalmente se refazendo, disse firme e calma para a filha: você vai emprestar o livro agora mesmo.\nE para mim: \"E você fica com o livro por quanto tempo quiser.\" Entendem? Valia mais do que me\ndar o livro: \"pelo tempo que eu quisesse\" é tudo o que uma pessoa, grande ou pequena, pode ter a\nousadia de querer.\nComo contar o que se seguiu? Eu estava estonteada, e assim recebi o livro na mão. Acho que eu\nnão disse nada. Peguei o livro. Não, não saí pulando como sempre. Saí andando bem devagar. Sei\nque segurava o livro grosso com as duas mãos, comprimindo-o contra o peito. Quanto tempo levei\naté chegar em casa, também pouco importa. Meu peito estava quente, meu coração pensativo.\nChegando em casa, não comecei a ler. Fingia que não o tinha, só para depois ter o susto de o ter.\nHoras depois abri-o, li algumas linhas maravilhosas, fechei-o de novo, fui passear pela casa, adiei\nainda mais indo comer pão com manteiga, fingi que não sabia onde guardara o livro, achava-o,\nabria-o por alguns instantes. Criava as mais falsas dificuldades para aquela coisa clandestina que\nera a felicidade. A felicidade sempre iria ser clandestina para mim. Parece que eu já pressentia.\nComo demorei! Eu vivia no ar... Havia orgulho e pudor em mim. Eu era uma rainha delicada.\nÀs vezes sentava-me na rede, balançando-me com o livro aberto no colo, sem tocá-lo, em êxtase\npuríssimo.\nNão era mais uma menina com um livro: era uma mulher com o seu amante.\nLISPECTOR, Clarice. O Primeiro Beijo. São Paulo: Ed. Ática, 1996",
    "statement": "Leia o trecho a seguir.\n“Olhando bem para meus olhos, disse-me que <u>havia emprestado</u> o livro a outra menina, e que eu\nvoltasse no dia seguinte para buscá-lo.\" (7°§)\nNa frase acima, a forma verbal sublinhada constitui um tempo verbal composto. Marque a opção\nque apresenta o mesmo tempo verbal, mas na forma simples.",
    "options": [
      {
        "letter": "A",
        "text": "Carlos dera um presente de aniversário para seu filho.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Meu amigo comprou um carro novo sem contar a ninguém.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Os atletas correm por esta rua devido ao pouco movimento.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Os jogadores estavam exaustos ao final da partida.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "O repórter gostaria de uma entrevista com o Senhor, chefe.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q78",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 78,
    "readingText": "O homem deve reencontrar o Paraíso...\nRubem Alves\nEra uma família grande, todos amigos. Viviam como todos nós: moscas presas na enorme teia de\naranha que é a vida da cidade. Todos os dias a aranha lhes arrancava um pedaço. Ficaram\ncansados. Resolveram mudar de vida: um sonho louco: navegar! Um barco, o mar, o céu, as\nestrelas, os horizontes sem fim: liberdade. Venderam o que tinham, compraram um barco capaz de\natravessar mares e sobreviver tempestades.\nMas para navegar não basta sonhar. É preciso saber. São muitos os saberes necessários para se\nnavegar. Puseram-se então a estudar cada um aquilo que teria de fazer no barco: manutenção do\ncasco, instrumentos de navegação, astronomia, meteorologia, as velas, as cordas, as polias e\nroldanas, os mastros, o leme, os parafusos, o motor, o radar, o rádio, as ligações elétricas, os\nmares, os mapas... Disse certo o poeta: Navegar é preciso, a ciência da navegação é saber preciso,\nexige aparelhos, números e medições. Barcos se fazem com precisão, astronomia se aprende com\no rigor da geometria, velas se fazem com saberes exatos sobre tecidos, cordas e ventos,\ninstrumentos de navegação não informam mais ou menos. Assim, eles se tomaram cientistas,\nespecialistas, cada um na sua - juntos para navegar.\nChegou então o momento da grande decisão - para onde navegar. Um sugeria as geleiras do sul\ndo Chile, outro os canais dos fiordes da Noruega, um outro queria conhecer os exóticos mares e\npraias das ilhas do Pacífico, e houve mesmo quem quisesse navegar nas rotas de Colombo. E foi\nentão que compreenderam que, quando o assunto era a escolha do destino, as ciências que\nconheciam para nada serviam.\nDe nada valiam números, tabelas, gráficos, estatísticas. Os computadores, coitados, chamados a\ndar o seu palpite, ficaram em silêncio. Os computadores não têm preferências - falta-lhes essa sutil\ncapacidade de gostar, que é a essência da vida humana. Perguntados sobre o porto de sua\nescolha, disseram que não entendiam a pergunta, que não lhes importava para onde se estava\nindo.\nSe os barcos se fazem com ciência, a navegação faz-se com os sonhos. Infelizmente a ciência,\nutilíssima, especialista em saber como as coisas funcionam, tudo ignora sobre o coração humano.\nE preciso sonhar para se decidir sobre o destino da navegação. Mas o coração humano, lugar dos\nsonhos, ao contrário da ciência, é coisa imprecisa. Disse certo o poeta: Viver não é preciso.\nPrimeiro vem o impreciso desejo. Primeiro vem o impreciso desejo de navegar. Só depois vem a\nprecisa ciência de navegar.\nNaus e navegação têm sido uma das mais poderosas imagens na mente dos poetas. Ezra Pound\ninicia seus Cânticos dizendo: E pois com a nau no mar/assestamos a quilha contra as vagas...\nCecília Meireles: Foi, desde sempre, o mar! A solidez da terra, monótona/parece-nos fraca ilusão!\nQueremos a ilusão do grande mar/multiplicada em suas malhas de perigo. E Nietzsche: Amareis a\nterra de vossos filhos, terra não descoberta, no mar mais distante. Que as vossas velas não se\ncansem de procurar esta terra! O nosso leme nos conduz para a terra dos nossos filhos... Viver é\nnavegar no grande mar!\nNão só os poetas: C. Wright Mills, um sociólogo sábio, comparou a nossa civilização a uma galera\nque navega pelos mares. Nos porões estão os remadores. Remam com precisão cada vez maior. A\ncada novo dia recebem remos novos, mais perfeitos. O ritmo das remadas acelera. Sabem tudo\nsobre a ciência do remar. A galera navega cada vez mais rápido. Mas, perguntados sobre o porto\ndo destino, respondem os remadores: O porto não nos importa. O que importa é a velocidade com\nque navegamos.\nC. Wright Mills usou esta metáfora para descrever a nossa civilização por meio duma imagem\nplástica: multiplicam-se os meios técnicos e científicos ao nosso dispor, que fazem com que as\nmudanças sejam cada vez mais rápidas; mas não temos ideia alguma de para onde navegamos.\nPara onde? Somente um navegador louco ou perdido navegaria sem ter ideia do para onde. Em\nrelação à vida da sociedade, ela contém a busca de uma utopia. Utopia, na linguagem comum, é\nusada como sonho impossível de ser realizado. Mas não é isso. Utopia é um ponto inatingível que\nindica uma direção.\nMário Quintana explicou a utopia com um verso: Se as coisas são inatingíveis... ora!/Não é motivo\npara não querê-las... Que tristes os caminhos, se não fora/ A mágica presença das estrelas! Karl\nMannheim, outro sociólogo sábio que poucos leem, já na década de 1920 diagnosticava a doença\nda nossa civilização: Não temos consciência de direções, não escolhemos direções. Faltam-nos\nestrelas que nos indiquem o destino.\nHoje, ele dizia, as únicas perguntas que são feitas, determinadas pelo pragmatismo da tecnologia\n(o importante é produzir o objeto) e pelo objetivismo da ciência (o importante é saber como\nfunciona), são: Como posso fazer tal coisa? Como posso resolver este problema concreto\nparticular? E conclui: E em todas essas perguntas sentimos o eco otimista: não preciso de me\npreocupar com o todo, ele tomará conta de si mesmo.\nEm nossas escolas é isso que se ensina: a precisa ciência da navegação, sem que os estudantes\nsejam levados a sonhar com as estrelas. A nau navega veloz e sem rumo. Nas universidades, essa\ndoença assume a forma de peste epidêmica: cada especialista se dedica, com paixão e\ncompetência, a fazer pesquisas sobre o seu parafuso, sua polia, sua vela, seu mastro.\nDizem que seu dever é produzir conhecimento. Se forem bem-sucedidas, suas pesquisas serão\npublicadas em revistas internacionais. Quando se lhes pergunta: Para onde seu barco está\nnavegando?, eles respondem: Isso não é científico. Os sonhos não são objetos de conhecimento\ncientífico...\nE assim ficam os homens comuns abandonados por aqueles que, por conhecerem mares e\nestrelas, lhes poderiam mostrar o rumo. Não posso pensar a missão das escolas, começando com\nas crianças e continuando com os cientistas, como outra que não a da realização do dito do poeta:\nNavegar é preciso. Viver não é preciso.\nÉ necessário ensinar os precisos saberes da navegação enquanto ciência. Mas é necessário\napontar com imprecisos sinais para os destinos da navegação: A terra dos filhos dos meus filhos, no\nmar distante... Na verdade, a ordem verdadeira é a inversa. Primeiro, os homens sonham com\nnavegar. Depois aprendem a ciência da navegação. E inútil ensinar a ciência da navegação a quem\nmora nas montanhas...\nO meu sonho para a educação foi dito por Bachelard: O universo tem um destino de felicidade. O\nhomem deve reencontrar o Paraíso. O paraíso é jardim, lugar de felicidade, prazeres e alegrias para\nos homens e mulheres. Mas há um pesadelo que me atormenta: o deserto. Houve um momento\nem que se viu, por entre as estrelas, um brilho chamado progresso. Está na bandeira nacional... E,\nquilha contra as vagas, a galera navega em direção ao progresso, a uma velocidade cada vez\nmaior, e ninguém questiona a direção. E assim que as florestas são destruídas, os rios se\ntransformam em esgotos de fezes e veneno, o ar se enche de gases, os campos se cobrem de lixo\n- e tudo ficou feio e triste.\nSugiro aos educadores que pensem menos nas tecnologias do ensino - psicologias e quinquilharias\n- e tratem de sonhar, com os seus alunos, sonhos de um Paraíso.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nAssinale a alternativa em que a forma verbal sublinhada tem um valor significativo, nocional.",
    "options": [
      {
        "letter": "A",
        "text": "Todos os dias a aranha lhes arrancava um pedaço. <u>Ficaram</u> cansados.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Assim, eles <u>se tornaram</u> cientistas, especialistas, cada um na sua - juntos para navegar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Os computadores, coitados, chamados a dar o seu palpite, <u>ficaram</u> em silêncio",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Nos porões <u>estão</u> os remadores. Remam com precisão cada vez maior.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "(...) os rios se transformam em esgotos de fezes e veneno, o ar se enche de gases, os campos se cobrem de lixo - e tudo <u>ficou</u> feio e triste.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q79",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 79,
    "readingText": "Leitura - leituras: quando ler (bem) é preciso\n\"[...]. Alguns leitores ao lerem estas frases (poesia citada) não compreenderam logo. Creio mesmo\nque é impossível compreender inteiramente à primeira leitura pensamentos assim esquematizados\nsem uma certa prática.\"\n(Mário de Andrade - Artista)\n\"Eu sou um escritor difícil Que a muita gente enquizila, Porém essa culpa é fácil De se acabar\nduma vez: É só tirar a cortina Que entra luz nesta escurez.\"\n(Mário de Andrade - Lundu do escritor difícil)\nNo eterno criar e recriar da atividade verbal, a criatividade, a semanticidade, a intersubjetividade,\na materialidade e a historicidade são propriedades essenciais da linguagem, indispensáveis a todos\nos atos de fala, sejam eles presentes, passados ou futuros. Porém, é a atividade semântica que\nintermedeia a conexão dos seres humanos com o mundo dos objetos, estabelecendo a relação\nentre o Eu e o Universo, e, junto com a alteridade (relação do Eu com o Outro, de caráter\ninterlocutivo), permite a identificação da linguagem como tal, pois a linguagem existe não apenas\npara significar, mas significar alguma coisa para o outro. A semanticidade possibilita o indivíduo\nconceber e revelar as coisas pertencentes ao mundo do real e da imaginação. Logo, é ao mesmo\ntempo significação, modo de conceber, ou melhor, uma configuração linguística de conhecimento,\numa organização verbal do pensamento, e designação ou referência, aplicação dos conceitos às\ncoisas extralinguísticas. [...].\nNo processo de leitura do texto, para que o leitor se aproprie desse(s) sentido(s), é necessário que\nele domine não apenas o código linguístico, mas também compartilhe bagagem cultural, vivências,\nexperiências, valores, correlacione os conhecimentos construídos anteriormente (de gênero e de\nmundo, entre outros) com as novas informações expressas no texto; faça inferências e\ncomparações; compreenda que o texto não é uma estrutura fechada, acabada, pronta; perceba as\nsignificações, as intencionalidades, os dialogismos, o não dito, os silêncios. Em resumo, é\nfundamental que, por meio de uma série de contribuições, o interlocutor colabore para a\nconstrução do conhecimento. Assim, ler não significa traduzir um sentido já considerado pronto,\nmas interagir com o outro (o autor), aceitando, ou não, os propósitos do interlocutor.\n(Prof' Marina Cezar - Revista de Villegagnon. Ano IV. No 4. 2009- Texto adaptado)",
    "statement": "Assinale a opção em que, de acordo com a variante padrão brasileira, o verbo indicado entre\nparênteses segue a mesma flexão da forma verbal observada em: \"[...] a atividade semântica que\nintermedeia a conexão dos seres humanos com o mundo. dos objetos[...]\"(2°§)",
    "options": [
      {
        "letter": "A",
        "text": "Queremos que ele (confiar) em sua competência.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Acredita no aluno que (ansiar) por novas leituras.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Encontrou uma empresa que (premiar) as boas ideias.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Ele quer uma leitura que (ampliar) seus conhecimentos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Todos procuramos um exercício que (afiar) nossa memória.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q80",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 80,
    "readingText": "A PIPOCA\nRubem Alves\nDisponível em http://www.releituras.com/rubemalves_pipoca.asp. Acessado em 31 de mai. 2016.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nÉ preciso deixar de ser de um jeito para ser de outro. \"Morre e transforma-te!\" − dizia Goethe.\nNessa passagem, o autor, tratando da transformação, cita a fala de um filósofo alemão, que utiliza\na segunda pessoa do singular. Se Goethe tivesse usado o tratamento de você, teríamos, então:",
    "options": [
      {
        "letter": "A",
        "text": "Morre e transforme-se!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Morra e transforme-se!",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Morra e transforma-te!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Morrem e transformam-se!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Morre e transforma-se!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q81",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 81,
    "readingText": "UM CINTURÃO\nGraciliano Ramos\nAs minhas primeiras relações com a justiça foram dolorosas e deixaram-me funda impressão. Eu\ndevia ter quatro ou cinco anos, por aí, e figurei na qualidade de réu. Certamente já me haviam feito\nrepresentar esse papel, mas ninguém me dera a entender que se tratava de julgamento. Batiam-me porque podiam bater-me, e isto era natural.\nOs golpes que recebi antes do caso do cinturão, puramente físicos, desapareciam quando findava\na dor. Certa vez minha mãe surrou-me com uma corda nodosa que me pintou as costas de\nmanchas sangrentas. Moído, virando a cabeça com dificuldade, eu distinguia nas costelas grandes\nlanhos vermelhos. Deitaram-me, enrolaram-me em panos molhados com água de sal – e houve\numa discussão na família. Minha avó, que nos visitava, condenou o procedimento da filha e esta\nafligiu-se. Irritada, ferira-me à toa, sem querer. Não guardei ódio a minha mãe: o culpado era o nó.\nSe não fosse ele, a Cagelação me haveria causado menor estrago. E estaria esquecida. A história\ndo cinturão, que veio pouco depois, avivou-a.\nMeu pai dormia na rede, armada na sala enorme. Tudo é nebuloso. Paredes extraordinariamente\nafastadas, rede infinita, os armadores longe, e meu pai acordando, levantando-se de mau humor,\nbatendo com os chinelos no chão, a cara enferrujada. Naturalmente não me lembro da ferrugem,\ndas rugas, da voz áspera, do tempo que ele consumiu rosnando uma exigência. Sei que estava\nbastante zangado, e isto me trouxe a covardia habitual. Desejei vê-lo dirigir-se a minha mãe e a\nJosé Baía, pessoas grandes, que não levavam pancada. Tentei ansiosamente fixar-me nessa\nesperança frágil. A força de meu pai encontraria resistência e gastar-se-ia em palavras.\nDébil e ignorante, incapaz de conversa ou defesa, fui encolher-me num canto, para lá dos caixões\nverdes. Se o pavor não me segurasse, tentaria escapulir-me: pela porta da frente chegaria ao\naçude, pela do corredor acharia o pé de turco. Devo ter pensado nisso, imóvel, atrás dos caixões.\nSó queria que minha mãe, sinhá Leopoldina, Amaro e José Baía surgissem de repente, me\nlivrassem daquele perigo.\nNinguém veio, meu pai me descobriu acocorado e sem fôlego, colado ao muro, e arrancou-me\ndali violentamente, reclamando um cinturão. Onde estava o cinturão? Eu não sabia, mas era difícil\nexplicar-me: atrapalhava-me, gaguejava, embrutecido, sem atinar com o motivo da raiva. Os\nmodos brutais, coléricos, atavam-me; os sons duros morriam, desprovidos de significação.\nNão consigo reproduzir toda a cena. Juntando vagas lembranças dela a fatos que se deram\ndepois, imagino os berros de meu pai, a zanga terrível, a minha tremura infeliz. Provavelmente fui\nsacudido. O assombro gelava-me o sangue, escancarava-me os olhos.\nOnde estava o cinturão? Impossível responder. Ainda que tivesse escondido o infame objeto,\nemudeceria, tão apavorado me achava. Situações deste gênero constituíram as maiores torturas\nda minha infância, e as consequências delas me acompanharam.\nO homem não me perguntava se eu tinha guardado a miserável correia: ordenava que a\nentregasse imediatamente. Os seus gritos me entravam na cabeça, nunca ninguém se esgoelou de\nsemelhante maneira.\nOnde estava o cinturão? Hoje não posso ouvir uma pessoa falar alto. O coração bate-me forte,\ndesanima, como se fosse parar, a voz emperra, a vista escurece, uma cólera doida agita coisas\nadormecidas cá dentro. A horrível sensação de que me furam os tímpanos com pontas de ferro.\nOnde estava o cinturão? A pergunta repisada ficou-me na lembrança: parece que foi pregada a\nmartelo.\nA fúria louca ia aumentar, causar-me sério desgosto. Conservar-me-ia ali desmaiado, encolhido,\nmovendo os dedos frios, os beiços trêmulos e silenciosos. Se o moleque José ou um cachorro\nentrasse na sala, talvez as pancadas se transferissem. O moleque e os cachorros eram inocentes,\nmas não se tratava disto. Responsabilizando qualquer deles, meu pai me esqueceria, deixar-me-ia\nfugir, esconder-me na beira do açude ou no quintal. Minha mãe, José Baía, Amaro, sinhá\nLeopoldina, o moleque e os cachorros da fazenda abandonaram-me. Aperto na garganta, a casa a\ngirar, o meu corpo a cair lento, voando, abelhas de todos os cortiços enchendo-me os ouvidos –\ne, nesse zunzum, a pergunta medonha. Náusea, sono. Onde estava o cinturão? Dormir muito, atrás\nde caixões, livre do martírio.\nHavia uma neblina, e não percebi direito os movimentos de meu pai. Não o vi aproximar-se do\ntorno e pegar o chicote. A mão cabeluda prendeu-me, arrastou-me para o meio da sala, a folha de\ncouro fustigou-me as costas. Uivos, alarido inútil, estertor. Já então eu devia saber que gogos e\nadulações exasperavam o algoz. Nenhum socorro. José Baía, meu amigo, era um pobre-diabo.\nAchava-me num deserto. A casa escura, triste; as pessoas tristes. Penso com horror nesse ermo,\nrecordo-me de cemitérios e de ruínas mal-assombradas. Cerravam-se as portas e as janelas, do\nteto negro pendiam teias de aranha. Nos quartos lúgubres minha irmãzinha engatinhava,\ncomeçava a aprendizagem dolorosa.\nJunto de mim, um homem furioso, segurando-me um braço, açoitando-me. Talvez as vergastadas\nnão fossem muito fortes: comparadas ao que senti depois, quando me ensinaram a carta de ABC,\nvaliam pouco. Certamente o meu choro, os saltos, as tentativas para rodopiar na sala como\ncarrapeta eram menos um sinal de dor que a explosão do medo reprimido. Estivera sem bulir,\nquase sem respirar. Agora esvaziava os pulmões, movia-me num desespero.\nO suplício durou bastante, mas, por muito prolongado que tenha sido, não igualava a mortificação\nda fase preparatória: o olho duro a magnetizar-me, os gestos ameaçadores, a voz rouca a mastigar\numa interrogação incompreensível.\nSolto, fui enroscar-me perto dos caixões, coçar as pisaduras, engolir soluços, gemer baixinho e\nembalar-me com os gemidos. Antes de adormecer, cansado, vi meu pai dirigir-se à rede, afastar\nas varandas, sentar-se e logo se levantar, agarrando uma tira de sola, o maldito cinturão, a que\ndesprendera a fivela quando se deitara. Resmungou e entrou a passear agitado. Tive a impressão\nde que ia falar-me: baixou a cabeça, a cara enrugada serenou, os olhos esmoreceram, procuraram\no refúgio onde me abatia, aniquilado.\nPareceu-me que a figura imponente minguava – e a minha desgraça diminuiu. Se meu pai se\ntivesse chegado a mim, eu o teria recebido sem o arrepio que a presença dele sempre me deu.\nNão se aproximou: conservou-se longe, rondando, inquieto. Depois se afastou.\nSozinho, vi-o de novo cruel e forte, soprando, espumando. E ali permaneci, miúdo, insignificante,\ntão insignificante e miúdo como as aranhas que trabalhavam na telha negra. Foi esse o primeiro\ncontato que tive com a justiça.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nNas opções que se seguem as formas verbais sublinhadas são locuções verbais, <u>EXCETO:</u>",
    "options": [
      {
        "letter": "A",
        "text": "Eu <u>devia</u> <u>ter</u> quatro ou cinco anos, por aí, e figurei na qualidade de réu.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Batiam-me porque <u>podiam</u> <u>bater-me,</u> e isto era natural.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "<u>Devo</u> <u>ter</u> <u>pensado</u> nisso, imóvel, atrás dos caixões.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Antes de adormecer, cansado, <u>vi meu pai dirigir-se</u> à rede (...).",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "Resmungou e <u>entrou a passear</u> agitado.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q82",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 82,
    "readingText": "ESPERA UMA CARTA\nCarlos Drummond de Andrade\nAgora sei por que não vieste, depois de tanto e tanto te esperar. Cheguei a supor que não\nexistisses. Imaginei, às vezes, que foras ter a outra porta, e alguém se beneficiava de ti. Era o\nequívoco mais consolador, afinal não se perderia a mensagem. Eu indagava os rostos, pesquisava\nneles a furtiva iluminação, o traço de beatitude, que indicasse conhecimento de teu segredo. Não\ndistinguia bem, as pessoas se afastavam ou escondiam tão finamente tua posse, que a dúvida\nficava enrodilhada à minha esquerda. O desengano, à direita. E não havia combate entre eles.\nCoexistiam, mais a cabeçuda esperança.\nTodas as manhãs te aguardava. Ao meio-dia já era certo que não vinhas. O resto do dia era neutro.\nRestava amanhã. E outro amanhã. E depois. Repousava, aos domingos, dessa expectação sem\nlimites. Via-te aparecer em sonho, e fechava os olhos como quem soubesse que não te merecia,\nou quisesse retardar o instante de comunicação. Esperar era quase receber. Cismava que te\nrecebera havia longos anos, mas era menino e sem condições de avaliar-te, ou vieras em código, e\neu, sem possuir a chave, me quedava mirando-te e remirando-te como à estrela intocável.\nMuitas recebi durante esse prazo. Não se confundiam contigo. Traziam palavras boas ou más,\nindiferentes, quaisquer. E o receio de que entre elas rolasses perdida, fosses considerada\ninsignificante? Desprezada, como impresso de propaganda?\nAs dádivas que devias trazer-me, quais seriam? Nunca imaginei ao certo o que de grande me\nreservavas. Quem sabe se a riqueza, de que eu tinha medo, mas revestida de doçura e imaginação,\na resumir os prazeres do despojamento? Ou a glória espiritual, sem seus gêmeos a jactância e o\norgulho? Ou o amor – e esta só palavra me fazia curvar a cabeça, ao peso de sua magnificência.\nEu não escolhia nem hesitava. O dom seria perfeito, sem proporção com o ente gratificado. E\ninfinito, a envolver minha finitude.\nMas agora sei por que não vieste nem virás. Estavas entre inúmeras companheiras, jogadas em\nsacos espessos, por sua vez afundados num subterrâneo. E dizer que todos os dias passei por tuas\nproximidades, até mesmo em cima de ti, sem discernir tua pulsação. Servidores infiéis ou cansados\nforam acumulando debaixo do chão o monte de notícias, lamentos, beijos, ameaças, faturas,\nordens, saudades, sobre o qual os caminhões passavam, os dias passavam, passavam os governos\ne suas reformas. Escondida, esmagada no monte, sem sombra de movimento, lá te deixaste jazer,\nenquanto eu conjeturava mil formas de extravio e omissão. Cheguei a desconfiar de ti, a crer que\nzombavas de minha urgência, distraindo-te por itinerários loucos. Suspeitei que te recusavas,\nquase desejei que fogo ou água te liquidassem, já que te esquivavas a tua missão.\nE foi o que aconteceu, sem dúvida. A umidade e os ratos de esgoto te consumiram. Restam – se\nrestarem – fragmentos que nada contam ou explicam, senão que uma carta maravilhosa, esperada\ndesde a eternidade, por mim e por outro qualquer homem igual a mim, foi escrita em alguma parte\ndo mundo e não chegou a destino, porque o Correio a jogou fora, entre trezentas mil ou trezentos\nmilhões de cartas.\nOBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
    "statement": "Com base no texto, responda à questão.\nAssinale a opção em que se encontra uma oração na voz passiva.",
    "options": [
      {
        "letter": "A",
        "text": "Era o equívoco mais consolador, afinal não se perderia a mensagem.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Não distinguia bem, as pessoas se afastavam ou escondiam (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Restam – se restarem – fragmentos que nada contam (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Imaginei, às vezes, que foras ter a outra porta, e alguém se beneficiava de ti.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Quem sabe se a riqueza, de que eu tinha medo, mas (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q83",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 83,
    "readingText": "O Médico e o monstro\nPaulo Mendes Campos\nAvental branco, pincenê vermelho, bigodes azuis, ei-lo, grave, aplicando sobre o peito descoberto\nduma criancinha um estetoscópio, e depois a injeção que a enfermeira lhe passa.\nO avental na verdade é uma camisa de homem adulto a bater-lhe pelos joelhos; os bigodes foram\npintados por sua irmã, a enfermeira; a criancinha é uma boneca de olhos cerúleos, mas já meio\ncareca, que atende pelo nome de Rosinha; os instrumentos para exame e cirurgia saem duma\ncaixinha de brinquedos.\nEla, seis anos e meio; o doutor tem cinco. Enquanto trabalham, a enfermeira presta informações:\n- Esta menina é boba mesmo, não gosta de injeção, nem de vitamina, mas a irmãzinha dela adora.\nO médico segura o microscópio, focaliza-o dentro da boca de Rosinha, pede uma colher, manda a\npaciente dizer aaá. Rosinha diz aaá pelos lábios da enfermeira. O médico apanha o pincenê, que\nescorreu de seu nariz, rabisca uma receita, enquanto a enfermeira continua:\n- O senhor pode dar injeção que eu faço ela tomar de qualquer jeito, porque é claro que se ela não\nquiser, NE, vai ficar muito magrinha que até o vento carrega.\nO médico, no entanto, prefere enrolar uma gaze em torno do pescoço da boneca, diagnosticando:\n- Mordida de leão.\n- Mordida de leão, pergunta, desapontada, a enfermeira, para logo aceitar este faz de conta dentro\ndo outro faz de conta; eu já disse tanto, meu Deus, para essa garota não ir na floresta brincar com\nChapeuzinho Vermelho...\nNovos clientes desfilam pela clínica: uma baiana de acarajé, um urso muito resfriado, porque só\ngostava de neve, um cachorro atropelado por lotação, outras bonecas de vários tamanhos, um\npapai Noel, uma bola de borracha e até mesmo o pai e a mãe do médico e da enfermeira.\nDe repente, o médico diz que está com sede e corre para a cozinha, apertando o pincenê contra o\nrosto. A mãe se aproveita disso para dar um beijo violento no seu amor de filho e também para\npreparar-lhe um copázio de vitaminas: tomate, cenoura, maçã, banana, limão, laranja e aveia. O\nfamoso pediatra, com um esgar colérico, recusa a formidável droga.\n- Tem de tomar, senão quem acaba no médico é você mesmo, doutor.\nEle implora em vão por uma bebida mais inócua. O copo é levado com energia aos seus lábios, a\nbeberagem é provada com uma careta. Em seguida, propõe um trato: — Só se você depois me der\num sorvete.\nA terrível mistura é sorvida com dificuldade e repugnância, seus olhos se alteram nas órbitas, um\nengasgo devolve o restinho. A operação durou um quarto de hora. A mãe recolhe o copo vazio\ncom a alegria da vitória e aplica no menino uma palmadinha carinhosa, revidada com a ameaça\ndum chute. Já estamos a essa altura, como não podia deixar de ser, presenciado a metamorfose\ndo médico em monstro.\nAo passar zunindo pela sala, o pincenê e o avental são atirados sobre o tapete com um gesto\ndesabrido. Do antigo médico resta um lindo bigode azul. De máscara preta e espada, Mr. Hyde\npenetra no quarto, onde a doce enfermeira continua a brincar, e desfaz com uma espadeirada\ntodo o consultório: microscópio, estetoscópio, remédios, seringa, termômetro, tesoura, gaze,\nesparadrapo, bonecas, tudo se derrama pelo chão. A enfermeira dá um grito de horror e começa a\nchorar nervosamente. O monstro, exultante, espeta-lhe a espada na barriga e brada:\n- Eu sou o Demônio do Deserto!\nAinda sob o efeito das vitaminas, preso na solidão escura do mal, desatento a qualquer autoridade\nmaterna ou paterna, com o diabo no corpo, o monstro vai espalhando o terror a seu redor: é a\ntelevisão ligada ao máximo, é o divã massacrado sob os seus pés, é um cometa indo tinir no\nouvido da cozinheira, um vaso quebrado, uma cortina que se despenca, um grito, um uivo, um\nrugido animal, é o doce derramado, a torneira inundando o banheiro, a revista nova dilacerada, é,\nenfim, o flagelo à solta no sexto andar dum apartamento carioca.\nSubitamente, o monstro se acalma. Suado e ofegante, senta-se sobre os joelhos do pai, pedindo\ncom doçura que conte uma história ou lhe compre um carneirinho de verdade",
    "statement": "E a paz e a ternura de novo abrem suas asas num lar ameaçado pelas forças do mal.\nOBS.: O texto foi adaptado às regras no Novo Acordo Ortográfico.\nA única alternativa em que há verbo na segunda conjugação é:",
    "options": [
      {
        "letter": "A",
        "text": "A terrível mistura é sorvida com dificuldade e repugnância (...).",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "A enfermaria dá um grito de horror e começa a chorar nervosamente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "(...) os instrumentos para exame e cirurgia saem duma caixinha de brinquedos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Novos clientes desfilam pela clínica (...).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "A operação durou um quarto de hora.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q84",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 84,
    "readingText": "TEXTO I\nTodos temos amigos e não é difícil falar de suas qualidades. No Brasil que, na minha obra, eu tenho\ndefinido como um país marcado pela casa, pela família e pelos laços sagrados da hospitalidade e\nda cortesia, os amigos se dividem em muitas categorias. Há amigos \"próximos\", \"íntimos\" e \"do\npeito\", com quem compartilhamos segredos e nos quais depositamos uma confiança ilimitada. E\nhá também, como uma espécie de compensação a nos prevenir contra os riscos da estima e da\nternura devotada às pessoas, os \"amigos da onça\" e os \"falsos amigos\", aqueles que, ao lado dos\n\"amigos distantes\", estão próximos dos inimigos \"íntimos\" e \"cordiais\". No Brasil, não seria exagero\ndizer, há amigos para tudo e sem eles a vida social estaria provavelmente paralisada, pois o que\nseria de nós sem esses \"amigos\" (ou \"amigões\") que temos na padaria, na condução, na academia\nde ginástica, no banco, nas repartições públicas, no consultório médico, na praia, piscina, colégio,\nbar e praças que frequentamos?\nDir-se-ia que, onde há um grupo de pessoas, existem amigos potenciais ou virtuais, ou seja:\naquelas criaturas com as quais simpatizamos e descobrimos afinidades especiais e singulares.\nÉ mais fácil, entretanto, falar dessa rede de amigos que todos possuímos e que, num sentido muito\npreciso, são o sal da nossa vida, do que discernir as linhas daquilo que chamamos de \"amizade\",\nultrapassando o plano do lugar-comum, que aprisiona a amizade dentro de um quadro de escolhas\npessoais, passando por cima de sua importância política e social.\nSei que sou amigo de Maria ou de João porque gosto deles. Mas como definir esse \"gostar\"\npolítica ou sociologicamente? Que implicações sociais tem essa afeição? Que deveres e coerções\nela apresenta e demanda?\nFalar disso é discorrer sobre as teias da amizade. E a amizade, ao fim e ao cabo, está contida no\nafeto como obrigação e como dever. Um afeto que, uma vez testado e estabelecido, vai além das\nescolhas, obrigando a tomar partido. O amigo de um amigo é, por definição, um amigo; a mulher\nde um amigo é homem; aos inimigos a lei, aos amigos tudo. Eis três princípios que ajudam a\nentender a amizade, pelo menos no caso do Brasil. Neles temos um eixo comum que ajuda a\ncompreender o seu sentido.\nRefiro-me, é claro, às obrigações impostas pela norma mais importante da vida social: a\nreciprocidade (que obriga a dar, receber e retribuir). Dar e receber, para depois retribuir, são\nmarcas mais claras da amizade como um principio moral sem o qual a própria sociabilidade\ndeixaria de existir. Damos aos amigos e deles esperamos receber. As amizades fazem parte do\nmomento, mas se prolongam no futuro: o amigo dos meus pais é meu amigo, o que seria do nosso\nfamoso clientelismo sem essa regra que nos obriga a ter redes de amizade ou \"turmas\"? Ademais,\nas amizades não se medem de forma instrumental: um presente dado hoje pode ser retribuído\nmuitos anos depois, o que distingue a amizade da relação instrumental tipica dos elos comerciais.\nFinalmente, vale considerar o perturbador principio que submete o inimigo à lei e aos amigos dá\ntodas as regalias. Para além de um cinismo fácil de condenar, esse axioma, que tem marcado por\ntantos séculos o nosso sistema politico, distingue interesses imediatos de amor; separa a vida\nsocial como feita de contratos visando ao lucro, da existência marcada pelo afeto e pelo carinho.\nSe a sociedade é governada por regras que a todos submetem, como as leis do mercado e os\ncódigos legais, ela também tem como base esses elos inscritos no coração que constituem as\ngrandes amizades.\nFalar da amizade, portanto, é refletir sobre essas correntes de presentes, palavras e gestos que se\nsituam aquém (ou além) dos deveres e obrigações legais e econômicas. Não fosse assim e\nninguém seria capaz de realizar o gesto supremo da amizade que constitui o \"dar de graça\", o\npresente impossível que, sendo sinal de carinho e amor, não deseja retorno.\n(DaMatta, Roberto. Em torno dos amigos e da amizade. In: Borja, Maria Isabel; Vassalo, Márcio,\norgs. Valores para viver. Rio de Janeiro: Guarda-Chuva, 2005, p.159-161)",
    "statement": "Em que opção a concordância verbal está de acordo com a norma padrão vigente?",
    "options": [
      {
        "letter": "A",
        "text": "No Brasil, não seria exagero dizer, hão de haver amigos para tudo,",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "No Brasil, não seria exagero dizer, deve existir amigos para tudo,",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "No Brasil, não seria exagero dizer, devem haver amigos para tudo,",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "No Brasil, não seria exagero dizer, hão de existir amigos para tudo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "No Brasil, não seria exagero dizer, teriam de haver amigos para tudo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q85",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 85,
    "readingText": "A ÚLTIMA CRÔNICA\nA caminho de casa, entro num botequim da Gávea para tomar um café junto ao balcão. Na\nrealidade estou adiando o momento de escrever. A perspectiva me assusta. Gostaria de estar\ninspirado, de coroar com êxito mais um ano nesta busca pitoresco ou do irrisório no cotidiano de\ncada um. Eu pretendia apenas recolher da vida diária algo de seu disperso conteúdo humano, fruto\nda convivência, que a faz mais digna de ser vivida. Visava ao circunstancial, ao episódico. Nesta\nperseguição do acidental, quer num Cagrante de esquina, quer nas palavras de uma criança ou\nnum acidente doméstico, torno-me simples espectador e perco a noção do essencial. Sem mais\nnada contar, curvo a cabeça e tomo meu café, enquanto o verso do poeta se reflete na\nlembrança: “assim eu quereria o meu último poema”. Não sou poeta e estou sem assunto. Lanço\nentão um último olhar fora de mim, onde vivem os assuntos que merecem uma crônica.\nAo fundo do botequim um casal de pretos acaba de sentar-se, numa das últimas mesas de\nmármore ao longo da parede de espelhos. A compostura da humildade, na contenção de gestos e\npalavras, deixa-se acentuar pela presença de uma negrinha de seus três anos, laço na cabeça, toda\narrumadinha no vestido pobre, que se instalou também à mesa: mal ousa balançar as perninhas\ncurtas ou correr os olhos grandes de curiosidade ao redor. Três seres esquivos que compõem em\ntorno à mesa a instituição tradicional da família, célula da sociedade. Vejo, porém, que se\npreparam para algo mais que matar a fome.\nPasso a observá-los. O pai, depois de contar o dinheiro que discretamente retirou do bolso, aborda\no garçom, inclinando-se para trás na cadeira, e aponta no balcão um pedaço de bolo sob a\nredoma. A mãe limita-se a ficar olhando imóvel, vagamente ansiosa, como se aguardasse a\naprovação do garçom. Este ouve, concentrado, o pedido do homem e depois se afasta para\natendê-lo. A mulher suspira, olhando para os lados, a reassegurar-se da naturalidade de sua\npresença ali. A meu lado o garçom encaminha a ordem do freguês. O homem atrás do balcão\napanha a porção do bolo com a mão, larga-o no pratinho — um bolo simples, amarelo-escuro,\napenas uma pequena fatia triangular.\nA negrinha, contida na sua expectativa, olha a garrafa de coca-cola e o pratinho que o garçom\ndeixou à sua frente. Por que não começa a comer? Vejo que os três, pai, mãe e filha, obedecem\nem torno à mesa a um discreto ritual. A mãe remexe na bolsa de plástico preto e brilhante, retira\nqualquer coisa. O pai se mune de uma caixa de fósforos, e espera. A filha aguarda também, atenta\ncomo um animalzinho. Ninguém mais os observa além de mim.\nSão três velinhas brancas, minúsculas, que a mãe espeta caprichosamente na fatia do bolo. E\nenquanto ela serve a coca-cola, o pai risca o fósforo e acende as velas. Como a um gesto\nensaiado, a menininha repousa o queixo no mármore e sopra com força, apagando as chamas.\nImediatamente põe-se a bater palmas, muito compenetrada, cantando num balbucio, a que os pais\nse juntam, discretos: “parabéns pra você, parabéns pra você...“ Depois a mãe recolhe as velas,\ntorna a guardá-las na bolsa. A negrinha agarra finalmente o bolo com as duas mãos sôfregas e\npõe-se a comê-lo. A mulher está olhando para ela com ternura — ajeita-lhe a fitinha no cabelo\ncrespo, limpa o farelo de bolo que lhe cai ao colo, O pai corre os olhos pelo botequim, satisfeito,\ncomo a se convencer intimamente do sucesso da celebração. De súbito, dá comigo a observá-lo,\nnossos olhos se encontram, ele se perturba, constrangido — vacila, ameaça abaixar a cabeça, mas\nacaba sustentando o olhar e enfim se abre num sorriso.\nAssim eu quereria a minha última crônica: que fosse pura como esse sorriso.\n(SABINO, Fernando. A companheira de viagem. Rio de Janeiro: Ed. Record, 1972)",
    "statement": "Assinale a opção que o autor, na crônica, expressa um fato em um passado recente, por meio de\numa locução verbal.",
    "options": [
      {
        "letter": "A",
        "text": "“Ao fundo do botequim um casal de pretos acaba de sentar-se (...)”.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“A mãe limita-se a ficar olhando imóvel (....)“.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Por que não começa comer?”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Imediatamente põe-se a bater palmas muito compenetrada, cantando (...)”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“A mulher esta olhando para ela com ternura (...)“.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q86",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 86,
    "readingText": "Bruno Lichtenstein\nRubem Braga\n18 de Julho de 1939\nFoi preso o menino Bruno Lichtenstein, que arrombou a Faculdade de Medicina. O menino Bruno\nLichtenstein não é arrombador profissional. Apenas acontece que o menino Bruno Lichtenstein\ntem um amigo, e esse amigo é um cachorro, e esse cachorro ia ser trucidado cientificamente, para\nestudos, na Faculdade de Medicina. O poeta mineiro Djalma Andrade tem um soneto que acaba\nmais ou menos assim:\n\"se entre os amigos encontrei cachorros,\nentre os cachorros encontrei-te, amigo\".\nMas com toda a certeza o menino Bruno Lichtenstein jamais leu esses versos. Também com\ncerteza nunca lhe explicaram o que é vivissecção, nem lhe disseram que seu cão ia ser\nvivisseccionado. Tudo o que ele sabia é que lhe haviam carregado o cachorro e que iam matá-Io.\nSe fosse pedi-Io, naturalmente, não o dariam. Quem, neste mundo, haveria de se preocupar com o\npobre menino Bruno Lichtenstein e o seu pobre cão? Mas o cachorro era seu amigo - e estava lá,\nmetido em um porão, esperando a hora de morrer. E só uma pessoa no mundo podia salvá-Ia: um\nmenino pobre chamado Bruno Lichtenstein. Com esse sobrenome de principado, Bruno\nLichtenstein é um garoto sem dinheiro. Não pagará a licença de seu amigo. Mas Bruno\nLichtenstein havia de salvar a vida de seu amigo - de qualquer jeito. E jeito só havia um: ir lá e tirar\no cachorro. De longe, Bruno Lichtenstein chorava, pensando ouvir o ganido triste de um\ncondenado à morte. via homens cruéis metendo o bisturi na carne quente de seu amigo: via\nsangue derramado. Horrível, horrível. Bruno Lichtenstein sentiu que seria o último dos infames se\nnão agisse imediatamente.\nAgiu. Escalou uma janela, arrebentou um vidro, saltou. Estava dentro do edifício. Andando pelas\nsalas desertas, foi até onde estava o seu amigo. Sentiu que o seu coração batia mais depressa. Deu\num assovio, um velho assovio de amizade.\nUm vulto se destacou em um salto - e um focinho e úmido lambeu a mão de Bruno Lichtenstein.\nAgora era para a rua, para a liberdade, para a vida...\nBruno Lichtenstein, da cabeça aos pés, tremia de susto e de alegria. Foi aí que ele ouviu uma voz\náspera e espantada de homem. Era o dr. Loforte. O dr. Loforte surpreendeu o menino. Um menino\npodre, que tremia, que havia arrombado a Faculdade. Só podia ser um ladrão! Bruno Lichtenstein\nnão explicou nada - e fez bem. Para o dr. Loforte um cachorro não é um cachorro - é um material\nde estudo como outro qualquer.\nNa polícia apareceu o pai do menino. O pai, o professor e o delegado conversaram longamente - e\nBruno Lichtenstein não ouvia nada. Só ouvia, lá longe, o ganir de um condenado à morte.\nJá te entregaram o cachorro, esse cachorro ia ser trucidado cientificamente, para estudos, na\nFaculdade de Medicina. Tu o mereceste, porque tu foste amigo. Não te deram nem te darão\nmedalha nenhuma - porque não há medalha nenhuma para distinguir a amizade. Mas te\nentregaram o teu cachorro, o cachorro que reivindicaste como um pequeno herói. Tu é um\nhomem, Bruno Lichtenstein - um homem no sentido decente da palavra, muito mais homem que\nmuito homem. Um aperto de mão, Bruno Lichtenstein.\nO texto acima foi extraído do livro \"1939 - Um episódio em Porto Alegre (Uma fada no front)\", Ed.\nRecord Rio de Janeiro, 2002 - pág. 37.",
    "statement": "Lido o texto, observe atentamente o quesito e assinale somente UMA opção correta.\n<u>\"Foi preso</u> o menino Bruno Lichtenstein, que arrombou a Faculdade de Medicina.\" (1° parágrafo)\nA voz verbal que destoa da forma acima sublinhada se encontra na opção:",
    "options": [
      {
        "letter": "A",
        "text": "Tinha sido pegado o cachorro do Bruno.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Anunciou-se uma medida de correção para a infração de Bruno.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "\"(... ) esse cachorro ia ser trucidado cientificamente, para estudos, na Faculdade de Medicina\". (1° parágrafo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Poucas vozes se ouviram em favor de Bruno Lichtenstein.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Em virtude do ocorrido, procedeu-se à apuração do caso.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q87",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 87,
    "readingText": "Bruno Lichtenstein\nRubem Braga\n18 de Julho de 1939\nFoi preso o menino Bruno Lichtenstein, que arrombou a Faculdade de Medicina. O menino Bruno\nLichtenstein não é arrombador profissional. Apenas acontece que o menino Bruno Lichtenstein\ntem um amigo, e esse amigo é um cachorro, e esse cachorro ia ser trucidado cientificamente, para\nestudos, na Faculdade de Medicina. O poeta mineiro Djalma Andrade tem um soneto que acaba\nmais ou menos assim:\n\"se entre os amigos encontrei cachorros,\nentre os cachorros encontrei-te, amigo\".\nMas com toda a certeza o menino Bruno Lichtenstein jamais leu esses versos. Também com\ncerteza nunca lhe explicaram o que é vivissecção, nem lhe disseram que seu cão ia ser\nvivisseccionado. Tudo o que ele sabia é que lhe haviam carregado o cachorro e que iam matá-Io.\nSe fosse pedi-Io, naturalmente, não o dariam. Quem, neste mundo, haveria de se preocupar com o\npobre menino Bruno Lichtenstein e o seu pobre cão? Mas o cachorro era seu amigo - e estava lá,\nmetido em um porão, esperando a hora de morrer. E só uma pessoa no mundo podia salvá-Ia: um\nmenino pobre chamado Bruno Lichtenstein. Com esse sobrenome de principado, Bruno\nLichtenstein é um garoto sem dinheiro. Não pagará a licença de seu amigo. Mas Bruno\nLichtenstein havia de salvar a vida de seu amigo - de qualquer jeito. E jeito só havia um: ir lá e tirar\no cachorro. De longe, Bruno Lichtenstein chorava, pensando ouvir o ganido triste de um\ncondenado à morte. via homens cruéis metendo o bisturi na carne quente de seu amigo: via\nsangue derramado. Horrível, horrível. Bruno Lichtenstein sentiu que seria o último dos infames se\nnão agisse imediatamente.\nAgiu. Escalou uma janela, arrebentou um vidro, saltou. Estava dentro do edifício. Andando pelas\nsalas desertas, foi até onde estava o seu amigo. Sentiu que o seu coração batia mais depressa. Deu\num assovio, um velho assovio de amizade.\nUm vulto se destacou em um salto - e um focinho e úmido lambeu a mão de Bruno Lichtenstein.\nAgora era para a rua, para a liberdade, para a vida...\nBruno Lichtenstein, da cabeça aos pés, tremia de susto e de alegria. Foi aí que ele ouviu uma voz\náspera e espantada de homem. Era o dr. Loforte. O dr. Loforte surpreendeu o menino. Um menino\npodre, que tremia, que havia arrombado a Faculdade. Só podia ser um ladrão! Bruno Lichtenstein\nnão explicou nada - e fez bem. Para o dr. Loforte um cachorro não é um cachorro - é um material\nde estudo como outro qualquer.\nNa polícia apareceu o pai do menino. O pai, o professor e o delegado conversaram longamente - e\nBruno Lichtenstein não ouvia nada. Só ouvia, lá longe, o ganir de um condenado à morte.\nJá te entregaram o cachorro, esse cachorro ia ser trucidado cientificamente, para estudos, na\nFaculdade de Medicina. Tu o mereceste, porque tu foste amigo. Não te deram nem te darão\nmedalha nenhuma - porque não há medalha nenhuma para distinguir a amizade. Mas te\nentregaram o teu cachorro, o cachorro que reivindicaste como um pequeno herói. Tu é um\nhomem, Bruno Lichtenstein - um homem no sentido decente da palavra, muito mais homem que\nmuito homem. Um aperto de mão, Bruno Lichtenstein.\nO texto acima foi extraído do livro \"1939 - Um episódio em Porto Alegre (Uma fada no front)\", Ed.\nRecord Rio de Janeiro, 2002 - pág. 37.",
    "statement": "Lido o texto, observe atentamente o quesito e assinale somente UMA opção correta.\nNa transposição para a voz passiva, ocorre um problema de gramatical idade na opção",
    "options": [
      {
        "letter": "A",
        "text": "\"Não te deram nem te darão medalha nenhuma (...)\". (7°parágrafo) - Não te foi dado nem te será dado medalha nenhuma.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "\"Só ouvia, lá longe, o ganir de um condenado à morte. (6° parágrafo) - O ganir de um condenado à morte, lá longe, era ouvido por ele\".",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "\"Mas te entregaram o teu cachorro (...)\". (7° parágrafo) - Mas o teu cachorro te foi entregue\".",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "\"O Dr. Loforte surpreendeu o menino\". (5° parágrafo) - O menino foi surpreendido pelo Dr. Loforte.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "\"Também com certeza nunca lhe explicaram o que é vivissecção (...)\". (2° parágrafo) - Também com certeza nunca lhe foi explicado o que é vivissecção.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q88",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 88,
    "readingText": "Na minha infância tinha muito verde e os frutos eram colhidos antes de amadurecer. Nela conheci\nDeus, nela conheci o Diabo e a ambos temia nas noites das histórias de assombração contadas\npela Maricota. Nunca pude esquecer essa pajem, cuja imaginação abriu aos meus olhos todo um\nreino mágico que me atraia e me apavorava com a mesma violência. Com a mesma força.\nNosso assunto noturno eram as almas-penadas que perambulavam sobre os telhados do casario\nde Sertãozinho, chão da minha meninice. Foram essas almas as minhas primeiras personagens, de\nmistura com jovens pálidas que vomitavam sangue, usavam violetas no cabelo e dormiam com\ngelo escondido no peito porque o amado não correspondia: todas morriam de amor. Quando\nsoube que duas das minhas antigas tiazinhas tinham morrido do mesmo mal, comecei a achar que\nminhas histórias da adolescência não eram assim tão originais. Contudo, continuei romântica, uma\nromântica amoitada por defesa. Pudor.\nA criação literária? Um mistério como qualquer outro ato de criação. Ato de mistério e de amor,\noutro mistério também: nunca se sabe quando se aproxima. Quando percebemos, já estamos\ncomprometidos até a raiz dos cabelos e a solução é ir até o fim..\nAlguns dos meus contos tiveram origem numa imagem. Outros, numa simples frase que ficou\ntatuada na memória, à espera do momento propício. Experimentos vanguardistas? Bem, sei que é\nmoda pôr em xeque a concepção da linguagem. Leio os experimentalistas, devasso-os, corro os\nolhos pelos ensaios críticos e pelas complexas teorias literárias. Ouço com o ouvido direito (que é o mais lúcido) milhares de conferências e teses nos seminários de literatura, medito na palavra que\nfoi posta no paredão. Dizem uns: o branco, o ausente é mais importante do que a frase. Vem\noutros e proclamam a morte da personagem. Morte total de qualquer tipo de enredo. Novos\ncódigos. Signos. Medito sobre tudo isso, anoto, analiso experiências e pesquisas porque também\nsou atraída pelo canto da sereia experimentalista, buscando nela um provável instrumental que me\nestimule no aperfeiçoamento de minha escritura, para usar um termo atual.\nMas a verdade é que quando me sento para escrever, na solidão e em silêncio, tudo quanto é\nfórmula, cálculo, modelos estruturalistas - tudo é posto de lado. Esqueço. Estendo minhas antenas\ne como um inseto subindo pelo Áspero casco de uma árvore, faço minha escolha e sigo meu\ncaminho. É difícil. É duro. Mas já optei. Carrego comigo a alegria dessa opção. A função do\nescritor? Escrever por aqueles que não podem escrever. Falar por aqueles que muitas vezes\nesperam ouvir da nossa boca a palavra que gostariam de dizer. Comunicar-se com o próximo e se\npossível, mesmo através de soluções ambíguas, ajudá-los no seu sofrimento e na sua esperança.\nIsso requer amor - o amor e a piedade que o escritor deve ter no seu coração.\n(TELLES, Lygia Fagundes. O jardim selvagem)",
    "statement": "“Leio os experimentalistas, devasso-os.”(3°§) Colocando-se os verbos na terceira pessoa do plural,\nqual seria a frase correta, segundo a norma padrão?",
    "options": [
      {
        "letter": "A",
        "text": "Leram os experimentalistas, devassaram eles.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Leram os experimentalistas, devassaram-lhes.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Leem os experimentalistas, devassam-nos.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Leem os experimentalistas, devassam-os.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Leiam os experimentalistas, devasse-los.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q89",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 89,
    "readingText": "Vamos de mal a pior?\nAlguns só conseguem enxergar o lado feio do mundo. E, como só noticias ruins dão manchete,\ndeleitam-se em ver confirmados seus piores enredos. Mas, no que se pode medir ou contar, a\nhistória é outra. O mundo hoje está pior? Vamos compará-lo com o de um século atrás. Jamais\nhouve tanta liberdade e o crescimento das democracias foi extraordinário. Entre elas já não há\nguerras. Nos conflitos recentes, pelo menos um lado é ditatorial. Na última década, reduziram-se\nem 40% as guerras. Houve também dramática redução das mortes violentas, que, no passado,\nceifavam 25% da população masculina. Hoje são só 2%. Nas pragas públicas, o povo via os\nacusados de heresia, bruxaria e magia negra serem assados em fogueiras. A razão e a ciência\najudaram a lançar luzes nessas áreas. Além disso, a ciência hoje é capaz de captar, entender e\nresolver boa parte dos problemas materiais que afligem a humanidade — incluindo os desastres do\nmeio ambiente.\nAntes da Revolução Industrial, um operário só possuía a roupa do corpo. Sua maior riqueza eram\nos pregos de sua casa. Há menos de dois séculos, um europeu trabalhava sessenta horas por\nsemana, dos 10 anos de idade até a sua morte, por volta dos 50 anos. Educação, cultura e lazer\nchegaram também aos pobres.\nAcabou-se a fome causada por calamidades naturais, como a que matou metade da população da\nIrlanda, no século XIX. Luís XIV não tinha a variedade nem a qualidade do cardápio de um reles\nmembro da classe média de hoje. O povo francês consumia 2 000 calorias por dia. Hoje, nos\npaíses pobres, consomem-se 2 700.\nHaverá algum país que estava pior que o Brasil em 1900 e hoje lhe passou à frente? Não encontrei\nnenhum. A maioria dos países latino-americanos, incluindo o Peru, era bem mais rica do que o\nBrasil. A renda per capita da Argentina foi cinco vezes\nmaior (hoje é quase igual). Em 1950, o Brasil era como a Bolívia de hoje. Em 1958, Cuba era o\nsegundo país mais rico da América Latina. Desde então, não fez senão retroceder. E a Coreia? Na\ndécada de 50, vitima de uma medonha guerra fratricida, até os pauzinhos de comer passaram a ser\nde metal, pois não havia mais Árvores. Mas a Coreia é uma civilização milenar, com sólida tradição\nde ciência e educação. Portanto, é uma comparação discutível. O Brasil avançou, do último século\npara cá? Quem duvida do atraso do Brasil no passado que leia as tenebrosas narrativas dos muitos\nvisitantes que por aqui viajaram. O século XX transformou espetacularmente o país. Entre 1870 e\n1987 o PIB brasileiro cresceu 157 vezes, o japonês 87 e o americano 53. Brasil, campeão do mundo!\nPor volta de 1900, a esperança de vida era inferior a 30 anos. Hoje já ultrapassou 70. A desnutrição\ngrave é residual e acabaram-se as formas catastróficas. Quase todos têm acesso a serviços\nmédicos (não tão bons, mas antes não havia nada). Nos confortos materiais, houve avanços\nespetaculares. Mais de 90% têm água encanada, eletricidade, televisão, geladeira e dezenas de\noutros confortos. Meus colegas do primário iam descalços para a escola. Como entendeu\nSchumpeter, foram os pobres que mais ganharam qualidade de vida com o crescimento. Em 1900,\n95% das crianças (entre 7 e 14 anos) não frequentavam escolas. Hoje,\napenas 2% ficam de fora. E, contrariando as fantasias saudosistas, os poucos que iam\nencontravam uma escola medíocre. Hoje, continua medíocre, mas é para todos e há ilhas de\nexcelência. Crescendo junto com a educação, nossa democracia nunca esteve tão robusta. Nem\ntudo são rosas. Há Áreas em que somos péssimos, como a distribuição de renda. Em matéria de\nsegurança, há oscilações. Contudo, as mortes violentas encolheram muito. Em corrupção, faltam\ndados confiáveis. Mas, em praticamente tudo o que podemos contar ou medir, pior não estamos.\nEssa é a tese do ensaio. Como disse lorde Rees de Ludlow, “para a maior parte das pessoas, na\nmaior parte das nações, nunca houve um momento melhor para viver”.\nOs pessimistas que fiquem com seus resmungos, pois os avanços em praticamente todas as\ndireções estão bem medidos. Os fatos não lhes dão razão (e, segundo o Gallup, nossa juventude é\ncampeã mundial de otimismo). Porém, não podemos festejar a situação presente, pois para o\nprogresso futuro precisamos ser obstinadamente inconformistas.\n(CASTRO, Cláudio de Moura. Veja, 18 fev. 2009, p. 26)",
    "statement": "No que concerne às formas verbais destacadas em: “Na última década, <u>reduziram-se</u> em 40% as\nguerras. Houve também dramática redução das mortes violentas, que, no passado, ceifavam 25%\nda população masculina.” (1°§S), qual afirmação está correta?",
    "options": [
      {
        "letter": "A",
        "text": "As duas formas poderiam ser empregadas tanto no pretérito perfeito, quanto no pretérito imperfeito, visto que, no texto, os dois tempos têm valor semântico idêntico.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "A primeira forma está no pretérito porque se refere a ação encerrada; a segunda, no passado, por indicar informação duvidosa.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Ambas as formas, conjugadas na voz passiva, pertencem ao modo indicativo, o que indica ter o autor certeza de suas afirmações.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "As duas formas referem-se a ações passadas: a primeira, no perfeito, tem limites determinados; a segunda, no imperfeito, indefinidos.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "As duas formas no pretérito ocorrem devido a necessidade de o autor tratar de duas ações subsequentes e similares.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q90",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 90,
    "readingText": "Leia atentamente o seguinte texto:\nENCONTRO NA PRAÇA\nJosé Luís da Cunha Fernandes, morador no Saco de São Francisco, uma tarde dessas, teve um\nencontro singular. Ia voltar de barca para Niterói e portava sua máquina fotográfica. Sua intenção\nera pegar o pôr-do-sol no Rio de dentro da barca. Mas ali na Praça 15 de Novembro, em frente à\nestação de embarque, deu-se o encontro de José Luís com uma rara personalidade.\nNinguém reparava nela, no insólito de sua presença, no inesperado de sua postura, em tudo que\nera de chamar atenção. Mas José Luís, que sabe ver, e não apenas olhar, maravilhou-se.\nMaravilhou-se e voltou imediatamente à infância, pois o ser que ali se encontrava parado em meio\nà multidão, ele o conhecera em menino, e desde então nunca mais o vira. Nunca. E de tanto não o\nver, por assim dizer se esquecera dele. As conversas, as leituras, as atividades de todo dia não\ncostumam referir-se à existência dessa figura de repente desaparecida. Então, ela ficara\nencaixotada num desvão da memória, mas tão escondido estava o caixote que era como se não\nexistisse. E assim se passaram anos.\nO que José Luís encontrou na Praça 15 foi uma esperança.\nE estava pousada no alto da caixa de correio. Estava pousada.\nQuantas crianças de hoje conhecem a esperança? Quantas ligam esse nome a um organismo vivo,\nque habita o folclore pela cor, que é promessa de felicidade? Menino do interior ainda pode ver,\num dia ou outro, a esperança. Menino da cidade, terá muita sorte se a encontrar no Alto da Boa\nVista ou no Parque da Cidade. Mas no cotidiano dos bairros superpovoados, nas ruas inteiramente\nplantadas de edifícios secos e agrestes, quem já viu esse bichinho? Quem sabe de sua esperteza\nem imitar folhas de arbusto, iludindo não só os outros insetos, que ele deseja papar, mas até a\ngente?\nPois em contrário a todas as possibilidades, a esperança postara-se naquele trecho febril do Rio de\nJaneiro, não ligando para o tumulto, a pressa, o barulho, a poeira, o fumo de descarga dos\nveículos. Ele elegera o cocuruto da caixa da ECT para a habitação provisória. Ali estava, quieta,\nverde, ortóptera, saltadora mas imóvel, mimética mas em sua cor natural, estridulante mas\nsilenciosa, guardando todas as potencialidades: simplesmente esperança, esperança para servi-los.\nE em que servia a esperança ao povo que ia quase correndo e não lhe dava a mínima confiança?\nSó José Luís era capaz de sabê-lo, por ser o único a tomar conhecimento do inseto em cima da\ncaixa. Percebeu logo que a esperança cumpria delicada tarefa.\nEm primeiro lugar, oferecia ou tentava oferecer boas notícias nas cartas colocadas no interior da\ncaixa. Palavras de carinho, promessas de emprego, reconciliações, doente que ficou bom, dívida\nque se conseguir pagar, beijos. Talvez as cartas dissessem o contrário disso, mas a esperança\nconcentrava seu princípio influente nas próximas correspondências, as definitivas. Bem que a ECT\npodia designar a esperança para seu logotipo. Inseto ágil, pulando como ele só: imagem de\nvelocidade, que se vem conseguindo implantar no tráfego postal.\nEm seguida, a esperança dirigia-se a todos, que voltavam a Niterói ou vinham de lá; e ainda aos\navulsos, que ficam por aqui mesmo, e transitam na Praça. “Ó vós todos que passais, aqui estou\n(dizia a esperança em seu falar tetigonídeo, que o vulgo infelizmente não capisca) para que\nrepareis o meu verde e o guardeis na rotina pelo que ele vale. Vale o melhor. Vale a capacidade de\ntransformar o real em transreal e usufruir as coisas deleitáveis que esse pode distribuir em forma\nde paz de espírito e coração sensível. Nem tudo é sujo na vida. Há claridades. Mas a claridade\ncomeça dentro de você, de vós mesmos... Depois é que ela se espalha pela cidade e pela vida dos\noutros. Eu, a esperança, à maneira dos reis antigos, vos envio saudar.”\nNinguém ouviu, ninguém traduziu. Só José Luís, que documentou a presença da esperança,\nfotografando-a. Ia fotografar o crepúsculo, mas antes teve a sorte de fotografar nada menos que\numa virtude teologal em minúscula forma vivente.\nCarlos Drummond de Andrade",
    "statement": "Lido o texto, observe atentamente o quesito e assinale somente UMA alternativa correta\nAs formas verbais sublinhadas apresentam-se no infinitivo, à exceção de uma, que aparece na\nopção:",
    "options": [
      {
        "letter": "A",
        "text": "“Ia <u>voltar</u> de barca para Niterói e (...)”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“As conversas, as leituras, as atividades de todo dia não costumam <u>referir-se</u> à existência dessa figura.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“E de tanto não o <u>ver,</u> por assim dizer, se esquecera dele.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Menino da cidade terá muita sorte se a <u>encontrar</u> no Alto da Boa Vista ou no Parque da Cidade.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "“Menino do interior pode <u>ver</u> um dia ou outro a esperança.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q91",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 91,
    "readingText": "Leia atentamente o seguinte texto:\nENCONTRO NA PRAÇA\nJosé Luís da Cunha Fernandes, morador no Saco de São Francisco, uma tarde dessas, teve um\nencontro singular. Ia voltar de barca para Niterói e portava sua máquina fotográfica. Sua intenção\nera pegar o pôr-do-sol no Rio de dentro da barca. Mas ali na Praça 15 de Novembro, em frente à\nestação de embarque, deu-se o encontro de José Luís com uma rara personalidade.\nNinguém reparava nela, no insólito de sua presença, no inesperado de sua postura, em tudo que\nera de chamar atenção. Mas José Luís, que sabe ver, e não apenas olhar, maravilhou-se.\nMaravilhou-se e voltou imediatamente à infância, pois o ser que ali se encontrava parado em meio\nà multidão, ele o conhecera em menino, e desde então nunca mais o vira. Nunca. E de tanto não o\nver, por assim dizer se esquecera dele. As conversas, as leituras, as atividades de todo dia não\ncostumam referir-se à existência dessa figura de repente desaparecida. Então, ela ficara\nencaixotada num desvão da memória, mas tão escondido estava o caixote que era como se não\nexistisse. E assim se passaram anos.\nO que José Luís encontrou na Praça 15 foi uma esperança.\nE estava pousada no alto da caixa de correio. Estava pousada.\nQuantas crianças de hoje conhecem a esperança? Quantas ligam esse nome a um organismo vivo,\nque habita o folclore pela cor, que é promessa de felicidade? Menino do interior ainda pode ver,\num dia ou outro, a esperança. Menino da cidade, terá muita sorte se a encontrar no Alto da Boa\nVista ou no Parque da Cidade. Mas no cotidiano dos bairros superpovoados, nas ruas inteiramente\nplantadas de edifícios secos e agrestes, quem já viu esse bichinho? Quem sabe de sua esperteza\nem imitar folhas de arbusto, iludindo não só os outros insetos, que ele deseja papar, mas até a\ngente?\nPois em contrário a todas as possibilidades, a esperança postara-se naquele trecho febril do Rio de\nJaneiro, não ligando para o tumulto, a pressa, o barulho, a poeira, o fumo de descarga dos\nveículos. Ele elegera o cocuruto da caixa da ECT para a habitação provisória. Ali estava, quieta,\nverde, ortóptera, saltadora mas imóvel, mimética mas em sua cor natural, estridulante mas\nsilenciosa, guardando todas as potencialidades: simplesmente esperança, esperança para servi-los.\nE em que servia a esperança ao povo que ia quase correndo e não lhe dava a mínima confiança?\nSó José Luís era capaz de sabê-lo, por ser o único a tomar conhecimento do inseto em cima da\ncaixa. Percebeu logo que a esperança cumpria delicada tarefa.\nEm primeiro lugar, oferecia ou tentava oferecer boas notícias nas cartas colocadas no interior da\ncaixa. Palavras de carinho, promessas de emprego, reconciliações, doente que ficou bom, dívida\nque se conseguir pagar, beijos. Talvez as cartas dissessem o contrário disso, mas a esperança\nconcentrava seu princípio influente nas próximas correspondências, as definitivas. Bem que a ECT\npodia designar a esperança para seu logotipo. Inseto ágil, pulando como ele só: imagem de\nvelocidade, que se vem conseguindo implantar no tráfego postal.\nEm seguida, a esperança dirigia-se a todos, que voltavam a Niterói ou vinham de lá; e ainda aos\navulsos, que ficam por aqui mesmo, e transitam na Praça. “Ó vós todos que passais, aqui estou\n(dizia a esperança em seu falar tetigonídeo, que o vulgo infelizmente não capisca) para que\nrepareis o meu verde e o guardeis na rotina pelo que ele vale. Vale o melhor. Vale a capacidade de\ntransformar o real em transreal e usufruir as coisas deleitáveis que esse pode distribuir em forma\nde paz de espírito e coração sensível. Nem tudo é sujo na vida. Há claridades. Mas a claridade\ncomeça dentro de você, de vós mesmos... Depois é que ela se espalha pela cidade e pela vida dos\noutros. Eu, a esperança, à maneira dos reis antigos, vos envio saudar.”\nNinguém ouviu, ninguém traduziu. Só José Luís, que documentou a presença da esperança,\nfotografando-a. Ia fotografar o crepúsculo, mas antes teve a sorte de fotografar nada menos que\numa virtude teologal em minúscula forma vivente.\nCarlos Drummond de Andrade",
    "statement": "Lido o texto, observe atentamente o quesito e assinale somente UMA alternativa correta\nNa transposição da voz ativa para a voz passiva ocorre uma INADEQUAÇÃO, que aparece na\nopção:",
    "options": [
      {
        "letter": "A",
        "text": "“Percebeu logo que a esperança cumpria delicada tarefa.” Percebeu logo que delicada tarefa era cumprida pela esperança.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Talvez as cartas dissessem o contrário disso.” O contrário disso talvez fosse dito pelas cartas.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“(...) desde então nunca mais o vira.”... desde então nunca mais fora visto por ele.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Quantas crianças de hoje conhecem a esperança?” A esperança é conhecida por quantas crianças de hoje?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“E elegera o cocoruto da caixa da ECT como habitação provisória.” E o cocoruto da caixa da ECT fora elegido como habitação provisória. ",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf7-q92",
    "listId": "pdf_7",
    "listTitle": "PDF 7 • Verbos (Aprofundamento & Concursos)",
    "questionNumber": 92,
    "readingText": "Leia atentamente o seguinte texto:\nSão Bernardo (Graciliano Ramos)\nConheci que Madalena era boa em demasia, mas não conheci tudo de uma vez. Ela se revelou\npouco a pouco, e nunca se revelou inteiramente. A culpa foi minha, ou antes, a culpa foi desta vida\nagreste, que me deu uma alma agreste.\nE, falando assim, compreendo que perco o tempo. Com efeito, se me escapa o retrato moral de\nminha mulher, para que serve esta narrativa? Para nada, mas sou forçado a escrever.\nQuando os grilos cantam, sento-me aqui à mesa da sala de jantar, bebo café, acendo o cachimbo.\nÀs vezes as idéias não vêm, ou vêm muito numerosas – e a folha permanece meio escrita, como\nestava na véspera. Releio algumas linhas, que me desagradam. Não vale a pena tentar corrigi-las.\nAfasto o papel.\nEmoções indefiníveis me agitam – inquietação terrível, desejo doido de voltar, tagarelar\nnovamente com Madalena, como fazíamos todos os dias, a esta hora. Saudade? Não, não é isto: é\ndesespero, raiva, um peso enorme no coração.\nProcuro recordar o que dizíamos. Impossível. As minhas palavras eram apenas palavras,\nreprodução imperfeita de fatos exteriores, e as dela tinham alguma coisa que não consigo exprimir.\nPara senti-las melhor, eu apagava as luzes, deixava que a sombra nos envolvesse até ficarmos dois\nvultos indistintos na escuridão.\nLá fora os sapos arengavam, o vento gemia, as árvores do pomar tornavam-se massas negras.\n– Casimiro!\nCasimiro Lopes estava no jardim, acocorado ao pé da janela, vigiando.\n– Casimiro!\nA figura de Casimiro Lopes aparece à janela, os sapos gritam, o vento sacode as árvores, apenas\nvisíveis na treva. Maria das Dores entra e vai abrir o comutador. Detenho-a: não quero luz.\nO tique-taque do relógio diminui, os grilos começam a cantar. E Madalena surge no lado de lá da\nmesa. Digo baixinho:\n– Madalena!\nA voz dela me chega aos ouvidos. Não, não é aos ouvidos. Também já não a vejo com os olhos.\nEstou encostado à mesa, as mãos cruzadas. Os objetos fundiram-se, e não enxergo sequer a\ntoalha branca.\n– Madalena...\nA voz de Madalena continua a acariciar-me. Que diz ela? Pede-me naturalmente que mande\nalgum dinheiro a mestre Caetano. Isto me irrita, mas a irritação é diferente das outras, é uma\nirritação antiga, que me deixa inteiramente calmo. Loucura estar uma pessoa ao mesmo tempo\nzangada e tranqüila. Mas estou assim. Irritado contra quem? Contra mestre Caetano. Não obstante\nele ter morrido, acho bom que vá trabalhar. Mandrião!\nA toalha reaparece, mas não sei se é esta toalha sobre que tenho as mãos cruzadas ou a que\nestava aqui há cinco anos.\nRumor do vento, dos sapos, dos grilos. A porta do escritório abre-se de manso, os passos de seu\nRibeiro afastam-se. Uma coruja pia na torre da igreja. Terá realmente piado a coruja? Será a\nmesma que piava há dois anos? Talvez seja até o mesmo pio daquele tempo.\nAgora seu Ribeiro está conversando com d. Glória no salão. Esqueço que eles me deixaram e que\nesta casa está quase deserta.\n– Casimiro!\nPenso que chamei Casimiro Lopes. A cabeça dele, com o chapéu de couro de sertanejo, assoma\nde quando em quando à janela, mas ignoro se a visão que me dá é atual ou remota.\nAgitam-se em mim sentimentos inconciliáveis: encolerizo-me e enterneço-me; bato na mesa e\ntenho vontade de chorar.\nSão Bernardo, Rio de Janeiro, Record, 1983.",
    "statement": "Lido o texto, observe atentamente o quesito e assinale somente UMA alternativa correta.\nEm uma das passagens abaixo, verifica-se a presença de um verbo intransitivo. Assinale a\nalternativa em que ele aparece.",
    "options": [
      {
        "letter": "A",
        "text": "“Releio algumas linhas, que me desagradam.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Emoções indefiníveis me agitam...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“...tagarelar novamente com Madalena, como fazíamos todos os dias, a esta hora.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "“Procuro recordar o que dizíamos.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Para senti-las melhor, eu apagava as luzes, deixava que a sombra nos envolvesse...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "AFA / EN / EFOMM / Concursos Militares"
  },
  {
    "id": "pdf16-q1",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 1,
    "statement": "Assinale a alternativa cujos verbos completam corretamente as seguintes frases:\n\n• Se ninguém ______ nesse caso, sabe lá Deus que fim terá.\n\n• No mesmo dia, ele ______ os documentos que perdera.\n\n• Foram designados alguns advogados para que ______ a banca examinadora.",
    "options": [
      {
        "letter": "A",
        "text": "intervir – reaveu – compossem",
        "correct": false,
        "explanation": "✗ INCORRETO: 'intervir' é infinitivo (o correto no futuro do subjuntivo é 'intervier'); 'reaveu' é erro crasso (o correto é 'reouve'); 'compossem' não existe (o correto é 'compusessem')."
      },
      {
        "letter": "B",
        "text": "intervier – reaveu – compossem",
        "correct": false,
        "explanation": "✗ INCORRETO: 'reaveu' é erro grave de conjugação do verbo defectivo/irregular reaver (forma correta: 'reouve'); 'compossem' é incorreto (correto: 'compusessem')."
      },
      {
        "letter": "C",
        "text": "intervir – reouve – compusessem",
        "correct": false,
        "explanation": "✗ INCORRETO: 'intervir' está no infinitivo impessoal, quando a oração condicional ('Se ninguém...') exige o futuro do subjuntivo 'intervier'."
      },
      {
        "letter": "D",
        "text": "intervier – reouve – compusessem",
        "correct": true,
        "explanation": "✓ CORRETO: 'intervier' (futuro do subjuntivo de intervir), 'reouve' (pretérito perfeito de reaver, mantendo a raiz de haver 'houve') e 'compusessem' (pretérito imperfeito do subjuntivo de compor, derivado de pôr 'pusessem')."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q2",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 2,
    "statement": "Se eu **correr** em busca dos meus sonhos, talvez **consiga** encontrá-los bem próximo a mim.\n\nNa frase acima, os verbos destacados encontram-se, respectivamente, no",
    "options": [
      {
        "letter": "A",
        "text": "infinitivo pessoal e presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) erra a identificação modal/temporal dos verbos destacados na oração condicional e optativa."
      },
      {
        "letter": "B",
        "text": "infinitivo pessoal e presente do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) erra a identificação modal/temporal dos verbos destacados na oração condicional e optativa."
      },
      {
        "letter": "C",
        "text": "futuro do subjuntivo e presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) erra a identificação modal/temporal dos verbos destacados na oração condicional e optativa."
      },
      {
        "letter": "D",
        "text": "futuro do subjuntivo e presente do subjuntivo.",
        "correct": true,
        "explanation": "✓ CORRETO: 'Se eu correr' está no Futuro do Subjuntivo (expressa hipótese futura) e 'talvez consiga' está no Presente do Subjuntivo (indica dúvida/desejo introduzido por 'talvez')."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q3",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 3,
    "readingText": "E como ontem **estivesse** chovendo, **tive** a infeliz ideia, ao sair à rua, de calçar um\nvelho par de galochas. Já me **desacostumara** delas, e me **sentia** a carregar nos pés\nalgo pesado, viscoso e desagradável.",
    "statement": "Os verbos destacados acima estão, respectivamente, no",
    "options": [
      {
        "letter": "A",
        "text": "pretérito perfeito do indicativo / pretérito imperfeito do subjuntivo / futuro do presente do indicativo / presente do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: Diverge da classificação sequencial exata dos quatro tempos pretéritos empregados no fragmento."
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito do subjuntivo / pretérito imperfeito do indicativo / pretérito perfeito do indicativo / pretérito imperfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: Diverge da classificação sequencial exata dos quatro tempos pretéritos empregados no fragmento."
      },
      {
        "letter": "C",
        "text": "pretérito perfeito do indicativo / pretérito perfeito do indicativo / pretérito mais-que-perfeito do indicativo / pretérito perfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: Diverge da classificação sequencial exata dos quatro tempos pretéritos empregados no fragmento."
      },
      {
        "letter": "D",
        "text": "pretérito imperfeito do subjuntivo / pretérito perfeito do indicativo / pretérito mais-que-perfeito do indicativo / pretérito imperfeito do indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO: 'estivesse' (pretérito imperfeito do subjuntivo), 'tive' (pretérito perfeito do indicativo), 'desacostumara' (pretérito mais-que-perfeito do indicativo simples) e 'sentia' (pretérito imperfeito do indicativo)."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q4",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 4,
    "readingText": "Os alienígenas vêm em missão de paz e trazem presentes.",
    "statement": "Mantendo-se o mesmo tempo e modo dos verbos, a transcrição do período acima para a primeira pessoa do plural resulta em:",
    "options": [
      {
        "letter": "A",
        "text": "Nós, alienígenas, viemos em missão de paz e trazemos presentes.",
        "correct": false,
        "explanation": "✗ INCORRETO: 'viemos' é pretérito perfeito do indicativo (ação passada), enquanto o enunciado original 'vêm' está no presente."
      },
      {
        "letter": "B",
        "text": "Nós, alienígenas, vimos em missão de paz e trazemos presentes.",
        "correct": true,
        "explanation": "✓ CORRETO: 'Nós vimos' é a 1ª pessoa do plural do Presente do Indicativo do verbo VIR (não confundir com viemos do pretérito) e 'trazemos' é o presente de trazer."
      },
      {
        "letter": "C",
        "text": "Nós, alienígenas, vemos em missão de paz e trouxemos presentes.",
        "correct": false,
        "explanation": "✗ INCORRETO: 'vemos' é do verbo VER (e não VIR) e 'trouxemos' é pretérito perfeito (e não presente)."
      },
      {
        "letter": "D",
        "text": "Nós, alienígenas, vimos em missão de paz e trouxemos presentes.",
        "correct": false,
        "explanation": "✗ INCORRETO: 'trouxemos' está no pretérito perfeito, alterando o tempo presente do verbo original 'trazem'."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q5",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 5,
    "readingText": "A evidência de que a terra era habitada não **impediu** que os marujos recém-desembarcados **gravassem** seus nomes e o de seus navios nas árvores e nas rochas costeiras e, a seguir, **imprimissem** o dia, o mês e o ano de seu desembarque (...).",
    "statement": "Passe os verbos em destaque no texto acima para o presente, observando o modo.\n\nEm seguida, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "impede – gravem – imprimam",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "impeça – gravam – imprimam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "impede – gravem – imprimem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "impeça – gravam – imprimem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q6",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 6,
    "statement": "Complete as lacunas abaixo com os verbos nos tempos e modos indicados entre parênteses; depois, assinale a alternativa com a sequência correta.\n\nI – Quando você ______ ao Brasil, traga-me uma bandeira do seu país. (vir – futuro do subjuntivo)\n\nII – No dia em que você ______ turistas eufóricos diante da Estátua da Liberdade, saberá que são brasileiros. (ver – futuro do subjuntivo)\n\nIII – Muitos turistas italianos ______ ao Brasil na Copa do Mundo. (vir – presente do indicativo)",
    "options": [
      {
        "letter": "A",
        "text": "vier – vir – vêm",
        "correct": true,
        "explanation": "✓ CORRETO: 'vier' (futuro do subjuntivo de vir), 'vir' (futuro do subjuntivo de ver) e 'vêm' (3ª pessoa do plural do presente do indicativo de vir, com acento circunflexo diferencial)."
      },
      {
        "letter": "B",
        "text": "vir – vir – vêm",
        "correct": false,
        "explanation": "✗ INCORRETO: Confunde as formas homônimas críticas dos verbos VER e VIR no futuro do subjuntivo (vir para ver / vier para vir) e a acentuação de 3ª do plural (vêm)."
      },
      {
        "letter": "C",
        "text": "vir – ver – vem",
        "correct": false,
        "explanation": "✗ INCORRETO: Confunde as formas homônimas críticas dos verbos VER e VIR no futuro do subjuntivo (vir para ver / vier para vir) e a acentuação de 3ª do plural (vêm)."
      },
      {
        "letter": "D",
        "text": "vier – ver – vem",
        "correct": false,
        "explanation": "✗ INCORRETO: Confunde as formas homônimas críticas dos verbos VER e VIR no futuro do subjuntivo (vir para ver / vier para vir) e a acentuação de 3ª do plural (vêm)."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q7",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 7,
    "readingText": "“Amigo, **abraça** tuas quedas e **tira** delas o conhecimento. Não te **deixes** abater.”",
    "statement": "Leia:\n\nOptando-se pela forma **você** em vez da forma **tu**, a alternativa que contém a correta conjugação verbal é",
    "options": [
      {
        "letter": "A",
        "text": "**Abrace** suas quedas e **tire** delas o conhecimento. Não se **deixe** abater.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "**Abraçai** suas quedas e **tirai** delas o conhecimento. Não se **deixai** abater.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "**Abraça** suas quedas e **tire** delas o conhecimento. Não se **deixa** abater.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "**Abrace** suas quedas e **tira** delas o conhecimento. Não se **deixa** abater.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q8",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 8,
    "statement": "Em qual das alternativas abaixo a flexão dos verbos está de acordo com a norma\nculta?",
    "options": [
      {
        "letter": "A",
        "text": "Prova que você tem bom caráter: devolva o dinheiro que você retirou do cofre!",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Em caso de dúvida, não tome nenhuma iniciativa: chame o responsável pelo setor.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Clica neste link e confira os resultados de todos os jogos do Campeonato Brasileiro",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Siga o conselho de nossos pais: economiza hoje para garantir uma velhice tranquila.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q9",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 9,
    "statement": "Relacione as colunas quanto à conjugação dos verbos em destaque e, em seguida, assinale a alternativa com a sequência correta.\n\n1 – O garoto **olhou** pela janela a noite enluarada.\n2 – **Havia** tempo para mais uma conversa séria.\n3 – Se **buscarmos** respostas, certamente as acharemos.\n4 – Não **desistas** de teus objetivos.\n5 – Eu jamais **imaginaria** encontrá-lo outra vez.\n\n( ) futuro do pretérito do indicativo\n( ) futuro do subjuntivo\n( ) pretérito perfeito do indicativo\n( ) pretérito imperfeito do indicativo\n( ) imperativo negativo",
    "options": [
      {
        "letter": "A",
        "text": "3 – 5 – 2 – 4 – 1",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "5 – 3 – 2 – 1 – 4",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "3 – 4 – 2 – 5 – 1",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "5 – 3 – 1 – 2 – 4",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q10",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 10,
    "statement": "Complete as lacunas abaixo com os verbos nos tempos e modos indicados entre parênteses; depois, assinale a alternativa com a sequência correta.\n\nI – Quando você ______ ao Brasil, traga-me uma bandeira do seu país. (vir – futuro do subjuntivo)\n\nII – No dia em que você ______ turistas eufóricos diante da Estátua da Liberdade, saberá que são brasileiros. (ver – futuro do subjuntivo)\n\nIII – Muitos turistas italianos ______ ao Brasil na Copa do Mundo. (vir – presente do indicativo)",
    "options": [
      {
        "letter": "A",
        "text": "vier – vir – vêm",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "vir – vir – vêm",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "vir – ver – vem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "vier – ver – vem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q11",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 11,
    "statement": "Coloque C (certo) ou E (errado) para a flexão de tempo e modo dos verbos destacados e, a seguir, assinale a alternativa com a sequência correta.\n\n( ) Quando vocês lhes **derem** essa boa notícia, eles não desistirão do curso. (futuro do subjuntivo)\n\n( ) Não é necessário que ele se **aborreça** por ter ela evitado o último encontro. (presente do indicativo)\n\n( ) Enquanto o cientista não obtiver todos os dados, não **terminará** a pesquisa. (futuro do pretérito do indicativo)",
    "options": [
      {
        "letter": "A",
        "text": "C, E, E",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "E, C, C",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "C, C, E",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "E, E, C",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q12",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 12,
    "statement": "Qual sequência de verbos no presente do subjuntivo completa corretamente as lacunas das frases abaixo?\n\n1 – Quem sabe ela ______ reverter a situação desagradável pela qual passou.\n2 – Possivelmente ______ o trem lotado, fato que não nos deve irritar jamais.\n3 – Os técnicos esperam que ______ chegar logo para a competição de futebol de salão.\n4 – Talvez os juízes ______ qualquer tentativa de suborno durante as apurações dos fatos.",
    "options": [
      {
        "letter": "A",
        "text": "consegue, tomamos, possemos, impedem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "consiga, tomemos, possamos, impeçam",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "consegue, tomemos, possemos, impedem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "consiga, tomamos, possamos, impeçam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q13",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 13,
    "statement": "Observe:\nOs policiais **investigaram** uma tentativa de sequestro e, antes que **ocorresse** o fato,\nnão se **demoraram** em questões burocráticas: anteciparam a prisão dos suspeitos.\nSubstituindo-se os verbos destacados, respectivamente, por **supor, advir e deter**, e\nmantendo o mesmo tempo e modo verbais, obtêm-se, corretamente,",
    "options": [
      {
        "letter": "A",
        "text": "suporam – advisse – deteram.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "suporam – advisse – detiveram.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "supuseram – adviesse – deteram.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "supuseram – adviesse – detiveram.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q14",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 14,
    "readingText": "“O tempo **fora** afastando aquelas amargas lembranças de minha memória. Se\nnão **fosse** assim, hoje **estaria** morto em vida.”",
    "statement": "Os verbos destacados nas frases acima estão conjugados, respectivamente, no",
    "options": [
      {
        "letter": "A",
        "text": "futuro do presente do indicativo – presente do subjuntivo – futuro do presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito do subjuntivo – pretérito imperfeito do subjuntivo – futuro do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "pretérito perfeito do indicativo – pretérito imperfeito do indicativo – futuro do pretérito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "pretérito mais-que-perfeito do indicativo – pretérito imperfeito do subjuntivo – futuro do pretérito do indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q15",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 15,
    "readingText": "Não **seria** incrível? **Imaginem** se, numa das viagens, vocês **pudessem** encontrar um\npersonagem importante da história, como Einstein, e ajudá-lo a elaborar suas teorias!\nJá pensaram nisso? As formas verbais destacadas no texto acima estão conjugadas,\nrespectivamente, no",
    "statement": "Leia: Amigos, um passeio numa máquina do tempo não seria divertido?",
    "options": [
      {
        "letter": "A",
        "text": "futuro do presente do indicativo / presente do subjuntivo / pretérito imperfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "futuro do pretérito do indicativo / imperativo afirmativo / pretérito imperfeito do subjuntivo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "pretérito imperfeito do subjuntivo / presente do subjuntivo / pretérito perfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "futuro do subjuntivo / imperativo afirmativo / pretérito perfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q16",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 16,
    "statement": "Assinale a alternativa em que o verbo destacado está no tempo composto.",
    "options": [
      {
        "letter": "A",
        "text": "O doutor Meneses **vai galgar** a soleira da porta com esforço.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "O doutor Meneses **tem galgado** a soleira da porta com esforço.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "O doutor Meneses **começou a galgar** a soleira da porta com esforço.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "A soleira da porta **foi galgada** com esforço pelo doutor Meneses.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q17",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 17,
    "readingText": "Considere as seguintes frases:\nI – Os policiais **deteram** o infrator em flagrante delito.\nII – Quando vocês **comporem** obras de grande valor literário, poderão divulgá-las.\nIII – Se eles se **opusessem** ao projeto, nada seria possível.\nIV – Se nós **obtivermos** êxito, dedicaremos tudo a você!",
    "statement": "Quanto às formas verbais destacadas, estão corretas\nsomente",
    "options": [
      {
        "letter": "A",
        "text": "I e III.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "II e IV.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "III e IV.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "I e II.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q18",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 18,
    "statement": "Observe os verbos destacados.\n\n“**Denuncie.** Se você recebeu uma proposta sem referência para melhorar de vida, **desconfie**. Nunca **entregue** seu caráter a ninguém.”\n\nOs verbos destacados apresentam-se em qual modo?",
    "options": [
      {
        "letter": "A",
        "text": "No indicativo, pois exprimem um fato certo de se realizar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "No subjuntivo, porque são formas verbais que enunciam um fato hipotético.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "No imperativo, pois os verbos destacados estão exprimindo ordem, conselho e pedido.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "No indicativo, porque as formas verbais enunciam um fato possível de acontecer.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q19",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 19,
    "statement": "**Corríamos** atrás uns dos outros na nossa infância. **Corremos**, hoje, atrás da felicidade de outrora.\n\nNas frases acima, os verbos destacados encontram-se, respectivamente, no:",
    "options": [
      {
        "letter": "A",
        "text": "Pretérito perfeito do indicativo – Presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Pretérito imperfeito do indicativo – Presente do indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Pretérito imperfeito do indicativo – Pretérito perfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Pretérito imperfeito do indicativo – Pretérito mais que perfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q20",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 20,
    "readingText": "“Se soubésseis o quanto era aprazível ouvir, mergulhar nas histórias de minha velha avó, não só os ouvidos, mas cada centímetro do ‘lado de dentro do corpo’ ______ a pulsar com tudo o que sua voz desenhava.”",
    "statement": "Complete o espaço demarcado no texto com a correta conjugação do verbo pôr.",
    "options": [
      {
        "letter": "A",
        "text": "Poriam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Poríeis",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Porias",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Poria",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q21",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 21,
    "statement": "Em qual alternativa a lacuna não pode ser preenchida com o verbo indicado nos parênteses no modo subjuntivo?\n\nA) Era necessário que outra pessoa ______ a liderança. (assumir)\nB) Saiu sorrateiramente, sem que ninguém ______ a sua ausência. (notar)\nC) Acordou de madrugada, esperando que alguém lhe ______ um copo d’água. (dar)\nD) O encarregado me denunciou para o patrão: disse que eu sempre ______ atrasado. (chegar)",
    "options": [
      {
        "letter": "A",
        "text": "Era necessário que outra pessoa a liderança. (assumir)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Saiu sorrateiramente, sem que ninguém a sua ausência. (notar)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Acordou de madrugada, esperando que alguém lhe um copo d’água. (dar)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O encarregado me denunciou para o patrão: disse que eu sempre atrasado. (chegar)",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q22",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 22,
    "statement": "Em qual alternativa a lacuna não pode ser preenchida com o verbo indicado nos parênteses no modo subjuntivo?\n\nA) Era necessário que outra pessoa ______ a liderança. (assumir)\nB) Saiu sorrateiramente, sem que ninguém ______ a sua ausência. (notar)\nC) Acordou de madrugada, esperando que alguém lhe ______ um copo d’água. (dar)\nD) O encarregado me denunciou para o patrão: disse que eu sempre ______ atrasado. (chegar)",
    "options": [
      {
        "letter": "A",
        "text": "Era necessário que outra pessoa a liderança. (assumir)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Saiu sorrateiramente, sem que ninguém a sua ausência. (notar)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Acordou de madrugada, esperando que alguém lhe um copo d’água. (dar)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "O encarregado me denunciou para o patrão: disse que eu sempre atrasado. (chegar)",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q23",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 23,
    "statement": "Assinale a alternativa em que o verbo está corretamente conjugado.",
    "options": [
      {
        "letter": "A",
        "text": "Se eu pôr todo o meu dinheiro neste investimento, estarei me arriscando.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Embora essa aplicação seje bastante rentável, é um investimento de alto risco.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Se ela reavesse o dinheiro que perdeu, iria investi-lo em uma aplicação de baixo risco.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Se eles expuserem os riscos do mercado para mim, poderei analisar a situação com mais segurança.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q24",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 24,
    "readingText": "“**Sentia-se** cansada. A barriga, as pernas, a cabeça, o corpo todo **era** um enorme peso que lhe **caía** irremediavelmente em cima. Esp**era**va que a qualquer momento o coração lhe **perfurasse** o peito, lhe **rasgasse** a blusa. Como **seria** o coração?” (Dina Salústio)",
    "statement": "Os verbos destacados no texto acima estão conjugados, respectivamente, no",
    "options": [
      {
        "letter": "A",
        "text": "pretérito perfeito do indicativo - pretérito imperfeito do indicativo - pretérito imperfeito do indicativo - futuro do presente do indicativo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito do indicativo - pretérito imperfeito do subjuntivo - futuro do pretérito do indicativo - pretérito imperfeito do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "pretérito-mais-que-perfeito do indicativo - pretérito imperfeito do indicativo - futuro do subjuntivo - pretérito imperfeito do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "pretérito imperfeito do indicativo - pretérito imperfeito do indicativo - pretérito imperfeito do subjuntivo - futuro do pretérito do indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q25",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 25,
    "statement": "Considerando a flexão dos verbos, assinale a alternativa correta.",
    "options": [
      {
        "letter": "A",
        "text": "Edgar se entreteu diante daquela cena.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Tudo dará certo, se você manter a boca fechada.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Ele só poderá fazer a prova depois que repor as aulas.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Assim que interpuséssemos recurso, as providências seriam tomadas.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q26",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 26,
    "readingText": "“Todas as manhãs, antes de a aurora anunciar o dia, o galo-da-campina **punha-se a cantar** emitindo notas maviosas, ritmadas.” (Adalberon C. Lins)",
    "statement": "O verbo da segunda conjugação, na frase acima, encontra-se no",
    "options": [
      {
        "letter": "A",
        "text": "presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "pretérito perfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "pretérito imperfeito do indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "pretérito imperfeito do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q27",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 27,
    "statement": "Assinale a alternativa que está correta quanto à flexão verbal.",
    "options": [
      {
        "letter": "A",
        "text": "Se os chefes virem o projeto, eles aceitarão a minha ideia.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Se meu chefe intervisse, talvez eu recebesse aumento salarial.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Quando você vir para a empresa, traga o projeto.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Quando ele rever o contrato, estaremos mais seguros.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Meu chefe interviu por mim junto à diretoria.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q28",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 28,
    "statement": "**Voltem** logo para casa hoje, meninas, pois meus pais **exigem** que **estejam** presentes à cerimônia de formatura do meu irmão à noite, na faculdade. Vocês não **podem** faltar, ou eles ficarão aborrecidos.\n\nOs verbos destacados encontram-se conjugados, respectivamente, no",
    "options": [
      {
        "letter": "A",
        "text": "presente do subjuntivo, imperativo afirmativo, presente do subjuntivo, presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "imperativo afirmativo, presente do indicativo, presente do subjuntivo, presente do indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "presente do subjuntivo, imperativo afirmativo, presente do indicativo, imperativo afirmativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "imperativo afirmativo, presente do indicativo, presente do indicativo, imperativo afirmativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q29",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 29,
    "statement": "São exemplos de verbos da 2ª conjugação:",
    "options": [
      {
        "letter": "A",
        "text": "cantar, ficar, remar e amar",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "compor, depor, dever e temer",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "sorrir, partir, dormir",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "remar, receber, dever e dormir",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "fugir, ir, dormir e sorrir.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf16-q30",
    "listId": "pdf_16",
    "listTitle": "PDF 16 • Modos Verbais I",
    "questionNumber": 30,
    "statement": "Assinale a alternativa em que **não** há erro na flexão do verbo.",
    "options": [
      {
        "letter": "A",
        "text": "Ninguém se adequa facilmente a um ambiente insalubre.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Assim que ele repor as aulas que perdeu, poderemos marcar a data da prova.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Se você pedir desculpas a ele e dizer a verdade, tudo poderá voltar ao normal.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Diante do fervor dos ânimos, eu intervim para que a situação não ficasse mais complicada.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q1",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 1,
    "statement": "O verbo \"ser\" foi usado algumas vezes. Assinale a alternativa em que o verbo SER\nesteja conjugado na terceira pessoa do singular do futuro do subjuntivo:",
    "options": [
      {
        "letter": "A",
        "text": "Será.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Seria.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "For.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Ser.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Seja.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q2",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 2,
    "statement": "“Eu quis, com todas as minhas forças(...)”, ao mudar a pessoa verbal, houve falha\nna conjugação em:",
    "options": [
      {
        "letter": "A",
        "text": "Tu quissesse.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Ele quis.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Nós quisemos.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Vós quisestes.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q3",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 3,
    "statement": "No trecho “Lamento, não vai acontecer”, as formas no futuro do presente e do futuro do pretérito do verbo lamentar são, respectivamente:",
    "options": [
      {
        "letter": "A",
        "text": "Lamentarei/lamentaria.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Lamente/lamentasse,",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Lamentara/lamenta.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Lamenta/lamentei.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q4",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 4,
    "statement": "Analise as palavras destacadas no fragmento “Quando dizemos palavras que **entusiasmam**, dizendo coisas que **trarão** paz, harmonia e felicidade para as pessoas que **estão** à nossa volta.” Quais os tempos verbais dessas palavras, respectivamente?",
    "options": [
      {
        "letter": "A",
        "text": "Pretérito, presente, futuro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Presente, futuro, presente.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Presente, pretérito, pretérito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Presente, futuro, futuro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Pretérito, futuro, presente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q5",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 5,
    "statement": "“(...) **seja** na nossa carreira, **seja** no nosso trabalho, **seja** na família, **seja** no atingimento de algum objetivo.”\n\nPara dar ênfase ao valor da persistência, o autor empregou a forma verbal no:",
    "options": [
      {
        "letter": "A",
        "text": "presente do subjuntivo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "futuro do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "futuro do presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q6",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 6,
    "statement": "Leia o fragmento seguinte e responda à questão: “Ele **chegara** a afirmar, em outro episódio, que era uma ‘luta perdida’.”\n\nO verbo ‘**chegara**’ sinaliza uma ação no passado, anterior a outro fato ocorrido no passado. Logo, o tempo verbal empregado foi do:",
    "options": [
      {
        "letter": "A",
        "text": "pretérito mais que perfeito.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "pretérito perfeito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "futuro do pretérito.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "futuro do presente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q7",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 7,
    "statement": "“(...) **seja** na nossa carreira, **seja** no nosso trabalho, **seja** na família, **seja** no atingimento de algum objetivo.”\n\nPara dar ênfase ao valor da persistência, o autor empregou a forma verbal no:",
    "options": [
      {
        "letter": "A",
        "text": "presente do subjuntivo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "pretérito imperfeito do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "futuro do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "futuro do presente do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q8",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 8,
    "statement": "“Não escolhas a tua esposa num baile, mas num campo de trigo durante a colheita.”\n(ditado esloveno) Se trocássemos o imperativo negativo “Não escolhas” pela forma\nafirmativa, a forma verbal correta seria",
    "options": [
      {
        "letter": "A",
        "text": "escolhas.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "escolha.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "escolhes.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "escolhe.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "escolher.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q9",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 9,
    "statement": "Está flexionada no modo imperativo a forma verbal destacada no verso:",
    "options": [
      {
        "letter": "A",
        "text": "“Não <u>permita</u>...”;",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“...que eu <u>morra</u>”;",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“Sem que eu <u>volte</u>...”;",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“ Sem que <u>desfrute</u>...;",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“Sem qu’inda <u>aviste</u>...”;",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q10",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 10,
    "statement": "Alternativa que corresponde ao emprego correto do verbo cantar na\nsegunda pessoa do plural do pretérito imperfeito",
    "options": [
      {
        "letter": "A",
        "text": "Cantei",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Cantarei",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Cantásseis",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Cantava",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q11",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 11,
    "readingText": "Observe as orações abaixo:\n\n1) “A jabuticabeira **cresceria** em graça e beleza caso...”\n2) “...talvez **reconheça** a primeira imagem que lhe mostrem...”\n3) “É como se nós mesmos **desejássemos** plantar no chão.”",
    "statement": "Assinale a alternativa que indica a ordem em que os verbos em destaque estão flexionados:",
    "options": [
      {
        "letter": "A",
        "text": "Futuro do pretérito do indicativo, futuro do subjuntivo, imperfeito do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Futuro do pretérito do indicativo, presente do subjuntivo, imperfeito do subjuntivo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Futuro do presente do indicativo, presente do subjuntivo, futuro do subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Pretérito Imperfeito do indicativo, imperfeito do subjuntivo, imperfeito do indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q12",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 12,
    "statement": "Assinale a alternativa que preenche as lacunas corretamente.\n\nI – Ele ficará maravilhado se ______ o resultado. (ver)\nII – Nós lhe daremos o recado assim que ele ______ aqui. (vir)",
    "options": [
      {
        "letter": "A",
        "text": "Vir, vir.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Vê, vier.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Ver, vir.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Vir, vier",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q13",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 13,
    "statement": "O verbo destacado na frase “Para nunca se separar de sua esposa, o índio macuxi **teceu** uma tipóia...” está no",
    "options": [
      {
        "letter": "A",
        "text": "Presente do Subjuntivo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Presente do Indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Pretérito Perfeito do Indicativo.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Futuro do Presente do Indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Futuro do Pretérito do Indicativo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q14",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 14,
    "statement": "Assinale a alternativa em que o tempo e modo do verbo destacado\nestá corretamente identificado entre parênteses.",
    "options": [
      {
        "letter": "A",
        "text": "“Se **fosse** necessário...” (pretérito imperfeito do subjuntivo)",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "“... os garotos **teriam** a resposta...” ( pretérito imperfeito do indicativo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "“... e **saibam** dosar o que é permitido ou não...” (futuro do subjuntivo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Pelo menos um dos pais **tirava** férias no inverno. (pretérito perfeito do indicativo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q15",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 15,
    "readingText": "“**Perderíamos** muito com essa mudança.”",
    "statement": "“**Perderíamos** muito com essa mudança.”\n\nAssinale a alternativa que não corresponde ao modo e tempo da forma verbal em destaque.",
    "options": [
      {
        "letter": "A",
        "text": "Perderias.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Perderiam.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Perderíeis.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Perderei.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "Perderia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q16",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 16,
    "statement": "O radical do verbo encontrado no período “Ele **suava** durante o jantar” é:",
    "options": [
      {
        "letter": "A",
        "text": "jant",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "janta",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "su",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "sua",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q17",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 17,
    "statement": "As formas **aquece**, **era** e **olhávamos** estão empregadas, respectivamente, nos tempos:\n\nA neve caindo **aquece** o meu coração. **Era** horário de trabalho e as pessoas entravam e saíam dos edifícios. E nós também **olhávamos** para o céu com os olhos daquele menino...",
    "options": [
      {
        "letter": "A",
        "text": "presente – pretérito e presente",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "pretérito – presente e pretérito",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "presente – pretérito e pretérito",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "pretérito – pretérito e presente",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "presente – presente e pretérito",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q18",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 18,
    "statement": "A forma verbal destacada atende às exigências da norma-padrão da\nlíngua portuguesa em:",
    "options": [
      {
        "letter": "A",
        "text": "Ao digitar as senhas em público, é necessário que **confiremos** se há pessoas estranhas nos observando para garantir a segurança virtual.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "As informações pessoais deveriam ser digitadas de forma condensada para que **cabessem** todas no espaço próprio do questionário socioeconômico.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Os meios eletrônicos contribuem para que os estudantes **retenham** a maior parte das informações necessárias ao bom desempenho escolar.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Para evitar a espionagem virtual é preciso que nós não **consintemos** na utilização dos nossos dados pessoais ao instalar novos aplicativos no celular.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Quando algum consumidor **querer** comprar o último modelo de smartphone, pode agredir outros componentes da fila para tomar seu lugar.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q19",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 19,
    "statement": "“... que <u>possa</u> garantir a vida na Terra.”\n\nO verbo empregado nos mesmos tempo e modo em que se encontra a forma grifada acima está na frase:",
    "options": [
      {
        "letter": "A",
        "text": "... que a Terra suporta?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "... as estimativas variaram entre...",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "... afirma o geógrafo Álvaro Luiz Heidrich.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "... a população da Terra cresceu mais de 40 vezes...",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "... que em 2050 tenhamos 9,3 bilhões de pessoas...",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial E): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      }
    ],
    "correctLetter": "E",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q20",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 20,
    "statement": "Assinale a frase em que todas as formas verbais estão corretamente empregadas.",
    "options": [
      {
        "letter": "A",
        "text": "Tu ouviste quando ela contou que Liane trouxe uma barraca?",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial A): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "B",
        "text": "Tu ouviu quando ela contou que Liane trosse uma barraca?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Tu ouvistes quando ela contou que Liane trouxe uma barraca?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Tu ouviu quando ela contou que Liane trousse uma barraca?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Tu ouviste quando ela contou que Liane trousse uma barraca?",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "A",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q21",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 21,
    "statement": "Em qual das alternativas abaixo o verbo em destaque está\ncorretamente flexionado?",
    "options": [
      {
        "letter": "A",
        "text": "Os grevistas se **manteram** na entrada da fábrica durante todo o horário do expediente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "É bom que **creiamos** em todas as informações enviadas pelo médico de plantão.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Os professores **interviram** em defesa do aluno que foi punido injustamente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Quem se **propor** a fazer esse trabalho tem que ser muito competente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q22",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 22,
    "statement": "Assinale a alternativa que identifica correta e respectivamente as formas verbais fazia, eram e haverá, indicadas no enunciado.",
    "options": [
      {
        "letter": "A",
        "text": "pretérito perfeito do indicativo; pretérito imperfeito do indicativo; futuro do presente do indicativo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "pretérito mais-que-perfeito do indicativo; pretérito perfeito do indicativo; presente do indicativo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "pretérito imperfeito do indicativo; pretérito imperfeito do indicativo; futuro do presente do indicativo",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "pretérito perfeito do indicativo; pretérito perfeito do indicativo; futuro do pretérito do indicativo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "pretérito mais-que-perfeito do indicativo; pretérito imperfeito do indicativo; presente do indicativo",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q23",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 23,
    "statement": "“**Perderíamos** muito com essa mudança.”\n\nAssinale a alternativa que não corresponde ao modo e tempo da forma verbal em destaque.",
    "options": [
      {
        "letter": "A",
        "text": "Perderias.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Perderiam.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Perderíeis.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Perderei.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial D): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "E",
        "text": "Perderia.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "D",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q24",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 24,
    "statement": "O verbo pertence à segunda conjugação na alternativa:",
    "options": [
      {
        "letter": "A",
        "text": "Dividimos o pão.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Falaram mal de você.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (B) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "C",
        "text": "Pusemos o livro no armário.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial C): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "D",
        "text": "Agrediram os torcedores rubro-negros.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "C",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q25",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 25,
    "statement": "O verbo está no futuro do pretérito na alternativa:",
    "options": [
      {
        "letter": "A",
        "text": "Dentro do banco, Maria contava o dinheiro.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "Eu gostaria de ler todos os aqueles livros.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Desejo que Lucas encontre o caminho certo.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "Júlia não entenderá a minha crítica.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q26",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 26,
    "statement": "Assinale a alternativa cujos modo e tempo da forma verbal em destaque na frase\nestão corretamente indicados entre parênteses.",
    "options": [
      {
        "letter": "A",
        "text": "Um dia após o terremoto, o governo da Indonésia **declarou** estado de emergência. ( presente do indicativo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "A Copa da Cultura **animará** Berlim durante a copa do mundo. (futuro do presente do indicativo)",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "O governo federal **anuncia** R$ 10 bilhões para a agricultura familiar. (pretérito mais-que-perfeito do indicativo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "As crianças que **estavam** descalças tremeram de frio. (pretérito perfeito do indicativo)",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "Machado de Assis **escreveu** contos imortais. (pretérito imperfeito do indicativo).",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q27",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 27,
    "statement": "Assinale a alternativa que completa corretamente a seguinte frase.\n\n“Quando ______ mais aperfeiçoados, os aviões, certamente, ______ maior conforto e segurança em qualquer viagem.”",
    "options": [
      {
        "letter": "A",
        "text": "estivessem – proporcionariam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "estiverem – proporcionarão",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "estejam – proporcionam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "estão – proporcionariam",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "estivessem – proporcionarem",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q28",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 28,
    "statement": "A frase abaixo cujo verbo expressa uma ação no passado é:",
    "options": [
      {
        "letter": "A",
        "text": "“Isso **facilita** o seu aproveitamento industrial”.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“... não se **soube** explicar como os pinheiros...”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "“Essa ave [...] **alimenta**-se de pinhões...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Essas sementes esquecidas **germinam**...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“... a gralha azul **enterra** o pinhão com a extremidade mais fina...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q29",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 29,
    "statement": "A forma verbal “poderia” em “Esse artigo bem que poderia ser chamado\nLágrimas por Bucha. O que aconteceu na cidade situada nos arredores de Kiev é\ninominável.” representa um fato não concluído assim como ocorre com a forma\nverbal destacada em:",
    "options": [
      {
        "letter": "A",
        "text": "Tu **foste** feliz em uma época distante.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "O diretor disse que **renunciaria** ao cargo ontem.",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "Ele **estivera** naquela região, lembro-me perfeitamente.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "**Amara** tão intensamente que sua saúde ficou comprometida.",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  },
  {
    "id": "pdf17-q30",
    "listId": "pdf_17",
    "listTitle": "PDF 17 • Modos Verbais II",
    "questionNumber": 30,
    "statement": "Em todas as frases a seguir, transcritas do texto, as formas verbais estão\nflexionadas o mesmo tempo, EXCETO:",
    "options": [
      {
        "letter": "A",
        "text": "“Barão vem antes de conde,...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (A) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "B",
        "text": "“Eu levaria o dicionário para a ilha deserta.”",
        "correct": true,
        "explanation": "✓ CORRETO (Gabarito Oficial B): Esta alternativa atende rigorosamente à norma-padrão gramatical e às regras de flexão, modo ou aspecto verbal solicitadas no enunciado."
      },
      {
        "letter": "C",
        "text": "“Os senhores todos conhecem a pergunta famosa...”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (C) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "D",
        "text": "“Ali, o que governa é a disciplina das letras.”",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (D) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      },
      {
        "letter": "E",
        "text": "“O dicionário responde a todas as curiosidades,...\" GABARITO – 2 – MODOS VERBAIS 1) C 2) A 3) A 4) B 5) A 6) A 7) A 8) D 9) A 10) D 11) B 12) D 13) C 14) A 15) D 16) C 17) C 18) C 19) E 20) A 21) B 22) C 23) D 24) C 25) B 26) B 27) B 28) B 29) B 30) B",
        "correct": false,
        "explanation": "✗ INCORRETO: A alternativa (E) apresenta inadequação de flexão verbal, tempo, modo, concordância ou regência conforme a gramática normativa."
      }
    ],
    "correctLetter": "B",
    "banca": "Tropa do Arcanjo / EEAr / EsPCEx"
  }
];
