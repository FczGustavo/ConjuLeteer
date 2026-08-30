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
}> = ({
  text,
  className = '',
  preserveLineBreaks = false,
  mode = 'prose'
}) => {
  if (!text) return null;

  const paragraphs = splitReadableBlocks(text, mode, preserveLineBreaks);

  return (
    <div className={`space-y-3 select-text font-sans font-normal ${className}`}>
      {paragraphs.map((p, pIdx) => {
        return (
          <p key={pIdx} className={`leading-[1.75] ${preserveLineBreaks ? 'whitespace-pre-line' : ''}`}>
            {parseInlineFormatting(p)}
          </p>
        );
      })}
    </div>
  );
};

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
      .filter(Boolean);

    if (preserveLineBreaks) return [lines.join('\n')];

    const blocks: string[] = [];
    let current = '';
    for (const line of lines) {
      const startsStructuredItem = isStructuredItem(line)
        || (mode === 'statement' && current.length > 0 && startsEmphasizedInstruction(line));

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

function isStructuredItem(line: string): boolean {
  // Bullets, numbered relations, Roman items, and C/E sequences.
  return /^(?:[•●▪◦]|\(?[IVX]{1,4}\)?\s*[-–—:.]|\d{1,2}\s*[-–—.)]|[A-E]\s*[).:-]|\(\s*\)\s*)/i.test(line);
}

function startsEmphasizedInstruction(line: string): boolean {
  // In the verb sheets the PDF bolds the instruction after ``Leia:`` or the
  // quoted excerpt. Keeping that instruction on its own line removes the
  // large, visually confusing bold run seen in the source extraction.
  return /^\*\*\s*[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ“"(]/.test(line);
}

function normalizeMarkup(text: string): string {
  return text
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
    // Normalize spacing introduced by adjacent PDF text runs.
    .replace(/[ \t]+([,.;:!?])/g, '$1');
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
          {content}
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
