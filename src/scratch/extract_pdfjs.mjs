import fs from 'node:fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Uso: node extract_pdfjs.mjs <arquivo.pdf>');
  process.exit(2);
}

const data = new Uint8Array(fs.readFileSync(filePath));
const document = await pdfjsLib.getDocument({ data, disableWorker: true }).promise;
const pages = [];
const isCompactVerbSheet = /(?:^|[\\/])(?:16\.|17\.)/.test(filePath);

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const content = await page.getTextContent();
  let text = '';
  let previous = null;
  for (const item of content.items) {
    if (!('str' in item)) continue;
   const value = item.str;
    // The seven main Gran PDFs use their first embedded font for headings and
    // pedagogical emphasis. The compact verb sheets use fonts 2 and 3 for the
    // marked verbal forms. Font 4 in those sheets is mostly question chrome,
    // so treating it as emphasis hid the actual targets and bolded commands.
    const emphasisFont = isCompactVerbSheet ? /_(?:f2|f3)$/i : /_f1$/i;
    const isEmphasis = typeof item.fontName === 'string' && emphasisFont.test(item.fontName) && !/^\s+$/.test(value);
    const renderedValue = isEmphasis ? `**${value}**` : value;
   if (value) {
      if (previous && !/^\s*$/.test(value) && !/^\s*$/.test(previous.str)) {
        const previousEnd = previous.transform?.[4] + (previous.width || 0);
        const currentStart = item.transform?.[4];
        const gap = Number.isFinite(previousEnd) && Number.isFinite(currentStart)
          ? currentStart - previousEnd
          : 4;
        // Text with different styles is split into adjacent items in these PDFs.
        // Use the actual geometric gap instead of inserting a space between every item.
        if (gap > 2.5) text += ' ';
      }
      text += renderedValue;
    }
    if (item.hasEOL) text += '\n';
    previous = item;
  }
  pages.push(`--- PAGE ${pageNumber} ---\n${text.trim()}`);
}

process.stdout.write(pages.join('\n\n'));
