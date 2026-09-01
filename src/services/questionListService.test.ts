import { describe, expect, it, vi } from 'vitest';
import { createQuestionList, loadQuestionLists, saveQuestionListProgress } from './questionListService';

describe('listas persistidas', () => {
  it('deduplica IDs e salva progresso', () => {
    const list = createQuestionList('Teste', ['q1','q1'], ['verbos','verbos'], 'all');
    expect(list.questionIds).toEqual(['q1']);
    expect(saveQuestionListProgress(list.id, { userAnswers: { q1:'A' }, confirmedAnswers: {}, noIdeaQuestions: {}, currentPage: 0, pageSize: 1 }).ok).toBe(true);
    expect(loadQuestionLists()[0].userAnswers.q1).toBe('A');
  });
  it('descarta registros estruturalmente inválidos', () => {
    localStorage.setItem('conjuletter_saved_question_lists_v1', JSON.stringify([{ id:'x' }]));
    expect(loadQuestionLists()).toEqual([]);
  });
  it('retorna falha de persistência', () => {
    const list = createQuestionList('Teste', ['q1'], ['verbos'], 'all');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw new DOMException('cheio','QuotaExceededError'); });
    expect(saveQuestionListProgress(list.id, { userAnswers:{}, confirmedAnswers:{}, noIdeaQuestions:{}, currentPage:0, pageSize:1 })).toMatchObject({ok:false,reason:'quota'});
  });
});
