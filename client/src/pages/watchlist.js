import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PENAMBAHAN: State untuk mengelola tab yang sedang aktif
  const [activeTab, setActiveTab] = useState('to_watch'); 
  
  const router = useRouter();

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.get('/watchlist');
      if (res.data.success) {
        setWatchlist(res.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // PENAMBAHAN: Fungsi untuk mengubah status (To Watch <-> Watched)
  const handleToggleStatus = async (e, movieId, currentStatus) => {
    e.preventDefault();
    // Jika status tidak ada, anggap 'to_watch'. Balikkan statusnya.
    const newStatus = (currentStatus || 'to_watch') === 'to_watch' ? 'watched' : 'to_watch';
    
    try {
      // Pastikan rute PUT ini sudah kamu buat di backend
      const res = await api.put(`/watchlist/${movieId}`, { status: newStatus });
      if (res.data.success) {
        // Update state lokal agar UI langsung berpindah tanpa reload
        setWatchlist(watchlist.map(item => 
          item.movie_id === movieId ? { ...item, status: newStatus } : item
        ));
      }
    } catch (error) {
      console.error("Gagal mengubah status:", error);
    }
  };

  const handleRemove = async (e, movieId) => {
    e.preventDefault(); 
    
    try {
      const res = await api.delete(`/watchlist/${movieId}`);
      if (res.data.success) {
        setWatchlist(watchlist.filter(item => item.movie_id !== movieId));
      }
    } catch (error) {
      console.error("Gagal menghapus dari watchlist:", error);
    }
  };

  // PENAMBAHAN: Memfilter data yang tampil berdasarkan tab yang aktif
  const filteredWatchlist = watchlist.filter(item => (item.status || 'to_watch') === activeTab);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 min-h-[80vh] bg-[#F7F3EF] dark:bg-[#151515] transition-colors duration-300">
      <h1 className="text-2xl md:text-4xl font-bold text-light-text dark:text-text-main mb-2">
        My Watchlist
      </h1>
      <p className="text-light-text-secondary dark:text-text-secondary mb-8">
        Movies you want to watch in the future.
      </p>

      {/* PENAMBAHAN: UI Tab Navigation */}
      <div className="flex gap-8 border-b border-black/10 dark:border-white/10 mb-8">
        {['to_watch', 'watched'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm md:text-base font-semibold transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-light-text-secondary dark:text-text-secondary hover:text-primary/70'
            }`}
          >
            {tab === 'to_watch' 
              ? `To Watch (${watchlist.filter(i => (i.status || 'to_watch') === 'to_watch').length})` 
              : `Watched (${watchlist.filter(i => i.status === 'watched').length})`
            }
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredWatchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {/* PERUBAHAN: Gunakan filteredWatchlist untuk mapping, bukan watchlist */}
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="relative group/item">
              
              <MovieCard
                id={item.movie_id} 
                title={item.title}
                rating={item.rating?.toFixed(1) || 'N/A'} 
                year={item.year || 'N/A'}
                poster={item.poster_path}
              />
              
              {/* Tombol Delete (Tetap di kiri) */}
              <button
                onClick={(e) => handleRemove(e, item.movie_id)}
                className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all duration-200 shadow-lg z-30 flex items-center gap-1"
                title="Remove from Watchlist"
              >
                🗑️
              </button>

              {/* PENAMBAHAN: Tombol Toggle Status (Di kanan) */}
              <button
                onClick={(e) => handleToggleStatus(e, item.movie_id, item.status)}
                className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all duration-200 shadow-lg z-30 flex items-center gap-1"
                title={activeTab === 'to_watch' ? "Mark as Watched" : "Move to To Watch"}
              >
                {activeTab === 'to_watch' ? '👁️ Watched' : '⬅️ To Watch'}
              </button>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/50 dark:bg-surface rounded-2xl border border-black/5 dark:border-white/5">
          <p className="text-light-text-secondary dark:text-text-secondary text-lg mb-4">
            {/* Teks menyesuaikan tab yang kosong */}
            {activeTab === 'to_watch' ? 'Your To Watch list is empty.' : 'You haven\'t watched any movies yet.'}
          </p>
          <Link href="/" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition inline-block">
            Discover Movies
          </Link>
        </div>
      )}
    </div>
  );
}