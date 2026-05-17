import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkToken(); // Jalankan saat pertama kali halaman dibuka
    // Agar Navbar tahu jika ada login/logout di halaman lain
    window.addEventListener('storage', checkToken);
    // Custom event agar Navbar tahu jika login sukses tanpa pindah halaman
    window.addEventListener('login-success', checkToken);
    // Custom event agar Navbar tahu jika logout sukses
    window.addEventListener('logout-success', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('login-success', checkToken);
      window.removeEventListener('logout-success', checkToken);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("logout-success"));
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  // HELPER: Fungsi untuk mengecek apakah link sedang aktif
  const isActive = (path) => router.pathname === path;

  // HELPER: Gaya CSS untuk Link (Dinamis)
  const navLinkClass = (path) => `
    transition-all duration-300 pb-1
    ${isActive(path) 
      ? 'text-light-text dark:text-text-main border-b-2 border-primary font-semibold' 
      : 'hover:text-light-text dark:hover:text-text-main text-light-text-secondary dark:text-text-secondary'}
  `;

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 h-[80px] w-full backdrop-blur-[20px] bg-light-bg/80 dark:bg-[#151515]/75 border-b border-black/10 dark:border-white/5 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* Kiri: Logo & Menu Utama */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-primary tracking-wide">Arunika</h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
            <Link href="/" className={navLinkClass('/')}>Home</Link>
            <Link href="/trending" className={navLinkClass('/trending')}>Trending</Link>
            <Link href="/genres" className={navLinkClass('/genres')}>Genres</Link>
            <Link href="/watchlist" className={navLinkClass('/watchlist')}>Watchlist</Link>
          </div>
        </div>

        {/* Kanan: Search & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full h-[40px] px-4">
            <span className="text-light-text-secondary dark:text-text-secondary mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search for movies..." 
              className="bg-transparent text-sm text-light-text dark:text-white focus:outline-none w-[150px] xl:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-light-text-secondary dark:text-text-secondary hover:text-light-text dark:hover:text-text-main transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          
          {mounted && isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button onClick={handleLogout} className="hidden md:block text-light-text-secondary dark:text-text-secondary hover:text-light-text dark:hover:text-text-main text-xs font-medium">
                Logout
              </button>
              <div className="w-10 h-10 rounded-full bg-surface dark:bg-elevated border border-black/10 dark:border-white/10 flex items-center justify-center text-primary font-semibold text-lg shadow-inner">
                A 
              </div>
            </div>
          ) : (
            mounted && (
              <Link href="/login" className="bg-primary hover:bg-primary-hover text-white text-[12px] md:text-sm font-medium px-4 md:px-5 py-2 rounded-[14px] transition whitespace-nowrap">
                Sign In
              </Link>
            )
          )}

          {/* TOMBOL HAMBURGER MOBILE */}
          <button 
            className="md:hidden text-2xl text-light-text dark:text-white focus:outline-none ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MENU DROPDOWN MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-[#F7F3EF] dark:bg-[#151515] border-b border-black/10 dark:border-white/5 shadow-lg py-4 px-6 flex flex-col gap-4 animate-fadeIn">
          
          <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full h-[40px] px-4 w-full mb-2">
            <span className="text-light-text-secondary dark:text-text-secondary mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search for movies..." 
              className="bg-transparent text-sm text-light-text dark:text-white focus:outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleSearch(e);
                if (e.key === 'Enter') setIsMobileMenuOpen(false);
              }}
            />
          </div>

          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/')}>Home</Link>
          <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/trending')}>Trending</Link>
          <Link href="/genres" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/genres')}>Genres</Link>
          <Link href="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass('/watchlist')}>Watchlist</Link>
          
          {mounted && isLoggedIn && (
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }} 
              className="text-left mt-2 pt-4 border-t border-black/10 dark:border-white/10 text-red-500 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}