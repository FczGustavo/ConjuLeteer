import { CANONICAL_VERBS } from '../data/canonicalVerbs';
import type { MilitaryBanca, MilitaryQuestion, QuestionArchetype, QuestionOption, VerbEntry } from '../types/verbs';
import { loadUserSettings } from '../utils/srsEngine';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const CHUNK_SIZE = 5;
const MAX_ATTEMPTS = 3;
type AnswerLetter = typeof LETTERS[number];

interface Blueprint {
  slotId: string;
  correctLetter: AnswerLetter;
  difficulty: 'medio' | 'dificil';
  construction: string;
  verbs: VerbEntry[];
}

interface Review {
  slotId: string;
  solvedLetter: AnswerLetter;
  contentMatches: boolean;
  unambiguous: boolean;
  groundedInReference: boolean;
  issues: string[];
}

const GUIDANCE: Record<QuestionArchetype, string> = {
  lacuna_derivado: 'Preenchimento de lacuna em contexto autêntico com verbo irregular ou derivado; todas as alternativas devem manter a mesma pessoa e estrutura e diferir apenas na flexão avaliada.',
  correlacao: 'Correlação entre tempos e modos em período composto, especialmente orações temporais, condicionais, concessivas e finais; preserve o sentido e o aspecto da frase ao reescrever.',
  imperativo_conversao: 'Conversão normativa entre tu, você e vós, distinguindo imperativo afirmativo e negativo; o negativo deve seguir o presente do subjuntivo e nunca criar uma primeira pessoa.',
  identificacao_morfologica: 'Identificação de modo, tempo, pessoa, número, conjugação, forma simples/composta ou forma nominal; o enunciado deve fornecer contexto suficiente para uma única classificação.',
  vozes_verbais: 'Identificação ou transformação entre voz ativa, passiva analítica, passiva sintética e reflexiva; preserve tempo, concordância, agente e argumento e distinga passiva sintética de sujeito indeterminado.',
  duplo_participio: 'Emprego normativo de particípios regulares e irregulares com ter/haver e ser/estar; não trate o particípio como adjetivo sem justificar a construção.',
  homonimos_temporais: 'Contraste de formas próximas, principalmente ver/vir, prever/prover, reaver/precaver e famílias derivadas; explicite o verbo, o tempo e o sentido que desempatam as formas.'
};

const CONSTRUCTIONS: Record<QuestionArchetype, string[]> = {
  lacuna_derivado: ['lacuna única contextualizada', 'duas lacunas correlacionadas', 'substituição de forma inadequada com justificativa'],
  correlacao: ['completar oração temporal ou condicional', 'reescrever preservando correlação e aspecto', 'julgar sequência de tempos e modos'],
  imperativo_conversao: ['converter tu para você', 'converter você para vós', 'distinguir imperativo afirmativo e negativo'],
  identificacao_morfologica: ['identificar modo e tempo', 'identificar pessoa, número e conjugação', 'comparar forma simples, composta e nominal'],
  vozes_verbais: ['transformar ativa em passiva analítica', 'distinguir passiva sintética e indeterminação', 'preservar tempo e concordância na mudança de voz'],
  duplo_participio: ['selecionar particípio conforme auxiliar', 'corrigir locução verbal', 'comparar particípio verbal e adjetival'],
  homonimos_temporais: ['contrastar futuro do subjuntivo', 'contrastar pretérito perfeito', 'selecionar derivado adequado no contexto']
};

// Perfil extraído por contagem determinística dos enunciados dos 152 itens de
// Verbos nos PDFs locais.  Serve para calibrar variedade, não para copiar
// questões ou atribuir banca/fonte à geração inédita.
const BANK_CALIBRATION = `Calibração do corpus local: priorize identificação de modo/tempo e flexão (82 sinais), correlação e valor semântico dos tempos (46), escolha de forma correta/norma-padrão (42), vozes e partícula se (17), e só depois comandos de imperativo explícito (3). Inclua também, de forma alternada, regência/transitividade, locuções e formas nominais quando o blueprint permitir. Não reproduza frases dos PDFs.`;

const HOMONYM_GROUPS = [['ver', 'vir'], ['prever', 'prover'], ['reaver', 'precaver']];

export class AiConfigurationError extends Error {
  constructor() {
    super('Configure uma chave do OpenRouter em Configurações para gerar questões com IA.');
    this.name = 'AiConfigurationError';
  }
}

export async function generateMilitaryQuestion(
  banca: MilitaryBanca,
  archetype: QuestionArchetype,
  targetVerb?: string
): Promise<MilitaryQuestion> {
  return (await requestQuestions(1, archetype, targetVerb, banca))[0];
}

export async function generateMilitaryQuestions(
  count: 5 | 10 | 20,
  archetype: QuestionArchetype,
  targetVerb?: string,
  onProgress?: (message: string) => void
): Promise<MilitaryQuestion[]> {
  return requestQuestions(count, archetype, targetVerb, undefined, onProgress);
}

async function requestQuestions(
  count: number,
  archetype: QuestionArchetype,
  targetVerb?: string,
  banca?: MilitaryBanca,
  onProgress?: (message: string) => void
): Promise<MilitaryQuestion[]> {
  const settings = loadUserSettings();
  const apiKey = settings.openRouterApiKey?.trim();
  if (!apiKey) throw new AiConfigurationError();
  const model = settings.aiModel?.trim() || 'google/gemini-3.7-flash';
  const blueprints = buildBlueprints(count, archetype, targetVerb);
  const accepted = new Map<string, MilitaryQuestion>();
  let pending = [...blueprints];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS && pending.length; attempt += 1) {
    const retry: Blueprint[] = [];
    for (let offset = 0; offset < pending.length; offset += CHUNK_SIZE) {
      const chunk = pending.slice(offset, offset + CHUNK_SIZE);
      onProgress?.(`Criando bloco ${Math.floor(offset / CHUNK_SIZE) + 1} · tentativa ${attempt}...`);
      const rawQuestions = await generateChunk(apiKey, model, archetype, chunk, banca);
      const valid = new Map<string, MilitaryQuestion>();

      for (const blueprint of chunk) {
        const raw = rawQuestions.find(item => isRecord(item) && item.slotId === blueprint.slotId);
        try {
          valid.set(blueprint.slotId, validateQuestion(raw, banca ?? 'Concurso Militar', archetype, blueprint));
        } catch {
          retry.push(blueprint);
        }
      }
      if (!valid.size) continue;

      onProgress?.(`Revisando ${valid.size} questão(ões) sem consultar o gabarito...`);
      const reviewBlueprints = chunk.filter(item => valid.has(item.slotId));
      const reviews = await reviewChunk(apiKey, model, archetype, reviewBlueprints, valid);
      for (const blueprint of reviewBlueprints) {
        const question = valid.get(blueprint.slotId);
        const review = reviews.find(item => item.slotId === blueprint.slotId);
        if (question && passesReview(review, blueprint) && !isDuplicate(question, [...accepted.values()])) {
          accepted.set(blueprint.slotId, question);
        } else {
          retry.push(blueprint);
        }
      }
    }
    pending = uniqueBlueprints(retry).filter(item => !accepted.has(item.slotId));
  }

  if (pending.length || accepted.size !== count) {
    throw new Error(`A revisão independente rejeitou ${pending.length || count - accepted.size} questão(ões). Tente gerar novamente para evitar conteúdo duvidoso.`);
  }
  onProgress?.('Caderno aprovado pela validação estrutural e pela revisão independente.');
  return blueprints.map(item => accepted.get(item.slotId) as MilitaryQuestion);
}

function buildBlueprints(count: number, archetype: QuestionArchetype, target?: string): Blueprint[] {
  const normalized = normalize(target ?? '');
  const explicit = CANONICAL_VERBS.find(verb => normalize(verb.infinitive) === normalized || verb.id === normalized);
  if (normalized && !explicit) throw new Error(`O verbo “${target}” não está na base canônica auditada.`);
  if (archetype === 'duplo_participio' && explicit && !explicit.doubleParticiple) {
    throw new Error(`O verbo “${explicit.infinitive}” não possui duplo particípio registrado na base canônica.`);
  }
  const eligible = (archetype === 'duplo_participio' ? CANONICAL_VERBS.filter(verb => verb.doubleParticiple) : CANONICAL_VERBS)
    .slice()
    .sort((left, right) => (right.pdfFrequency ?? -1) - (left.pdfFrequency ?? -1));
  const answerOffset = crypto.getRandomValues(new Uint32Array(1))[0] % LETTERS.length;
  return Array.from({ length: count }, (_, index) => {
    let verbs: VerbEntry[];
    if (explicit) verbs = [explicit];
    else if (archetype === 'homonimos_temporais') {
      verbs = HOMONYM_GROUPS[index % HOMONYM_GROUPS.length]
        .map(id => CANONICAL_VERBS.find(verb => verb.id === id))
        .filter((verb): verb is VerbEntry => Boolean(verb));
    } else verbs = [eligible[index % eligible.length]];
    return {
      slotId: `q${index + 1}`,
      correctLetter: LETTERS[(index + answerOffset) % LETTERS.length],
      difficulty: index % 2 ? 'dificil' : 'medio',
      construction: CONSTRUCTIONS[archetype][index % CONSTRUCTIONS[archetype].length],
      verbs
    };
  });
}

async function generateChunk(
  apiKey: string,
  model: string,
  archetype: QuestionArchetype,
  blueprints: Blueprint[],
  banca?: MilitaryBanca
): Promise<unknown[]> {
  const style = banca
    ? `Use somente o nível de exigência associado a ${banca}; não atribua a questão à instituição.`
    : 'Use estilo geral de concurso militar. Não mencione, imite nem atribua conteúdo a banca, prova, ano, autor ou fonte.';
  const plan = blueprints.map(item => ({
    slotId: item.slotId,
    correctLetter: item.correctLetter,
    difficulty: item.difficulty,
    construction: item.construction,
    targetVerbs: item.verbs.map(verb => verb.infinitive)
  }));
  const prompt = `# Tarefa
Crie as questões do blueprint. ${style}

# Critérios
- Norma-padrão brasileira, enunciado autocontido e exatamente quatro alternativas A-D.
- Uma única resposta correta, obrigatoriamente na letra reservada pelo blueprint.
- Distratores homogêneos, plausíveis e independentes; sem pistas de tamanho ou tom.
- Se pedir a incorreta, destaque **INCORRETA**. Use ________ apenas para lacunas.
- Explique cada alternativa pela regra aplicada e apresente resolução conclusiva.
- Varie construção e redação. Não contrarie a referência canônica local.

# Exemplos de calibração
- Bom: todas as alternativas completam a mesma lacuna e diferem apenas no fenômeno gramatical avaliado.
- Bom: a justificativa identifica forma, modo, tempo, pessoa e regra relevante sem depender do próprio gabarito.
- Ruim: alternativas de categorias diferentes, duas respostas defensáveis ou explicação que apenas repete “está correta”.

# Conteúdo
${GUIDANCE[archetype]}

# Calibração de qualidade
${BANK_CALIBRATION}

# Blueprint
${JSON.stringify(plan, null, 2)}

# Referência canônica local
${canonicalReference(blueprints.flatMap(item => item.verbs))}`;
  const result = await callModel(apiKey, model, 'Você elabora questões gramaticais rigorosas a partir de um blueprint fechado.', prompt, questionSchema(blueprints.length), `question_batch_${blueprints.length}`);
  if (!isRecord(result) || !Array.isArray(result.questions)) throw new Error('A IA não retornou uma lista válida de questões.');
  return result.questions;
}

async function reviewChunk(
  apiKey: string,
  model: string,
  archetype: QuestionArchetype,
  blueprints: Blueprint[],
  questions: Map<string, MilitaryQuestion>
): Promise<Review[]> {
  const payload = blueprints.map(blueprint => {
    const question = questions.get(blueprint.slotId) as MilitaryQuestion;
    return {
      slotId: blueprint.slotId,
      statement: question.statement,
      options: question.options.map(option => ({ letter: option.letter, text: option.text })),
      expectedContent: GUIDANCE[archetype],
      targetVerbs: blueprint.verbs.map(verb => verb.infinitive)
    };
  });
  const prompt = `Resolva e audite cada questão independentemente. Você não recebeu o gabarito do elaborador.
Determine a resposta somente pelo enunciado, alternativas e referência canônica.
contentMatches exige aderência real ao conteúdo; unambiguous exige uma única resposta defensável; groundedInReference exige ausência de conflito com a referência.

# Questões
${JSON.stringify(payload, null, 2)}

# Calibração de qualidade
${BANK_CALIBRATION}

# Referência canônica local
${canonicalReference(blueprints.flatMap(item => item.verbs))}`;
  const result = await callModel(apiKey, model, 'Você é um revisor independente, rigoroso e conservador de Língua Portuguesa.', prompt, reviewSchema(blueprints.length), `question_review_${blueprints.length}`);
  if (!isRecord(result) || !Array.isArray(result.reviews)) return [];
  return result.reviews.filter(isReview);
}

async function callModel(
  apiKey: string,
  model: string,
  system: string,
  prompt: string,
  schema: Record<string, unknown>,
  name: string
): Promise<unknown> {
  const requestBody = JSON.stringify({
    model,
    response_format: { type: 'json_schema', json_schema: { name, strict: true, schema } },
    messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 12000
  });
  let response: Response | undefined;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://conjuletter.app',
        'X-Title': 'ConjuLetter AI Questions',
        'Content-Type': 'application/json'
      },
      body: requestBody
    });
    if (response.ok || (response.status !== 429 && response.status < 500)) break;
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 600));
  }
  if (!response) throw new Error('Não foi possível iniciar a geração.');
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Falha na geração/revisão (${response.status}): ${details.slice(0, 220)}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw new Error('O modelo não retornou conteúdo estruturado.');
  try {
    return JSON.parse(content);
  } catch {
    throw new Error('O modelo retornou JSON inválido. Selecione um modelo compatível com JSON Schema.');
  }
}

function validateQuestion(value: unknown, banca: MilitaryBanca, archetype: QuestionArchetype, blueprint: Blueprint): MilitaryQuestion {
  if (!isRecord(value) || value.slotId !== blueprint.slotId) throw new Error('Questão fora do blueprint.');
  if (typeof value.statement !== 'string' || value.statement.trim().length < 30) throw new Error('Enunciado insuficiente.');
  if (!Array.isArray(value.options) || value.options.length !== 4) throw new Error('Alternativas inválidas.');
  const options = value.options.map((raw, index): QuestionOption => {
    if (!isRecord(raw)) throw new Error('Alternativa inválida.');
    const letter = LETTERS[index];
    if (raw.letter !== letter || typeof raw.text !== 'string' || !raw.text.trim() || typeof raw.correct !== 'boolean') throw new Error(`Alternativa ${letter} inválida.`);
    if (typeof raw.explanation !== 'string' || raw.explanation.trim().length < 12) throw new Error(`Justificativa ${letter} insuficiente.`);
    return { letter, text: raw.text.trim(), correct: raw.correct, explanation: raw.explanation.trim() };
  });
  const correct = options.filter(option => option.correct);
  if (correct.length !== 1 || correct[0].letter !== blueprint.correctLetter) throw new Error('Gabarito fora do blueprint.');
  if (typeof value.resolutionCommentary !== 'string' || value.resolutionCommentary.trim().length < 30) throw new Error('Resolução insuficiente.');
  if (typeof value.ruleContext !== 'string' || value.ruleContext.trim().length < 8) throw new Error('Regra central ausente.');
  if (value.difficulty !== blueprint.difficulty) throw new Error('Dificuldade fora do blueprint.');
  if (!matchesContent(archetype, value.statement, options, blueprint.verbs, blueprint.construction)) throw new Error('Conteúdo não corresponde ao filtro.');
  return {
    id: `ai-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
    archetype,
    bancaTarget: banca,
    statement: value.statement.trim(),
    options,
    resolutionCommentary: value.resolutionCommentary.trim(),
    targetVerbs: blueprint.verbs.map(verb => verb.infinitive),
    ruleContext: value.ruleContext.trim(),
    difficulty: blueprint.difficulty,
    isAiGenerated: true
  };
}

function matchesContent(archetype: QuestionArchetype, statement: string, options: QuestionOption[], verbs: VerbEntry[], construction: string): boolean {
  const corpus = normalize([statement, ...options.map(option => option.text)].join(' ')).replace(/[^a-z0-9ç ]/g, ' ');
  const forms = verbs.flatMap(verb => [
    verb.infinitive,
    ...Object.values(verb.conjugations).flatMap(table => Object.values(table).filter((form): form is string => Boolean(form))),
    ...(verb.doubleParticiple ? Object.values(verb.doubleParticiple) : [])
  ]);
  if (!forms.some(form => containsForm(corpus, form))) return false;
  if (archetype === 'lacuna_derivado') return statement.includes('________');
  if (archetype === 'correlacao') return /quando|caso|se |embora|ainda que|antes que|depois que|para que|assim que|enquanto|conquanto|logo que/.test(corpus) || /reescrev|correla/.test(corpus);
  if (archetype === 'imperativo_conversao') return /imperativ|ordem|pedido|tratamento|tu |voce |vos /.test(corpus);
  if (archetype === 'identificacao_morfologica') return /modo|tempo|pessoa|numero|conjug|forma verbal|simples|composta|nominal/.test(corpus);
  if (archetype === 'vozes_verbais') return /voz|ativa|passiva|reflexiva|indeterminacao|particula se/.test(corpus);
  if (archetype === 'duplo_participio') return verbs.some(verb => verb.doubleParticiple && Object.values(verb.doubleParticiple).some(form => containsForm(corpus, form))) && /ter|haver|ser|estar|auxiliar|partic/.test(corpus);
  if (archetype === 'homonimos_temporais') return verbs.every(verb => {
    const verbForms = [verb.infinitive, ...Object.values(verb.conjugations).flatMap(table => Object.values(table).filter((form): form is string => Boolean(form)))];
    return verbForms.some(form => containsForm(corpus, form));
  }) && /ver|vir|prever|prover|reaver|precaver|derivad|homonim|semelhant/.test(corpus);
  return Boolean(construction);
}

function canonicalReference(verbs: VerbEntry[]): string {
  const unique = [...new Map(verbs.map(verb => [verb.id, verb])).values()];
  return unique.map(verb => JSON.stringify({
    infinitive: verb.infinitive,
    classification: verb.classification,
    warning: verb.criticalTrapDescription,
    doubleParticiple: verb.doubleParticiple,
    conjugations: verb.conjugations
  })).join('\n');
}

function questionSchema(count: number): Record<string, unknown> {
  return {
    type: 'object', additionalProperties: false, required: ['questions'],
    properties: { questions: { type: 'array', minItems: count, maxItems: count, items: {
      type: 'object', additionalProperties: false,
      required: ['slotId', 'statement', 'options', 'resolutionCommentary', 'ruleContext', 'difficulty'],
      properties: {
        slotId: { type: 'string' }, statement: { type: 'string', minLength: 30 },
        options: { type: 'array', minItems: 4, maxItems: 4, items: {
          type: 'object', additionalProperties: false, required: ['letter', 'text', 'correct', 'explanation'],
          properties: { letter: { type: 'string', enum: LETTERS }, text: { type: 'string' }, correct: { type: 'boolean' }, explanation: { type: 'string' } }
        } },
        resolutionCommentary: { type: 'string' }, ruleContext: { type: 'string' }, difficulty: { type: 'string', enum: ['medio', 'dificil'] }
      }
    } } }
  };
}

function reviewSchema(count: number): Record<string, unknown> {
  return {
    type: 'object', additionalProperties: false, required: ['reviews'],
    properties: { reviews: { type: 'array', minItems: count, maxItems: count, items: {
      type: 'object', additionalProperties: false,
      required: ['slotId', 'solvedLetter', 'contentMatches', 'unambiguous', 'groundedInReference', 'issues'],
      properties: {
        slotId: { type: 'string' }, solvedLetter: { type: 'string', enum: LETTERS },
        contentMatches: { type: 'boolean' }, unambiguous: { type: 'boolean' }, groundedInReference: { type: 'boolean' },
        issues: { type: 'array', items: { type: 'string' } }
      }
    } } }
  };
}

function passesReview(review: Review | undefined, blueprint: Blueprint): boolean {
  return Boolean(review && review.solvedLetter === blueprint.correctLetter && review.contentMatches && review.unambiguous && review.groundedInReference);
}

function isDuplicate(question: MilitaryQuestion, accepted: MilitaryQuestion[]): boolean {
  const current = tokens(question.statement);
  return accepted.some(item => {
    const other = tokens(item.statement);
    const intersection = [...current].filter(token => other.has(token)).length;
    return intersection / new Set([...current, ...other]).size >= 0.78;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isReview(value: unknown): value is Review {
  if (!isRecord(value)) return false;
  return typeof value.slotId === 'string'
    && typeof value.solvedLetter === 'string'
    && LETTERS.includes(value.solvedLetter as AnswerLetter)
    && typeof value.contentMatches === 'boolean'
    && typeof value.unambiguous === 'boolean'
    && typeof value.groundedInReference === 'boolean'
    && Array.isArray(value.issues);
}

function uniqueBlueprints(items: Blueprint[]): Blueprint[] {
  return [...new Map(items.map(item => [item.slotId, item])).values()];
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function containsForm(normalizedCorpus: string, form: string): boolean {
  const normalizedForm = normalize(form).replace(/[^a-z0-9ç ]/g, ' ').trim();
  return ` ${normalizedCorpus.replace(/\s+/g, ' ').trim()} `.includes(` ${normalizedForm} `);
}

function tokens(value: string): Set<string> {
  return new Set(normalize(value).replace(/[^a-z0-9ç ]/g, ' ').split(/\s+/).filter(token => token.length > 3));
}
