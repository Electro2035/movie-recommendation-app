import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query; // Menangkap query 'q' dari URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Asumsi backend memiliki endpoint pencarian: /movies/search?q=...
        const res = await api.get(`/movies/search?q=${q}`);
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (error) {
        console.error("Gagal melakukan pencarian:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 min-h-[80vh]">
      <h1 className="text-2xl md:text-4xl font-bold text-light-text dark:text-text-main mb-8">
        Search Results for <span className="text-primary">"{q}"</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : movies.length > 0 ? (
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
      ) : (
        <div className="text-center py-20 bg-white/50 dark:bg-surface rounded-2xl border border-black/5 dark:border-white/5">
          <p className="text-light-text-secondary dark:text-text-secondary text-lg">
            No movies found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}