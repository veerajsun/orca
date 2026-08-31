import React from 'react';
import { Star, Tv } from 'lucide-react';
import { Series } from '../types/content';

interface SeriesCardProps {
  series: Series;
  onSelect?: (series: Series) => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({ series, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(series)}
      className="neo-card overflow-hidden group cursor-pointer flex flex-col justify-between h-full transition-all duration-300"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <img
          src={series.poster}
          alt={series.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-90" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full btn-glass text-xs font-mono font-semibold flex items-center space-x-1 text-amber-300">
          <Star className="w-3 h-3 fill-amber-300" />
          <span>{series.rating.toFixed(1)}</span>
        </div>

        {/* Status Badge */}
        {series.status && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-200 backdrop-blur-md">
            {series.status}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white font-sans truncate group-hover:text-blue-300 transition-colors">
              {series.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2 pt-1 text-[11px] font-mono text-gray-400">
            <span className="flex items-center space-x-1">
              <Tv className="w-3 h-3 text-gray-500" />
              <span>{series.seasons} {series.seasons === 1 ? 'Season' : 'Seasons'}</span>
            </span>
            <span>•</span>
            <span className="text-gray-400">{series.genres.join(', ')}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
          {series.description}
        </p>
      </div>
    </div>
  );
};
