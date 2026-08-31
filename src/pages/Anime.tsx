import React, { useEffect, useState } from 'react';
import { AnimeCard } from '../components/AnimeCard';
import { RssFeed } from '../components/RssFeed';
import { fetchAnime } from '../lib/content';
import { Anime } from '../types/content';

export const AnimePage: React.FC = () => {
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Orca | Anime';
    fetchAnime()
      .then(setAnimeData)
      .catch((err) => console.error('Failed to load anime:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">
          Anime
        </h1>
        <p className="text-sm text-gray-400 font-sans">
          Immerse yourself in legendary mecha battles, fantasy realms, and cyberpunk sagas.
        </p>
      </div>

      {!loading && animeData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animeData.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      {/* RSS Feed Section — configure the feed URL in src/config/feeds.ts */}
      <RssFeed category="anime" title="Latest Anime News" />
    </div>
  );
};
