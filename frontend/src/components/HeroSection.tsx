import { Search, Sparkles, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export default function HeroSection({ searchQuery, onSearchChange, totalResults }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800/80 p-8 sm:p-12 mb-8">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        {/* Subtitle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs text-indigo-300 font-medium shadow-inner">
          <BookOpen className="w-3.5 h-3.5 text-brand-400" />
          <span>Catalog Explorer</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Discover Your <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Next Book</span>
        </h1>

        {/* Hero Description */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Explore a curated library spanning programming, cybersecurity, science fiction, history, philosophy, and more. Filter by genre, difficulty, or length.
        </p>

        {/* Search Input Box */}
        <div className="relative max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-xl transition-all"
            />
            <div className="absolute right-3 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-400 font-medium border border-slate-700/60">
              {totalResults} {totalResults === 1 ? 'book' : 'books'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
