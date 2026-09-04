import { SlidersHorizontal, RotateCcw, Filter } from 'lucide-react';

export interface FilterState {
  genre: string;
  difficulty: string;
  language: string;
  maxPageCount: number;
  minYear: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  genres: string[];
  languages: string[];
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  filters,
  genres,
  languages,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="glass-panel rounded-2xl p-6 space-y-6 sticky top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-400" />
          <h3 className="font-bold text-white text-base">Filter Library</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Genre Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Genre / Category
        </label>
        <select
          value={filters.genre}
          onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="All">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => {
            const isSelected = (level === 'All' && !filters.difficulty) || filters.difficulty === level;
            return (
              <button
                key={level}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    difficulty: level === 'All' ? '' : level,
                  })
                }
                className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Language
        </label>
        <select
          value={filters.language}
          onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value="All">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Page Count Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Max Page Count
          </label>
          <span className="text-xs font-bold text-brand-400">
            {filters.maxPageCount < 700 ? `< ${filters.maxPageCount} p` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="700"
          step="50"
          value={filters.maxPageCount}
          onChange={(e) => onFilterChange({ ...filters, maxPageCount: Number(e.target.value) })}
          className="w-full accent-brand-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>200 p</span>
          <span>450 p</span>
          <span>700 p</span>
        </div>
      </div>

      {/* Publication Year Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Published After
          </label>
          <span className="text-xs font-bold text-brand-400">
            {filters.minYear > 1930 ? `> ${filters.minYear}` : 'Any Year'}
          </span>
        </div>
        <input
          type="range"
          min="1930"
          max="2024"
          step="10"
          value={filters.minYear}
          onChange={(e) => onFilterChange({ ...filters, minYear: Number(e.target.value) })}
          className="w-full accent-brand-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>1930</span>
          <span>1980</span>
          <span>2024</span>
        </div>
      </div>

    </aside>
  );
}
