import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types/content';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(movie)}
      className="neo-card overflow-hidden group cursor-pointer flex flex-col justify-between h-full transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full btn-glass text-xs font-mono font-semibold flex items-center space-x-1 text-amber-300">
          <Star className="w-3 h-3 fill-amber-300" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-white font-sans truncate group-hover:text-amber-200 transition-colors">
            {movie.title}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-gray-400">
            {movie.genres.map((g) => (
              <span key={g} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 uppercase">
                {g}
              </span>
            ))}
            <span className="ml-auto text-gray-500 font-semibold">{movie.year}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
          {movie.description}
        </p>
      </div>
    </div>
  );
};
