import Image from 'next/image';
import Link from 'next/link'; 

export default function MovieCard({ id, title, rating, year, poster }) {
  const imageUrl = poster 
    ? `https://image.tmdb.org/t/p/w500${poster}`
    : '/api/placeholder/180/270';

  return (
     <Link href={`/movies/${id}`} className="flex flex-col gap-2 min-w-[150px] md:min-w-[180px] group cursor-pointer snap-start">
      <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-white/5">
        <Image 
          src={`https://image.tmdb.org/t/p/w500${poster}`} 
          alt={title}
          fill
          sizes="(max-width: 768px) 150px, 180px" // Sangat penting agar ukuran download efisien!
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">▶</div>
        </div>
      </div>
      
      <div className="mt-3">
        {/* Teks Judul: text-light-text (Gelap/Light Mode) & dark:text-text-main (Terang/Dark Mode) */}
        <h3 className="text-sm md:text-base font-medium text-light-text dark:text-text-main truncate">
          {title}
        </h3>
        
        {/* Teks Tahun & Genre: text-light-text-secondary (Abu gelap) & dark:text-text-secondary (Abu terang) */}
        <div className="flex items-center gap-2 text-[12px] text-light-text-secondary dark:text-text-secondary mt-1">
          <span className="text-yellow-500">★ {rating}</span>
          <span>{year}</span>
        </div>
      </div>
    </Link>
  );
}