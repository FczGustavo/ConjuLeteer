import { randomUUID } from 'node:crypto';
import type { ImportJob, ImportManifest, ImportJobStatus } from '../src/types/importPipeline.js';

interface StoredJob { job: ImportJob; owner: string }
const records = new Map<string, StoredJob>();

function now(): string { return new Date().toISOString(); }

export function createImportJob(owner: string, input: { fileName?: string; fileHash?: string; totalPages?: number; totalBatches?: number }): ImportJob {
  if (input.fileHash) {
    for (const record of records.values()) {
      if (record.owner === owner && record.job.manifest.fileHash === input.fileHash && !['failed', 'cancelled'].includes(record.job.status)) return record.job;
    }
  }
  const id = randomUUID();
  const totalPages = Math.max(0, Math.min(20_000, Math.floor(input.totalPages || 0)));
  const manifest: ImportManifest = {
    importId: id,
    fileName: input.fileName,
    fileHash: input.fileHash,
    totalPages,
    receivedPages: [],
    processedPages: [],
    reprocessedPages: [],
    rejectedPages: [],
    extractionMethods: {},
    questionCountDetected: 0,
    verifiedCount: 0,
    quarantinedCount: 0,
    coverage: 0,
  };
  const timestamp = now();
  const job: ImportJob = { id, status: 'queued', createdAt: timestamp, updatedAt: timestamp, totalPages, processedPages: 0, totalBatches: Math.max(1, Math.floor(input.totalBatches || 1)), completedBatches: 0, verifiedCount: 0, quarantinedCount: 0, attempts: 0, manifest };
  records.set(id, { job, owner });
  return job;
}

export function getOwnedJob(id: string, owner: string): ImportJob | undefined {
  const record = records.get(id);
  return record?.owner === owner ? record.job : undefined;
}

export function updateOwnedJob(id: string, owner: string, patch: Partial<Pick<ImportJob, 'status' | 'processedPages' | 'completedBatches' | 'verifiedCount' | 'quarantinedCount' | 'attempts' | 'costUsd' | 'error'>> & { manifest?: Partial<ImportManifest> }): ImportJob | undefined {
  const record = records.get(id);
  if (!record || record.owner !== owner) return undefined;
  const current = record.job;
  const manifest = patch.manifest ? {
    ...current.manifest,
    ...patch.manifest,
    coverage: patch.manifest.coverage === undefined ? current.manifest.coverage : Math.min(1, Math.max(0, Number(patch.manifest.coverage) || 0)),
  } : current.manifest;
  const terminal = current.status === 'completed' || current.status === 'failed' || current.status === 'cancelled';
  const nextStatus = terminal && patch.status && patch.status !== current.status ? current.status : patch.status || current.status;
  const next: ImportJob = {
    ...current,
    ...patch,
    status: nextStatus,
    processedPages: patch.processedPages === undefined ? current.processedPages : Math.max(current.processedPages, Math.min(current.totalPages || Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(patch.processedPages)))),
    completedBatches: patch.completedBatches === undefined ? current.completedBatches : Math.max(current.completedBatches, Math.min(current.totalBatches, Math.max(0, Math.floor(patch.completedBatches)))),
    verifiedCount: patch.verifiedCount === undefined ? current.verifiedCount : Math.max(current.verifiedCount, Math.max(0, Math.floor(patch.verifiedCount))),
    quarantinedCount: patch.quarantinedCount === undefined ? current.quarantinedCount : Math.max(current.quarantinedCount, Math.max(0, Math.floor(patch.quarantinedCount))),
    attempts: patch.attempts === undefined ? current.attempts : Math.max(current.attempts, Math.max(0, Math.floor(patch.attempts))),
    manifest,
    updatedAt: now(),
  };
  record.job = next;
  return next;
}

export function cancelOwnedJob(id: string, owner: string): ImportJob | undefined {
  const record = records.get(id);
  if (!record || record.owner !== owner) return undefined;
  const status: ImportJobStatus = record.job.status === 'completed' || record.job.status === 'failed' ? record.job.status : 'cancelling';
  record.job = { ...record.job, status, updatedAt: now() };
  return record.job;
}

export function clearExpiredJobs(maxAgeMs = 2 * 60 * 60_000): void {
  const threshold = Date.now() - maxAgeMs;
  for (const [id, record] of records) if (Date.parse(record.job.updatedAt) < threshold) records.delete(id);
}
