import type { QuestionBankEmphasisNote, QuestionBankItem, QuestionBankSupport, SubjectId } from '../data/questionBank';
import { safeWriteStorage, type StorageWriteResult } from '../utils/storage';
import type { ImportManifest, QuestionEvidence } from '../types/importPipeline';
import { artifactsToText, extractPdfArtifacts, type PdfArtifactResult } from './pdfArtifacts';
import { normalizeQuestionSupport, parseLegacySupport, validateQuestionQuality } from '../utils/questionSupport';
import { createPdfImportBatches } from './pdfBatching';

const CUSTOM_QUESTIONS_STORAGE_KEY = 'conjuletter_custom_questions_v1';
const CUSTOM_QUARANTINED_STORAGE_KEY = 'conjuletter_quarantined_questions_v1';

export interface ImportPipelineResult {
  importId: string;
  verified: QuestionBankItem[];
  quarantined: QuestionBankItem[];
  manifest: ImportManifest;
  storage: StorageWriteResult;
}

export function getCustomQuestions(): QuestionBankItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.map(item => normalizeQuestionSupport(item as QuestionBankItem)).filter(item => item.quality?.status !== 'quarantined' && item.quality?.status !== 'rejected')
        : [];
    }
  } catch (e) {
    console.error('Error loading custom questions', e);
  }
  return [];
}

export function saveCustomQuestions(questions: QuestionBankItem[]): StorageWriteResult {
  const result = safeWriteStorage(CUSTOM_QUESTIONS_STORAGE_KEY, questions);
  if (!result.ok) console.error('Error saving custom questions', result.error);
  return result;
}

export function getQuarantinedQuestions(): QuestionBankItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUARANTINED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(item => normalizeQuestionSupport(item as QuestionBankItem)) : [];
  } catch (error) {
    console.error('Error loading quarantined questions', error);
    return [];
  }
}

function saveQuarantinedQuestions(questions: QuestionBankItem[]): StorageWriteResult {
  const result = safeWriteStorage(CUSTOM_QUARANTINED_STORAGE_KEY, questions);
  if (!result.ok) console.error('Error saving quarantined questions', result.error);
  return result;
}

function plainEvidenceText(value: string): string {
  return value.replace(/<\/?(?:u|b|strong)>/giu, '').replace(/\*\*/gu, '').replace(/\s+/gu, ' ').trim().toLocaleLowerCase();
}

function inferNativeEvidence(artifacts: PdfArtifactResult | undefined, field: QuestionEvidence['field'], value: string): QuestionEvidence | undefined {
  const target = plainEvidenceText(value);
  if (!artifacts || target.length < 3) return undefined;
  const page = artifacts.artifacts.find(artifact => plainEvidenceText(artifact.nativeText).includes(target));
  return page ? { field, page: page.pageNumber, originalText: value.trim(), method: 'native-text' } : undefined;
}

const EVIDENCE_FIELDS: QuestionEvidence['field'][] = ['statement', 'support', 'source', 'options', 'highlights', 'answer', 'metadata'];

function inferOptionsEvidence(artifacts: PdfArtifactResult | undefined, values: string[]): QuestionEvidence | undefined {
  const targets = values.map(plainEvidenceText).filter(target => target.length >= 1);
  if (!artifacts || targets.length === 0) return undefined;
  const page = artifacts.artifacts.find(artifact => {
    const text = plainEvidenceText(artifact.nativeText);
    return targets.every(target => text.includes(target));
  });
  return page ? { field: 'options', page: page.pageNumber, originalText: values.join(' | '), method: 'native-text' } : undefined;
}

function findOfficialAnswerKey(sourceText: string, questionNumber: number): { letter: string; text: string; page: number } | undefined {
  const marker = sourceText.search(/(?:gabarito|respostas?\s+oficiais?)/iu);
  if (marker < 0) return undefined;
  const appendix = sourceText.slice(marker);
  const match = appendix.match(new RegExp(`(?:^|\\n|\\s)0*${questionNumber}\\s*(?:[-–—.:)]|\\s)\\s*([A-E])\\b`, 'iu'));
  if (!match || match.index === undefined) return undefined;
  const evidenceText = appendix.slice(Math.max(0, match.index), Math.min(appendix.length, match.index + match[0].length)).replace(/\s+/gu, ' ').trim();
  const absoluteOffset = marker + match.index;
  const before = sourceText.slice(0, absoluteOffset);
  const pageMatches = [...before.matchAll(/--- PAGINA (\d+) ---/gu)];
  return { letter: match[1].toUpperCase(), text: evidenceText, page: pageMatches.length ? Number(pageMatches[pageMatches.length - 1][1]) : 0 };
}

export function clearCustomQuestions(): void {
  try {
    localStorage.removeItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_QUARANTINED_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing custom questions', e);
  }
}

/** Extract text page by page with PDF.js, preserving meaningful line endings. */
export async function extractTextFromPdfFile(file: File, signal?: AbortSignal): Promise<string> {
  const result = await extractPdfArtifacts(file, signal);
  return artifactsToText(result.artifacts).replace(/[ \t]+\n/g, '\n').trim();
}

export async function extractPdfArtifactsFromFile(
  file: File,
  signal?: AbortSignal,
  onProgress?: (page: number, totalPages: number, method: string) => void,
): Promise<PdfArtifactResult> {
  return extractPdfArtifacts(file, signal, progress => onProgress?.(progress.page, progress.totalPages, progress.method));
}

/**
 * Parses raw text containing exam questions & gabarito using OpenRouter AI
 */
export async function parsePdfQuestionsWithAiDetailed(
  rawText: string,
  subjectId: SubjectId,
  subjectTitle: string,
  listTitle: string,
  onProgress?: (msg: string) => void,
  signal?: AbortSignal,
  artifactResult?: PdfArtifactResult,
): Promise<ImportPipelineResult> {
  onProgress?.('Enviando texto do PDF para o servidor de importação...');

  // Process every page. The answer appendix is repeated in each batch so
  // questions near the beginning can still be reconciled with a final key.
  const sourceText = artifactResult ? artifactsToText(artifactResult.artifacts) : rawText;
  const requestBatches = createPdfImportBatches(sourceText);
  const importId = artifactResult?.importId || globalThis.crypto?.randomUUID?.() || `import-${Date.now()}`;

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

  const userPrompt = '';

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
      const pagesInBatch = [...requestBatches[batchIndex].matchAll(/--- PAGINA (\d+) ---/gu)].map(match => Number(match[1]));
      const images = pagesInBatch
        .map(page => artifactResult?.artifacts.find(artifact => artifact.pageNumber === page)?.imageDataUrl)
        .filter((value): value is string => Boolean(value))
        .slice(0, 2);
      let lastResponse: Response | undefined;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (signal?.aborted) throw new DOMException('Importação cancelada.', 'AbortError');
        lastResponse = await fetch('/api/ai/import', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rawText: requestBatches[batchIndex], images, batch: batchIndex + 1, totalBatches: requestBatches.length }) });
        if (![429, 500, 502, 503, 504].includes(lastResponse.status) || attempt === 2) break;
        const retryAfter = Number(lastResponse.headers.get('Retry-After'));
        const waitMs = Number.isFinite(retryAfter) ? Math.min(15_000, Math.max(500, retryAfter * 1000)) : 750 * (attempt + 1);
        await new Promise<void>((resolve, reject) => {
          const timer = window.setTimeout(() => { controller.signal.removeEventListener('abort', abort); resolve(); }, waitMs);
          const abort = () => { window.clearTimeout(timer); controller.signal.removeEventListener('abort', abort); reject(new DOMException('Importação cancelada.', 'AbortError')); };
          controller.signal.addEventListener('abort', abort, { once: true });
        });
      }
      response = lastResponse as Response;
    } catch (error) {
      if (signal?.aborted) throw new DOMException('Importação cancelada.', 'AbortError');
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
    statement: typeof q.statement === 'string' && q.statement.trim() ? q.statement : '',
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
    const deterministicKey = findOfficialAnswerKey(sourceText, questionNumber);
    const deterministicAnswer = deterministicKey?.letter === correctLetter ? deterministicKey : undefined;
    if (deterministicKey && deterministicKey.letter !== correctLetter) structuralWarnings.push('A letra estruturada diverge do gabarito oficial encontrado no documento.');
    if (!q.answerEvidence && deterministicAnswer) q.answerEvidence = deterministicAnswer.text;
    const normalizedItem = normalizeQuestionSupport(item);
    normalizedItem.quality = validateQuestionQuality(normalizedItem, { requireEmphasisNotes: true, requireProvenance: true });
    const evidence: QuestionEvidence[] = Array.isArray(q.evidence)
      ? q.evidence.filter((entry: any) => Number.isInteger(Number(entry?.page)) && Number(entry.page) > 0 && EVIDENCE_FIELDS.includes(entry?.field)).map((entry: any): QuestionEvidence => ({
          field: entry.field as QuestionEvidence['field'],
          page: Number(entry.page),
          coordinates: entry.coordinates && typeof entry.coordinates === 'object' ? {
            x: Number(entry.coordinates.x || 0), y: Number(entry.coordinates.y || 0), width: Number(entry.coordinates.width || 0), height: Number(entry.coordinates.height || 0),
          } : undefined,
          originalText: typeof entry.originalText === 'string' ? entry.originalText : undefined,
          // Do not persist page images in localStorage; they are request-scoped evidence.
          imageDataUrl: typeof entry.imageDataUrl === 'string' && entry.imageDataUrl.length < 20_000 ? entry.imageDataUrl : undefined,
          method: ['native-text', 'ocr', 'vision', 'deterministic', 'independent-pass'].includes(entry.method) ? entry.method : 'deterministic',
        }))
      : [];
    const inferredStatement = inferNativeEvidence(artifactResult, 'statement', typeof item.statement === 'string' ? item.statement : '');
    if (inferredStatement && !evidence.some(entry => entry.field === 'statement')) evidence.push(inferredStatement);
    const optionValues = rawOptions.map((option: any) => typeof option?.text === 'string' ? option.text : '').filter(Boolean);
    const inferredOptions = inferOptionsEvidence(artifactResult, optionValues);
    if (inferredOptions && !evidence.some(entry => entry.field === 'options')) evidence.push(inferredOptions);
    if (typeof q.answerEvidence === 'string' && q.answerEvidence.trim() && !evidence.some(entry => entry.field === 'answer')) {
      evidence.push({ field: 'answer', page: Number(item.provenance?.answerPage || deterministicAnswer?.page || 0), originalText: q.answerEvidence.trim(), method: deterministicAnswer ? 'deterministic' : 'independent-pass' });
    }
    const confidence = q.fieldConfidence && typeof q.fieldConfidence === 'object' ? q.fieldConfidence : deterministicAnswer ? { answer: { confidence: 1, method: 'deterministic' } } : undefined;
    normalizedItem.quality = { ...normalizedItem.quality, evidence, fieldConfidence: confidence };
    if (!q.answerEvidence && !evidence.some(entry => entry.field === 'answer')) {
      structuralWarnings.push('Gabarito sem evidência independente de página ou trecho oficial.');
    }
    const answerConfidence = Number(confidence?.answer?.confidence);
    if (!Number.isFinite(answerConfidence) || answerConfidence < 0.98) structuralWarnings.push('Confiança do gabarito abaixo do limiar editorial.');
    if (typeof q.answerEvidence === 'string' && q.answerEvidence.trim() && !new RegExp(`\\b${correctLetter}\\b`, 'iu').test(q.answerEvidence)) {
      structuralWarnings.push('Trecho de evidência do gabarito não confirma a letra estruturada.');
    }
    if (typeof q.answerEvidence === 'string' && q.answerEvidence.trim() && !plainEvidenceText(sourceText).includes(plainEvidenceText(q.answerEvidence))) {
      structuralWarnings.push('Trecho do gabarito não foi localizado no conteúdo original.');
    }
    for (const requiredField of ['statement', 'options', 'answer'] as const) {
      if (!evidence.some(entry => entry.field === requiredField && entry.page > 0 && entry.originalText?.trim())) {
        structuralWarnings.push(`Evidência ausente para ${requiredField === 'answer' ? 'o gabarito' : requiredField === 'options' ? 'as alternativas' : 'o enunciado'}.`);
      }
    }
    if (structuralWarnings.length > 0) {
      normalizedItem.quality = {
        ...normalizedItem.quality,
        status: 'quarantined',
        warnings: [...new Set([...structuralWarnings, ...normalizedItem.quality.warnings])]
      };
    } else if (normalizedItem.quality.warnings.length > 0) {
      normalizedItem.quality = { ...normalizedItem.quality, status: 'quarantined' };
    }
    return normalizedItem;
  });

  const verified = resultItems.filter(item => item.quality?.status === 'verified');
  const quarantined = resultItems.filter(item => item.quality?.status !== 'verified');
  // Publish only verified records. Quarantine is durable but hidden from study.
  const currentCustom = getCustomQuestions();
  const storage = saveCustomQuestions([...currentCustom, ...verified]);
  const quarantineStorage = saveQuarantinedQuestions([...getQuarantinedQuestions(), ...quarantined]);
  const manifest: ImportManifest = {
    ...(artifactResult?.manifest || {
      importId,
      fileName: listTitle,
      totalPages: [...sourceText.matchAll(/--- PAGINA (\d+) ---/gu)].length,
      receivedPages: [], processedPages: [], reprocessedPages: [], rejectedPages: [], extractionMethods: {}, questionCountDetected: 0, verifiedCount: 0, quarantinedCount: 0, coverage: 0,
    }),
    importId,
    questionCountDetected: resultItems.length,
    verifiedCount: verified.length,
    quarantinedCount: quarantined.length,
  };
  if (!storage.ok || !quarantineStorage.ok) onProgress?.('Questões processadas, mas o armazenamento local recusou parte do relatório.');

  onProgress?.(`Processamento concluído: ${verified.length} verificadas, ${quarantined.length} isoladas para revisão.`);
  return { importId, verified, quarantined, manifest, storage: storage.ok ? quarantineStorage : storage };
}

/** Backwards-compatible convenience API: callers receive only publishable items. */
export async function parsePdfQuestionsWithAi(
  rawText: string,
  subjectId: SubjectId,
  subjectTitle: string,
  listTitle: string,
  onProgress?: (msg: string) => void,
  signal?: AbortSignal,
): Promise<QuestionBankItem[]> {
  const result = await parsePdfQuestionsWithAiDetailed(rawText, subjectId, subjectTitle, listTitle, onProgress, signal);
  return result.verified;
}
