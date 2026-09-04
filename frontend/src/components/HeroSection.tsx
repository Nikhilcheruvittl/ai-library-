import { Search, BookOpen, Library, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export default function HeroSection({ searchQuery, onSearchChange, totalResults }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fffefb] to-[#f5efe4] border border-[#e6e0d4] p-8 sm:p-12 mb-8 shadow-sm">
      {/* Decorative Warm Accent Background Shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#006699]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        {/* Subtitle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0e9dc] border border-[#d8cebe] text-xs text-[#006699] font-medium shadow-xs">
          <Library className="w-3.5 h-3.5 text-[#006699]" />
          <span>Open Library Catalog</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-title text-[#1a2530] leading-tight tracking-tight">
          Discover Your Next Book on <span className="text-[#006699]">OpenLibrary</span>
        </h1>

        {/* Hero Description */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
          Explore our open digital catalog spanning programming, cybersecurity, science fiction, history, philosophy, and self-development.
        </p>

        {/* Prominent Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-md rounded-xl overflow-hidden border border-[#d8cebe] focus-within:border-[#006699] focus-within:ring-2 focus-within:ring-[#006699]/20 transition-all bg-white">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, author, topic, or keyword..."
              className="w-full pl-12 pr-32 py-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-[#f4ebd9] text-[11px] font-semibold text-slate-700 border border-[#e2d6c1]">
                {totalResults} {totalResults === 1 ? 'book' : 'books'}
              </span>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#006699] hover:bg-[#005580] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

