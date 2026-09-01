import { describe, expect, it } from 'vitest';
import { validateMediaRequest, type RawMediaRequest } from './questionMediaService';

const valid: RawMediaRequest = {
  kind: 'diagram', placement: 'statement', page: 2,
  crop: { x: 0.15, y: 0.2, width: 0.5, height: 0.3 },
  altText: 'Diagrama geométrico do enunciado', confidence: 0.98,
};

describe('recortes visuais de questões', () => {
  it('aceita apenas um recorte delimitado e comprovado', () => {
    expect(validateMediaRequest(valid, 5)).toEqual([]);
  });

  it('rejeita página inteira, coordenadas inválidas e baixa confiança', () => {
    const warnings = validateMediaRequest({
      ...valid, page: 8, confidence: 0.6, altText: 'foto',
      crop: { x: -0.1, y: 0, width: 1, height: 1 },
    }, 5);
    expect(warnings).toContain('Página visual inválida.');
    expect(warnings).toContain('Recorte fora dos limites da página.');
    expect(warnings).toContain('Recorte visual abrange quase toda a página.');
    expect(warnings).toContain('Texto alternativo insuficiente.');
    expect(warnings).toContain('Confiança visual abaixo do limiar editorial.');
  });

  it('exige associação para mídia dentro de alternativa', () => {
    expect(validateMediaRequest({ ...valid, placement: 'option' }, 5)).toContain('Imagem de alternativa sem letra associada.');
  });
});
