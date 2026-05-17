import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlistStatus, setWatchlistStatus] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch Data & Check Status
  useEffect(() => {
    if (!id) return;
    const loadPageData = async () => {
      try {
        const [movieRes, watchlistRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get('/watchlist')
        ]);
        if (movieRes.data.success) setMovie(movieRes.data.data);
        const found = watchlistRes.data.data.find(item => String(item.movie_id) === String(id));
        setWatchlistStatus(found ? (found.status || 'to_watch') : null);
      } catch (err) { console.error("Error loading page:", err); }
      finally { setLoading(false); }
    };
    loadPageData();
  }, [id]);

  const handleWatchlist = async () => {
    if (!localStorage.getItem('token')) return router.push('/login');
    setIsAdding(true);
    try {
      if (!watchlistStatus) {
        await api.post('/watchlist', {
          movie_id: movie.id, title: movie.title || movie.name,
          poster_path: movie.poster_path, rating: movie.vote_average,
          year: movie.release_date?.split('-')[0] || 'N/A', status: 'to_watch'
        });
        setWatchlistStatus('to_watch');
      } else {
        const newStatus = watchlistStatus === 'to_watch' ? 'watched' : 'to_watch';
        await api.put(`/watchlist/${id}`, { status: newStatus });
        setWatchlistStatus(newStatus);
      }
    } catch (err) { console.error(err); }
    finally { setIsAdding(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-medium">Loading...</div>;
  if (!movie) return <div className="min-h-screen flex items-center justify-center">Movie not found</div>;

  const btnStyles = {
    watched: "bg-green-500/10 text-green-600 border-green-500/30",
    to_watch: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    default: "border-black/20 dark:border-white/20 text-light-text dark:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
  };

  return (
    <div className="min-h-screen pb-16 bg-[#F7F3EF] dark:bg-[#151515] transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative w-full h-[45vh] bg-surface overflow-hidden">
        <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} className="w-full h-full object-cover opacity-40 scale-105 blur-sm" alt="backdrop" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F3EF] dark:from-[#151515] to-transparent" />
      </div>

      <div className="max-w-[1100px] mx-auto px-6 -mt-32 relative z-10 flex flex-col md:flex-row gap-10">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="w-[220px] rounded-2xl shadow-2xl border border-white/10" alt={movie.title} />
        
        <div className="flex-grow md:pt-12">
          <h1 className="text-4xl font-bold dark:text-white mb-3">{movie.title || movie.name}</h1>
          
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-6">
            <span className="text-yellow-500 font-bold">★ {movie.vote_average?.toFixed(1)}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{movie.age_rating || 'PG-13'}</span>
            <span>•</span>
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
          </div>

          <p className="dark:text-gray-400 leading-relaxed mb-8 max-w-2xl text-justify">{movie.overview}</p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-primary hover:scale-105 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">▶ Watch Trailer</button>
            
            <button 
              onClick={handleWatchlist} disabled={isAdding}
              className={`px-6 py-3 rounded-xl font-bold border transition-all duration-300 flex items-center gap-2 active:scale-95 disabled:opacity-50 ${btnStyles[watchlistStatus] || btnStyles.default}`}
            >
              {isAdding ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : 
               watchlistStatus === 'watched' ? '✓ Watched' : watchlistStatus === 'to_watch' ? '👁️ Mark Watched' : '+ Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}