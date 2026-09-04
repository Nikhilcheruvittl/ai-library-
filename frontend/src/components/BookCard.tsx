import { ApiBook } from '@/lib/api';
import { Star, BookOpen, Calendar, Globe, Bookmark } from 'lucide-react';

interface BookCardProps {
  book: ApiBook;
}

// Classic Library Book Jacket Color Themes
const COVER_THEMES = [
  { bg: "from-[#1e3a8a] via-[#1e40af] to-[#0f172a]", text: "text-[#93c5fd]", border: "border-blue-400/30" }, // Deep Navy
  { bg: "from-[#881337] via-[#9f1239] to-[#4c0519]", text: "text-[#fecdd3]", border: "border-rose-400/30" }, // Crimson Burgundy
  { bg: "from-[#064e3b] via-[#047857] to-[#022c22]", text: "text-[#a7f3d0]", border: "border-emerald-400/30" }, // Forest Green
  { bg: "from-[#78350f] via-[#b45309] to-[#451a03]", text: "text-[#fde68a]", border: "border-amber-400/30" }, // Leather Amber
  { bg: "from-[#581c87] via-[#6b21a8] to-[#3b0764]", text: "text-[#e9d5ff]", border: "border-purple-400/30" }, // Deep Indigo
  { bg: "from-[#164e63] via-[#0e7490] to-[#083344]", text: "text-[#a5f3fc]", border: "border-cyan-400/30" }, // Deep Teal
];

export default function BookCard({ book }: BookCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const primaryGenre = book.genres.length > 0 ? book.genres[0].name : 'General';
  const authorNames = book.authors.length > 0 ? book.authors.map(a => a.name).join(', ') : 'Unknown Author';
  const theme = COVER_THEMES[book.id % COVER_THEMES.length];

  return (
    <div className="bg-white rounded-xl border border-[#e6e0d4] overflow-hidden flex flex-col h-full shadow-xs hover:shadow-md hover:border-[#006699]/40 transition-all duration-200 group">
      
      {/* Prominent Book Cover Area (2:3 Aspect / Vertical Library Spine style) */}
      <div className="p-4 bg-[#f8f5f0] border-b border-[#eee8dc] flex items-center justify-center">
        <div className="relative w-full aspect-[3/4] max-h-56 rounded-r-md rounded-l-sm overflow-hidden shadow-md group-hover:shadow-lg transition-shadow flex flex-col justify-between book-cover-shadow">
          
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between text-white relative`}>
              {/* Spine Indent Line */}
              <div className="absolute top-0 left-2 bottom-0 w-0.5 bg-black/20" />
              
              {/* Top Genre Badge */}
              <div className="flex items-center justify-between z-10 pl-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs ${theme.text}`}>
                  {primaryGenre}
                </span>
                <Bookmark className="w-3.5 h-3.5 text-white/40" />
              </div>

              {/* Title & Author on Cover */}
              <div className="z-10 pl-2 my-auto py-2">
                <h4 className="font-serif-title text-sm sm:text-base font-bold text-white leading-snug line-clamp-3 drop-shadow-sm">
                  {book.title}
                </h4>
                {book.subtitle && (
                  <p className="text-[11px] text-slate-200/90 line-clamp-1 italic mt-1">
                    {book.subtitle}
                  </p>
                )}
                <p className="text-[11px] font-medium text-slate-300 mt-2 line-clamp-1 font-sans">
                  {authorNames}
                </p>
              </div>

              {/* Cover Bottom Bar */}
              <div className="z-10 pl-2 flex justify-between items-end text-[9px] text-white/70 uppercase tracking-widest font-mono">
                <span>OpenLibrary</span>
                <span>{book.publication_year}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Header Row: Author & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500 line-clamp-1 max-w-[65%]">{authorNames}</span>
            <div className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{book.rating}</span>
            </div>
          </div>

          {/* Book Title */}
          <h3 className="text-base font-bold font-serif-title text-slate-900 group-hover:text-[#006699] transition-colors line-clamp-1">
            {book.title}
          </h3>

          {/* Difficulty & Genre Pills */}
          <div className="flex items-center gap-2 pt-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getDifficultyColor(book.difficulty_level)}`}>
              {book.difficulty_level}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {primaryGenre}
            </span>
          </div>

          {/* Summary */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
            {book.summary}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-[#eee8dc] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {book.page_count} p
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {book.publication_year}
            </span>
          </div>

          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {book.language}
          </span>
        </div>

      </div>

    </div>
  );
}

