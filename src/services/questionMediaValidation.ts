import type { NormalizedMediaCrop, QuestionMediaDescriptor, QuestionMediaKind, QuestionMediaPlacement } from '../types/importPipeline';

const MAX_CROP_AREA = 0.82;
const MIN_CROP_AREA = 0.0015;

export interface RawMediaRequest {
  kind: QuestionMediaKind;
  placement: QuestionMediaPlacement;
  optionLetter?: QuestionMediaDescriptor['optionLetter'];
  page: number;
  crop: NormalizedMediaCrop;
  altText: string;
  caption?: string;
  source?: string;
  confidence: number;
}

export function validateMediaRequest(request: RawMediaRequest, totalPages: number): string[] {
  const warnings: string[] = [];
  const crop = request.crop;
  const values = [crop?.x, crop?.y, crop?.width, crop?.height];
  if (!Number.isInteger(request.page) || request.page < 1 || request.page > totalPages) warnings.push('Página visual inválida.');
  if (values.some(value => !Number.isFinite(value))) warnings.push('Coordenadas visuais inválidas.');
  if (crop && (crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0 || crop.x + crop.width > 1 || crop.y + crop.height > 1)) warnings.push('Recorte fora dos limites da página.');
  const area = crop ? crop.width * crop.height : 0;
  if (area < MIN_CROP_AREA) warnings.push('Recorte visual pequeno demais.');
  if (area > MAX_CROP_AREA) warnings.push('Recorte visual abrange quase toda a página.');
  if (!request.altText || request.altText.trim().length < 8) warnings.push('Texto alternativo insuficiente.');
  if (!Number.isFinite(request.confidence) || request.confidence < 0.92 || request.confidence > 1) warnings.push('Confiança visual abaixo do limiar editorial.');
  if (request.placement === 'option' && !request.optionLetter) warnings.push('Imagem de alternativa sem letra associada.');
  return warnings;
}
