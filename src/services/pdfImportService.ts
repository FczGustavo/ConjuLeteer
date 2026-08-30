import type { QuestionBankItem, SubjectId } from '../data/questionBank';
import { loadUserSettings } from '../utils/srsEngine';

const CUSTOM_QUESTIONS_STORAGE_KEY = 'conjuletter_custom_questions_v1';

export function getCustomQuestions(): QuestionBankItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
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
3. Separe o texto-base compartilhado em "readingText" e mantenha em "statement" apenas o comando e os trechos específicos da questão.
4. Preserve a ordem, a numeração e todas as alternativas existentes. Não transforme trechos do enunciado em alternativas.
5. Preserve destaques como **texto** quando forem identificáveis e represente lacunas como ________.
6. "correctLetter" deve vir exclusivamente do bloco oficial de respostas/gabarito. Se não houver resposta explícita para uma questão, omita essa questão do resultado.
7. Marque exatamente uma opção com "correct": true, correspondente a "correctLetter".
8. Antes de responder, confira número da questão, letras, quantidade de alternativas e correspondência com o gabarito.
9. Retorne somente um objeto JSON válido, sem markdown, neste formato:
{
  "questions": [
    {
    "questionNumber": 1,
    "readingText": "texto de apoio ou string vazia",
    "statement": "comando completo",
    "options": [
      {"letter":"A","text":"alternativa A","correct":false},
      {"letter":"B","text":"alternativa B","correct":true},
      {"letter":"C","text":"alternativa C","correct":false},
      {"letter":"D","text":"alternativa D","correct":false}
    ],
    "correctLetter": "B",
    "banca": "nome explícito ou Concurso Militar"
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

  const resultItems: QuestionBankItem[] = parsedArray.map((q, idx) => {
    const correctLetter = String(q.correctLetter || '').toUpperCase();
    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const optionLetters = rawOptions.map((opt: any) => String(opt.letter || '').toUpperCase());

    if (!q.statement || rawOptions.length < 4 || rawOptions.length > 5) {
      throw new Error(`Questão ${q.questionNumber || idx + 1} incompleta: enunciado ou alternativas inválidas.`);
    }
    if (new Set(optionLetters).size !== rawOptions.length || !optionLetters.includes(correctLetter)) {
      throw new Error(`Questão ${q.questionNumber || idx + 1} com gabarito inconsistente.`);
    }

    return {
    id: `custom-${subjectId}-${Date.now()}-${idx + 1}`,
    subjectId: subjectId,
    subjectTitle: subjectTitle,
    listId: `custom_import_${Date.now()}`,
    listTitle: listTitle || 'Lista Importada via IA',
    questionNumber: q.questionNumber || (idx + 1),
    readingText: q.readingText || undefined,
    statement: q.statement || 'Enunciado da questão',
    options: rawOptions.map((opt: any) => ({
      letter: String(opt.letter).toUpperCase(),
      text: opt.text || '',
      correct: String(opt.letter).toUpperCase() === correctLetter
    })),
    correctLetter,
    banca: q.banca || 'Importada pelo Usuário',
    isCustom: true
    } as QuestionBankItem;
  });

  // Append to existing custom questions
  const currentCustom = getCustomQuestions();
  saveCustomQuestions([...currentCustom, ...resultItems]);

  onProgress?.(`Sucesso! ${resultItems.length} questões importadas e salvas no Banco.`);
  return resultItems;
}
