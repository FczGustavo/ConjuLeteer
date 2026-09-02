import type { QuestionBankItem } from '../data/questionBank';

export const PREVIEW_SMALL_BOARD_KEY = '__preview_small_boards__';
export const PREVIEW_SMALL_BOARD_LABEL = 'Concursos estaduais e outras bancas (<5Q)';

export interface BoardFilterOption {
  key: string;
  label: string;
  boards: string[];
  count: number;
}

const HIDDEN_COMPILATION_BOARDS = new Set([
  'Compilação de concursos militares',
  'Compilação sem banca impressa',
]);

/**
 * Normalize only selector-facing aliases. The original board is never
 * rewritten on the question record, so its credit tag remains exact.
 */
export function canonicalPreviewBoard(board?: string): string {
  const raw = board?.trim() ?? '';
  if (!raw) return '';
  const upper = raw.toUpperCase().replace(/\s+/g, ' ');

  // Military boards
  if (/^EEAR\s+(?:BCT|BTC)\b/i.test(upper)) return 'EEAr BCT';
  if (/^EEAR\b/i.test(upper)) return 'EEAr';
  if (/^AFA\b/i.test(upper)) return 'AFA';
  if (/^(?:COL[ÉE]GIO\s+NAVAL|CN)\b/i.test(upper)) return 'Colégio Naval';
  if (/^EAM\b/i.test(upper)) return 'EAM';
  if (/^EFOMM\b/i.test(upper)) return 'EFOMM';
  if (/^(?:ESCOLA\s+NAVAL|EN)\b/i.test(upper)) return 'Escola Naval';
  if (/^(?:EPCAR|EPACR)\b/i.test(upper)) return 'EPCAR';
  if (/^ESPCEX\b/i.test(upper)) return 'EsPCEx';
  if (/^ESSA\b/i.test(upper)) return 'EsSA';
  // Editions and regional labels (ITA 12, ITA-SP, ITA SP) point to the same
  // institution in the selector.  The raw credit tag remains untouched.
  if (/^ITA(?:[-\s]|$)/i.test(upper)) return 'ITA';
  if (/^IME\b/i.test(upper)) return 'IME';
  if (/^ESFCEX\b/i.test(upper)) return 'EsFCEx';
  if (/^ESSEX\b/i.test(upper)) return 'EsSEx';

  // Major civil / vestibular boards
  if (/^MACK(?:ENZIE|-SP)\b/i.test(upper)) return 'Mackenzie';
  if (/^UF(?:RGS|RS)\b/i.test(upper)) return 'UFRGS';
  if (/^FUVEST\b/i.test(upper)) return 'FUVEST';
  if (/^UNESP\b/i.test(upper)) return 'UNESP';
  if (/^UNICAMP\b/i.test(upper)) return 'UNICAMP';
  if (/^UERJ\b/i.test(upper)) return 'UERJ';
  if (/^VUNESP\b/i.test(upper)) return 'VUNESP';
  if (/^CESGRANRIO\b/i.test(upper)) return 'Cesgranrio';
  if (/^FGV\b/i.test(upper)) return 'FGV';
  if (/^FCC\b/i.test(upper)) return 'FCC';
  if (/^CEV\s*[-–—]\s*URCA/i.test(upper)) return 'CEV-URCA';
  if (/^UNB\b/i.test(upper)) return 'UnB';
  if (/^PUCCAMP\b/i.test(upper)) return 'PUCCAMP';
  if (/^PUC(?:PR|-PR)\b/i.test(upper)) return 'PUC-PR';
  if (/^PUC(?:-MG|\s+MINAS)\b/i.test(upper)) return 'PUC-MG';
  if (/^PUC(?:-RS)\b/i.test(upper)) return 'PUC-RS';
  if (/^PUC(?:-RIO)\b/i.test(upper)) return 'PUC-Rio';
  if (/^PUC(?:-SP)\b/i.test(upper)) return 'PUC-SP';
  if (/^PUC\b/i.test(upper)) return 'PUC';

  // Clean trailing OCR noise like " 1.", " 12", " 34"
  const clean = raw.replace(/\s+\d+\.?\s*$/, '').trim();
  return clean || raw;
}

function isStudyable(question: QuestionBankItem): boolean {
  return question.quality?.status !== 'quarantined' && question.quality?.status !== 'rejected';
}

/** Build board choices while preserving exact raw board names in each option. */
export function buildBoardFilterOptions(
  questions: QuestionBankItem[],
  filter: 'en' | 'en_preview' = 'en',
): BoardFilterOption[] {
  const rawCounts = new Map<string, number>();
  for (const question of questions) {
    if (!isStudyable(question) || question.language !== 'en') continue;
    if (filter === 'en_preview' && question.corpusId !== 'english_preview') continue;
    const board = question.examMetadata?.board?.trim();
    if (!board || HIDDEN_COMPILATION_BOARDS.has(board)) continue;
    rawCounts.set(board, (rawCounts.get(board) ?? 0) + 1);
  }

  const canonicalGroups = new Map<string, { label: string; boards: string[]; count: number }>();
  for (const [rawBoard, count] of rawCounts) {
    const label = canonicalPreviewBoard(rawBoard) || rawBoard;
    const lookupKey = label.toLowerCase();
    const current = canonicalGroups.get(lookupKey) ?? { label, boards: [], count: 0 };
    current.boards.push(rawBoard);
    current.count += count;
    canonicalGroups.set(lookupKey, current);
  }

  const options: BoardFilterOption[] = [];
  const smallBoards: string[] = [];
  let smallCount = 0;
  for (const [, group] of canonicalGroups) {
    // Military boards are explicit product categories even when small
    const isMilitary = /^(?:EEAR|EEAR BCT|AFA|EFOMM|ITA|IME|ESPCEX|EPCAR|COL[ÉE]GIO NAVAL|ESCOLA NAVAL|ESSA|EAM)\b/i.test(group.label);
    if (group.count < 5 && !isMilitary) {
      smallBoards.push(...group.boards);
      smallCount += group.count;
      continue;
    }
    options.push({ key: group.label, label: group.label, boards: group.boards, count: group.count });
  }
  if (smallBoards.length > 0) {
    options.push({
      key: PREVIEW_SMALL_BOARD_KEY,
      label: PREVIEW_SMALL_BOARD_LABEL,
      boards: smallBoards,
      count: smallCount,
    });
  }
  return options.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function matchesBoardFilter(
  question: QuestionBankItem,
  selectedBoard: string | undefined,
  _filter: 'en' | 'en_preview' = 'en',
  options: BoardFilterOption[],
): boolean {
  if (!selectedBoard || selectedBoard === 'all') return true;
  const rawBoard = question.examMetadata?.board ?? '';
  const option = options.find(candidate => candidate.key === selectedBoard);
  if (option) return option.boards.includes(rawBoard);
  return canonicalPreviewBoard(rawBoard).toUpperCase() === canonicalPreviewBoard(selectedBoard).toUpperCase() || rawBoard === selectedBoard;
}

export function getBoardFilterLabel(options: BoardFilterOption[], key?: string): string | undefined {
  if (!key || key === 'all') return undefined;
  return options.find(option => option.key === key)?.label ?? key;
}
