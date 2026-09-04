'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FilterSidebar, { FilterState } from '@/components/FilterSidebar';
import BookGrid from '@/components/BookGrid';
import { fetchBooks, fetchGenres, ApiBook, ApiGenre } from '@/lib/api';

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

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section with Live API Search Input */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={totalBooks}
        />

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
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Library Catalog</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                  {loading ? 'Loading...' : `Showing ${books.length} of ${totalBooks}`}
                </span>
              </h2>
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
      <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-16 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} AI Library Application — Phase 1 REST API Integration.</p>
        </div>
      </footer>

    </div>
  );
}
