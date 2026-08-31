import React, { useEffect, useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { SeriesCard } from '../components/SeriesCard';
import { RssFeed } from '../components/RssFeed';
import { fetchSeries } from '../lib/content';
import { Series as SeriesType } from '../types/content';

export const Series: React.FC = () => {
  const [seriesData, setSeriesData] = useState<SeriesType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Orca | Series';
    fetchSeries()
      .then(setSeriesData)
      .catch((err) => console.error('Failed to load series:', err))
      .finally(() => setLoading(false));
  }, []);

  const heroSeries = seriesData.length > 0 ? (seriesData.find((s) => s.id === 's-hero') || seriesData[0]) : null;
  const otherSeries = heroSeries ? seriesData.filter((s) => s.id !== heroSeries.id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">

      {!loading && heroSeries && (
        <>
          {/* Featured Series Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 neo-card min-h-[420px] flex items-end p-6 sm:p-12">
            <div className="absolute inset-0 z-0">
              <img
                src={heroSeries.banner || heroSeries.poster}
                alt={heroSeries.title}
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-white/15 text-white font-semibold uppercase tracking-wider backdrop-blur-md">
                  NEW EPISODE
                </span>
                <span className="text-gray-300">{heroSeries.genres.join(' • ')}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-sans uppercase">
                {heroSeries.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                {heroSeries.description}
              </p>

              <div className="flex items-center space-x-4 pt-2">
                <button className="px-6 py-3 rounded-full btn-glass-primary font-mono text-xs tracking-wider flex items-center space-x-2">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Watch Now</span>
                </button>

                <button className="px-6 py-3 rounded-full btn-glass font-mono text-xs tracking-wider text-gray-300 hover:text-white flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {otherSeries.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                All Series & Originals
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherSeries.map((series) => (
                  <SeriesCard key={series.id} series={series} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!heroSeries && !loading && (
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">
            Series
          </h1>
        </div>
      )}

      {/* RSS Feed Section — configure the feed URL in src/config/feeds.ts */}
      <RssFeed category="series" title="Latest Series News" />
    </div>
  );
};
