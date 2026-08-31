import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Film, Tv, Radio, Newspaper } from 'lucide-react';
import { fetchMovies, fetchSeries, fetchAnime, fetchKDrama, fetchAllPodcastsAdmin } from '../lib/content';
import { newsData } from '../data/news';
import { SearchResult } from '../types/content';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    Promise.all([fetchMovies(), fetchSeries(), fetchAnime(), fetchKDrama(), fetchAllPodcastsAdmin()])
      .then(([moviesData, seriesData, animeData, kdramaData, podcastsData]) => {
        const results: SearchResult[] = [];

        moviesData.forEach((m) =>
          results.push({
            id: m.id,
            title: m.title,
            category: 'movie',
            image: m.poster,
            subtitle: `${m.year} • ${m.genres.join(', ')}`,
            description: m.description,
          })
        );

        seriesData.forEach((s) =>
          results.push({
            id: s.id,
            title: s.title,
            category: 'series',
            image: s.poster,
            subtitle: `${s.seasons} Seasons • ${s.genres.join(', ')}`,
            description: s.description,
          })
        );

        animeData.forEach((a) =>
          results.push({
            id: a.id,
            title: a.title,
            category: 'anime',
            image: a.poster,
            subtitle: `${a.episodes} EP • ${a.studio || 'Anime'}`,
            description: a.description,
          })
        );

        kdramaData.forEach((k) =>
          results.push({
            id: k.id,
            title: k.title,
            category: 'kdrama',
            image: k.poster,
            subtitle: `${k.episodes} EP • ${k.network || 'KDrama'}`,
            description: k.description,
          })
        );

        podcastsData.forEach((p) =>
          results.push({
            id: p.id,
            title: p.title,
            category: 'podcast',
            image: p.coverImage,
            subtitle: `${p.podcastName} • Ep ${p.episodeNumber}`,
            description: p.description,
          })
        );

        newsData.forEach((n) =>
          results.push({
            id: n.id,
            title: n.title,
            category: 'news',
            image: n.thumbnail,
            subtitle: `News • ${n.publishedAt}`,
            description: n.description,
          })
        );

        setAllResults(results);
      })
      .catch((err) => console.error('Failed to load search data:', err));
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResults.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q);
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      return matchesQuery && matchesCat;
    });
  }, [allResults, query, activeCategory]);

  if (!isOpen) return null;

  const handleSelectResult = (item: SearchResult) => {
    onClose();
    if (item.category === 'movie') navigate('/movies');
    else if (item.category === 'series') navigate('/series');
    else if (item.category === 'anime') navigate('/anime');
    else if (item.category === 'kdrama') navigate('/kdrama');
    else if (item.category === 'podcast') navigate('/podcast');
    else navigate('/');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'movie':
        return <Film className="w-3.5 h-3.5 text-amber-400" />;
      case 'series':
        return <Tv className="w-3.5 h-3.5 text-blue-400" />;
      case 'podcast':
        return <Radio className="w-3.5 h-3.5 text-emerald-400" />;
      case 'news':
        return <Newspaper className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Film className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#181818] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-white/5">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search movies, series, anime, podcasts, news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white font-sans placeholder-gray-500 focus:outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 btn-glass text-xs font-mono text-gray-300">
            Esc
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center space-x-2 overflow-x-auto text-xs font-mono">
          {['all', 'movie', 'series', 'anime', 'kdrama', 'podcast', 'news'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {!query.trim() ? (
            <div className="text-center py-12 text-gray-500 text-sm font-mono">
              Type something to search across Orca...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm font-mono">
              No matching titles or stories found for "{query}".
            </div>
          ) : (
            filteredResults.map((item) => (
              <div
                key={`${item.category}-${item.id}`}
                onClick={() => handleSelectResult(item)}
                className="neo-card p-3 flex items-center space-x-4 cursor-pointer hover:border-white/20 transition-all"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded bg-black/40 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded bg-white/5">{getCategoryIcon(item.category)}</span>
                    <span className="text-xs font-mono text-gray-400 uppercase">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-white font-sans text-sm truncate pt-0.5">{item.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
