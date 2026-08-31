import React from 'react';
import { Star, Film } from 'lucide-react';
import { Anime } from '../types/content';

interface AnimeCardProps {
  anime: Anime;
  onSelect?: (anime: Anime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(anime)}
      className="neo-card overflow-hidden group cursor-pointer flex flex-col justify-between h-full transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
        <img
          src={anime.poster}
          alt={anime.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full btn-glass text-xs font-mono font-semibold flex items-center space-x-1 text-amber-300">
          <Star className="w-3 h-3 fill-amber-300" />
          <span>{anime.rating.toFixed(1)}</span>
        </div>

        {/* Anime Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 border border-purple-500/30 text-purple-200 backdrop-blur-md">
          ANIME
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-white font-sans truncate group-hover:text-purple-300 transition-colors">
            {anime.title}
          </h3>

          <div className="flex items-center space-x-2 pt-1 text-[11px] font-mono text-gray-400">
            <span className="flex items-center space-x-1">
              <Film className="w-3 h-3 text-purple-400" />
              <span>{anime.episodes} EP</span>
            </span>
            {anime.studio && (
              <>
                <span>•</span>
                <span className="text-gray-400 truncate">{anime.studio}</span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
          {anime.description}
        </p>
      </div>
    </div>
  );
};
