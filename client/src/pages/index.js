import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies/trending');
        if (res.data.success) {
          setTrending(res.data.data);
          setFeatured(res.data.data[0]); 
        }
      } catch (error) {
        console.error("Gagal memuat film:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="w-full pb-10">
      {/* HERO SECTION */}
      {featured && (
        <section className="relative w-full h-[85vh] bg-[#151515] dark:bg-[#151515] light:bg-light-bg overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 z-0"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})` }}
          ></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] dark:from-[#151515] light:from-light-bg via-[#151515]/70 dark:via-[#151515]/70 light:via-light-bg/70 to-black/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 hidden md:block"></div>
          
          <div className="relative max-w-[1440px] mx-auto w-full h-full z-20 flex flex-col justify-end">
            <div className="p-6 md:p-16 md:pl-8 w-full md:w-2/3">
              <span className="text-[#C44536] font-medium tracking-widest text-xs mb-2 block">FEATURED</span>
              
              {/* Teks Hero selalu dipaksa putih agar kontras dengan gambar */}
              <h1 className="text-4xl md:text-[64px] leading-tight md:leading-[1.1] font-semibold mb-4 text-white tracking-[-2px] line-clamp-3">
                {featured.title || featured.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-300 mb-6">
                <span className="flex items-center gap-1"><span className="text-yellow-500">★</span> {featured.vote_average?.toFixed(1)}</span>
                <span>{(featured.release_date || featured.first_air_date)?.split('-')[0]}</span>
              </div>

              <p className="text-gray-400 text-sm md:text-base mb-8 max-w-xl line-clamp-3 leading-relaxed">
                {featured.overview}
              </p>
              
              <div className="flex gap-4">
                {/* Tombol Watch Trailer dengan SVG Professional */}
                <button className="bg-[#C44536] hover:bg-[#D85646] text-white px-8 py-3.5 rounded-[14px] font-medium transition text-base flex items-center gap-2 shadow-[0_4px_14px_rgba(196,69,54,0.3)]">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BAGIAN KONTEN */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-12 md:mt-16 text-light-text dark:text-[#F3F4F6]">
        
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] md:text-[28px] font-semibold">Trending Now</h2>
            <span className="text-[#C44536] text-xs md:text-sm font-medium cursor-pointer hover:underline">View All</span>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x">
            {trending.slice(0, 10).map((movie) => (
              <MovieCard 
                key={movie.id}
                title={movie.title || movie.name}
                rating={movie.vote_average?.toFixed(1)}
                year={(movie.release_date || movie.first_air_date)?.split('-')[0]}
                poster={movie.poster_path}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] md:text-[28px] font-semibold">Recommended for You</h2>
            <span className="text-[#C44536] text-xs md:text-sm font-medium cursor-pointer hover:underline">View All</span>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x">
            {trending.slice(10, 20).map((movie) => (
              <MovieCard 
                key={movie.id}
                title={movie.title || movie.name}
                rating={movie.vote_average?.toFixed(1)}
                year={(movie.release_date || movie.first_air_date)?.split('-')[0]}
                poster={movie.poster_path}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}