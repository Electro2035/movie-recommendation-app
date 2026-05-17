import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import Image from 'next/image';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUserData(res.data.user);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Gagal mengambil data user");
        setIsLoggedIn(false);
        setUserData(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  useEffect(() => {
    window.addEventListener('storage', fetchUser);
    window.addEventListener('login-success', fetchUser);
    window.addEventListener('logout-success', fetchUser); 

    return () => {
      window.removeEventListener('storage', fetchUser);
      window.removeEventListener('login-success', fetchUser);
      window.removeEventListener('logout-success', fetchUser);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  const isActive = (path) => router.pathname === path;

  const navLinkClass = (path) => `
    relative transition-all duration-300 py-1
    ${isActive(path) 
      ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full' 
      : 'text-light-text-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary'}
  `;

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 h-[80px] w-full backdrop-blur-[24px] bg-light-bg/80 dark:bg-[#0A0A0A]/80 border-b border-black/5 dark:border-white/5 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-full flex items-center justify-between">
        
        {/* Kiri: Logo & Menu Utama */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            href="/"
            className="group flex items-center gap-0 select-none"
          >
            {/* Logo Icon */}
            <div className="relative h-16 w-16 md:h-[72px] md:w-[72px] shrink-0 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="Cinevora Logo"
                className="h-full w-full object-contain drop-shadow-md"
              />
            </div>
            {/* Logo Text */}
            <h1 className="text-[24px] font-black tracking-tighter bg-gradient-to-r from-[#B47E40] via-[#F8D29D] to-[#8C5E2D] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_10px_rgba(180,126,64,0.3)] transition-all duration-300">
              Cinevora
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] uppercase tracking-widest font-bold">
            <Link href="/" className={navLinkClass('/')}>Home</Link>
            <Link href="/trending" className={navLinkClass('/trending')}>Trending</Link>
            <Link href="/genres" className={navLinkClass('/genres')}>Genres</Link>
            <Link href="/watchlist" className={navLinkClass('/watchlist')}>Watchlist</Link>
          </div>
        </div>

        {/* Kanan: Search, Theme Toggle, & Profile */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl h-[44px] px-4 group focus-within:border-primary/50 transition-all">
            <span className="opacity-50 group-focus-within:opacity-100 transition-opacity">🔍</span>
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="bg-transparent text-sm text-light-text dark:text-white focus:outline-none w-[180px] xl:w-[240px] ml-2 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-light-text-secondary dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-all w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-primary/20"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
          
          {mounted && isLoggedIn ? (
            <div className="flex items-center">         
              <Link href="/profile" className="group flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all duration-500 shadow-lg shadow-primary/10">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-[11px] font-black text-primary uppercase tracking-tighter leading-none mb-1">Account</p>
                  <p className="text-sm font-bold text-light-text dark:text-white truncate max-w-[100px] leading-none">
                    {userData?.name || 'User'}
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            mounted && (
              <Link href="/login" className="bg-primary hover:bg-primary-hover text-white text-xs lg:text-sm font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95">
                Sign In
              </Link>
            )
          )}

          {/* TOMBOL HAMBURGER MOBILE */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white focus:outline-none shadow-lg shadow-primary/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MENU DROPDOWN MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-light-bg dark:bg-[#0F0F0F] border-b border-black/10 dark:border-white/10 shadow-2xl py-8 px-6 flex flex-col gap-6 animate-fadeIn">
          
          <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl h-[50px] px-4 w-full">
            <span className="mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="bg-transparent text-sm text-light-text dark:text-white focus:outline-none w-full font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleSearch(e);
                if (e.key === 'Enter') setIsMobileMenuOpen(false);
              }}
            />
          </div>

          <div className="flex flex-col gap-6 text-lg font-black uppercase tracking-tighter">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/') ? 'text-primary' : ''}>Home</Link>
            <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/trending') ? 'text-primary' : ''}>Trending</Link>
            <Link href="/genres" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/genres') ? 'text-primary' : ''}>Genres</Link>
            <Link href="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/watchlist') ? 'text-primary' : ''}>Watchlist</Link>
            {isLoggedIn && (
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-primary border-t border-white/5 pt-6">My Profile</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}