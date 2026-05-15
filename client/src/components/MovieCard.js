export default function MovieCard({ title, rating, year, poster }) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${poster}`;

  return (
    <div className="group min-w-[140px] md:min-w-[180px] cursor-pointer">
      <div className="w-full h-[210px] md:h-[270px] bg-surface rounded-[20px] overflow-hidden relative transition-all duration-300 group-hover:-translate-y-1.5 border border-white/5">
        {/* Gambar Poster Asli */}
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">▶</div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm md:text-base font-medium text-text-main truncate">{title}</h3>
        <div className="flex items-center gap-2 text-[12px] text-text-secondary mt-1">
          <span className="text-yellow-500">★ {rating}</span>
          <span>{year}</span>
        </div>
      </div>
    </div>
  );
}