import React from 'react';

type TextMode = 'prose' | 'statement' | 'reading' | 'option';

/**
 * Formats exam text preserving specific bold words, underlined expressions, and blank fill lines (_____).
 * Keeps the overall text normal weight, pleasant, clean, and legible.
 */
export const FormattedExamText: React.FC<{
  text: string;
  className?: string;
  preserveLineBreaks?: boolean;
  mode?: TextMode;
}> = React.memo(({
  text,
  className = '',
  preserveLineBreaks = false,
  mode = 'prose'
}) => {
  if (!text) return null;

  const paragraphs = splitReadableBlocks(text, mode, preserveLineBreaks);

  return (
    <div className={`space-y-3 select-text font-sans font-normal break-words [overflow-wrap:anywhere] ${className}`}>
      {paragraphs.map((p, pIdx) => {
        const readingKind = mode === 'reading' ? classifyReadingBlock(p, pIdx, paragraphs.length) : 'body';
        if (readingKind === 'label') {
          return (
            <p key={pIdx} className="text-[11px] uppercase tracking-[0.16em] text-[#e8a87c] font-semibold leading-tight">
              {parseInlineFormatting(p)}
            </p>
          );
        }
        if (readingKind === 'title') {
          return (
            <p key={pIdx} className="text-base sm:text-lg text-[#fff7ed] font-semibold leading-tight">
              {parseInlineFormatting(p)}
            </p>
          );
        }
        if (readingKind === 'source') {
          return (
            <p key={pIdx} className="border-t border-[#343c46] pt-3 text-xs text-[#9ca3af] italic leading-relaxed">
              {parseInlineFormatting(p)}
            </p>
          );
        }
        return (
            <p key={pIdx} className={`leading-[1.75] break-words [overflow-wrap:anywhere] ${preserveLineBreaks ? 'whitespace-pre-line' : ''}`}>
            {parseInlineFormatting(p)}
          </p>
        );
      })}
    </div>
  );
});

/**
 * PDF text extraction often puts each visual line in a separate line without
 * meaning that a new paragraph exists. We join those artificial wraps, but
 * keep the structures that carry meaning in an exam question: bullets,
 * numbered relations, Roman-item lists and C/E statements.
 */
function splitReadableBlocks(text: string, mode: TextMode, preserveLineBreaks: boolean): string[] {
  const normalized = normalizeMarkup(text)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u00a0\u2007\u202f]/g, ' ')
    .trim();

  if (!normalized) return [];

  const paragraphs = normalized.split(/\n\s*\n+/);
  return paragraphs.flatMap((paragraph) => {
    const lines = paragraph
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .map(line => repairNestedStyleMarkers(line))
      .filter(Boolean)
      .flatMap(line => splitInlineReadingLines(line, mode));

    if (preserveLineBreaks) return [lines.join('\n')];

    const blocks: string[] = [];
    let current = '';
    const longestLine = Math.max(...lines.map(line => stripInlineMarkers(line).length), 1);
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      const previousLine = lineIndex > 0 ? lines[lineIndex - 1] : '';
      const insideNumberedReadingParagraph = mode === 'reading' && /^\d{1,2}\s*[§º°]/.test(current);
      const currentStartsSource = mode === 'reading' && current.length > 0 && startsReadingSource(current);
      const startsStructuredItem = isStructuredItem(line)
        || (mode === 'statement' && current.length > 0 && startsEmphasizedInstruction(line))
        || (mode === 'reading' && current.length > 0 && (
          startsReadingSource(line)
          || (currentStartsSource && startsReadingInstruction(line))
          ||
          (!insideNumberedReadingParagraph && startsReadingParagraph(line, previousLine, longestLine))
          || startsReadingHeading(line, previousLine, lineIndex)
        ));

      if (startsStructuredItem && current) {
        blocks.push(current);
        current = line;
      } else {
        current = current ? `${current} ${line}` : line;
      }
    }
    if (current) blocks.push(current);
    return blocks;
  }).filter(Boolean);
}

function splitInlineReadingLines(line: string, mode: TextMode): string[] {
  if (mode !== 'reading') return [line];

  // Sources occasionally arrive glued to the preceding sentence.  Put the
  // citation on its own block so it receives the source treatment in the UI.
  const sourceAt = line.search(/\s+(?=(?:\(?(?:Dispon[ií]vel|Fonte:|Acesso em:?)\b))/i);
  if (sourceAt > 0) {
    const before = line.slice(0, sourceAt).trim();
    const source = line.slice(sourceAt).trim();
    return splitInlineReadingLines(before, mode).concat(splitInlineReadingLines(source, mode));
  }

  // Conversely, some records put the next instruction immediately after a
  // ``Fonte: ...`` citation on the same line.  Keep the command in a normal
  // reading block instead of italicising it as part of the source.
  if (startsReadingSource(line)) {
    const instructionAt = line.search(/\s+(?=(?:Leia|Leia-se|Observe|Observ[eé]|Considere|Assinale|Marque|Julgue|Indique|Responda|Analise|Aponte)\b)/i);
    if (instructionAt > 0) {
      return [line.slice(0, instructionAt).trim(), line.slice(instructionAt).trim()];
    }
  }
  return [line];
}

function startsReadingParagraph(line: string, previousLine: string, longestLine: number): boolean {
  const plainLine = stripInlineMarkers(line);
  const plainPrevious = stripInlineMarkers(previousLine);
  if (/^[—–-]\s+/.test(plainLine)) return true;
  if (!/[.!?…][”"')\]]?$/.test(plainPrevious)) return false;
  if (!/^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/.test(plainLine)) return false;
  // A short final line followed by a new capitalized sentence is the most
  // reliable paragraph signal left by these PDFs after text extraction.
  return plainPrevious.length <= longestLine * 0.74;
}

function stripInlineMarkers(text: string): string {
  return text.replace(/\*\*|<\/?u>|<\/?(?:b|strong)>/g, '');
}

function startsReadingHeading(line: string, previousLine: string, lineIndex: number): boolean {
  const plain = stripInlineMarkers(line);
  const previous = stripInlineMarkers(previousLine);
  if (/^Texto\s+(?:[IVX]+|para\s+a?\s*quest[aã]o)\s*$/i.test(previous) && lineIndex > 0) return true;
  // A numbered paragraph followed by a wrapped line is ordinary prose, not
  // a heading.  This guard prevents ``1§... silêncio`` / ``aguardando...``
  // from becoming two visual blocks.
  if (isStructuredItem(previous)) return false;
  // Lowercase lines are continuations of the preceding sentence, never a
  // standalone title (common when a PDF wraps a sentence mid-line).
  if (!/^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/.test(plain)) return false;
  return lineIndex <= 2
    && plain.length <= 96
    && !/[.!?:;]$/.test(plain)
    && !/^(?:Leia|Observe|Considere|Assinale|Marque|Após|Julgue|Aponte|Indique)\b/i.test(plain);
}

function startsReadingSource(line: string): boolean {
  const plain = stripInlineMarkers(line);
  return /^(?:Fonte|Dispon[ií]vel|Acesso|Adaptado)\b/i.test(plain)
    || /^(?:https?:\/\/|www\.)/i.test(plain)
    || /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][\p{L}.'-]*(?:\s+[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][\p{L}.'-]*){0,5}\s+Texto\s+Adaptado\b/u.test(plain)
    || /^\([^\n]{3,180}\b(?:19|20)\d{2}\b[^\n]*\)$/u.test(plain);
}

function startsReadingInstruction(line: string): boolean {
  return /^(?:Leia|Leia-se|Observe|Observ[eé]|Considere|Assinale|Marque|Julgue|Indique|Responda|Analise|Aponte)\b/i.test(stripInlineMarkers(line));
}

function classifyReadingBlock(block: string, index: number, total: number): 'label' | 'title' | 'source' | 'body' {
  const plain = stripInlineMarkers(block).trim();
  if (/^Texto\s+(?:[IVX]+|para\s+a?\s*quest[aã]o)\s*$/i.test(plain)) return 'label';
  if (index <= 3 && looksLikeByline(plain)) return 'source';
  if (startsReadingSource(block) || (index === total - 1 && /\b(?:Fonte|Dispon[ií]vel|Acesso|Adaptado|https?:\/\/|\b(?:19|20)\d{2}\b)\b/i.test(plain) && plain.length < 420)) {
    return 'source';
  }
  if (index <= 2 && plain.length <= 96 && !/^\d{1,2}\s*[§º°]/.test(plain) && !/[.!?:;]$/.test(plain) && !/^(?:Leia|Observe|Considere|Assinale|Marque|Após|Julgue|Aponte|Indique)\b/i.test(plain)) {
    return 'title';
  }
  return 'body';
}

function looksLikeByline(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 8 || /[.!?:;(),“”"\d]/.test(text)) return false;
  if (/^(?:A|O|As|Os|Um|Uma)\s/u.test(text)) return false;
  const connectors = new Set(['a', 'e', 'da', 'das', 'de', 'do', 'dos', 'em', 'na', 'no']);
  return words.every((word, index) => connectors.has(word.toLowerCase()) || (index === 0 || /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/u.test(word)));
}

function isStructuredItem(line: string): boolean {
  // Bullets, numbered relations/paragraphs, Roman items, and C/E sequences.
  return /^(?:[•●▪◦]|\(?[IVX]{1,4}\)?\s*[-–—:.]|\d{1,2}\s*(?:[-–—.)]|[§º°])|[A-E]\s*[).:-]|\(\s*\)\s*)/i.test(line);
}

function startsEmphasizedInstruction(line: string): boolean {
  // In the verb sheets the PDF bolds the instruction after ``Leia:`` or the
  // quoted excerpt. Keeping that instruction on its own line removes the
  // large, visually confusing bold run seen in the source extraction.
  return /^\*\*\s*[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ“"(]/.test(line);
}

function normalizeMarkup(text: string): string {
  const cleaned = stripSubjectHeaders(text)
  return cleaned
    // A line break before a lowercase continuation is a PDF line-wrap
    // artifact, not a new paragraph (for example ``silêncio\n\naguardando``).
    .replace(/\n{2,}(?=[a-záéíóúàâêîôûãõç])/g, '\n')
    // Some PDF style runs join the label and title while wrapping the title
    // in an underline marker.  Restore both the line break and plain title.
    .replace(/\bTexto\s+([IVX]+)<u>([^<\n]+)<\/u>/g, 'Texto $1\n$2')
    // A few PDF text layers concatenate a Roman text label and its title
    // (``Texto IA complicada...``). Restore the semantic line boundary.
    .replace(/\bTexto\s+([IVX]+)(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ])/g, 'Texto $1\n')
    // Repair crossed underline/bold markers produced when a PDF's emphasis
    // spans were merged (``**<u>word</u> ...**`` and the inverse).
    .replace(/\*\*<u>([^<\n]*)\*<\/u>\*/g, '<u>$1</u>')
    .replace(/\*\*<u>([^<\n]*)\*\*<\/u>/g, '<u>$1</u>')
    .replace(/\*\*<u>([^<\n]*)<\/u>([^*\n]*)\*\*/g, '<u>$1</u>$2')
    .replace(/<u>([^<\n]*)\*\*([^<\n]*)<\/u>([^*\n]*)\*\*/g, '<u>$1$2</u>$3')
    // Adjacent style spans around list numbers (``**1****-**``) are PDF
    // artifacts, not emphasis.
    .replace(/\*\*(\d{1,2})\*\*\*\*\s*([-–—])\*\*/g, '$1 $2')
    // A style span containing only punctuation creates a dark pill around a
    // colon/dash. Keep the punctuation and remove the presentation marker.
    .replace(/\*\*([-–—:;,.!?])\*\*/g, '$1')
    // Standalone Roman/numeric labels are structural, not words to emphasize.
    .replace(/\*\*([IVX]{1,4}|\d{1,2})\*\*(?=\s*[-–—.)])/gi, '$1')
    // A few PDFs split an accented character out of a bold run (``avi**õ**es``)
    // and leave a visually broken word. Rejoin only the single accented glyph
    // when it is surrounded by letters; phonetic multi-letter highlights stay.
    .replace(/(?<=\p{L})\*\*([áéíóúàâêôãõç])\*\*(?=\p{L})/giu, '$1')
    .replace(/\bocéu\b/gi, 'o céu')
    .replace(/(\d{1,2}\s*[§º°])(?=\S)/g, '$1 ')
    .replace(/\bEo\b/g, 'E o')
    .replace(/\beo\b/g, 'e o')
    .replace(/\bEa\b/g, 'E a')
    .replace(/\bea\b/g, 'e a')
    .replace(/\beA\b/g, 'e A')
    // A few OCR/PDF text runs split the first syllable of a word across
    // adjacent spans (``u mpronome`` / ``E muma``).  Join only these known
    // artifacts so ordinary intentional spacing remains untouched.
    .replace(/\bu\s+mpronome\b/gi, 'um pronome')
    .replace(/\bu\s+mverbo\b/gi, 'um verbo')
    .replace(/\bE\s+muma\b/g, 'Em uma')
    .replace(/\béa\b/gi, 'é a')
    .replace(/\btransformar\s+se\b/gi, 'transformar-se')
    .replace(/\bfiorescia\b/gi, 'florescia')
    .replace(/\bfiores\b/gi, 'flores')
    .replace(/\bRefiexo\b/g, 'Reflexo')
    .replace(/\bIogo\b/g, 'logo')
    .replace(/\bGarlos\b/g, 'Carlos')
    .replace(/\b0 termo\b/g, 'O termo')
    .replace(/\s+¢€?\s+/g, ' — ')
    .replace(/\s+€\s+(?=(?:formado|isso|contudo)\b)/gi, ' é ')
    .replace(/J&€\s*0/gi, 'Já o')
    .replace(/†/g, '?')
    // Markdown markers occasionally remain unbalanced after OCR recovery.
    // Drop only the final unmatched pair marker so no ``**`` leaks into the
    // rendered question while balanced emphasis remains intact.
    .replace(/([\s\S]*)/, (_match, value: string) => repairBoldMarkers(value))
    // Normalize spacing introduced by adjacent PDF text runs.
    .replace(/[ \t]+([,.;:!?])/g, '$1');
}

/** Pure formatting entry point used by data audits and regression tests. */
// oxlint-disable-next-line react/only-export-components -- pure formatter is intentionally co-located with its renderer
export function normalizeExamText(text: string): string {
  return normalizeMarkup(text);
}

function repairBoldMarkers(value: string): string {
  const marker = /\*\*/g;
  const positions: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = marker.exec(value)) !== null) positions.push(match.index);
  const balanced = positions.length % 2 === 0
    ? value
    : value.slice(0, positions[positions.length - 1]) + value.slice(positions[positions.length - 1] + 2);
  // A single asterisk is never a supported visual marker in the bank. It is
  // usually the residue of a crossed PDF bold/underline span.
  return balanced.replace(/(?<!\*)\*(?!\*)/g, '');
}

function repairNestedStyleMarkers(value: string): string {
  const joinedCrossSpan = value.replace(/<u>([^<\n]*)<\/u>\*+([\p{L}])/gu, '<u>$1$2</u>');
  const withoutNested = joinedCrossSpan.replace(/<u>([\s\S]*?)<\/u>/g, (_match, inner: string) => `<u>${inner.replace(/\*/g, '')}</u>`);
  return repairBoldMarkers(withoutNested);
}

function stripSubjectHeaders(text: string): string {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const strongHeader = /^(?:Portugu[eê]s|Acentua[cç][aã]o|Estrutura(?:\s+da\s+palavra)?|Novo acordo ortogr[aá]fico|S[ií]laba e fonemas|Processos de forma[cç][aã]o de palavras|Verbos|Classes(?: de palavras)?|Pronomes|Sujeito|Sintaxe|Morfologia|Significa[cç][aã]o|Empregos|Coloca[cç][aã]o pronominal)\b/i;
  while (lines.length > 1) {
    const first = lines[0].trim();
    if (!strongHeader.test(first) || /[.!?:;]$/.test(first) || first.length > 180) break;
    lines.shift();
  }
  // Some imported records collapsed a short subject header and its citation
  // into one physical line (for example ``Estrutura da palavra ... (Autor)``).
  // Remove only the leading header segment when a citation follows, leaving
  // the source visible and semantically separated in the support box.
  if (lines.length === 1) {
    const single = lines[0].trim();
    const citationAt = single.search(/\s(?=\()/);
    if (citationAt > 0 && strongHeader.test(single.slice(0, citationAt).trim())) {
      lines[0] = single.slice(citationAt + 1);
    }
  }
  return lines.join('\n');
}

function parseInlineFormatting(paragraph: string): React.ReactNode[] {
  // Regex matches:
  // 1. **bold** or <b>bold</b> or <strong>bold</strong>
  // 2. <u>underlined</u>
  // 3. ______ (3 or more underscores or dashes)
  // 4. Quotation blocks
  const tokenRegex = /(\*\*[^*]+\*\*|<b>.*?<\/b>|<strong>.*?<\/strong>|<u>.*?<\/u>|_{3,}|-{3,})/g;

  const parts = paragraph.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const content = part.slice(2, -2);
      return (
        <strong key={idx} className="font-semibold text-[#fff7ed]">
          {content}
        </strong>
      );
    }

    // HTML <b> or <strong>
    if ((part.startsWith('<b>') && part.endsWith('</b>')) || (part.startsWith('<strong>') && part.endsWith('</strong>'))) {
      const content = part.replace(/<\/?(b|strong)>/g, '');
      return (
        <strong key={idx} className="font-semibold text-[#fff7ed]">
          {content}
        </strong>
      );
    }

    // Underline <u>
    if (part.startsWith('<u>') && part.endsWith('</u>')) {
      const content = part.slice(3, -4);
      return (
          <span key={idx} className="underline decoration-[#e8a87c] decoration-2 font-medium text-[#f3ede6]">
          {parseInlineFormatting(content)}
        </span>
      );
    }

    // Lacunas / Blanks (________)
    if (/^_{3,}$/.test(part) || /^-{3,}$/.test(part)) {
      return (
        <span 
          key={idx} 
          className="inline-block mx-1 px-2 py-0.5 font-mono text-xs font-bold text-[#e8a87c] bg-[#1a1d22] border border-[#343c46] rounded shadow-inner"
        >
          {part}
        </span>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}
