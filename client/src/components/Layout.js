import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-[#151515] transition-colors duration-300">
      <Navbar />

      <main className="w-full flex-grow text-light-text dark:text-[#F3F4F6]">
        {children}
      </main>

        <footer className="mt-5 border-t border-black/10 dark:border-white/5 py-12 bg-light-bg dark:bg-[#151515]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary tracking-wide mb-4">Arunika</h3>
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
        <div className="text-center text-light-text-secondary dark:text-text-secondary text-xs mt-12 border-t border-white/5 pt-6">
          © 2026 Arunika. All rights reserved.
        </div>
      </footer>
    </div>
  );
}