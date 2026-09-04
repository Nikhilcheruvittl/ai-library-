'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';
import BookGrid from '@/components/BookGrid';
import { fetchBooks, fetchGenres, ApiBook, ApiGenre } from '@/lib/api';
import { Library, BookMarked, Sparkles } from 'lucide-react';

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

  // API Data State
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Classic Library Hero Section with Live Search */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={totalBooks}
        />

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

