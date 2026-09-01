import { describe, expect, it, vi } from 'vitest';
import { removeConjuLetterStorage, safeWriteStorage } from './storage';

describe('storage seguro', () => {
  it('preserva chaves de outras aplicações no reset', () => {
    localStorage.setItem('conjuletter_settings_v1', '{}'); localStorage.setItem('outra_app', 'intacto');
    removeConjuLetterStorage();
    expect(localStorage.getItem('conjuletter_settings_v1')).toBeNull();
    expect(localStorage.getItem('outra_app')).toBe('intacto');
  });
  it('classifica quota excedida sem lançar', () => {
    const error = new DOMException('cheio', 'QuotaExceededError');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => { throw error; });
    expect(safeWriteStorage('conjuletter_x', {})).toMatchObject({ ok: false, reason: 'quota' });
  });
});
