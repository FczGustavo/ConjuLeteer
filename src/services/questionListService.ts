import type { SubjectId } from '../data/questionBank';
import { safeWriteStorage, type StorageWriteResult } from '../utils/storage';

const STORAGE_KEY = 'conjuletter_saved_question_lists_v1';

export interface SavedQuestionList {
  id: string;
  name: string;
  questionIds: string[];
  subjectIds: SubjectId[];
  statusFilter: 'all' | 'pending' | 'correct' | 'wrong' | 'noIdea';
  createdAt: string;
  updatedAt: string;
  currentPage: number;
  pageSize: number;
  userAnswers: Record<string, string>;
  confirmedAnswers: Record<string, boolean>;
  noIdeaQuestions?: Record<string, boolean>;
}

export function loadQuestionLists(): SavedQuestionList[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedQuestionList).map(normalizeSavedQuestionList);
  } catch {
    return [];
  }
}

function normalizeSavedQuestionList(item: SavedQuestionList): SavedQuestionList {
  const pageSize = [0, 1, 5, 10, 20].includes(item.pageSize) ? item.pageSize : 1;
  const answers = Object.fromEntries(Object.entries(item.userAnswers).filter((entry): entry is [string, string] => typeof entry[0] === 'string' && /^[A-E]$/.test(entry[1])));
  const booleans = (value: Record<string, boolean> | undefined) => Object.fromEntries(Object.entries(value || {}).filter((entry): entry is [string, boolean] => typeof entry[0] === 'string' && entry[1] === true));
  return {
    ...item,
    questionIds: [...new Set(item.questionIds.filter(value => typeof value === 'string'))],
    subjectIds: [...new Set(item.subjectIds.filter(value => typeof value === 'string'))],
    currentPage: Number.isFinite(item.currentPage) ? Math.max(0, Math.floor(item.currentPage)) : 0,
    pageSize,
    userAnswers: answers,
    confirmedAnswers: booleans(item.confirmedAnswers),
    noIdeaQuestions: booleans(item.noIdeaQuestions),
  };
}

export function createQuestionList(
  name: string,
  questionIds: string[],
  subjectIds: SubjectId[],
  statusFilter: SavedQuestionList['statusFilter'],
  noIdeaQuestions: Record<string, boolean> = {}
): SavedQuestionList {
  const now = new Date().toISOString();
  const list: SavedQuestionList = {
    id: `list-${crypto.randomUUID()}`,
    name,
    questionIds: [...new Set(questionIds)],
    subjectIds: [...new Set(subjectIds)],
    statusFilter,
    createdAt: now,
    updatedAt: now,
    currentPage: 0,
    pageSize: 1,
    userAnswers: {},
    confirmedAnswers: {},
    noIdeaQuestions: { ...noIdeaQuestions }
  };
  saveQuestionLists([list, ...loadQuestionLists()]);
  return list;
}

export function updateQuestionList(updated: SavedQuestionList): SavedQuestionList[] {
  const lists = loadQuestionLists();
  const next = lists.map(list => list.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : list);
  saveQuestionLists(next);
  return next;
}

export function saveQuestionListProgress(
  id: string,
  progress: Pick<SavedQuestionList, 'userAnswers' | 'confirmedAnswers' | 'noIdeaQuestions' | 'currentPage' | 'pageSize'>
): StorageWriteResult {
  const lists = loadQuestionLists();
  const next = lists.map(list => list.id === id
    ? { ...list, ...progress, updatedAt: new Date().toISOString() }
    : list);
  return saveQuestionLists(next);
}

export function deleteQuestionList(id: string): SavedQuestionList[] {
  const next = loadQuestionLists().filter(list => list.id !== id);
  saveQuestionLists(next);
  return next;
}

function saveQuestionLists(lists: SavedQuestionList[]): StorageWriteResult {
  return safeWriteStorage(STORAGE_KEY, lists);
}

function isSavedQuestionList(value: unknown): value is SavedQuestionList {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedQuestionList>;
  return typeof item.id === 'string'
    && typeof item.name === 'string'
    && Array.isArray(item.questionIds)
    && Array.isArray(item.subjectIds)
    && typeof item.currentPage === 'number'
    && Number.isFinite(item.currentPage)
    && typeof item.pageSize === 'number'
    && Number.isFinite(item.pageSize)
    && Boolean(item.userAnswers && typeof item.userAnswers === 'object')
    && Boolean(item.confirmedAnswers && typeof item.confirmedAnswers === 'object');
}
