import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCw } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { RssFeed } from '../components/RssFeed';
import { fetchMovies } from '../lib/content';
import { Movie } from '../types/content';

export const Movies: React.FC = () => {
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    document.title = 'Orca | Movies';
    fetchMovies()
      .then(setMoviesData)
      .catch((err) => console.error('Failed to load movies:', err))
      .finally(() => setLoading(false));
  }, []);

  const genresList = ['All', 'SCI-FI', 'THRILLER', 'ACTION', 'CYBERPUNK', 'HORROR', 'FANTASY', 'DRAMA'];
  const yearsList = ['All', '2024', '2023', '2022'];

  const filteredMovies = useMemo(() => {
    return moviesData.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.director?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = selectedGenre === 'All' || m.genres.includes(selectedGenre);
      const matchesYear = selectedYear === 'All' || m.year.toString() === selectedYear;
      const matchesRating = selectedRating === 'All' || (selectedRating === '4.5+' && m.rating >= 4.5);

      return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });
  }, [moviesData, searchTerm, selectedGenre, selectedYear, selectedRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">
          Movies
        </h1>
        <p className="text-sm text-gray-400 font-sans">
          Explore cinematic blockbusters, sci-fi epics, and indie thrillers.
        </p>
      </div>

      {/* Filter Control Bar matching Screenshot */}
      <div className="neo-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search titles, directors, actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141313] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs font-sans text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-[#141313] border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Genre: All</option>
            {genresList.filter(g => g !== 'All').map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#141313] border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Year: All</option>
            {yearsList.filter(y => y !== 'All').map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-[#141313] border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">Rating: All</option>
            <option value="4.5+">Rating: 4.5+</option>
          </select>

          <button className="p-2.5 rounded-full btn-glass text-gray-400 hover:text-white">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-20 neo-card text-gray-400 font-mono text-sm">
          Loading movies...
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-20 neo-card text-gray-400 font-mono text-sm">
          No movies match your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMovies.slice(0, visibleCount).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredMovies.length && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-8 py-3 rounded-full btn-glass text-xs font-mono tracking-widest text-gray-300 hover:text-white flex items-center space-x-2"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>LOAD MORE MOVIES</span>
          </button>
        </div>
      )}

      {/* RSS Feed Section — configure the feed URL in src/config/feeds.ts */}
      <RssFeed category="movies" title="Latest Movie News" />
    </div>
  );
};
