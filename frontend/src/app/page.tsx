'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';
import BookGrid from '@/components/BookGrid';
import AIAssistantWidget from '@/components/AIAssistantWidget';
import { fetchBooks, fetchGenres, fetchAiSearch, ApiBook, ApiGenre } from '@/lib/api';
import { Library, BookMarked, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  genre: 'All',
  difficulty: '',
  language: 'All',
  maxPageCount: 700,
  minYear: 1930,
};

const DEFAULT_LANGUAGES = ['English'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Standard Catalog API Data State
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // AI Search & Assistant State (Phase 2 LLM Integration)
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiIntent, setAiIntent] = useState<'book_search' | 'conversation' | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiBooks, setAiBooks] = useState<ApiBook[]>([]);
  const [aiTotal, setAiTotal] = useState<number>(0);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hasAiSearched, setHasAiSearched] = useState<boolean>(false);

  // 1. Fetch Available Genres from GET /api/v1/genres
  useEffect(() => {
    let isMounted = true;
    fetchGenres()
      .then((data: ApiGenre[]) => {
        if (isMounted) {
          const genreNames = data.map((g) => g.name).sort();
          setGenres(genreNames);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch genres from backend:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Books from GET /api/v1/books matching live search & filters
  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchBooks({
        search: searchQuery,
        genre: filters.genre,
        difficulty: filters.difficulty,
        language: filters.language,
        max_page_count: filters.maxPageCount,
        min_year: filters.minYear,
        limit: 50, // Fetch up to 50 items
        offset: 0,
      });

      setBooks(response.items);
      setTotalBooks(response.total);
    } catch (err: any) {
      console.error('Failed to fetch books from API:', err);
      setError(err.message || 'Connection refused');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters(INITIAL_FILTERS);
  };

  const handleQuickGenreSelect = (selectedGenre: string) => {
    setFilters((prev) => ({
      ...prev,
      genre: prev.genre === selectedGenre ? 'All' : selectedGenre,
    }));
  };

  // AI Assistant & Search Execution Handler (POST /api/v1/ai/search)
  const handleAiSearchSubmit = async (queryText: string) => {
    setAiQuery(queryText);
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetchAiSearch(queryText, 24, 0);
      setAiIntent(response.intent);
      setAiMessage(response.message || null);
      setHasAiSearched(true);

      if (response.intent === 'book_search') {
        setAiBooks(response.items);
        setAiTotal(response.total);

        // Smooth scroll AI results into view
        setTimeout(() => {
          document.getElementById('ai-results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setAiBooks([]);
        setAiTotal(0);
      }
    } catch (err: any) {
      console.error('Failed to execute AI search:', err);
      setAiError(err.message || 'Ollama AI service request failed');
      setHasAiSearched(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetAiSearch = () => {
    setAiQuery('');
    setAiIntent(null);
    setAiMessage(null);
    setAiBooks([]);
    setAiTotal(0);
    setAiLoading(false);
    setAiError(null);
    setHasAiSearched(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-slate-800 flex flex-col font-sans antialiased relative">
      
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Classic Library Hero Section with Live Search */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={totalBooks}
        />

        {/* AI Book Search Results Banner & Grid (Renders when AI book search returns items) */}
        {hasAiSearched && aiIntent === 'book_search' && (
          <section id="ai-results-section" className="bg-[#eef7fc] border border-[#b8e0f5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#c4e0f0]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#006699] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-serif-title text-[#1a2530] flex items-center gap-2">
                    AI Search Results
                    <span className="px-2.5 py-0.5 rounded-full bg-[#006699] text-white text-xs font-bold font-sans">
                      {aiTotal} {aiTotal === 1 ? 'book matched' : 'books matched'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600 font-sans">
                    Natural-language query: <span className="font-semibold text-slate-800">"{aiQuery}"</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAiSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#d8cebe] text-xs font-semibold text-slate-700 hover:text-[#006699] hover:border-[#006699] transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Dismiss AI Results</span>
              </button>
            </div>

            <BookGrid
              books={aiBooks}
              loading={aiLoading}
              error={aiError}
              onResetFilters={handleResetAiSearch}
            />
          </section>
        )}

        {/* Popular Subject Quick Bar */}
        {genres.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-[#e6e0d4] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <BookMarked className="w-3.5 h-3.5 text-[#006699]" />
              <span>Popular Subjects</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleQuickGenreSelect('All')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filters.genre === 'All'
                    ? 'bg-[#006699] text-white border-[#005580]'
                    : 'bg-[#faf8f5] text-slate-700 border-[#d8cebe] hover:border-slate-400'
                }`}
              >
                All Subjects
              </button>
              {genres.slice(0, 8).map((g) => {
                const isSelected = filters.genre === g;
                return (
                  <button
                    key={g}
                    onClick={() => handleQuickGenreSelect(g)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#006699] text-white border-[#005580]'
                        : 'bg-[#faf8f5] text-slate-700 border-[#d8cebe] hover:border-slate-400'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Catalog Grid Layout (Sidebar + Books Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Filters Area */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              genres={genres}
              languages={DEFAULT_LANGUAGES}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Book Cards Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#e6e0d4]">
              <div className="flex items-center gap-3">
                <Library className="w-5 h-5 text-[#006699]" />
                <h2 className="text-lg font-bold font-serif-title text-slate-900">
                  Catalog Collection
                </h2>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#f0e9dc] text-slate-700 font-medium border border-[#d8cebe]">
                {loading ? 'Searching catalog...' : `Showing ${books.length} of ${totalBooks} books`}
              </span>
            </div>

            <BookGrid
              books={books}
              loading={loading}
              error={error}
              onResetFilters={handleResetFilters}
              onRetry={loadBooks}
            />
          </div>

        </div>

      </main>

      {/* Floating AI Assistant Avatar & Panel Widget (Bottom-Right) */}
      <AIAssistantWidget
        onSearchSubmit={handleAiSearchSubmit}
        onResetAiSearch={handleResetAiSearch}
        aiTotal={aiTotal}
        aiLoading={aiLoading}
        aiError={aiError}
        hasSearched={hasAiSearched}
        lastQuery={aiQuery}
        aiIntent={aiIntent}
        aiMessage={aiMessage}
      />


      {/* Footer */}
      <footer className="border-t border-[#e6e0d4] bg-[#fffdf9] mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif-title font-semibold text-slate-700">OpenLibrary Catalog Explorer</p>
          <p>© {new Date().getFullYear()} OpenLibrary — Classic Online Library Catalog Integration.</p>
        </div>
      </footer>

    </div>
  );
}
