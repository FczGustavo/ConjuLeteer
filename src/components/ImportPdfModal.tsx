import React, { useEffect, useRef, useState } from 'react';
import { X, FileUp, Sparkles, AlertCircle, Upload, BookOpen } from 'lucide-react';
import { parsePdfQuestionsWithAiDetailed, extractPdfArtifactsFromFile } from '../services/pdfImportService';
import { artifactsToText } from '../services/pdfArtifacts';
import { createPdfImportBatches } from '../services/pdfBatching';
import { SUBJECTS_CONFIG, type SubjectId, type QuestionBankItem } from '../data/questionBank';

interface ImportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsImported: (newQuestions: QuestionBankItem[]) => void;
}

interface ImportSummary {
  importedCount: number;
  quarantinedItems: Array<{ questionNumber: number; warnings: string[] }>;
  pagesProcessed: number;
  totalPages: number;
}

export const ImportPdfModal: React.FC<ImportPdfModalProps> = ({
  isOpen,
  onClose,
  onQuestionsImported
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('importadas');
  const [listTitle, setListTitle] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const importControllerRef = useRef<AbortController | null>(null);
  const jobIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        setImportSummary(null); setErrorMessage(null); setStatusMessage(''); onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => { document.removeEventListener('keydown', onKeyDown); window.clearTimeout(focusTimer); };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) importControllerRef.current?.abort();
    if (isLoading && jobIdRef.current) void fetch(`/api/import/jobs/${encodeURIComponent(jobIdRef.current)}`, { method: 'DELETE', credentials: 'same-origin' }).catch(() => undefined);
    jobIdRef.current = null;
    importControllerRef.current = null;
    setIsLoading(false);
    setImportSummary(null);
    setErrorMessage(null);
    setStatusMessage('');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      acceptFile(e.target.files[0]);
    }
  };

  const acceptFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { setErrorMessage('Selecione um arquivo PDF válido.'); return; }
    if (file.size > 25 * 1024 * 1024) { setErrorMessage('O PDF excede o limite de 25 MB. Divida o arquivo em lotes menores.'); return; }
    setSelectedFile(file);
    if (!listTitle) setListTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleStartImport = async () => {
    setErrorMessage(null);
    setImportSummary(null);
    setIsLoading(true);
    const controller = new AbortController();
    importControllerRef.current = controller;
    setStatusMessage('Lendo conteúdo...');

    try {
      let rawText = pastedText.trim();
      let artifactResult;

      if (selectedFile) {
        setStatusMessage('Reconstruindo páginas, texto e evidências visuais...');
        artifactResult = await extractPdfArtifactsFromFile(selectedFile, controller.signal, (page, total, method) => setStatusMessage(`Página ${page} de ${total}: ${method === 'native-text+vision' ? 'revisão visual/OCR preparada' : 'texto nativo extraído'}...`));
        rawText = artifactsToText(artifactResult.artifacts).trim() || rawText;
        if (!rawText && !artifactResult.artifacts.length) throw new Error('O PDF não contém páginas legíveis.');
      }

      if (!rawText) {
        throw new Error('Por favor, selecione um arquivo PDF ou cole o texto das questões com gabarito.');
      }

      const targetSubject = SUBJECTS_CONFIG.find(s => s.id === selectedSubjectId) || SUBJECTS_CONFIG[1];

      const health = await fetch('/api/health', { credentials: 'same-origin', signal: controller.signal });
      if (!health.ok) throw new Error('O serviço de importação não está disponível.');
      const totalPages = artifactResult?.manifest.totalPages || (rawText.match(/--- PAGINA \d+ ---/gu) || []).length;
      const totalBatches = createPdfImportBatches(rawText).length;
      const jobResponse = await fetch('/api/import/jobs', { method: 'POST', credentials: 'same-origin', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName: selectedFile?.name || listTitle, fileHash: artifactResult?.fileHash, totalPages, totalBatches }) });
      if (jobResponse.ok) {
        const jobData = await jobResponse.json() as { job?: { id?: string } };
        jobIdRef.current = typeof jobData.job?.id === 'string' ? jobData.job.id : null;
      }
      const updateJob = (patch: Record<string, unknown>) => jobIdRef.current
        ? fetch(`/api/import/jobs/${encodeURIComponent(jobIdRef.current)}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) }).catch(() => undefined)
        : Promise.resolve();
      await updateJob({ status: 'processing', processedPages: artifactResult?.manifest.processedPages.length || 0, manifest: artifactResult?.manifest });

      const result = await parsePdfQuestionsWithAiDetailed(
        rawText,
        selectedSubjectId,
        targetSubject.title,
        listTitle || 'Simulado Importado via IA',
        (msg) => { setStatusMessage(msg); const match = msg.match(/lote (\d+) de (\d+)/iu); void updateJob({ status: 'processing', completedBatches: match ? Number(match[1]) - 1 : undefined, attempts: 1 }); },
        controller.signal,
        artifactResult,
      );

      onQuestionsImported(result.verified);
      await updateJob({ status: 'completed', completedBatches: result.manifest.totalPages ? totalBatches : totalBatches, processedPages: result.manifest.processedPages.length, verifiedCount: result.verified.length, quarantinedCount: result.quarantined.length, manifest: result.manifest });
      setIsLoading(false);
      importControllerRef.current = null;
      jobIdRef.current = null;
      setImportSummary({
        importedCount: result.verified.length,
        pagesProcessed: result.manifest.processedPages.length,
        totalPages: result.manifest.totalPages,
        quarantinedItems: result.quarantined
          .map(item => ({ questionNumber: item.questionNumber, warnings: item.quality?.warnings ?? [] }))
      });
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        setIsLoading(false);
        importControllerRef.current = null;
        jobIdRef.current = null;
        return;
      }
      if (jobIdRef.current) void fetch(`/api/import/jobs/${encodeURIComponent(jobIdRef.current)}`, { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: controller.signal.aborted ? 'cancelled' : 'failed', error: err instanceof Error ? err.message : 'Erro inesperado' }) }).catch(() => undefined);
      setIsLoading(false);
      importControllerRef.current = null;
      jobIdRef.current = null;
      setErrorMessage(err instanceof Error ? err.message : 'Erro inesperado durante a importação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div role="dialog" aria-modal="true" aria-labelledby="import-dialog-title" className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-[#181b20] border border-[#2e353e] shadow-2xl overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-[#2e353e] p-5 shrink-0 bg-[#181b20]">
          <div className="flex items-center space-x-2 text-[#f3ede6] font-bold text-sm">
            <FileUp className="w-4 h-4 text-[#e8a87c]" />
            <span id="import-dialog-title">Importar Questões via PDF / IA</span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-[#f3ede6] hover:bg-[#242930] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs font-mono">
          {importSummary ? (
            <div className="space-y-4" data-import-summary>
              <div className="rounded-xl border border-[#34d399]/40 bg-[#182a22] p-4 text-[#d1fae5]">
                <p className="font-bold text-sm">Importação concluída</p>
                <p className="mt-1 font-sans leading-relaxed">
                  {importSummary.importedCount} {importSummary.importedCount === 1 ? 'questão verificada foi publicada' : 'questões verificadas foram publicadas'} no Banco de Questões.
                </p>
                <p className="mt-1 font-sans text-[11px] opacity-80">Cobertura: {importSummary.pagesProcessed} de {importSummary.totalPages || importSummary.pagesProcessed} páginas processadas.</p>
              </div>
              {importSummary.quarantinedItems.length > 0 ? (
                <div className="rounded-xl border border-[#fbbf24]/40 bg-[#2a2417] p-4 text-[#fef3c7]">
                  <p className="font-bold">{importSummary.quarantinedItems.length} questão(ões) isolada(s)</p>
                  <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#fde68a]">Nenhum item inconclusivo foi publicado. Revise as evidências antes de liberar estas questões.</p>
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                    {importSummary.quarantinedItems.map(item => (
                      <div key={item.questionNumber} className="rounded-lg border border-[#fbbf24]/25 bg-[#1b1f25] p-2.5">
                        <p className="font-bold">Questão {item.questionNumber}</p>
                        {item.warnings.map((warning, index) => <p key={index} className="font-sans text-[11px] leading-relaxed">• {warning}</p>)}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-[#343c46] bg-[#20242b] p-4 font-sans leading-relaxed text-[#d1d5db]">Todas as questões detectadas passaram pelas validações e têm evidência suficiente para publicação.</p>
              )}
            </div>
          ) : (
          <>
          
          {/* Destination Subject */}
          <div className="space-y-1.5">
            <label className="text-[#f3ede6] font-bold flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#e8a87c]" />
              <span>Assunto de Destino:</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value as SubjectId)}
              className="w-full px-3 py-2 bg-[#20242b] rounded-lg border border-[#2e353e] text-[#f3ede6] text-xs font-mono focus:border-[#e8a87c] focus:outline-none"
            >
              {SUBJECTS_CONFIG.filter(s => s.id !== 'todos').map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* List Title */}
          <div className="space-y-1.5">
            <label className="text-[#f3ede6] font-bold">Título da Lista / Módulo:</label>
            <input
              type="text"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="Ex: Simulado AFA 2024 - Fonética"
              className="w-full px-3 py-2 bg-[#20242b] rounded-lg border border-[#2e353e] text-[#f3ede6] text-xs font-mono focus:border-[#e8a87c] focus:outline-none placeholder:text-[#525b68]"
            />
          </div>

          {/* PDF File Upload */}
          <div className="space-y-1.5">
            <label className="text-[#f3ede6] font-bold">Arquivo PDF com Questões e Gabarito:</label>
            <div onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const file=event.dataTransfer.files[0]; if(file) acceptFile(file); }} className="p-4 rounded-xl border border-dashed border-[#343c46] hover:border-[#e8a87c] bg-[#14161a] text-center transition-colors">
              <input
                type="file"
                accept=".pdf"
                id="pdf-upload-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center space-y-2">
                <Upload className="w-6 h-6 text-[#e8a87c]" />
                <span className="text-[#d1d5db] font-sans text-xs">
                  {selectedFile ? (
                    <strong className="text-[#e8a87c]">{selectedFile.name}</strong>
                  ) : (
                    'Clique para selecionar o PDF ou arraste aqui'
                  )}
                </span>
                <span className="text-[10px] text-[#8b949e]">
                  O PDF deve conter questões de múltipla escolha e a tabela de gabarito.
                </span>
              </label>
            </div>
          </div>

          <p className="rounded-lg bg-[#20242b] p-3 text-[10px] leading-relaxed text-[#9ca3af]">Ao confirmar, o texto extraído e, quando necessário, imagens comprimidas de páginas com baixa legibilidade serão enviados à OpenRouter exclusivamente para estruturar e verificar as questões. Envie somente materiais cujo processamento você esteja autorizado a realizar.</p>

          {/* Or Paste Raw Text */}
          <div className="space-y-1.5">
            <label className="text-[#f3ede6] font-bold">Ou Cole o Texto Diretamente:</label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Cole aqui o texto das questões e o gabarito..."
              rows={4}
              className="w-full px-3 py-2 bg-[#20242b] rounded-lg border border-[#2e353e] text-[#f3ede6] text-xs font-mono focus:border-[#e8a87c] focus:outline-none placeholder:text-[#525b68]"
            />
          </div>

          {/* Status Message */}
          {isLoading && (
            <div className="p-3.5 rounded-xl bg-[#20242b] border border-[#e8a87c]/40 text-[#e8a87c] flex items-center space-x-2.5 animate-pulse">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono">{statusMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#2f1c1f] border border-[#f87171]/40 text-[#f87171] flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs font-sans leading-relaxed">{errorMessage}</span>
            </div>
          )}

          </>
          )}

        </div>

        {/* Fixed Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#2e353e] bg-[#14161a] shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-[#20242b] hover:bg-[#282e37] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono transition-colors"
          >
            {isLoading ? 'Cancelar importação' : 'Cancelar'}
          </button>

          <button
            onClick={importSummary ? handleClose : handleStartImport}
            disabled={isLoading || (!importSummary && !selectedFile && !pastedText.trim())}
            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] disabled:opacity-40 disabled:cursor-not-allowed text-[#16181b] font-bold text-xs font-mono transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Processando...' : importSummary ? 'Fechar' : 'Estruturar com IA & Salvar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
