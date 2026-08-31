import type { QuestionBankEmphasisNote, QuestionBankItem, QuestionBankSupport, SubjectId } from '../data/questionBank';
import { loadUserSettings } from '../utils/srsEngine';
import { normalizeQuestionSupport, parseLegacySupport, validateQuestionQuality } from '../utils/questionSupport';

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
export async function extractTextFromPdfFile(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).href;
  const data = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
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

  return pages.join('\n\n').replace(/[ \t]+\n/g, '\n').trim();
}

/**
 * Parses raw text containing exam questions & gabarito using OpenRouter AI
 */
export async function parsePdfQuestionsWithAi(
  rawText: string,
  subjectId: SubjectId,
  subjectTitle: string,
  listTitle: string,
  onProgress?: (msg: string) => void
): Promise<QuestionBankItem[]> {
  const settings = loadUserSettings();
  const apiKey = settings.openRouterApiKey;
  const model = settings.aiModel || 'google/gemini-3.7-flash';

  if (!apiKey) {
    throw new Error('Chave de API do OpenRouter não configurada. Por favor, adicione sua chave no modal de Configurações.');
  }

  onProgress?.('Enviando texto do PDF para análise da IA...');

  // Preserve both the questions and the answer table when a document is large.
  const maxCharacters = 120000;
  const textSample = rawText.length <= maxCharacters
    ? rawText
    : `${rawText.slice(0, 90000)}\n\n[...trecho intermediario omitido...]\n\n${rawText.slice(-30000)}`;

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

${textSample}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://conjuletter.local',
      'X-Title': 'ConjuLetter Question Bank Import'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erro na API OpenRouter (${response.status}): ${errText}`);
  }

  onProgress?.('Processando resposta estruturada da IA...');

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || '';

  // Parse JSON
  let parsedArray: any[] = [];
  try {
    const jsonMatch = rawContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      parsedArray = JSON.parse(jsonMatch[0]);
    } else {
      const obj = JSON.parse(rawContent);
      if (Array.isArray(obj)) {
        parsedArray = obj;
      } else if (obj.questions && Array.isArray(obj.questions)) {
        parsedArray = obj.questions;
      }
    }
  } catch {
    throw new Error('Falha ao interpretar a estrutura JSON gerada pela IA: ' + rawContent.slice(0, 200));
  }

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
    id: `custom-${subjectId}-${Date.now()}-${idx + 1}`,
    subjectId: subjectId,
    subjectTitle: subjectTitle,
    listId: `custom_import_${Date.now()}`,
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
