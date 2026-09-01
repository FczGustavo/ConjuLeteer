export type StorageWriteResult = { ok: true } | { ok: false; reason: 'quota' | 'unavailable'; error: unknown };

export function safeWriteStorage(key: string, value: unknown): StorageWriteResult {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    const quota = error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');
    return { ok: false, reason: quota ? 'quota' : 'unavailable', error };
  }
}

export function removeConjuLetterStorage(): void {
  const ownedKeys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith('conjuletter_')) ownedKeys.push(key);
  }
  ownedKeys.forEach(key => localStorage.removeItem(key));
}
