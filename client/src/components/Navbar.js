import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';  

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';
  // useEffect ini WAJIB ada di next-themes untuk mencegah error tampilan (hydration)
  useEffect(() => {
    setMounted(true);
      // Cek token di localStorage untuk menentukan status login
      const token = localStorage.getItem('token');
          if (token) {
            setIsLoggedIn(true);
          }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  if (isAuthPage) return null;

  return (
    // Class biasa untuk Light Mode, prefix dark: untuk Dark Mode
    <nav className="sticky top-0 z-50 h-[80px] w-full backdrop-blur-[20px] bg-light-bg/80 dark:bg-[#151515]/75 border-b border-black/10 dark:border-white/5 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* Kiri: Logo & Menu Utama */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-primary tracking-wide">Arunika</h1>
          </Link>
          
          {/* Menu disembunyikan di HP, muncul di tablet/desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-light-text-secondary dark:text-text-secondary">
            <Link href="/" className="text-light-text dark:text-text-main border-b-2 border-primary pb-1">Home</Link>
            <Link href="/trending" className="hover:text-light-text dark:hover:text-text-main transition">Trending</Link>
            <Link href="/genres" className="hover:text-light-text dark:hover:text-text-main transition">Genres</Link>
            <Link href="/watchlist" className="hover:text-light-text dark:hover:text-text-main transition">Watchlist</Link>
          </div>
        </div>

        {/* Kanan: Search & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Box */}
          <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full h-[40px] px-4">
            <span className="text-light-text-secondary dark:text-text-secondary mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search for movies..." 
              className="bg-transparent text-sm text-light-text dark:text-white focus:outline-none w-[150px] xl:w-[200px]"
            />
          </div>
          
          {/* Icon Search untuk Mobile */}
          <button className="lg:hidden text-light-text-secondary dark:text-text-secondary hover:text-light-text dark:hover:text-white">
            🔍
          </button>

          {/* Theme Toggle Button */}
          {/* Harus di-wrap dengan mounted agar Next.js tidak bingung saat proses render pertama di server */}
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
              {/* Tombol Logout (Minimalis) */}
              <button 
                onClick={handleLogout}
                className="text-light-text-secondary dark:text-text-secondary hover:text-light-text dark:hover:text-text-main text-xs font-medium"
              >
                Logout
              </button>
              
              {/* Avatar Default (Sesuai image_6.png, bulat sempurna dengan inisial) */}
              <div className="w-10 h-10 rounded-full bg-surface dark:bg-elevated border border-black/10 dark:border-white/10 flex items-center justify-center text-primary font-semibold text-lg shadow-inner">
                {/* Inisial sementara, besok kita buat profil dinamis */}
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
        </div>
      </div>
    </nav>
  );
}