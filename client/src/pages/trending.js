import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Ganti endpoint ini sesuai dengan route di backend kamu
        const res = await api.get('/movies/trending'); 
        if (res.data.success) setMovies(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTrending();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 min-h-screen bg-light-bg dark:bg-[#151515]">
      <h1 className="text-3xl font-bold mb-2">Trending Movies</h1>
      <p className="text-gray-500 mb-8">Most watched movies this week.</p>

      {loading ? (
        <div className="flex justify-center py-20 animate-pulse text-primary font-medium">Loading Trending...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title || movie.name}
              rating={movie.vote_average?.toFixed(1)}
              year={(movie.release_date || movie.first_air_date)?.split('-')[0]}
              poster={movie.poster_path}
            />
          ))}
        </div>
      )}
    </div>
  );
}