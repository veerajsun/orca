import React from 'react';
import { Play, Plus, Clock } from 'lucide-react';
import { Podcast } from '../types/content';

interface PodcastCardProps {
  podcast: Podcast;
  onPlay?: (podcast: Podcast) => void;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, onPlay }) => {
  return (
    <div className="neo-card p-4 group flex flex-col justify-between h-full transition-all duration-300">
      <div className="space-y-4">
        {/* Cover Image Container */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40">
          <img
            src={podcast.coverImage}
            alt={podcast.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-gray-200 backdrop-blur-md border border-white/10 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{podcast.duration}</span>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400">
            <span>Ep {podcast.episodeNumber}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{podcast.category}</span>
          </div>

          <h3 className="font-bold text-lg text-white font-sans pt-1 truncate group-hover:text-emerald-300 transition-colors">
            {podcast.title}
          </h3>

          <p className="text-xs text-gray-400 font-sans line-clamp-2 pt-1 leading-relaxed">
            {podcast.description}
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
        <button
          onClick={() => onPlay?.(podcast)}
          className="p-2.5 rounded-full btn-glass text-white hover:text-emerald-400 flex items-center justify-center"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </button>

        <button className="p-2.5 rounded-full btn-glass text-gray-400 hover:text-white">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
