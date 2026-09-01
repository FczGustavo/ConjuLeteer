import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { QuestionMedia } from '../components/QuestionMedia';
import { canvasToOptimizedBlob, saveQuestionMediaAsset } from '../services/questionMediaService';
import type { QuestionMediaDescriptor } from '../types/importPipeline';

const descriptor: QuestionMediaDescriptor = {
  id: 'fixture-media', assetId: 'fixture-media-asset', kind: 'chart', placement: 'statement', page: 3,
  crop: { x: 0.18, y: 0.26, width: 0.58, height: 0.32 }, width: 960, height: 460,
  mimeType: 'image/webp', altText: 'Gráfico de barras comparando quatro grupos de estudo',
  caption: 'Recorte visual da questão', hash: 'fixture', confidence: 0.99,
};

const bundledDescriptor: QuestionMediaDescriptor = {
  id: 'fixture-bundled-media', assetId: 'english-a2cae6d104a03b0a', kind: 'figure', placement: 'statement', page: 159,
  crop: { x: 0.09, y: 0.49, width: 0.38, height: 0.23 }, width: 450, height: 380,
  mimeType: 'image/png', assetUrl: '/assets/questions/english/p159-Im11.png',
  altText: 'Tirinha de Charlie Brown recortada da questão', caption: 'Recorte visual da questão', hash: 'fixture-bundled', confidence: 1,
};

function createFixtureBlob(): Promise<Blob> {
  const canvas = document.createElement('canvas'); canvas.width = 960; canvas.height = 460;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#fbfbfa'; context.fillRect(0, 0, 960, 460);
  context.fillStyle = '#20242b'; context.font = '600 28px Inter, sans-serif'; context.fillText('Resultados por grupo', 58, 58);
  context.strokeStyle = '#59616c'; context.lineWidth = 2; context.beginPath(); context.moveTo(80, 365); context.lineTo(900, 365); context.stroke();
  [0.34, 0.56, 0.78, 0.48].forEach((value, index) => { const height = value * 300; context.fillStyle = '#3977c8'; context.fillRect(145 + index * 190, 365 - height, 92, height); context.fillStyle = '#343b44'; context.font = '20px Inter, sans-serif'; context.fillText(`Grupo ${index + 1}`, 145 + index * 190, 405); });
  return canvasToOptimizedBlob(canvas);
}

export const Fixture = () => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { createFixtureBlob().then(blob => saveQuestionMediaAsset(descriptor.assetId, blob)).then(() => setReady(true)).catch(reason => setError(reason instanceof Error ? reason.message : String(reason))); }, []);
  return <main className="min-h-screen bg-[#101214] px-4 py-12 text-[#f3ede6]"><article className="question-sheet mx-auto max-w-3xl rounded-2xl bg-[#1d2025] p-6 shadow-2xl"><p className="mb-4 font-mono text-xs text-[#3977c8]">Questão com elemento visual</p><h1 className="mb-5 text-lg">Observe o gráfico recortado e assinale a alternativa correta.</h1>{error ? <p role="alert">{error}</p> : ready ? <div className="space-y-6"><QuestionMedia media={[descriptor]} /><QuestionMedia media={[bundledDescriptor]} /></div> : <p>Preparando recorte...</p>}</article></main>;
};

createRoot(document.getElementById('root')!).render(<Fixture />);
