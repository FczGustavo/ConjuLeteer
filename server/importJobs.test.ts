import { describe, expect, it } from 'vitest';
import { cancelOwnedJob, createImportJob, getOwnedJob, updateOwnedJob } from './importJobs';

describe('import job tracker', () => {
  it('é idempotente por hash na mesma sessão', () => {
    const first = createImportJob('session-test', { fileHash: `hash-${Date.now()}`, totalPages: 2 });
    const same = createImportJob('session-test', { fileHash: first.manifest.fileHash, totalPages: 99 });
    expect(same.id).toBe(first.id);
  });

  it('isola o proprietário e permite progresso/cancelamento', () => {
    const owner = `owner-${Date.now()}`;
    const job = createImportJob(owner, { totalPages: 3, totalBatches: 2 });
    expect(getOwnedJob(job.id, 'outro')).toBeUndefined();
    const updated = updateOwnedJob(job.id, 'outro', { processedPages: 1 });
    expect(updated).toBeUndefined();
    expect(updateOwnedJob(job.id, owner, { status: 'processing', processedPages: 2 })?.processedPages).toBe(2);
    expect(cancelOwnedJob(job.id, owner)?.status).toBe('cancelling');
  });
});
