import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { NewsItem } from '../types/content';

interface NewsCardProps {
  news: NewsItem;
  onReadMore?: (news: NewsItem) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onReadMore }) => {
  return (
    <div className="neo-card overflow-hidden group flex flex-col sm:flex-row h-full transition-all duration-300">
      <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-black/40">
        <img
          src={news.thumbnail}
          alt={news.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-200 backdrop-blur-md border border-white/10 uppercase">
          {news.category}
        </div>
      </div>

      <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400">
            <span>{news.publishedAt}</span>
            {news.readTime && (
              <>
                <span>•</span>
                <span className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{news.readTime}</span>
                </span>
              </>
            )}
          </div>

          <h3 className="font-bold text-lg text-white font-sans line-clamp-2 group-hover:text-amber-200 transition-colors leading-snug">
            {news.title}
          </h3>

          <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
            {news.description}
          </p>
        </div>

        <div>
          <button
            onClick={() => onReadMore?.(news)}
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-gray-300 hover:text-white group/btn"
          >
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
