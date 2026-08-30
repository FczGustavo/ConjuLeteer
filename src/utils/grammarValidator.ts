import { CANONICAL_VERBS } from '../data/canonicalVerbs';
import type { Person, VerbEntry } from '../types/verbs';

export interface ValidationResult {
  isCorrect: boolean;
  userInput: string;
  expectedForm: string | null;
  isDefective: boolean;
  charDiff?: {
    char: string;
    status: 'correct' | 'incorrect' | 'missing' | 'extra';
  }[];
  explanation?: string;
}

export function normalizePortugueseVerb(input: string, strictAccents: boolean = true): string {
  let cleaned = input.trim().toLowerCase();
  if (!strictAccents) {
    cleaned = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return cleaned;
}

export function isDefectiveInput(input: string): boolean {
  const norm = input.trim().toLowerCase();
  return ['n/a', 'na', 'n/d', 'nd', 'não existe', 'nao existe', 'inexistente', '-', 'x', 'null', 'defectivo'].includes(norm);
}

export function validateConjugationCell(
  verb: VerbEntry,
  moodTenseKey: string,
  person: Person,
  rawUserInput: string,
  strictAccents: boolean = true
): ValidationResult {
  const expectedForm = verb.conjugations[moodTenseKey]?.[person] ?? null;
  const userInput = rawUserInput.trim();

  // Caso 1: A forma é defectiva / inexistente na língua culta
  if (expectedForm === null) {
    if (isDefectiveInput(userInput) || userInput === '') {
      return {
        isCorrect: true,
        userInput,
        expectedForm: null,
        isDefective: true,
        explanation: `Correto! O verbo "${verb.infinitive}" não possui esta forma na norma culta (forma defectiva).`
      };
    } else {
      return {
        isCorrect: false,
        userInput,
        expectedForm: null,
        isDefective: true,
        explanation: `Atenção: A forma "${userInput}" NÃO EXISTE na norma-padrão. Este verbo é defectivo nesta pessoa/tempo.`
      };
    }
  }

  // Caso 2: A forma canônica existe
  if (isDefectiveInput(userInput)) {
    return {
      isCorrect: false,
      userInput,
      expectedForm,
      isDefective: false,
      explanation: `Incorreto: Esta forma existe na norma-padrão: "${expectedForm}".`
    };
  }

  const normUser = normalizePortugueseVerb(userInput, strictAccents);
  const normExpected = normalizePortugueseVerb(expectedForm, strictAccents);
  const isCorrect = normUser === normExpected;

  // Gerar Character Diff para feedback visual de precisão militar
  const charDiff = computeCharDiff(userInput, expectedForm);

  let explanation: string | undefined;
  if (!isCorrect) {
    if (!strictAccents && normalizePortugueseVerb(userInput, false) === normalizePortugueseVerb(expectedForm, false)) {
      explanation = `Atenção à acentuação gráfica: o correto é "${expectedForm}".`;
    } else {
      explanation = `Forma esperada: "${expectedForm}".`;
    }
  }

  return {
    isCorrect,
    userInput,
    expectedForm,
    isDefective: false,
    charDiff,
    explanation
  };
}

function computeCharDiff(user: string, expected: string): { char: string; status: 'correct' | 'incorrect' | 'missing' | 'extra' }[] {
  const diffs: { char: string; status: 'correct' | 'incorrect' | 'missing' | 'extra' }[] = [];
  const maxLen = Math.max(user.length, expected.length);

  for (let i = 0; i < maxLen; i++) {
    const u = user[i];
    const e = expected[i];

    if (u === undefined) {
      diffs.push({ char: e, status: 'missing' });
    } else if (e === undefined) {
      diffs.push({ char: u, status: 'extra' });
    } else if (u.toLowerCase() === e.toLowerCase()) {
      diffs.push({ char: u, status: 'correct' });
    } else {
      diffs.push({ char: u, status: 'incorrect' });
    }
  }

  return diffs;
}

export function findVerbByInfinitive(infinitive: string): VerbEntry | undefined {
  const norm = infinitive.trim().toLowerCase();
  return CANONICAL_VERBS.find(v => v.infinitive.toLowerCase() === norm);
}
