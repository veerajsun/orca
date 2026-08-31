import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { Hero } from '../components/Hero';
import { MovieCard } from '../components/MovieCard';
import { SeriesCard } from '../components/SeriesCard';
import { AnimeCard } from '../components/AnimeCard';
import { NewsCard } from '../components/NewsCard';
import { fetchMovies, fetchSeries, fetchAnime } from '../lib/content';
import { newsData } from '../data/news';
import { Movie, Series, Anime } from '../types/content';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stellarVoid, setStellarVoid] = useState<Movie | null>(null);
  const [neonEchoes, setNeonEchoes] = useState<Series | null>(null);
  const [mechaSoul, setMechaSoul] = useState<Anime | null>(null);

  useEffect(() => {
    document.title = 'Orca | Home';

    Promise.all([fetchMovies(), fetchSeries(), fetchAnime()])
      .then(([movies, series, anime]) => {
        setStellarVoid(movies.find((m) => m.id === 'm7') || movies[0] || null);
        setNeonEchoes(series.find((s) => s.id === 's1') || series[0] || null);
        setMechaSoul(anime.find((a) => a.id === 'a1') || anime[0] || null);
      })
      .catch((err) => console.error('Failed to load trending content:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16">
      {/* 3D Cinematic Hero */}
      <Hero
        onExploreClick={() => navigate('/movies')}
        onDiscoverClick={() => navigate('/series')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section: Trending Now */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
              Trending Now
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12 neo-card text-gray-400 font-mono text-sm">
              Loading trending content...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stellarVoid && <MovieCard movie={stellarVoid} onSelect={() => navigate('/movies')} />}
              {neonEchoes && <SeriesCard series={neonEchoes} onSelect={() => navigate('/series')} />}
              {/* Custom Docuseries item as seen in screenshot */}
              <div className="neo-card p-4 flex flex-col justify-between group cursor-pointer" onClick={() => navigate('/series')}>
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-black/40">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
                    alt="Aether Worlds"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-gray-200">
                    Docuseries
                  </div>
                </div>
                <div className="pt-3 space-y-1">
                  <h3 className="font-bold text-white text-base">Aether Worlds</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    Explore the theoretical exoplanets that could harbor life in deep space...
                  </p>
                </div>
              </div>
              {mechaSoul && <AnimeCard anime={mechaSoul} onSelect={() => navigate('/anime')} />}
            </div>
          )}
        </section>

        {/* Section: Latest News Feed */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
            Latest News & Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsData.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
