import { describe, expect, it } from 'vitest';
import { loadUserSettings, recordVerbAttempt } from './srsEngine';

describe('configurações e SRS', () => {
  it('migra tema Alexandria legado', () => {
    localStorage.setItem('conjuletter_settings_v1', JSON.stringify({theme:'alexandria'}));
    expect(loadUserSettings().theme).toBe('alexandria-dark');
  });
  it('desabilita e migra tema Vanguard para tema padrão', () => {
    localStorage.setItem('conjuletter_settings_v1', JSON.stringify({ theme: 'vanguard' }));
    expect(loadUserSettings().theme).toBe('dark');
    localStorage.setItem('conjuletter_settings_v1', JSON.stringify({ theme: 'vanguard-dark' }));
    expect(loadUserSettings().theme).toBe('dark');
    localStorage.setItem('conjuletter_settings_v1', JSON.stringify({ theme: 'vanguard-light' }));
    expect(loadUserSettings().theme).toBe('dark');
  });
  it('recupera JSON corrompido', () => {
    localStorage.setItem('conjuletter_settings_v1', '{');
    expect(loadUserSettings().theme).toBe('dark');
  });
  it('mantém pontuações nos limites', () => {
    for(let i=0;i<10;i+=1) recordVerbAttempt('por','indicativo','presente',false);
    const result=recordVerbAttempt('por','indicativo','presente',true);
    expect(result.stat.masteryScore).toBeGreaterThanOrEqual(0);
    expect(result.stat.masteryScore).toBeLessThanOrEqual(100);
  });
});
