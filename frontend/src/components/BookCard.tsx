import { ApiBook } from '@/lib/api';
import { Star, BookOpen, Calendar, Globe } from 'lucide-react';

interface BookCardProps {
  book: ApiBook;
}

const GRADIENTS = [
  "from-blue-600 via-indigo-700 to-slate-900",
  "from-emerald-600 via-teal-800 to-slate-900",
  "from-amber-600 via-orange-800 to-slate-900",
  "from-purple-600 via-indigo-900 to-slate-900",
  "from-cyan-600 via-blue-900 to-slate-900",
  "from-emerald-700 via-green-950 to-slate-900",
  "from-rose-600 via-pink-900 to-slate-900",
  "from-violet-600 via-purple-950 to-slate-900"
];

export default function BookCard({ book }: BookCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const primaryGenre = book.genres.length > 0 ? book.genres[0].name : 'General';
  const authorNames = book.authors.length > 0 ? book.authors.map(a => a.name).join(', ') : 'Unknown Author';
  const gradient = GRADIENTS[book.id % GRADIENTS.length];

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group">
      
      {/* Styled Cover Area */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between overflow-hidden shadow-inner`}>
        {/* Decorative Background Icon */}
        <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 transform -rotate-12 pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-brand-300 border border-slate-700/60 shadow-sm">
            {primaryGenre}
          </span>

          <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${getDifficultyColor(book.difficulty_level)}`}>
            {book.difficulty_level}
          </span>
        </div>

        {/* Cover Title Overlay */}
        <div className="z-10 mt-auto">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider line-clamp-1">{primaryGenre}</p>
          <h4 className="text-lg font-extrabold text-white line-clamp-1 leading-snug drop-shadow-md">{book.title}</h4>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-slate-900/40">
        
        <div className="space-y-2">
          {/* Author & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 line-clamp-1 max-w-[70%]">{authorNames}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{book.rating}</span>
            </div>
          </div>

          {/* Book Title */}
          <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
            {book.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {book.summary}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              {book.page_count} p
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {book.publication_year}
            </span>
          </div>

          <span className="flex items-center gap-1 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            {book.language}
          </span>
        </div>

      </div>

    </div>
  );
}
