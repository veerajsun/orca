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
  sourceFeed?: string; // which feed title this came from, useful when merging multiple feeds
}

interface RssFeedProps {
  category: FeedCategory;
  title?: string;
  limit?: number;
}

export const RssFeed: React.FC<RssFeedProps> = ({ category, title = 'Latest Updates', limit = 9 }) => {
  const feedUrls = CATEGORY_FEEDS[category] || [];

  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!feedUrls.length) return; // No feeds configured yet for this category — render nothing.

    let cancelled = false;
    setLoading(true);
    setError(null);

    // Fetch every configured feed for this category in parallel, then merge & sort by date.
    Promise.allSettled(
      feedUrls.map((url) =>
        fetch(`/api/rss?url=${encodeURIComponent(url)}`).then((res) => {
          if (!res.ok) throw new Error('Feed request failed');
          return res.json();
        })
      )
    )
      .then((results) => {
        if (cancelled) return;

        const merged: RssItem[] = [];
        let anySucceeded = false;

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            anySucceeded = true;
            const feedItems: RssItem[] = (result.value.items || []).map((it: any) => ({
              ...it,
              sourceFeed: result.value.feedTitle || '',
            }));
            merged.push(...feedItems);
          }
        });

        if (!anySucceeded && feedUrls.length > 0) {
          setError('Could not load feeds right now.');
          setItems([]);
          return;
        }

        // De-duplicate (same story sometimes appears in multiple feeds) by link, then sort newest first.
        const seen = new Set<string>();
        const deduped = merged.filter((it) => {
          if (seen.has(it.link)) return false;
          seen.add(it.link);
          return true;
        });

        deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        setItems(deduped.slice(0, limit));
      })
      .catch(() => {
        if (!cancelled) setError('Could not load feeds right now.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(feedUrls), limit]);

  // No feeds configured yet for this category — don't show an empty section.
  if (!feedUrls.length) return null;

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
              key={item.id + item.link}
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
                      {item.sourceFeed && <span className="text-gray-600">• {item.sourceFeed}</span>}
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
