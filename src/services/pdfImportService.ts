import type { QuestionBankEmphasisNote, QuestionBankItem, QuestionBankSupport, SubjectId } from '../data/questionBank';
import { normalizeQuestionSupport, parseLegacySupport, validateQuestionQuality } from '../utils/questionSupport';
import { createPdfImportBatches } from './pdfBatching';

const CUSTOM_QUESTIONS_STORAGE_KEY = 'conjuletter_custom_questions_v1';

export function getCustomQuestions(): QuestionBankItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(item => normalizeQuestionSupport(item as QuestionBankItem)) : [];
    }
  } catch (e) {
    console.error('Error loading custom questions', e);
  }
  return [];
}

export function saveCustomQuestions(questions: QuestionBankItem[]): void {
  try {
    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Error saving custom questions', e);
  }
}

export function clearCustomQuestions(): void {
  try {
    localStorage.removeItem(CUSTOM_QUESTIONS_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing custom questions', e);
  }
}

/** Extract text page by page with PDF.js, preserving meaningful line endings. */
export async function extractTextFromPdfFile(file: File, signal?: AbortSignal): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).href;
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({ data });
  const document = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    if (signal?.aborted) { await loadingTask.destroy(); throw new DOMException('Importação cancelada.', 'AbortError'); }
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    let text = '';

    for (const item of content.items) {
      if (!('str' in item)) continue;
      text += item.str;
      text += item.hasEOL ? '\n' : ' ';
    }

    pages.push(`--- PAGINA ${pageNumber} ---\n${text.trim()}`);
  }

  const extracted = pages.join('\n\n').replace(/[ \t]+\n/g, '\n').trim();
  await loadingTask.destroy();
  return extracted;
}

/**
 * Parses raw text containing exam questions & gabarito using OpenRouter AI
 */
export async function parsePdfQuestionsWithAi(
  rawText: string,
  subjectId: SubjectId,
  subjectTitle: string,
  listTitle: string,
  onProgress?: (msg: string) => void,
  signal?: AbortSignal,
): Promise<QuestionBankItem[]> {
  onProgress?.('Enviando texto do PDF para o servidor de importação...');

  // Process every page. The answer appendix is repeated in each batch so
  // questions near the beginning can still be reconciled with a final key.
  const requestBatches = createPdfImportBatches(rawText);

  const systemPrompt = `Você é um extrator e revisor de questões de Língua Portuguesa para concursos militares brasileiros.
Sua tarefa é transcrever com fidelidade as questões presentes no conteúdo fornecido e associá-las somente aos gabaritos explicitamente encontrados no documento.

REGRAS OBRIGATÓRIAS
1. Não crie, complete, corrija ou parafraseie conteúdo ausente. Não infira gabaritos por conhecimento gramatical.
2. Ignore cabeçalhos, rodapés, números de página, marcas d'água, e-mails, IPs e avisos do site.
3. Separe o texto-base compartilhado no objeto "support" e mantenha em "statement" apenas o comando e os trechos específicos da questão.
4. Preserve a ordem, a numeração e todas as alternativas existentes. Não transforme trechos do enunciado em alternativas.
5. Preserve destaques como **texto** ou <u>texto</u> somente quando forem semanticamente necessários. Cada destaque deve ter uma justificativa em "emphasisNotes". Nunca marque título, autoria ou fonte por decoração. Represente lacunas como ________.
6. "correctLetter" deve vir exclusivamente do bloco oficial de respostas/gabarito. Se não houver resposta explícita para uma questão, omita essa questão do resultado.
7. Marque exatamente uma opção com "correct": true, correspondente a "correctLetter".
8. Antes de responder, confira número da questão, letras, quantidade de alternativas e correspondência com o gabarito.
9. Retorne somente um objeto JSON válido, sem markdown, neste formato:
{
  "questions": [
    {
    "questionNumber": 1,
    "questionPage": 1,
    "answerPage": 12,
    "support": {
      "label": "TEXTO I ou string vazia",
      "title": "título limpo, sem Markdown/HTML",
      "author": "autoria ou string vazia",
      "paragraphs": ["cada parágrafo do texto, preservando versos e diálogos"],
      "source": "fonte bibliográfica ou string vazia"
    },
    "statement": "comando completo",
    "options": [
      {"letter":"A","text":"alternativa A","correct":false},
      {"letter":"B","text":"alternativa B","correct":true},
      {"letter":"C","text":"alternativa C","correct":false},
      {"letter":"D","text":"alternativa D","correct":false}
    ],
    "correctLetter": "B",
    "banca": "nome explícito ou Concurso Militar",
    "emphasisNotes": [{"target":"statement|option:A|support.paragraph:1","reason":"o enunciado solicita a forma destacada"}]
    }
  ]
}`;

  const userPrompt = `Extraia todas as questões completas que possuam gabarito oficial explícito no conteúdo abaixo. Faça uma última conferência cruzada entre número e letra antes de retornar o JSON.

CONTEÚDO DO DOCUMENTO:

${rawText.slice(0, 1)}`;

  void systemPrompt;
  void userPrompt;
  let parsedArray: any[] = [];
  const health = await fetch('/api/health', { credentials: 'same-origin', signal });
  if (!health.ok) throw new Error('O serviço de importação não está disponível.');
  for (let batchIndex = 0; batchIndex < requestBatches.length; batchIndex += 1) {
    if (signal?.aborted) throw new DOMException('Importação cancelada.', 'AbortError');
    onProgress?.(`Analisando lote ${batchIndex + 1} de ${requestBatches.length}...`);
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort();
    signal?.addEventListener('abort', abortFromCaller, { once: true });
    const timeout = window.setTimeout(() => controller.abort(), 55_000);
    let response: Response;
    try {
      response = await fetch('/api/ai/import', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rawText: requestBatches[batchIndex], batch: batchIndex + 1, totalBatches: requestBatches.length }) });
    } catch (error) {
      throw new Error(error instanceof Error && error.name === 'AbortError' ? 'A importação excedeu o tempo limite.' : 'Não foi possível contactar o servidor de importação.');
    } finally {
      window.clearTimeout(timeout);
      signal?.removeEventListener('abort', abortFromCaller);
    }
    if (!response.ok) {
      const errText = await response.text(); let detail = errText;
      try { const parsedError = JSON.parse(errText) as { error?: unknown }; if (typeof parsedError.error === 'string') detail = parsedError.error; } catch { /* resposta não JSON */ }
      const retryAfter = response.headers.get('Retry-After');
      const suffix = response.status === 429 && retryAfter ? ` Tente novamente em ${retryAfter} segundos.` : response.status >= 500 ? ' Nenhum lote foi salvo; tente novamente mais tarde.' : '';
      throw new Error(`Erro no servidor de importação (${response.status}): ${detail}${suffix}`);
    }
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    try {
      const jsonMatch = rawContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawContent);
      const questions = Array.isArray(parsed) ? parsed : parsed.questions;
      if (Array.isArray(questions)) parsedArray.push(...questions);
    } catch {
      throw new Error(`Falha ao interpretar o lote ${batchIndex + 1}: ${rawContent.slice(0, 200)}`);
    }
  }
  // The answer appendix may cause overlap; retain the first complete occurrence.
  parsedArray = parsedArray.filter((question, index, all) => all.findIndex(candidate => Number(candidate?.questionNumber) === Number(question?.questionNumber) && String(candidate?.statement || '').trim() === String(question?.statement || '').trim()) === index);

  if (parsedArray.length === 0) {
    throw new Error('Nenhuma questão válida foi identificada no texto do PDF enviado.');
  }

  const seenQuestionNumbers = new Set<number>();
  const importId = crypto.randomUUID();

  const resultItems: QuestionBankItem[] = parsedArray.map((q, idx) => {
    q = q && typeof q === 'object' ? q : {};
    const structuralWarnings: string[] = [];
    const requestedNumber = Number(q.questionNumber || idx + 1);
    const questionNumber = Number.isInteger(requestedNumber) && requestedNumber > 0 ? requestedNumber : idx + 1;
    if (questionNumber !== requestedNumber) structuralWarnings.push('Número da questão ausente ou inválido; confira a numeração no PDF.');
    if (seenQuestionNumbers.has(questionNumber)) structuralWarnings.push('Número de questão duplicado na resposta da IA.');
    seenQuestionNumbers.add(questionNumber);
    const requestedCorrectLetter = String(q.correctLetter || '').toUpperCase();
    const correctLetter = /^[A-E]$/.test(requestedCorrectLetter) ? requestedCorrectLetter : 'A';
    if (correctLetter !== requestedCorrectLetter) structuralWarnings.push('Gabarito sem letra A–E válida.');
    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const optionLetters = rawOptions.map((opt: any) => String(opt?.letter || '').toUpperCase());

    if (!q.statement) structuralWarnings.push('Enunciado ausente ou vazio.');
    if (rawOptions.length < 4 || rawOptions.length > 5) structuralWarnings.push('Quantidade de alternativas diferente de 4 ou 5.');
    if (new Set(optionLetters).size !== rawOptions.length) structuralWarnings.push('Letras de alternativas duplicadas.');
    if (optionLetters.some((letter: string) => !/^[A-E]$/.test(letter))) structuralWarnings.push('Alternativa com letra fora do intervalo A–E.');
    if (!optionLetters.includes(correctLetter)) structuralWarnings.push('Gabarito não corresponde a nenhuma alternativa.');

    const support: QuestionBankSupport | undefined = q.support && typeof q.support === 'object'
      ? {
          label: typeof q.support.label === 'string' ? q.support.label.trim() || undefined : undefined,
          title: typeof q.support.title === 'string' ? q.support.title.replace(/<\/?(?:u|b|strong)>|\*\*/gi, '').trim() || undefined : undefined,
          author: typeof q.support.author === 'string' ? q.support.author.trim() || undefined : undefined,
          paragraphs: Array.isArray(q.support.paragraphs) ? q.support.paragraphs.filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0) : [],
          source: typeof q.support.source === 'string' ? q.support.source.trim() || undefined : undefined,
        }
      : parseLegacySupport(typeof q.readingText === 'string' ? q.readingText : undefined);
    const emphasisNotes: QuestionBankEmphasisNote[] = Array.isArray(q.emphasisNotes)
      ? q.emphasisNotes.filter((note: any) => typeof note?.target === 'string' && typeof note?.reason === 'string').map((note: any) => ({ target: note.target.trim(), reason: note.reason.trim() }))
      : [];
    const item = {
    id: `custom-${subjectId}-${importId}-${idx + 1}`,
    subjectId: subjectId,
    subjectTitle: subjectTitle,
    listId: `custom_import_${importId}`,
    listTitle: listTitle || 'Lista Importada via IA',
    questionNumber,
    support,
    statement: typeof q.statement === 'string' && q.statement.trim() ? q.statement : 'Enunciado da questão (revisar importação)',
    options: rawOptions.map((opt: any, optionIndex: number) => ({
      letter: (/^[A-E]$/.test(String(opt?.letter || '').toUpperCase()) ? String(opt.letter).toUpperCase() : (['A', 'B', 'C', 'D', 'E'][optionIndex] || 'A')) as QuestionBankItem['options'][number]['letter'],
      text: typeof opt?.text === 'string' ? opt.text : '',
      correct: String(opt?.letter || '').toUpperCase() === correctLetter
    })),
    correctLetter,
    banca: q.banca || 'Importada pelo Usuário',
    emphasisNotes,
    provenance: {
      pdf: listTitle || 'Importação via PDF/IA',
      questionPage: Number.isInteger(Number(q.questionPage)) && Number(q.questionPage) > 0 ? Number(q.questionPage) : undefined,
      answerPage: Number.isInteger(Number(q.answerPage)) && Number(q.answerPage) > 0 ? Number(q.answerPage) : undefined,
    },
    isCustom: true
    } as QuestionBankItem;
    const normalizedItem = normalizeQuestionSupport(item);
    normalizedItem.quality = validateQuestionQuality(normalizedItem, { requireEmphasisNotes: true, requireProvenance: true });
    if (structuralWarnings.length > 0) {
      normalizedItem.quality = {
        status: 'warning',
        warnings: [...new Set([...structuralWarnings, ...normalizedItem.quality.warnings])]
      };
    }
    return normalizedItem;
  });

  // Append to existing custom questions
  const currentCustom = getCustomQuestions();
  saveCustomQuestions([...currentCustom, ...resultItems]);

  onProgress?.(`Sucesso! ${resultItems.length} questões importadas e salvas no Banco.`);
  return resultItems;
}
