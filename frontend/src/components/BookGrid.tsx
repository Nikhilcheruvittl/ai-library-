import { ApiBook } from '@/lib/api';
import BookCard from './BookCard';
import { BookX, AlertTriangle, Loader2 } from 'lucide-react';

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
          <div key={i} className="glass-card rounded-2xl h-80 animate-pulse p-5 flex flex-col justify-between space-y-4">
            <div className="h-36 bg-slate-800/60 rounded-xl w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-800/60 rounded w-3/4" />
              <div className="h-3 bg-slate-800/40 rounded w-1/2" />
              <div className="h-3 bg-slate-800/40 rounded w-full" />
            </div>
            <div className="h-4 bg-slate-800/60 rounded w-1/3 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  // User-Friendly Error State
  if (error) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-rose-500/20 bg-rose-950/10">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">API Service Unavailable</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Unable to connect to the backend server ({error}). Ensure the FastAPI server is running on <code className="text-brand-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">http://localhost:8000</code>.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  // Empty Result State
  if (books.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <BookX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No books found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No books match your current search query or filter criteria. Try adjusting your parameters or resetting filters.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-lg transition-colors"
        >
          Reset Filters
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
