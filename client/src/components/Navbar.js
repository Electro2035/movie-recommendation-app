import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-[80px] w-full backdrop-blur-[20px] bg-[#151515]/75 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* Kiri: Logo & Menu Utama */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-primary tracking-wide">Arunika</h1>
          </Link>
          
          {/* Menu disembunyikan di HP, muncul di tablet/desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-text-secondary">
            <Link href="/" className="text-text-main border-b-2 border-primary pb-1">Home</Link>
            <Link href="/trending" className="hover:text-text-main transition">Trending</Link>
            <Link href="/genres" className="hover:text-text-main transition">Genres</Link>
            <Link href="/watchlist" className="hover:text-text-main transition">Watchlist</Link>
          </div>
        </div>

        {/* Kanan: Search & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Box hanya muncul di layar besar agar tidak sempit */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full h-[40px] px-4">
            <span className="text-text-secondary mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search for movies..." 
              className="bg-transparent text-sm text-white focus:outline-none w-[150px] xl:w-[200px]"
            />
          </div>
          {/* Icon Search untuk Mobile */}
          <button className="lg:hidden text-text-secondary hover:text-white">
            🔍
          </button>
          
          <Link href="/login" className="bg-primary hover:bg-primary-hover text-white text-[12px] md:text-sm font-medium px-4 md:px-5 py-2 rounded-[14px] transition whitespace-nowrap">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}