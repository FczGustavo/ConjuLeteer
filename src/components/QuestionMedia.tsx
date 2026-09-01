import React, { useEffect, useRef, useState } from 'react';
import { Expand, ImageOff, X } from 'lucide-react';
import type { QuestionMediaDescriptor } from '../types/importPipeline';
import { loadQuestionMediaAsset } from '../services/questionMediaService';

export const QuestionMedia: React.FC<{ media: QuestionMediaDescriptor[]; className?: string }> = ({ media, className = '' }) => {
  if (!media.length) return null;
  return (
    <div className={`question-media-grid grid gap-4 ${media.length > 1 ? 'sm:grid-cols-2' : ''} ${className}`} data-question-media>
      {media.map(item => <QuestionMediaItem key={item.id} item={item} />)}
    </div>
  );
};

const QuestionMediaItem: React.FC<{ item: QuestionMediaDescriptor }> = ({ item }) => {
  const [url, setUrl] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Bundled public assets are available during render; imported assets are
  // resolved asynchronously from IndexedDB below.
  const resolvedUrl = item.assetUrl ?? url;
  const resolvedFailed = failed;

  useEffect(() => {
    let active = true;
    let objectUrl: string | undefined;
    if (item.assetUrl) {
      return () => { active = false; };
    }
    loadQuestionMediaAsset(item.assetId).then(blob => {
      if (!active || !blob) { if (active) setFailed(true); return; }
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(() => active && setFailed(true));
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [item.assetId, item.assetUrl]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setExpanded(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  if (resolvedFailed) return (
    <div className="question-media-error flex min-h-28 items-center justify-center gap-2 rounded-xl p-4 text-xs" role="status">
      <ImageOff className="h-4 w-4" /> Recorte visual indisponível
    </div>
  );
  if (!resolvedUrl) return <div className="question-media-loading min-h-28 animate-pulse rounded-xl" aria-label="Carregando recorte visual" />;

  return (
    <figure className="question-media-figure overflow-hidden rounded-xl">
      <button ref={triggerRef} type="button" className="group relative block w-full cursor-zoom-in" onClick={() => setExpanded(true)} aria-label={`Ampliar imagem: ${item.altText}`}>
        <img src={resolvedUrl} width={item.width} height={item.height} alt={item.altText} loading="lazy" decoding="async" onError={() => setFailed(true)} className="mx-auto max-h-[32rem] w-auto max-w-full object-contain" />
        <span className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/65 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Expand className="h-4 w-4" /></span>
      </button>
      {(item.caption || item.source) && <figcaption className="space-y-1 px-3 py-2 text-xs leading-relaxed"><span>{item.caption}</span>{item.source && <cite className="block opacity-70">{item.source}</cite>}</figcaption>}
      {expanded && (
        <div role="dialog" aria-modal="true" aria-label={`Imagem ampliada: ${item.altText}`} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" onMouseDown={event => { if (event.currentTarget === event.target) { setExpanded(false); triggerRef.current?.focus(); } }}>
          <button autoFocus type="button" onClick={() => { setExpanded(false); triggerRef.current?.focus(); }} className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-black/60 text-white" aria-label="Fechar imagem ampliada"><X className="h-5 w-5" /></button>
          <img src={resolvedUrl} alt={item.altText} onError={() => setFailed(true)} className="max-h-[90vh] max-w-[94vw] object-contain" />
        </div>
      )}
    </figure>
  );
};
