import type {
  QuestionBankEmphasisNote,
  QuestionBankItem,
  QuestionBankOption,
  QuestionBankQuality,
  QuestionBankSupport,
} from '../data/questionBank';

const SOURCE_START_RE = /^(?:Fonte|Dispon[ií]vel|Acesso|Adaptado)\b|^\(?https?:\/\//i;
const READING_INSTRUCTION_RE = /^(?:Leia|Leia-se|Observe|Observ[eé]|Considere|Assinale|Marque|Julgue|Indique|Responda|Analise|Aponte)\b/i;
const LABEL_RE = /^(?:TEXTO|Texto)\s+(?:[IVX]+|\d+)$/i;
const MARKED_INSTRUCTION_START_RE = /^(\s*)(?:<u>\s*(Assinale|Marque|Observe|Leia(?:-se)?|Indique|Aponte|Considere|Analise|Responda|Complete)\s*<\/u>|\*\*\s*(Assinale|Marque|Observe|Leia(?:-se)?|Indique|Aponte|Considere|Analise|Responda|Complete)\s*\*\*)/i;

/**
 * These are editorial directions that belong to the question command, not to
 * the source excerpt.  PDF layers frequently put them in the same text run
 * as the passage; keeping them in the support card creates a misleading
 * "texto de apoio" paragraph and duplicates the command on screen.
 */
function isRedundantSupportInstruction(value: string): boolean {
  const plain = stripSupportMarkup(value).replace(/\s+/g, ' ').trim();
  if (!plain) return false;
  const patterns = [
    /^leia\s*:?$/iu,
    /^leia(?:\s+(?:o|a|os|as))?\s+(?:textos?|trechos?|excertos?|fragmentos?|frases?)(?:\s+(?:a|ao)\s+seguir|\s+abaixo|\s+seguinte|\s+destacado)?\s*[:.]?$/iu,
    /^leia\s+atentamente(?:\s+o\s+(?:seguinte\s+)?(?:texto|trecho)|\s+o\s+trecho\s+(?:a|ao)\s+seguir|\s+e\s+assinale\s+a\s+alternativa\s+correta)?\s*[:.]?$/iu,
    /^observe\s*:?$/iu,
    /^observe\s+atentamente(?:\s+o\s+(?:seguinte\s+)?(?:texto|trecho|quesito))?\s*[:.]?$/iu,
    /^ap[oó]s\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|quest[aã]o\s+proposta)[.!?]?$/iu,
    /^lido\s+o\s+texto,[^.?!]{0,220}(?:alternativa|op[cç][aã]o)\s+correta[.!?]?$/iu,
    /^com\s+base\s+no\s+texto,?\s+responda\s+(?:[àa]\s+)?quest[aã]o[.!?]?$/iu,
    /^para\s+responder\s+[àa]\s+quest[aã]o\s*:?$/iu,
  ];
  return patterns.some(pattern => pattern.test(plain));
}

/** Remove only a leading meta direction when it is followed by real content. */
function stripInlineSupportInstruction(value: string): string {
  const original = value.replace(/\r\n?/g, '\n').trim();
  const plain = stripSupportMarkup(original).replace(/\s+/g, ' ').trim();
  if (isRedundantSupportInstruction(plain)) return '';
  const match = original.match(/^(?:Leia(?:[-\s]+(?:(?:o|a|os|as)\s+)?(?:texto|trecho|excerto|fragmento)[^:]{0,100})?|Observe(?:\s+atentamente[^:]{0,100})?|Ap[oó]s\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|quest[aã]o\s+proposta)|Lido\s+o\s+texto,[^.?!]{0,220}(?:alternativa|op[cç][aã]o)\s+correta)\s*[:.]\s*(.+)$/isu);
  if (!match) return original;
  const remainder = match[1].trim();
  return stripSupportMarkup(remainder).length >= 24 ? remainder : original;
}

function cleanSupportParagraphs(paragraphs: string[]): string[] {
  return paragraphs
    .map(paragraph => stripInlineSupportInstruction(paragraph))
    .map(paragraph => paragraph
      .replace(/\r\n?/g, '\n')
      .replace(/[\u00a0\u2007\u202f]/g, ' ')
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .filter(Boolean)
      .join('\n'))
    .filter(Boolean);
}

/**
 * Removes a duplicated reading direction from the statement once a support
 * card exists.  The actual command (for example "assinale a alternativa")
 * is preserved; only the introductory sentence is removed.
 */
function stripStatementSupportPreamble(statement: string, hasSupport: boolean): string {
  if (!hasSupport) return statement;
  let value = statement.replace(/\r\n?/g, '\n').trim();
  value = value.replace(/^(?:Ap[oó]s\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|quest[aã]o\s+proposta)|Lido\s+o\s+texto,[^.?!]{0,240}(?:alternativa|op[cç][aã]o)\s+correta)[.!?]\s*/iu, '');
  value = value.replace(/^Lido\s+o\s+texto,\s*(?:\*\*)?observe\s+atentamente(?:\*\*)?\s+o\s+quesito\s+e\s+assinale\s+somente\s+(?:\*\*)?uma(?:\*\*)?\s+alternativa\s+correta(?:\s+em\s+cada\s+quest[aã]o)?\s*[:.]?\s*/iu, '');
  value = value.replace(/^Leia(?:\s+atentamente)?(?:\s+(?:o\s+)?(?:textos?|trechos?|excertos?|fragmentos?|frases?)[^:]{0,100})?\s*(?:em\s+destaque\s*)?[:.]\s*/iu, '');
  return value.trim();
}

export function stripSupportMarkup(value: string): string {
  return value
    .replace(/<\/?(?:u|b|strong)>/gi, '')
    .replace(/\*\*/g, '')
    .replace(/[\u00a0\u2007\u202f]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Command starters are not pedagogical targets.  PDF extraction can turn a
 * command's bold styling into an underline, so keep the command readable but
 * unmarked.  The match is intentionally limited to the beginning of the
 * statement; semantic highlights elsewhere are preserved.
 */
function stripInstructionMarkup(value: string): string {
  return value.replace(MARKED_INSTRUCTION_START_RE, (_match, whitespace: string, underline: string, bold: string) => `${whitespace}${underline || bold}`);
}

function normalizeRawBlock(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u00a0\u2007\u202f]/g, ' ')
    .split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}

function isLikelyByline(value: string): boolean {
  const plain = stripSupportMarkup(value);
  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 8 || /[.!?:;(),“”"\d]/.test(plain)) return false;
  if (/^(?:A|O|As|Os|Um|Uma)\s/u.test(plain)) return false;
  const connectors = new Set(['a', 'e', 'da', 'das', 'de', 'do', 'dos', 'em', 'na', 'no']);
  return words.every((word, index) => connectors.has(word.toLowerCase()) || index === 0 || /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/u.test(word));
}

function isLikelyTitle(value: string): boolean {
  const plain = stripSupportMarkup(value);
  return plain.length > 0
    && plain.length <= 140
    && !/[.!?:;]$/.test(plain)
    && !/^\d{1,2}\s*[§º°]/.test(plain)
    && !READING_INSTRUCTION_RE.test(plain)
    && !/^(?:Fonte|Dispon[ií]vel|Acesso|Adaptado)\b/i.test(plain);
}

function isLikelySource(value: string): boolean {
  const plain = stripSupportMarkup(value);
  return SOURCE_START_RE.test(plain)
    || /\b(?:Dispon[ií]vel|Acesso em|Texto adaptado|Texto Adaptado|Editora|Itatiaia|Rocco|Saraiva|Companhia das Letras|Record|Moderna|Phonogram|Philips)\b/i.test(plain)
    || /^\([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^\n]{0,220}\b(?:19|20)\d{2}\b[^\n]*\)$/u.test(plain)
    || /^\([^\n]{3,240}\b(?:19|20)\d{2}\b[^\n]*\)$/u.test(plain);
}

function splitInlineSource(block: string): [string, string] | null {
  const match = block.match(/(?:\n\s*|\s+)(?=\(?(?:Dispon[ií]vel|Fonte:|Acesso em:?)\b|[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^\n]{1,100}\bTexto Adaptado\b)/iu);
  if (match && match.index !== undefined && match.index > 0) {
    return [block.slice(0, match.index).trim(), block.slice(match.index).trim()];
  }
  const citation = block.match(/\s+(\([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^()\n]{0,220}\b(?:19|20)\d{2}\b[^()\n]*\))$/u);
  if (citation && citation.index !== undefined && citation.index > 0) {
    return [block.slice(0, citation.index).trim(), citation[1].trim()];
  }
  return null;
}

function formatBodyBlock(block: string): string {
  const lines = normalizeRawBlock(block).split('\n').filter(Boolean);
  if (lines.length <= 1) return lines[0] || '';

  // Keep verses, dialogue and numbered paragraphs visibly structured. PDF line
  // wraps in ordinary prose are joined so they do not become false paragraphs.
  const looksStructured = lines.some(line => /^(?:[—–-]\s+|\d{1,2}\s*[§º°]|[IVX]{1,4}\s*[-–—:.])/i.test(line));
  const looksVerse = lines.length >= 3 && lines.every(line => line.length <= 92 && !/[.!?;:]$/.test(line));
  return (looksStructured || looksVerse) ? lines.join('\n') : lines.join(' ');
}

export function parseLegacySupport(readingText?: string): QuestionBankSupport | undefined {
  if (!readingText?.trim()) return undefined;

  const normalized = readingText.replace(/\r\n?/g, '\n').trim();
  const rawBlocks = normalized
    .split(/\n\s*\n+/)
    .map(normalizeRawBlock)
    .filter(Boolean);
  const blocks: string[] = [];
  for (const rawBlock of rawBlocks) {
    const rawLines = rawBlock.split('\n');
    if (rawLines[0] && LABEL_RE.test(stripSupportMarkup(rawLines[0])) && rawLines.length > 1) {
      // PDF layers often put the label and title/body on one physical block.
      blocks.push(rawLines[0], rawLines.slice(1).join('\n').trim());
      continue;
    }
    const split = splitInlineSource(rawBlock);
    if (split) blocks.push(split[0], split[1]);
    else blocks.push(rawBlock);
  }

  const support: QuestionBankSupport = { paragraphs: [] };
  let index = 0;
  if (blocks[index] && LABEL_RE.test(stripSupportMarkup(blocks[index]))) {
    support.label = stripSupportMarkup(blocks[index]).replace(/^Texto/i, 'TEXTO');
    index += 1;
    // Some PDF text layers repeat the Roman numeral as a standalone line.
    if (blocks[index] && /^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)$/i.test(stripSupportMarkup(blocks[index]))) index += 1;
  }

  if (blocks[index] && isLikelyTitle(blocks[index])) {
    support.title = stripSupportMarkup(blocks[index]);
    index += 1;
  }
  if (blocks[index] && isLikelyByline(blocks[index])) {
    support.author = stripSupportMarkup(blocks[index]);
    index += 1;
  }

  const bodyAndSource = blocks.slice(index);
  if (bodyAndSource.length > 0 && isLikelySource(bodyAndSource[bodyAndSource.length - 1])) {
    support.source = stripSupportMarkup(bodyAndSource.pop()!);
  }

  support.paragraphs = cleanSupportParagraphs(bodyAndSource.map(formatBodyBlock).filter(Boolean));
  if (!support.title && !support.author && !support.source && support.paragraphs.length === 0) return undefined;
  return support;
}

export function getQuestionSupport(question: Pick<QuestionBankItem, 'support' | 'readingText'>): QuestionBankSupport | undefined {
  if (question.support) {
    const paragraphs = Array.isArray(question.support.paragraphs)
      ? question.support.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string' && paragraph.trim().length > 0)
      : [];
    if (question.support.title || question.support.author || question.support.source || paragraphs.length > 0 || question.support.label) {
      return { ...question.support, paragraphs: cleanSupportParagraphs(paragraphs) };
    }
  }
  return parseLegacySupport(question.readingText);
}

export function supportToClipboardText(support: QuestionBankSupport | undefined): string {
  if (!support) return '';
  const clean = (value: string) => value
    .replace(/<\/?(?:u|b|strong)>/gi, '')
    .replace(/\*\*/g, '')
    .replace(/[\u00a0\u2007\u202f]/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
  const sections = [support.label, support.title, support.author, ...support.paragraphs, support.source]
    .filter((value): value is string => Boolean(value))
    .map(clean);
  return sections.join('\n\n');
}

function normalizeStructuredSupport(support: QuestionBankSupport | undefined): QuestionBankSupport | undefined {
  if (!support) return undefined;
  const cleanParagraphs = cleanSupportParagraphs((Array.isArray(support.paragraphs) ? support.paragraphs : [])
    .filter((paragraph): paragraph is string => typeof paragraph === 'string' && paragraph.trim().length > 0)
  );
  const normalized: QuestionBankSupport = {
    paragraphs: cleanParagraphs,
  };
  const cleanMeta = (value?: string) => value ? stripSupportMarkup(value).replace(/\s+/g, ' ').trim() : '';
  const label = cleanMeta(support.label).replace(/^Texto\b/i, 'TEXTO');
  const title = cleanMeta(support.title);
  const author = cleanMeta(support.author);
  const source = cleanMeta(support.source);
  if (label) normalized.label = label;
  if (title) normalized.title = title;
  if (author) normalized.author = author;
  if (source) normalized.source = source;
  return normalized.label || normalized.title || normalized.author || normalized.source || normalized.paragraphs.length > 0
    ? normalized
    : undefined;
}

/**
 * A complete support paragraph marked as one large target is almost always a
 * decoration/import residue.  New imports may retain that mark only when the
 * AI supplied an explicit semantic note for the paragraph; otherwise remove
 * the wrapper while preserving any inner content.
 */
function stripUnsupportedWholeParagraphMarks(
  support: QuestionBankSupport | undefined,
  emphasisNotes: QuestionBankEmphasisNote[] | undefined,
): QuestionBankSupport | undefined {
  if (!support || support.paragraphs.length === 0) return support;
  const notedTargets = new Set(
    (emphasisNotes || []).map(note => note?.target?.trim().toLowerCase()).filter(Boolean),
  );
  const paragraphs = support.paragraphs.map((paragraph, index) => {
    const target = `support.paragraph:${index + 1}`.toLowerCase();
    if (notedTargets.has(target)) return paragraph;
    const underline = paragraph.trim().match(/^<u>([\s\S]+)<\/u>$/i);
    const bold = paragraph.trim().match(/^\*\*([\s\S]+)\*\*$/);
    const match = underline || bold;
    if (!match || stripSupportMarkup(match[1]).length < 40) return paragraph;
    return match[1].trim();
  });
  return { ...support, paragraphs };
}

function moveLeadingAccessToSource(
  statement: string,
  support: QuestionBankSupport | undefined,
): { statement: string; support: QuestionBankSupport | undefined } {
  if (!support) return { statement, support };
  const match = statement.trim().match(/^(Acesso\s+em[^\n]{2,120})\n+(.+)$/isu);
  if (!match) return { statement, support };
  const access = match[1].replace(/\s+/g, ' ').trim();
  const source = support.source?.trim() || '';
  if (!source.toLowerCase().includes(access.toLowerCase())) {
    support = { ...support, source: `${source} ${access}`.trim() };
  }
  return { statement: match[2].trim(), support };
}

function markupIsBalanced(value: string): boolean {
  return (value.match(/\*\*/g) || []).length % 2 === 0
    && (value.match(/<u>/g) || []).length === (value.match(/<\/u>/g) || []).length;
}

function hasMarkup(value: string): boolean {
  return /<u>.+?<\/u>|\*\*.+?\*\*/s.test(value);
}

export function validateQuestionQuality(
  question: Pick<QuestionBankItem, 'statement' | 'options' | 'correctLetter' | 'support' | 'readingText' | 'emphasisNotes' | 'provenance'>,
  options: { requireEmphasisNotes?: boolean; requireProvenance?: boolean } = {},
): QuestionBankQuality {
  const warnings: string[] = [];
  const support = getQuestionSupport(question);
  const allText = [question.statement, supportToClipboardText(support), ...question.options.map(option => option.text)].join('\n');

  if (!question.statement?.trim()) warnings.push('Enunciado vazio.');
  if (![4, 5].includes(question.options.length)) warnings.push('Quantidade de alternativas diferente de 4 ou 5.');
  if (question.options.filter(option => option.correct).length !== 1 || !question.options.some(option => option.letter === question.correctLetter && option.correct)) {
    warnings.push('Gabarito e alternativa marcada não coincidem.');
  }
  if (/[�¢€†]/.test(allText)) warnings.push('Caractere corrompido detectado.');
  if (!markupIsBalanced(allText)) warnings.push('Marcação de destaque desbalanceada.');
  if (support?.title && hasMarkup(support.title)) warnings.push('Título contém marcação visual decorativa.');
  if (options.requireEmphasisNotes && hasMarkup(allText) && (!question.emphasisNotes || question.emphasisNotes.length === 0)) {
    warnings.push('Destaque visual importado sem justificativa semântica.');
  }
  if (question.emphasisNotes?.some(note => typeof note?.target !== 'string' || typeof note?.reason !== 'string' || !/^(?:statement|option:[A-E]|support\.paragraph:\d+)$/i.test(note.target) || note.reason.trim().length < 8)) {
    warnings.push('Justificativa de destaque visual inválida ou incompleta.');
  }
  if (MARKED_INSTRUCTION_START_RE.test(question.statement || '')) {
    warnings.push('Comando inicial contém sublinhado/negrito decorativo.');
  }
  if (/^\s*Acesso\s+em[^\n]{2,120}\n/iu.test(question.statement || '')) {
    warnings.push('Data de acesso bibliográfico está no enunciado, não na fonte.');
  }
  if (options.requireProvenance && (!question.provenance?.pdf || !Number.isInteger(question.provenance.questionPage) || !Number.isInteger(question.provenance.answerPage))) {
    warnings.push('Página da questão ou do gabarito não foi identificada.');
  }
  if (/\b(?:sublinhad[oa]s?|grif[oa]s?|destacad[oa]s?|em negrito)\b/i.test(question.statement) && !hasMarkup(allText)) {
    warnings.push('O enunciado exige destaque visual, mas nenhum alvo foi identificado.');
  }
  if (support?.source && support.paragraphs.length === 0 && !support.title) warnings.push('Fonte sem conteúdo de apoio identificável.');

  return { status: warnings.length ? 'warning' : 'verified', warnings };
}

export function normalizeQuestionSupport(question: QuestionBankItem): QuestionBankItem {
  const normalizedSupport = normalizeStructuredSupport(getQuestionSupport(question));
  const support = stripUnsupportedWholeParagraphMarks(normalizedSupport, question.emphasisNotes);
  const withoutPreamble = stripStatementSupportPreamble(question.statement, Boolean(support));
  const moved = moveLeadingAccessToSource(withoutPreamble, support);
  const statement = stripInstructionMarkup(moved.statement);
  const quality = validateQuestionQuality({ ...question, statement, support: moved.support });
  return { ...question, statement, support: moved.support, quality };
}

export function optionHasVisualMarkup(option: QuestionBankOption): boolean {
  return hasMarkup(option.text);
}
