import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State baru untuk fitur Watchlist
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await api.get(`/movies/${id}`); 
        if (res.data.success) {
          setMovie(res.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token || !id) return;

      try {
        // Mengambil daftar watchlist user
        const res = await api.get('/watchlist');
        if (res.data.success) {
          // Cek apakah ID film saat ini ada di dalam data watchlist dari database
          const isExist = res.data.data.some(item => item.movie_id.toString() === id.toString());
          setIsInWatchlist(isExist);
        }
      } catch (error) {
        console.error("Gagal mengecek status watchlist:", error);
      }
    };

    checkWatchlistStatus();
  }, [id]);

  // Fungsi untuk interaksi tombol Watchlist
  const handleWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Arahkan ke login jika belum masuk
      return;
    }

    setIsAdding(true);
    try {
      if (isInWatchlist) {
        // Hapus dari watchlist
        await api.delete(`/watchlist/${id}`);
        setIsInWatchlist(false);
      } else {
        // Tambah ke watchlist
        await api.post('/watchlist', {
          movie_id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          rating: movie.vote_average,
          year: (movie.release_date || movie.first_air_date)?.split('-')[0]
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error("Gagal memperbarui watchlist:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading detail...</div>;
  if (!movie) return <div className="min-h-screen flex items-center justify-center">Movie not found (404)</div>;

  return (
    <div className="min-h-screen pb-16 bg-[#F7F3EF] dark:bg-[#151515] transition-colors duration-300">
      
      {/* 1. Backdrop Image */}
      <div className="relative w-full h-[50vh] bg-surface">
        <img 
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F3EF] dark:from-[#151515] to-transparent"></div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* 2. Poster Movie */}
        <div className="w-[200px] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-grow md:pt-10">
          {/* 3. Judul Movie */}
          <h1 className="text-4xl font-bold text-[#1F2937] dark:text-[#F3F4F6] mb-4">
            {movie.title || movie.name}
          </h1>

          <div className="flex items-center gap-3 text-sm font-medium text-[#6B7280] dark:text-[#A1A1AA] mb-6">
            {/* 4. Film Rating */}
            <span className="text-yellow-500 font-bold">★ {movie.vote_average?.toFixed(1)}</span>
            <span>•</span>
            {/* 5. Age Rating */}
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {movie.age_rating || 'PG-13'}
            </span>
            <span>•</span>
            {/* 6. Durasi Film */}
            <span>{formatRuntime(movie.runtime)}</span>
          </div>

          {/* 7. Sinopsis */}
          <p className="text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed mb-8 max-w-3xl">
            {movie.overview}
          </p>

          <div className="flex gap-4">
            {/* 8. Tombol Watch Trailer */}
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-semibold transition">
              ▶ Watch Trailer
            </button>
            
            {/* 9. Tombol Add to Watchlist (Dinamic dengan Animasi) */}
            <button 
              onClick={handleWatchlist}
              disabled={isAdding}
              className={`
                px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 
                active:scale-95 shadow-sm 
                ${isInWatchlist 
                  ? 'bg-blue-500/10 text-blue-600 border border-blue-500/50 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30' 
                  : 'border border-[#6B7280] dark:border-[#A1A1AA] text-[#1F2937] dark:text-[#F3F4F6] hover:bg-black/5 dark:hover:bg-white/5'
                }
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {isAdding ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : isInWatchlist ? (
                <>
                  {/* UBAH: Tampilan saat sudah ada di watchlist */}
                  <span className="scale-110 transition-transform duration-300">👁️</span>
                  <span>Sudah Ditonton</span>
                </>
              ) : (
                <>
                  {/* Tampilan default (Belum ada di watchlist) */}
                  <span className="text-lg transition-transform duration-300">+</span>
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}