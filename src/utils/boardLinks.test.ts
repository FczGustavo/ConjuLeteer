import { describe, expect, it } from 'vitest';
import { getBoardExamUrl } from './boardLinks';

describe('créditos oficiais das bancas', () => {
  it.each(['EEAr 1.', 'EEAr 2.', 'EEAr BCT 1.', 'EEAr BTC 1.', 'ITA 12', 'AFA 45', 'EPCAR 2020', 'EsSA 2022', 'EAM 2018', 'Colégio Naval 2017'])('%s resolve para um portal oficial seguro', board => {
    const url = getBoardExamUrl(board);
    expect(url).toBeDefined();
    expect(new URL(url!).protocol).toBe('https:');
  });

  it('não cria link para uma banca desconhecida', () => {
    expect(getBoardExamUrl('Banca sem identificação')).toBeUndefined();
  });
});
