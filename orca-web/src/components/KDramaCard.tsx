import React from 'react';
import { Star, Tv } from 'lucide-react';
import { KDrama } from '../types/content';

interface KDramaCardProps {
  kdrama: KDrama;
  onSelect?: (kdrama: KDrama) => void;
}

export const KDramaCard: React.FC<KDramaCardProps> = ({ kdrama, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(kdrama)}
      className="neo-card overflow-hidden group cursor-pointer flex flex-col justify-between h-full transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
        <img
          src={kdrama.poster}
          alt={kdrama.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full btn-glass text-xs font-mono font-semibold flex items-center space-x-1 text-amber-300">
          <Star className="w-3 h-3 fill-amber-300" />
          <span>{kdrama.rating.toFixed(1)}</span>
        </div>

        {/* KDrama Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 border border-rose-500/30 text-rose-200 backdrop-blur-md">
          KDRAMA
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-white font-sans truncate group-hover:text-rose-300 transition-colors">
            {kdrama.title}
          </h3>

          <div className="flex items-center space-x-2 pt-1 text-[11px] font-mono text-gray-400">
            <span className="flex items-center space-x-1">
              <Tv className="w-3 h-3 text-rose-400" />
              <span>{kdrama.episodes} EP</span>
            </span>
            {kdrama.network && (
              <>
                <span>•</span>
                <span className="text-gray-400">{kdrama.network}</span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
          {kdrama.description}
        </p>
      </div>
    </div>
  );
};
