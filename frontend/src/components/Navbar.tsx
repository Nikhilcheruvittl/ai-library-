import { Library, BookOpen, Layers, Compass, Bookmark } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#fffdf9]/95 backdrop-blur-md border-b border-[#e6e0d4] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#006699] flex items-center justify-center shadow-sm text-white">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-serif-title text-[#1a2530] tracking-tight flex items-center gap-1">
              Open<span className="text-[#006699]">Library</span>
            </span>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-sans font-medium -mt-1">
              Catalog Explorer
            </span>
          </div>
        </div>

        {/* Catalog Quick Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#" className="flex items-center gap-1.5 text-[#006699] font-bold hover:underline">
            <Compass className="w-4 h-4" />
            <span>Browse Catalog</span>
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Subjects</span>
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Collections</span>
          </a>
        </nav>

        {/* Header Right / Phase Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef7fc] text-[#006699] border border-[#b8e0f5] text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#006699]" />
            <span>Phase 2 — AI Search</span>
          </div>
        </div>


      </div>
    </header>
  );
}

