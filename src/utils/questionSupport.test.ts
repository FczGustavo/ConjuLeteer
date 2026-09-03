import { describe, expect, it } from 'vitest';
import type { QuestionBankItem } from '../data/questionBank';
import { normalizeQuestionSupport, normalizeQuestionSupportCached } from './questionSupport';

const base = (partial: Partial<QuestionBankItem>): QuestionBankItem => ({ id:'q',subjectId:'verbos',subjectTitle:'Verbos',listId:'l',listTitle:'L',questionNumber:1,statement:'Assinale a opção.',options:['A','B','C','D'].map((letter,index)=>({letter:letter as 'A'|'B'|'C'|'D',text:letter,correct:index===0})),correctLetter:'A',banca:'Oficial',...partial });

describe('normalização de apoio', () => {
  it('move fragmento bibliográfico final para a fonte', () => {
    const item=normalizeQuestionSupport(base({support:{paragraphs:['Corpo do texto.','WAGNER, Carlos.'],source:'Acesso em ago. 2020'}}));
    expect(item.support?.paragraphs).toEqual(['Corpo do texto.']);
    expect(item.support?.source).toContain('WAGNER, Carlos.');
  });
  it('separa glossário da citação e corrige typo inequívoco da URL', () => {
    const item = normalizeQuestionSupport(base({ support: {
      paragraphs: ['Texto do apoio.'],
      source: 'Adapted from htto://www.usinaenalish.com/articles/what- offshore-enalish.html Glossary: word - meaning',
    } }));
    expect(item.support?.source).toBe('Adapted from https://www.usingenglish.com/articles/what-offshore-english.html');
    expect(item.support?.paragraphs).toContain('Glossary: word - meaning');
  });
  it('recupera título e autoria colados na primeira linha do apoio', () => {
    const item = normalizeQuestionSupport(base({ support: {
      title: 'Título principal',
      paragraphs: ['Benefits of meditation Meditation can bring calm.', 'By Mayo Clinic Staff More text follows.'],
    } }));
    expect(item.support?.paragraphs[0]).toContain('**Benefits of meditation**');
    expect(item.support?.author).toBe('By Mayo Clinic Staff');
    expect(item.support?.paragraphs.join(' ')).toContain('More text follows.');
  });
  it('promove cabeçalho incorporado quando não há título estruturado', () => {
    const item = normalizeQuestionSupport(base({ support: {
      paragraphs: ['The search for extraterrestrial intelligence Scientists and radio astronomers began the search.'],
    } }));
    expect(item.support?.title).toBe('The search for extraterrestrial intelligence');
    expect(item.support?.paragraphs[0]).toContain('Scientists and radio astronomers');
  });
  it('move para o enunciado apenas destaque explicitamente referido', () => {
    const item=normalizeQuestionSupport(base({statement:'Observe o verbo sublinhado: pusesse.',support:{paragraphs:['No texto ele <u>pusesse</u> a carta.']}}));
    expect(item.statement).toContain('<u>pusesse</u>');
    expect(item.support?.paragraphs[0]).not.toContain('<u>');
  });
  it('não altera enunciado que já tem marcação', () => {
    const item=normalizeQuestionSupport(base({statement:'Observe <u>esta</u> forma.',support:{paragraphs:['Outra **forma**.']}}));
    expect(item.statement).toBe('Observe <u>esta</u> forma.');
  });
  it('nunca promove automaticamente uma questão já marcada para revisão', () => {
    const item=normalizeQuestionSupport(base({quality:{status:'warning',warnings:['Revisão editorial pendente.']}}));
    expect(item.quality).toEqual({status:'warning',warnings:['Revisão editorial pendente.']});
  });
  it('reutiliza a normalização de um registro imutável', () => {
    const question = base({ statement: 'Texto estável.' });
    expect(normalizeQuestionSupportCached(question)).toBe(normalizeQuestionSupportCached(question));
  });
});
