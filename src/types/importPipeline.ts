/** Contracts shared by the browser importer, the API job tracker and reports. */

export type ImportJobStatus = 'queued' | 'processing' | 'cancelling' | 'completed' | 'cancelled' | 'failed';
export type ImportQualityStatus = 'verified' | 'warning' | 'quarantined' | 'rejected';

export interface FieldConfidence {
  confidence: number;
  method: 'native-text' | 'ocr' | 'vision' | 'deterministic' | 'independent-pass';
  warnings?: string[];
}

export type FieldConfidenceMap = Partial<Record<'statement' | 'support' | 'source' | 'options' | 'highlights' | 'answer' | 'metadata', FieldConfidence>>;

export interface QuestionEvidence {
  field: 'statement' | 'support' | 'source' | 'options' | 'highlights' | 'answer' | 'metadata';
  page: number;
  coordinates?: { x: number; y: number; width: number; height: number };
  originalText?: string;
  /** A small visual crop or page thumbnail, never required for native text. */
  imageDataUrl?: string;
  method: FieldConfidence['method'];
}

export type QuestionMediaKind = 'figure' | 'chart' | 'table' | 'map' | 'diagram' | 'formula' | 'photo';
export type QuestionMediaPlacement = 'support' | 'statement' | 'option';

/** Coordinates use the rendered page's top-left origin and values from 0 to 1. */
export interface NormalizedMediaCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QuestionMediaDescriptor {
  id: string;
  assetId: string;
  /**
   * Optional immutable URL for bundled/public media. Imported jobs use
   * `assetId` in IndexedDB; audited catalogue entries can ship a cropped
   * asset with the application and skip the local asset lookup entirely.
   */
  assetUrl?: string;
  kind: QuestionMediaKind;
  placement: QuestionMediaPlacement;
  optionLetter?: 'A' | 'B' | 'C' | 'D' | 'E';
  page: number;
  crop: NormalizedMediaCrop;
  width: number;
  height: number;
  mimeType: 'image/webp' | 'image/png' | 'image/jpeg';
  altText: string;
  caption?: string;
  source?: string;
  hash: string;
  confidence: number;
}

export interface PageQualityMetrics {
  characterCount: number;
  wordCount: number;
  replacementCharacters: number;
  textCoverage: number;
  needsOcr: boolean;
  hasVisualContent?: boolean;
}

export interface PageTextSpan {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  italic?: boolean;
  hasEOL?: boolean;
}

export interface PageLayoutBlock {
  type: 'paragraph' | 'heading' | 'header' | 'footer' | 'table' | 'question' | 'answer-key';
  text: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

export interface PageLayout {
  lineCount: number;
  columnCount: number;
  hasTables: boolean;
  recurringHeader?: string;
  recurringFooter?: string;
}

export interface PageArtifact {
  pageNumber: number;
  width: number;
  height: number;
  extractionMethod: 'native-text' | 'ocr' | 'native-text+vision';
  nativeText: string;
  ocrText?: string;
  spans: PageTextSpan[];
  blocks: PageLayoutBlock[];
  layout: PageLayout;
  /** Generated only for pages that require visual/OCR review. */
  imageDataUrl?: string;
  quality: PageQualityMetrics;
}

export interface ImportManifest {
  importId: string;
  fileName?: string;
  fileHash?: string;
  totalPages: number;
  receivedPages: number[];
  processedPages: number[];
  reprocessedPages: number[];
  rejectedPages: number[];
  extractionMethods: Record<number, PageArtifact['extractionMethod']>;
  questionCountDetected: number;
  verifiedCount: number;
  quarantinedCount: number;
  extractedMediaCount?: number;
  coverage: number;
}

export interface ImportJob {
  id: string;
  status: ImportJobStatus;
  createdAt: string;
  updatedAt: string;
  totalPages: number;
  processedPages: number;
  totalBatches: number;
  completedBatches: number;
  verifiedCount: number;
  quarantinedCount: number;
  attempts: number;
  costUsd?: number;
  error?: string;
  manifest: ImportManifest;
}

export interface ImportReport {
  job: ImportJob;
  pages: PageArtifact[];
  verified: number[];
  quarantined: Array<{ questionNumber: number; reasons: string[]; evidence: QuestionEvidence[] }>;
}
