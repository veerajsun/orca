import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { PodcastCard } from '../components/PodcastCard';
import { RssFeed } from '../components/RssFeed';
import { fetchPodcasts } from '../lib/content';
import { Podcast } from '../types/content';

export const PodcastPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [featuredPodcast, setFeaturedPodcast] = useState<Podcast | null>(null);
  const [podcastsData, setPodcastsData] = useState<Podcast[]>([]);

  useEffect(() => {
    document.title = 'Orca | Podcasts';
    fetchPodcasts()
      .then(({ featured, list }) => {
        setFeaturedPodcast(featured);
        setPodcastsData(list);
      })
      .catch((err) => console.error('Failed to load podcasts:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPodcasts = podcastsData.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-400 font-mono text-sm">
        Loading podcasts...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Header & Category Chips */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">
            Podcasts
          </h1>
          <p className="text-sm text-gray-400 font-sans max-w-xl leading-relaxed">
            Immersive audio experiences. Deep dives into cinematic soundscapes and compelling narratives.
          </p>
        </div>

        {/* Filter Chips */}
        {podcastsData.length > 0 && (
          <div className="flex items-center space-x-2 font-mono text-xs">
            {['All', 'True Crime', 'Tech'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === cat
                    ? 'btn-glass-primary text-white font-semibold'
                    : 'btn-glass text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Audio Player Banner */}
      {featuredPodcast && (
        <div className="neo-card p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Left Album Cover */}
          <div className="relative aspect-square w-full md:w-64 rounded-xl overflow-hidden bg-black/50 flex-shrink-0 shadow-2xl">
            <img
              src={featuredPodcast.coverImage}
              alt={featuredPodcast.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white backdrop-blur-md">
              Orca | Podcasts
            </div>
          </div>

          {/* Right Details & Player */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                FEATURED
              </span>
              <span>Episode {featuredPodcast.episodeNumber}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              {featuredPodcast.title}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
              {featuredPodcast.description}
            </p>

            {/* Interactive Player Controls Bar */}
            <div className="neo-inset p-4 rounded-xl flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full btn-glass-primary text-white hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Progress Bar */}
              <div className="flex-1 space-y-1">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: isPlaying ? '45%' : '28%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>12:45</span>
                  <span>{featuredPodcast.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podcast Grid — only shown once real episodes exist */}
      {filteredPodcasts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">
            All Episodes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </section>
      )}

      {/* RSS Feed Section — configure the feed URL in src/config/feeds.ts */}
      <RssFeed category="podcast" title="Latest Podcast Episodes" />
    </div>
  );
};
