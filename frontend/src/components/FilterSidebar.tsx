import { SlidersHorizontal, RotateCcw } from 'lucide-react';

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
    <aside className="bg-white rounded-2xl p-6 space-y-6 border border-[#e6e0d4] shadow-sm sticky top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#eee8dc]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#006699]" />
          <h3 className="font-bold font-serif-title text-slate-800 text-base">Filter Catalog</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#006699] transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Genre Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Genre / Subject
        </label>
        <select
          value={filters.genre}
          onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
          className="w-full bg-[#faf8f5] border border-[#d8cebe] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#006699] focus:ring-1 focus:ring-[#006699]"
        >
          <option value="All">All Subjects & Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#eee8dc]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Reading Level
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
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
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-[#006699] text-white border-[#005580] shadow-xs'
                    : 'bg-[#faf8f5] text-slate-600 border-[#d8cebe] hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#eee8dc]">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Language
        </label>
        <select
          value={filters.language}
          onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
          className="w-full bg-[#faf8f5] border border-[#d8cebe] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#006699] focus:ring-1 focus:ring-[#006699]"
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
      <div className="space-y-2.5 pt-4 border-t border-[#eee8dc]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Max Length
          </label>
          <span className="text-xs font-bold text-[#006699]">
            {filters.maxPageCount < 700 ? `< ${filters.maxPageCount} pages` : 'Any Length'}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="700"
          step="50"
          value={filters.maxPageCount}
          onChange={(e) => onFilterChange({ ...filters, maxPageCount: Number(e.target.value) })}
          className="w-full accent-[#006699] bg-[#e6e0d4] h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>200 p</span>
          <span>450 p</span>
          <span>700 p</span>
        </div>
      </div>

      {/* Publication Year Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#eee8dc]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Published After
          </label>
          <span className="text-xs font-bold text-[#006699]">
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
          className="w-full accent-[#006699] bg-[#e6e0d4] h-1.5 rounded-lg cursor-pointer"
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
