import { useState } from 'react';
import { Sparkles, Search, RotateCcw, AlertCircle, Loader2, Bot, CheckCircle2 } from 'lucide-react';
import BookGrid from './BookGrid';
import { ApiBook } from '@/lib/api';

interface AISearchSectionProps {
  onSearchSubmit: (query: string) => void;
  onResetAiSearch: () => void;
  aiBooks: ApiBook[];
  aiTotal: number;
  aiLoading: boolean;
  aiError: string | null;
  hasSearched: boolean;
  lastQuery: string;
}

const EXAMPLE_PROMPTS = [
  'Find me a beginner cybersecurity book under 300 pages',
  'Show me programming books published after 2018',
  'Recommend an advanced history or philosophy book',
  'Intermediate python books'
];

export default function AISearchSection({
  onSearchSubmit,
  onResetAiSearch,
  aiBooks,
  aiTotal,
  aiLoading,
  aiError,
  hasSearched,
  lastQuery,
}: AISearchSectionProps) {
  const [queryInput, setQueryInput] = useState(lastQuery || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = queryInput.trim();
    if (!trimmed) {
      setValidationError('Please enter a natural-language search request before asking AI.');
      return;
    }
    setValidationError(null);
    onSearchSubmit(trimmed);
  };

  const handleExampleClick = (promptText: string) => {
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
    <section className="bg-gradient-to-r from-[#eef7fc] via-[#fffdf9] to-[#faf5eb] border border-[#b8e0f5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d0e6f5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006699] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif-title text-[#1a2530]">
                Ask OpenLibrary AI
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#006699]/10 text-[#006699] text-[10px] font-bold uppercase tracking-wider border border-[#006699]/20">
                LLM Structured Search
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              Type your search intent in plain English and let Ollama AI parse structured parameters.
            </p>
          </div>
        </div>

        {hasSearched && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#d8cebe] text-xs font-semibold text-slate-700 hover:text-[#006699] hover:border-[#006699] transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear AI Search</span>
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex items-start bg-white rounded-xl border border-[#c4e0f0] focus-within:border-[#006699] focus-within:ring-2 focus-within:ring-[#006699]/20 shadow-xs overflow-hidden transition-all">
            <div className="pl-4 pt-3.5 text-[#006699]">
              <Bot className="w-5 h-5" />
            </div>
            <textarea
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                if (validationError) setValidationError(null);
              }}
              rows={2}
              placeholder="e.g., 'Find me a beginner cybersecurity book under 300 pages' or 'Show me programming books published after 2018'..."
              className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none font-sans"
            />
            <div className="pr-3 pt-3">
              <button
                type="submit"
                disabled={aiLoading}
                className="px-4 py-2 rounded-lg bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Validation Warning */}
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Quick Example Prompt Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Try asking:</span>
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleExampleClick(prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#eef7fc] border border-[#d8cebe] hover:border-[#006699] text-slate-700 hover:text-[#006699] text-[11px] transition-colors shadow-xs"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </form>

      {/* AI Error Alert */}
      {aiError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>AI Search Error</span>
          </div>
          <p className="leading-relaxed">{aiError}</p>
        </div>
      )}

      {/* AI Search Results Panel */}
      {hasSearched && !aiLoading && !aiError && (
        <div className="space-y-6 pt-4 border-t border-[#d0e6f5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif-title font-bold text-slate-900 text-base">
                AI Search Results
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#006699] text-white font-medium">
                {aiTotal} {aiTotal === 1 ? 'book matched' : 'books matched'}
              </span>
            </div>
            <p className="text-xs text-slate-500 italic hidden sm:block">
              Parsed from query: "{lastQuery}"
            </p>
          </div>

          <BookGrid
            books={aiBooks}
            loading={false}
            error={null}
            onResetFilters={handleClear}
          />
        </div>
      )}

    </section>
  );
}
