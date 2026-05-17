import { useState, useEffect } from 'react';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';

const GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 27, name: 'Horror' }, { id: 10749, name: 'Romance' }
];

export default function Genres() {
  const [selectedGenre, setSelectedGenre] = useState(28);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchByGenre = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies?genre=${selectedGenre}`);
        if (res.data.success) setMovies(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchByGenre();
  }, [selectedGenre]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 min-h-screen bg-light-bg dark:bg-[#151515]">
      <h1 className="text-3xl font-bold mb-6">Browse by Genre</h1>
      
      {/* Genre Selector Chips */}
      <div className="flex flex-wrap gap-3 mb-10">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedGenre === genre.id 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-blac  k/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">Loading {GENRES.find(g => g.id === selectedGenre).name}...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              rating={movie.vote_average?.toFixed(1)}
              year={movie.release_date?.split('-')[0]}
              poster={movie.poster_path}
            />
          ))}
        </div>
      )}
    </div>
  );
}