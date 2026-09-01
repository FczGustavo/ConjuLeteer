import type { SubjectId } from '../data/questionBank';

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
    return parsed.filter(isSavedQuestionList);
  } catch {
    return [];
  }
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
): void {
  const lists = loadQuestionLists();
  const next = lists.map(list => list.id === id
    ? { ...list, ...progress, updatedAt: new Date().toISOString() }
    : list);
  saveQuestionLists(next);
}

export function deleteQuestionList(id: string): SavedQuestionList[] {
  const next = loadQuestionLists().filter(list => list.id !== id);
  saveQuestionLists(next);
  return next;
}

function saveQuestionLists(lists: SavedQuestionList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

function isSavedQuestionList(value: unknown): value is SavedQuestionList {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedQuestionList>;
  return typeof item.id === 'string'
    && typeof item.name === 'string'
    && Array.isArray(item.questionIds)
    && Array.isArray(item.subjectIds)
    && typeof item.currentPage === 'number'
    && typeof item.pageSize === 'number'
    && Boolean(item.userAnswers && typeof item.userAnswers === 'object')
    && Boolean(item.confirmedAnswers && typeof item.confirmedAnswers === 'object');
}
