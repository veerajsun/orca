import React, { useEffect, useState } from 'react';
import { Rss, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { CATEGORY_FEEDS, FeedCategory } from '../config/feeds';

interface RssItem {
  id: string;
  title: string;
  link: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
  category: string;
}

interface RssFeedProps {
  category: FeedCategory;
  title?: string;
  limit?: number;
}

export const RssFeed: React.FC<RssFeedProps> = ({ category, title = 'Latest Updates', limit = 6 }) => {
  const feedUrl = CATEGORY_FEEDS[category];

  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedUrl) return; // No feed configured yet for this category — render nothing.

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Feed request failed');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setItems((data.items || []).slice(0, limit));
      })
      .catch(() => {
        if (!cancelled) setError('Could not load feed right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [feedUrl, limit]);

  // No feed URL configured yet for this category — don't show an empty section.
  if (!feedUrl) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center space-x-2">
        <Rss className="w-5 h-5 text-amber-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans">{title}</h2>
      </div>

      {loading && (
        <div className="neo-card text-center py-12 text-gray-400 font-mono text-sm">
          Loading feed...
        </div>
      )}

      {!loading && error && (
        <div className="neo-card text-center py-12 text-gray-400 font-mono text-sm flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="neo-card text-center py-12 text-gray-400 font-mono text-sm">
          No items in this feed yet.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-card overflow-hidden group flex flex-col h-full transition-all duration-300"
            >
              {item.thumbnail && (
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.category && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-200 backdrop-blur-md border border-white/10 uppercase">
                      {item.category}
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-2">
                  {item.publishedAt && (
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  <h3 className="font-bold text-base text-white font-sans line-clamp-2 group-hover:text-amber-200 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-gray-300 group-hover:text-white">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};
