import Image from 'next/image';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MovieCard = dynamic(() => import('@/components/MovieCard'), {
  ssr: false, // Menunda render komponen ini di server
  loading: () => (
    // Skeleton Placeholder untuk MovieCard
    <div className="min-w-[150px] md:min-w-[180px] aspect-[2/3] bg-black/10 dark:bg-white/5 animate-pulse rounded-2xl flex-shrink-0"></div>
  )
});

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState(null);
  
  // State untuk Modal Trailer
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

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

  // Fungsi untuk memanggil dan menampilkan trailer
  const handleWatchTrailer = async () => {
    if (trailerKey) {
      setShowTrailer(true);
      return;
    }
    
    setIsLoadingTrailer(true);
    try {
      const res = await api.get(`/movies/${featured.id}`);
      if (res.data.success) {
        const videos = res.data.data.videos?.results || [];
        const trailer = videos.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
        
        if (trailer) {
          setTrailerKey(trailer.key);
          setShowTrailer(true);
        } else {
          alert("Trailer tidak tersedia untuk film ini.");
        }
      }
    } catch (error) {
      console.error("Gagal mengambil trailer:", error);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  return (
    <div className="w-full pb-10">
      
      {/* HERO SECTION DENGAN SKELETON LOADER UNTUK MENGATASI CLS */}
      {!featured ? (
        /* SKELETON PLACEHOLDER: WAJIB sama tingginya h-[85vh] */
        <section className="relative w-full h-[85vh] bg-[#151515] dark:bg-[#151515] light:bg-light-bg overflow-hidden flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 border-4 border-[#C44536]/20 border-t-[#C44536] rounded-full animate-spin"></div>
        </section>
      ) : (
        /* HERO ASLI (Muncul setelah data ada) */
        <section className="relative w-full h-[85vh] bg-[#151515] dark:bg-[#151515] light:bg-light-bg overflow-hidden">
          
          {/* PENGGANTI BACKGROUND IMAGE: Gunakan next/image dengan priority dan resolusi w1280 */}
          <div className="absolute inset-0 z-0">
            <Image 
              src={`https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`}
              alt={featured.title || featured.name || "Featured Movie"}
              fill
              priority // <-- Memaksa browser memuat ini di urutan paling pertama (Mengatasi LCP)
              sizes="100vw"
              className="object-cover object-center transition-opacity duration-1000"
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-light-bg/90 via-light-bg/20 to-transparent dark:from-background dark:via-background/80 dark:to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-light-bg/60 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent z-10 hidden md:block"></div>

          <div className="relative max-w-[1440px] mx-auto w-full h-full z-20 flex flex-col justify-end">
            <div className="p-6 md:p-16 md:pl-8 w-full md:w-2/3">
              <span className="text-[#C44536] font-medium tracking-widest text-xs mb-2 block">FEATURED</span>
              
              {/* Judul: text-light-text (hitam/gelap) saat terang, text-white saat gelap */}
              <h1 className="text-4xl md:text-[64px] leading-tight md:leading-[1.1] font-bold mb-4 text-light-text dark:text-white tracking-[-2px] line-clamp-3">
                {featured.title || featured.name}
              </h1>
              
              <div className="flex items-center gap-4 text-xs md:text-sm font-medium text-light-text-secondary dark:text-text-secondary mb-6">
                <span className="flex items-center gap-1"><span className="text-yellow-500">★</span> {featured.vote_average?.toFixed(1)}</span>
                <span>•</span>
                <span>{(featured.release_date || featured.first_air_date)?.split('-')[0]}</span>
              </div>

              <p className="text-light-text-secondary dark:text-text-secondary text-sm md:text-base mb-8 max-w-xl line-clamp-3 leading-relaxed">
                {featured.overview}
              </p>
              
              <div className="flex gap-4">
                {/* Tombol Watch Trailer Diperbarui */}
                <button 
                  onClick={handleWatchTrailer}
                  disabled={isLoadingTrailer}
                  className="bg-[#C44536] hover:bg-[#D85646] text-white px-8 py-3.5 rounded-[14px] font-medium transition text-base flex items-center gap-2 shadow-[0_4px_14px_rgba(196,69,54,0.3)] disabled:opacity-70 disabled:cursor-wait"
                >
                  {isLoadingTrailer ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                  {isLoadingTrailer ? 'Loading...' : 'Watch Trailer'}
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
            <Link 
              href="/trending" 
              className="text-primary hover:text-red-500 text-sm font-semibold transition-colors flex items-center gap-1 group"
            >
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x">
            {trending.slice(0, 10).map((movie) => (
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
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] md:text-[28px] font-semibold">Recommended for You</h2>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x">
            {trending.slice(10, 20).map((movie) => (
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
        </section>
      </div>

      {/* --- MODAL POP-UP TRAILER HERO --- */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
          
          {/* Area gelap untuk menutup pop-up */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setShowTrailer(false)}
            title="Click outside to close"
          ></div>
          
          <div className="w-full max-w-5xl aspect-video relative animate-fadeIn z-10">
            <button 
              onClick={() => setShowTrailer(false)} 
              className="absolute -top-10 right-0 md:-right-4 text-white/70 hover:text-white font-bold text-sm md:text-lg flex items-center gap-2 transition bg-black/50 px-3 py-1 rounded-lg z-20"
            >
              ✕ Close
            </button>
            
            <iframe
              className="w-full h-full rounded-2xl shadow-2xl border border-white/10 relative z-20"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}