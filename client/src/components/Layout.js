import Navbar from './Navbar';
import { useRouter } from 'next/router';

export default function Layout({ children }) {

    const router = useRouter();
    const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-[#151515] transition-colors duration-300">
      <Navbar />

      <main className="w-full flex-grow text-light-text dark:text-[#F3F4F6]">
        {children}
      </main>

        {!isAuthPage && (
        <footer className="mt-5 border-t border-black/10 dark:border-white/5 py-12 bg-[#EBE6E0] dark:bg-[#0D0D0D]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[24px] font-black tracking-tighter bg-gradient-to-r from-[#B47E40] via-[#F8D29D] to-[#8C5E2D] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_10px_rgba(180,126,64,0.3)] transition-all duration-300">
              Cinevora
            </h3>
            <p className="text-light-text-secondary dark:text-text-secondary text-sm">Discover. Watch. Enjoy.<br/>Find movies you'll love.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-light-text dark:text-text-main">Quick Links</h4>
            <ul className="text-light-text-secondary dark:text-text-secondary text-sm space-y-2 cursor-pointer">
              <li className="hover:text-primary transition">Home</li>
              <li className="hover:text-primary transition">Trending</li>
              <li className="hover:text-primary transition">Genres</li>
              <li className="hover:text-primary transition">Watchlist</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-light-text dark:text-text-main">Support</h4>
            <ul className="text-light-text-secondary dark:text-text-secondary text-sm space-y-2 cursor-pointer">
              <li className="hover:text-primary transition">Help Center</li>
              <li className="hover:text-primary transition">Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm text-light-text dark:text-text-main">Follow Us</h4>
            <p className="text-light-text-secondary dark:text-text-secondary text-sm">Twitter • Instagram • Discord</p>
          </div>
        </div>
        <div className="text-center text-light-text-secondary dark:text-text-secondary text-xs mt-12 border-t border-black/10 dark:border-white/5 pt-6">
          © 2026 Cinevora. All rights reserved.
        </div>
      </footer>
        )}
    </div>
  );
}