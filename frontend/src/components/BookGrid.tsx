import { ApiBook } from '@/lib/api';
import BookCard from './BookCard';
import { BookX, AlertTriangle, RefreshCw } from 'lucide-react';

interface BookGridProps {
  books: ApiBook[];
  loading?: boolean;
  error?: string | null;
  onResetFilters: () => void;
  onRetry?: () => void;
}

export default function BookGrid({
  books,
  loading = false,
  error = null,
  onResetFilters,
  onRetry,
}: BookGridProps) {
  // Loading Skeleton State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e6e0d4] h-96 animate-pulse p-4 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="h-44 bg-[#f0e9dc] rounded-md w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-[#f0e9dc] rounded w-3/4" />
              <div className="h-3 bg-[#f5efe4] rounded w-1/2" />
              <div className="h-3 bg-[#f5efe4] rounded w-full" />
            </div>
            <div className="h-4 bg-[#f0e9dc] rounded w-1/3 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  // User-Friendly Error State
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-rose-200 bg-rose-50/20 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold font-serif-title text-slate-900">Backend Service Unavailable</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Unable to connect to OpenLibrary backend API ({error}). Ensure the FastAPI server is running on <code className="text-[#006699] font-mono bg-[#eef7fc] px-1.5 py-0.5 rounded border border-[#b8e0f5]">http://localhost:8000</code>.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006699] hover:bg-[#005580] text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  // Empty Result State
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-[#e6e0d4] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#f8f5f0] border border-[#d8cebe] flex items-center justify-center mx-auto text-slate-400">
          <BookX className="w-8 h-8 text-[#006699]" />
        </div>
        <h3 className="text-lg font-bold font-serif-title text-slate-900">No books found in catalog</h3>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          No catalog records match your current search query or filter parameters. Try adjusting your search term or resetting filters.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006699] hover:bg-[#005580] text-xs font-semibold text-white shadow-sm transition-colors"
        >
          Reset Catalog Filters
        </button>
      </div>
    );
  }

  // Normal Grid Render
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

