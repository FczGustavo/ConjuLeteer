import type { MilitaryQuestion } from '../types/verbs';

export const MILITARY_QUESTIONS: MilitaryQuestion[] = [
  // --- QUESTÕES EXTRAÍDAS DO PDF 16 (Modos Verbais I) ---
  {
    id: 'pdf16-q01',
    archetype: 'lacuna_derivado',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['intervir', 'reaver', 'compor'],
    ruleContext: 'Conjugação de derivados no subjuntivo e pretérito.',
    statement: 'Assinale a alternativa cujos verbos completam corretamente as seguintes frases:\n\n• Se ninguém ________ nesse caso, sabe lá Deus que fim terá.\n• No mesmo dia, ele ________ os documentos que perdera.\n• Foram designados alguns advogados para que ________ a banca examinadora.',
    options: [
      { letter: 'A', text: 'intervir – reaveu – compossem', correct: false, explanation: 'Inadequado: "intervir" não é futuro do subjuntivo, "reaveu" não existe e "compossem" erra a raiz de pôr.' },
      { letter: 'B', text: 'intervier – reaveu – compossem', correct: false, explanation: 'Inadequado: "reaveu" e "compossem" são formas inexistentes na norma culta.' },
      { letter: 'C', text: 'intervir – reouve – compusessem', correct: false, explanation: 'Inadequado: a oração condicional futura exige "intervier" (e não o infinitivo "intervir").' },
      { letter: 'D', text: 'intervier – reouve – compusessem', correct: true, explanation: 'Correto: intervier (futuro subjuntivo de intervir), reouve (pretérito perfeito de reaver) e compusessem (pretérito imperfeito subjuntivo de compor).' }
    ],
    resolutionCommentary: 'Intervir faz "intervier" no futuro do subjuntivo; reaver segue haver nas formas com "v" (reouve); compor segue pôr no pretérito imperfeito do subjuntivo (compusessem).'
  },
  {
    id: 'pdf16-q02',
    archetype: 'identificacao_morfologica',
    bancaTarget: 'EEAr',
    difficulty: 'facil',
    targetVerbs: ['correr', 'conseguir'],
    ruleContext: 'Reconhecimento de tempos do subjuntivo em orações subordinadas.',
    statement: '“Se eu correr em busca dos meus sonhos, talvez consiga encontrá-los bem próximo a mim.”\n\nNa frase acima, os verbos destacados encontram-se, respectivamente, no:',
    options: [
      { letter: 'A', text: 'infinitivo pessoal e presente do indicativo.', correct: false, explanation: '"Correr" após conjunção condicional "se" é futuro do subjuntivo.' },
      { letter: 'B', text: 'infinitivo pessoal e presente do subjuntivo.', correct: false, explanation: '"Correr" não é infinitivo pessoal, expressa hipótese futura no subjuntivo.' },
      { letter: 'C', text: 'futuro do subjuntivo e presente do indicativo.', correct: false, explanation: '"Consiga" após o advérbio de dúvida "talvez" está no presente do subjuntivo.' },
      { letter: 'D', text: 'futuro do subjuntivo e presente do subjuntivo.', correct: true, explanation: 'Correto: "correr" é futuro do subjuntivo (introduzido por "se") e "consiga" é presente do subjuntivo (introduzido por "talvez").' }
    ],
    resolutionCommentary: 'A conjunção "se" com ideia de hipótese futura exige futuro do subjuntivo (se eu correr). O advérbio "talvez" atrai o presente do subjuntivo (que eu consiga).'
  },
  {
    id: 'pdf16-q04',
    archetype: 'imperativo_conversao',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['vir', 'trazer'],
    ruleContext: 'Flexão de 3ª do plural para 1ª do plural no presente do indicativo.',
    statement: 'Leia:\n“Os alienígenas vêm em missão de paz e trazem presentes.”\n\nMantendo-se o mesmo tempo e modo dos verbos, a transcrição do período acima para a primeira pessoa do plural resulta em:',
    options: [
      { letter: 'A', text: 'Nós, alienígenas, viemos em missão de paz e trazemos presentes.', correct: false, explanation: '"Viemos" é pretérito perfeito do indicativo.' },
      { letter: 'B', text: 'Nós, alienígenas, vimos em missão de paz e trazemos presentes.', correct: true, explanation: 'Correto: "vimos" é a 1ª pessoa do plural do presente do indicativo do verbo vir (eu venho, tu vens, ele vem, nós vimos).' },
      { letter: 'C', text: 'Nós, alienígenas, vemos em missão de paz e trouxemos presentes.', correct: false, explanation: '"Vemos" é do verbo ver e "trouxemos" é pretérito perfeito.' },
      { letter: 'D', text: 'Nós, alienígenas, vimos em missão de paz e trouxemos presentes.', correct: false, explanation: '"Trouxemos" altera o tempo para o pretérito.' }
    ],
    resolutionCommentary: 'Presente do indicativo de VIR na 1ª pessoa do plural é "vimos" (nós vimos hoje). Trazer no presente do indicativo na 1ª pessoa do plural é "trazemos".'
  },
  {
    id: 'pdf16-q06',
    archetype: 'homonimos_temporais',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['vir', 'ver'],
    ruleContext: 'Distinção entre futuro do subjuntivo de VIR e VER e presente de VIR.',
    statement: 'Complete as lacunas abaixo com os verbos nos tempos e modos indicados entre parênteses:\n\nI- Quando você ________ ao Brasil, traga-me uma bandeira do seu país. (vir – futuro do subjuntivo)\nII- No dia em que você ________ turistas eufóricos diante da Estátua da Liberdade, saberá que são brasileiros. (ver – futuro do subjuntivo)\nIII- Muitos turistas italianos ________ ao Brasil na Copa do Mundo. (vir – presente do indicativo)',
    options: [
      { letter: 'A', text: 'vier – vir – vêm', correct: true, explanation: 'Correto: vir no futuro do subjuntivo faz "vier"; ver no futuro do subjuntivo faz "vir"; vir na 3ª pessoa do plural do presente faz "vêm" (com circunflexo).' },
      { letter: 'B', text: 'vir – vir – vêm', correct: false, explanation: 'A 1ª lacuna exige "vier" (futuro de vir).' },
      { letter: 'C', text: 'vir – ver – vem', correct: false, explanation: 'A 1ª lacuna exige "vier", a 2ª exige "vir" e a 3ª exige "vêm".' },
      { letter: 'D', text: 'vier – ver – vem', correct: false, explanation: 'A 2ª lacuna exige "vir" e a 3ª exige "vêm" (plural).' }
    ],
    resolutionCommentary: 'Futuro do subjuntivo: VIR -> quando você vier; VER -> quando você vir. Presente do indicativo: eles vêm (com acento circunflexo diferencial de plural).'
  },
  {
    id: 'pdf16-q07',
    archetype: 'imperativo_conversao',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['abraçar', 'tirar', 'deixar'],
    ruleContext: 'Transposição de Imperativo do tratamento Tu para Você.',
    statement: 'Leia:\n“Amigo, abraça tuas quedas e tira delas o conhecimento. Não te deixes abater.”\n\nOptando-se pela forma você em vez da forma tu, a alternativa que contém a correta conjugação verbal é:',
    options: [
      { letter: 'A', text: 'Abrace suas quedas e tire delas o conhecimento. Não te deixes abater.', correct: false, explanation: 'Mistura pronomes de você (suas) com tu (não te deixes).' },
      { letter: 'B', text: 'Abraçai suas quedas e tirai delas o conhecimento. Não se deixai abater.', correct: false, explanation: 'Formas misturadas com a 2ª pessoa do plural (vós).' },
      { letter: 'C', text: 'Abrace suas quedas e tire delas o conhecimento. Não se deixe abater.', correct: true, explanation: 'Correto: abrace (você), tire (você) e não se deixe (você) derivam todas do presente do subjuntivo.' },
      { letter: 'D', text: 'Abrace suas quedas e tira delas o conhecimento. Não se deixa abater.', correct: false, explanation: '"Tira" e "não se deixa" mantêm formas incorretas para o tratamento de você.' }
    ],
    resolutionCommentary: 'O imperativo afirmativo e negativo para "você" é extraído diretamente do presente do subjuntivo: abrace você, tire você, não se deixe você abater.'
  },
  {
    id: 'pdf16-q13',
    archetype: 'lacuna_derivado',
    bancaTarget: 'EEAr',
    difficulty: 'dificil',
    targetVerbs: ['supor', 'advir', 'deter'],
    ruleContext: 'Substituição de verbos preservando o tempo e modo exatos.',
    statement: 'Observe:\n“Os policiais investigaram uma tentativa de sequestro e, antes que ocorresse o fato, não se demoraram em questões burocráticas: anteciparam a prisão dos suspeitos.”\n\nSubstituindo-se os verbos destacados, respectivamente, por supor, advir e deter, e mantendo o mesmo tempo e modo verbais, obtêm-se, corretamente:',
    options: [
      { letter: 'A', text: 'suporam – advisse – deteram.', correct: false, explanation: 'Formas "suporam", "advisse" e "deteram" são erros graves de flexão.' },
      { letter: 'B', text: 'suporam – advisse – detiveram.', correct: false, explanation: '"Suporam" e "advisse" não existem na norma culta.' },
      { letter: 'C', text: 'supuseram – adviesse – deteram.', correct: false, explanation: '"Deteram" é incorreto; o pretérito perfeito de deter é "detiveram".' },
      { letter: 'D', text: 'supuseram – adviesse – detiveram.', correct: true, explanation: 'Correto: supuseram (pret. perfeito), adviesse (pret. imperfeito subjuntivo) e detiveram (pret. perfeito).' }
    ],
    resolutionCommentary: 'Supor segue pôr (eles supuseram); advir segue vir (antes que adviesse); deter segue ter (eles não se detiveram).'
  },
  {
    id: 'pdf16-q17',
    archetype: 'lacuna_derivado',
    bancaTarget: 'EEAr',
    difficulty: 'dificil',
    targetVerbs: ['deter', 'compor', 'opor', 'obter'],
    ruleContext: 'Identificação de correção em orações com verbos derivados.',
    statement: 'Considere as seguintes frases:\n\nI – Os policiais deteram o infrator em flagrante delito.\nII – Quando vocês comporem obras de grande valor literário, poderão divulgá-las.\nIII – Se eles se opusessem ao projeto, nada seria possível.\nIV – Se nós obtivermos êxito, dedicaremos tudo a você!\n\nQuanto às formas verbais destacadas, estão corretas somente:',
    options: [
      { letter: 'A', text: 'I e III.', correct: false, explanation: 'I está incorreta (o correto é "detiveram").' },
      { letter: 'B', text: 'II e IV.', correct: false, explanation: 'II está incorreta (o correto é "compuserem").' },
      { letter: 'C', text: 'III e IV.', correct: true, explanation: 'Correto: III (opusessem - pretérito imperfeito do subjuntivo) e IV (obtivermos - futuro do subjuntivo) estão impecáveis.' },
      { letter: 'D', text: 'I e II.', correct: false, explanation: 'Ambas I e II contêm erros graves de conjugação.' }
    ],
    resolutionCommentary: 'Deter faz "detiveram" (não deteram); compor faz "compuserem" no futuro do subjuntivo (não comporem); opor faz "opusessem"; obter faz "obtivermos".'
  },
  {
    id: 'pdf16-q27',
    archetype: 'correlacao',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['ver', 'vir'],
    ruleContext: 'Flexão de VER no futuro do subjuntivo e derivados de VIR.',
    statement: 'Assinale a alternativa que está correta quanto à flexão verbal:',
    options: [
      { letter: 'A', text: 'Se os chefes virem o projeto, eles aceitarão a minha ideia.', correct: true, explanation: 'Correto: "virem" é o futuro do subjuntivo na 3ª pessoa do plural do verbo VER (se eles virem).' },
      { letter: 'B', text: 'Se meu chefe intervisse, talvez eu recebesse aumento salarial.', correct: false, explanation: 'Incorreto: intervir segue vir, logo o correto é "interviesse".' },
      { letter: 'C', text: 'Quando você vir para a empresa, traga o projeto.', correct: false, explanation: 'Incorreto: o futuro do subjuntivo de vir é "vier" (quando você vier).' },
      { letter: 'D', text: 'Quando ele rever o contrato, estaremos mais seguros.', correct: false, explanation: 'Incorreto: rever segue ver no futuro do subjuntivo: "quando ele revir".' }
    ],
    resolutionCommentary: 'Verbo VER no futuro do subjuntivo: se eu vir, tu vires, ele vir, nós virmos, vós virdes, eles virem.'
  },
  {
    id: 'pdf16-q29',
    archetype: 'identificacao_morfologica',
    bancaTarget: 'EEAr',
    difficulty: 'facil',
    targetVerbs: ['compor', 'depor', 'pôr'],
    ruleContext: 'Classificação de conjugação verbal (-ar, -er/-or, -ir).',
    statement: 'São exemplos de verbos da 2ª conjugação:',
    options: [
      { letter: 'A', text: 'cantar, ficar, remar e amar', correct: false, explanation: 'Verbos terminados em -ar pertencem à 1ª conjugação.' },
      { letter: 'B', text: 'compor, depor, dever e temer', correct: true, explanation: 'Correto: verbos em -er e o verbo pôr e seus derivados (antigo poer) pertencem à 2ª conjugação.' },
      { letter: 'C', text: 'sorrir, partir, dormir', correct: false, explanation: 'Verbos terminados em -ir pertencem à 3ª conjugação.' },
      { letter: 'D', text: 'remar, receber, dever e dormir', correct: false, explanation: 'Mistura 1ª (-ar), 2ª (-er) e 3ª (-ir) conjugações.' }
    ],
    resolutionCommentary: 'Pôr e seus derivados (compor, depor, repor, propor) são classificados na 2ª conjugação por sua origem no latim "ponere" e forma arcaica "poer".'
  },

  // --- QUESTÕES EXTRAÍDAS DO PDF 17 (Modos Verbais II) ---
  {
    id: 'pdf17-q01',
    archetype: 'identificacao_morfologica',
    bancaTarget: 'EEAr',
    difficulty: 'facil',
    targetVerbs: ['ser'],
    ruleContext: 'Flexão do verbo SER no futuro do subjuntivo.',
    statement: 'O verbo "ser" foi usado algumas vezes. Assinale a alternativa em que o verbo SER esteja conjugado na terceira pessoa do singular do futuro do subjuntivo:',
    options: [
      { letter: 'A', text: 'Será.', correct: false, explanation: 'Futuro do presente do indicativo.' },
      { letter: 'B', text: 'Seria.', correct: false, explanation: 'Futuro do pretérito do indicativo.' },
      { letter: 'C', text: 'For.', correct: true, explanation: 'Correto: "for" é a 1ª e 3ª pessoa do singular do futuro do subjuntivo (quando eu for, quando ele for).' },
      { letter: 'D', text: 'Ser.', correct: false, explanation: 'Infinitivo impessoal.' },
      { letter: 'E', text: 'Seja.', correct: false, explanation: 'Presente do subjuntivo.' }
    ],
    resolutionCommentary: 'Futuro do subjuntivo do verbo SER: quando eu for, tu fores, ele for, nós formos, vós fordes, eles forem.'
  },
  {
    id: 'pdf17-q02',
    archetype: 'identificacao_morfologica',
    bancaTarget: 'EEAr',
    difficulty: 'facil',
    targetVerbs: ['querer'],
    ruleContext: 'Flexão de 2ª pessoa no pretérito perfeito do indicativo.',
    statement: '“Eu quis, com todas as minhas forças(...)”, ao mudar a pessoa verbal, houve falha na conjugação em:',
    options: [
      { letter: 'A', text: 'Tu quissesse.', correct: true, explanation: 'Correto (indica a falha): "quissesse" é uma forma inexistente. No pretérito perfeito, a 2ª pessoa é "tu quiseste".' },
      { letter: 'B', text: 'Ele quis.', correct: false, explanation: 'Forma correta na 3ª pessoa do singular.' },
      { letter: 'C', text: 'Nós quisemos.', correct: false, explanation: 'Forma correta na 1ª pessoa do plural.' },
      { letter: 'D', text: 'Vós quisestes.', correct: false, explanation: 'Forma correta na 2ª pessoa do plural.' }
    ],
    resolutionCommentary: 'Pretérito perfeito do indicativo de QUERER: eu quis, tu quiseste, ele quis, nós quisemos, vós quisestes, eles quiseram.'
  },
  {
    id: 'pdf17-q08',
    archetype: 'imperativo_conversao',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['escolher'],
    ruleContext: 'Conversão de Imperativo Negativo para Imperativo Afirmativo na 2ª pessoa (Tu).',
    statement: '“Não escolhas a tua esposa num baile, mas num campo de trigo durante a colheita.” (ditado esloveno)\n\nSe trocássemos o imperativo negativo “Não escolhas” pela forma afirmativa, a forma verbal correta seria:',
    options: [
      { letter: 'A', text: 'escolhas.', correct: false, explanation: '"Escolhas" é presente do subjuntivo.' },
      { letter: 'B', text: 'escolha.', correct: false, explanation: '"Escolha" é imperativo afirmativo de você (3ª pessoa).' },
      { letter: 'C', text: 'escolhes.', correct: false, explanation: '"Escolhes" é presente do indicativo com o "s".' },
      { letter: 'D', text: 'escolhe.', correct: true, explanation: 'Correto: o imperativo afirmativo de TU vem do presente do indicativo sem o "s" (tu escolhes -> escolhe tu).' },
      { letter: 'E', text: 'escolher.', correct: false, explanation: 'Infinitivo impessoal.' }
    ],
    resolutionCommentary: 'Imperativo afirmativo de TU: presente do indicativo sem o "s" (tu escolhes -> escolhe tu).'
  },
  {
    id: 'pdf17-q12',
    archetype: 'homonimos_temporais',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['ver', 'vir'],
    ruleContext: 'Futuro do subjuntivo de VER (vir) e VIR (vier).',
    statement: 'Assinale a alternativa que preenche as lacunas corretamente:\n\nI – Ele ficará maravilhado se ________ o resultado. (ver)\nII- Nós lhe daremos o recado assim que ele ________ aqui. (vir)',
    options: [
      { letter: 'A', text: 'Vir, vir.', correct: false, explanation: 'A 2ª lacuna requer "vier".' },
      { letter: 'B', text: 'Vê, vier.', correct: false, explanation: 'A 1ª lacuna requer "vir".' },
      { letter: 'C', text: 'Ver, vir.', correct: false, explanation: 'Ambas estão incorretas.' },
      { letter: 'D', text: 'Vir, vier.', correct: true, explanation: 'Correto: futuro do subjuntivo de VER é "vir" e de VIR é "vier".' }
    ],
    resolutionCommentary: 'I - se ele vir (ver); II - assim que ele vier (vir).'
  },
  {
    id: 'pdf17-q16',
    archetype: 'identificacao_morfologica',
    bancaTarget: 'EEAr',
    difficulty: 'facil',
    targetVerbs: ['suar'],
    ruleContext: 'Segmentação morfológica: radical e vogal temática.',
    statement: 'O radical do verbo encontrado no período “Ele suava durante o jantar” é:',
    options: [
      { letter: 'A', text: 'jant', correct: false, explanation: '"Jantar" é substantivo no contexto.' },
      { letter: 'B', text: 'janta', correct: false, explanation: 'Incorreto.' },
      { letter: 'C', text: 'su', correct: true, explanation: 'Correto: no verbo suar (su-a-va), o radical invariável é "su", "a" é a vogal temática de 1ª conjugação e "va" é a desinência modo-temporal.' },
      { letter: 'D', text: 'sua', correct: false, explanation: '"Sua" inclui a vogal temática "a".' }
    ],
    resolutionCommentary: 'Verbo suar: su- (radical) + -a- (vogal temática da 1ª conjugação) + -va (desinência modo-temporal do pretérito imperfeito do indicativo).'
  },
  {
    id: 'pdf17-q20',
    archetype: 'identificacao_morfologica',
    bancaTarget: 'EEAr',
    difficulty: 'facil',
    targetVerbs: ['ouvir', 'trazer'],
    ruleContext: 'Concordância e grafia no pretérito perfeito.',
    statement: 'Assinale a frase em que todas as formas verbais estão corretamente empregadas:',
    options: [
      { letter: 'A', text: 'Tu ouviste quando ela contou que Liane trouxe uma barraca?', correct: true, explanation: 'Correto: "tu ouviste" (2ª pessoa singular sem "s" no final) e "trouxe" (grafado com "x").' },
      { letter: 'B', text: 'Tu ouviu quando ela contou que Liane trosse uma barraca?', correct: false, explanation: 'Erros de concordância (tu ouviu) e ortografia (trosse).' },
      { letter: 'C', text: 'Tu ouvistes quando ela contou que Liane trouxe uma barraca?', correct: false, explanation: '"Ouvistes" é 2ª pessoa do plural (vós).' },
      { letter: 'D', text: 'Tu ouviu quando ela contou que Liane trousse uma barraca?', correct: false, explanation: 'Erros de concordância e ortografia.' }
    ],
    resolutionCommentary: 'No pretérito perfeito do indicativo, a 2ª pessoa do singular (Tu) termina em -ste (ouviste) e a 2ª do plural (Vós) termina em -stes (ouvistes). O verbo trazer no pretérito grafa-se com "x" (trouxe).'
  },
  {
    id: 'pdf17-q27',
    archetype: 'correlacao',
    bancaTarget: 'EEAr',
    difficulty: 'medio',
    targetVerbs: ['estar', 'proporcionar'],
    ruleContext: 'Correlação temporal: Futuro do Subjuntivo + Futuro do Presente.',
    statement: 'Assinale a alternativa que completa corretamente a seguinte frase:\n“Quando ________ mais aperfeiçoados, os aviões, certamente, ________ maior conforto e segurança em qualquer viagem.”',
    options: [
      { letter: 'A', text: 'estivessem – proporcionariam', correct: false, explanation: '"Quando" com ideia futura exige futuro do subjuntivo (estiverem), não imperfeito (estivessem).' },
      { letter: 'B', text: 'estiverem – proporcionarão', correct: true, explanation: 'Correto: correlação clássica de Futuro do Subjuntivo (quando estiverem) com Futuro do Presente do Indicativo (proporcionarão).' },
      { letter: 'C', text: 'estejam – proporcionam', correct: false, explanation: 'Correlação temporal inadequada com "quando".' },
      { letter: 'D', text: 'estão – proporcionariam', correct: false, explanation: 'Inadequação de tempos.' }
    ],
    resolutionCommentary: 'A conjunção temporal "quando" introduz oração com verbo no Futuro do Subjuntivo (estiverem), exigindo na oração principal o Futuro do Presente do Indicativo (proporcionarão).'
  }
];
