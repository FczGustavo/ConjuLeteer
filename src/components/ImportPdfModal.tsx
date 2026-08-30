import React, { useState } from 'react';
import { X, FileUp, Sparkles, AlertCircle, Upload, BookOpen } from 'lucide-react';
import { parsePdfQuestionsWithAi, extractTextFromPdfFile } from '../services/pdfImportService';
import { SUBJECTS_CONFIG, type SubjectId, type QuestionBankItem } from '../data/questionBank';

interface ImportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsImported: (newQuestions: QuestionBankItem[]) => void;
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

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!listTitle) {
        setListTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleStartImport = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setStatusMessage('Lendo conteúdo...');

    try {
      let rawText = pastedText.trim();

      if (selectedFile) {
        setStatusMessage('Extraindo texto do arquivo PDF...');
        const extracted = await extractTextFromPdfFile(selectedFile);
        if (extracted && extracted.trim().length > 50) {
          rawText = extracted;
        } else if (!rawText) {
          throw new Error('Não foi possível extrair texto legível do arquivo PDF selecionado. Tente copiar e colar o texto das questões no campo abaixo.');
        }
      }

      if (!rawText) {
        throw new Error('Por favor, selecione um arquivo PDF ou cole o texto das questões com gabarito.');
      }

      const targetSubject = SUBJECTS_CONFIG.find(s => s.id === selectedSubjectId) || SUBJECTS_CONFIG[1];

      const imported = await parsePdfQuestionsWithAi(
        rawText,
        selectedSubjectId,
        targetSubject.title,
        listTitle || 'Simulado Importado via IA',
        (msg) => setStatusMessage(msg)
      );

      onQuestionsImported(imported);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Erro inesperado durante a importação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-[#181b20] border border-[#2e353e] shadow-2xl overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-[#2e353e] p-5 shrink-0 bg-[#181b20]">
          <div className="flex items-center space-x-2 text-[#f3ede6] font-bold text-sm">
            <FileUp className="w-4 h-4 text-[#e8a87c]" />
            <span>Importar Questões via PDF / IA</span>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-[#f3ede6] hover:bg-[#242930] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs font-mono">
          
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
            <div className="p-4 rounded-xl border border-dashed border-[#343c46] hover:border-[#e8a87c] bg-[#14161a] text-center transition-colors">
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

        </div>

        {/* Fixed Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#2e353e] bg-[#14161a] shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-[#20242b] hover:bg-[#282e37] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleStartImport}
            disabled={isLoading || (!selectedFile && !pastedText.trim())}
            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] disabled:opacity-40 disabled:cursor-not-allowed text-[#16181b] font-bold text-xs font-mono transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Processando...' : 'Estruturar com IA & Salvar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
