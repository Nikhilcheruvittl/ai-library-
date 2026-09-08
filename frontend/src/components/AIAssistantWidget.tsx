import { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, X, RotateCcw, AlertCircle, Loader2, Send } from 'lucide-react';

interface AIAssistantWidgetProps {
  onSearchSubmit: (query: string) => void;
  onResetAiSearch: () => void;
  aiTotal: number;
  aiLoading: boolean;
  aiError: string | null;
  hasSearched: boolean;
  lastQuery: string;
  aiIntent?: 'book_search' | 'conversation' | null;
  aiMessage?: string | null;
}

const SUGGESTED_PROMPTS = [
  'Find a beginner cybersecurity book under 300 pages',
  'What is SQL injection?',
  'Hi, how are you?',
];

export default function AIAssistantWidget({
  onSearchSubmit,
  onResetAiSearch,
  aiTotal,
  aiLoading,
  aiError,
  hasSearched,
  lastQuery,
  aiIntent,
  aiMessage,
}: AIAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryInput, setQueryInput] = useState<string>(lastQuery || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync query input if lastQuery changes externally
  useEffect(() => {
    if (lastQuery) {
      setQueryInput(lastQuery);
    }
  }, [lastQuery]);

  // Focus textarea when opening panel
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = queryInput.trim();
    if (!trimmed) {
      setValidationError('Please type a search query first!');
      return;
    }
    setValidationError(null);
    onSearchSubmit(trimmed);
  };

  const handlePromptClick = (promptText: string) => {
    setQueryInput(promptText);
    setValidationError(null);
    onSearchSubmit(promptText);
  };

  const handleClear = () => {
    setQueryInput('');
    setValidationError(null);
    onResetAiSearch();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Compact Floating Chat/Search Panel */}
      <div
        ref={panelRef}
        className={`mb-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-[#b8e0f5] shadow-2xl rounded-2xl p-5 space-y-4 transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e2eff7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006699] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-slate-900 text-sm flex items-center gap-1.5">
                Ask OpenLibrary
                <Sparkles className="w-3.5 h-3.5 text-[#006699] animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-500 font-sans font-medium">
                AI Natural Language Assistant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={2}
              placeholder="Ask a question or search for books..."
              className="w-full px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-[#faf8f5] border border-[#d8cebe] rounded-xl focus:outline-none focus:border-[#006699] focus:ring-1 focus:ring-[#006699] resize-none font-sans"
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-2">
            {hasSearched ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#006699] font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear AI State</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">Press Enter to ask</span>
            )}

            <button
              type="submit"
              disabled={aiLoading}
              className="px-3.5 py-1.5 rounded-lg bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ml-auto"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Asking AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Conversational AI Response Chat Bubble */}
        {hasSearched && !aiLoading && !aiError && aiIntent === 'conversation' && aiMessage && (
          <div className="p-3 bg-[#eef7fc] border border-[#b8e0f5] rounded-xl text-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#006699]">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Response</span>
            </div>
            <p className="leading-relaxed font-sans text-slate-700 whitespace-pre-wrap">{aiMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {aiError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-900">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Ollama AI Error</span>
            </div>
            <p className="leading-snug">{aiError}</p>
          </div>
        )}

        {/* Suggested Prompts */}
        <div className="space-y-1.5 pt-2 border-t border-[#e2eff7]">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Suggested Prompts:</p>
          <div className="space-y-1">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left px-2.5 py-1 rounded-md bg-[#faf8f5] hover:bg-[#eef7fc] border border-[#eee8dc] hover:border-[#006699] text-slate-700 hover:text-[#006699] text-[11px] font-medium transition-colors line-clamp-1"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Results Badge Indicator for Book Search */}
        {hasSearched && !aiLoading && !aiError && aiIntent === 'book_search' && (
          <div className="pt-2 border-t border-[#e2eff7] flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-600">AI Book Results:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#006699] text-white text-[10px] font-bold">
              {aiTotal} {aiTotal === 1 ? 'book matched' : 'books matched'}
            </span>
          </div>
        )}

      </div>

      {/* Floating Bottom-Right Character Avatar Button */}
      <div className="relative group">
        {/* Closed Tooltip Badge */}
        {!isOpen && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-white border border-[#b8e0f5] text-slate-800 text-xs font-semibold shadow-md whitespace-nowrap opacity-90 group-hover:opacity-100 transition-all pointer-events-none flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Ask me for help!</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open OpenLibrary AI Assistant"
          className={`w-14 h-14 rounded-full bg-[#006699] hover:bg-[#005580] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
            isOpen ? 'rotate-90 ring-4 ring-[#006699]/30' : 'hover:scale-105'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
          )}
        </button>
      </div>

    </div>
  );
}
