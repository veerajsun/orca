import React, { useEffect, useState } from 'react';
import { Lock, Film, Tv, Sparkles, Clapperboard, Mic } from 'lucide-react';
import { AdminManager, FieldConfig } from '../components/admin/AdminManager';
import {
  fetchMovies,
  fetchSeries,
  fetchAnime,
  fetchKDrama,
  fetchAllPodcastsAdmin,
  upsertMovie,
  upsertSeries,
  upsertAnime,
  upsertKDrama,
  upsertPodcast,
  deleteItem,
} from '../lib/content';

type Tab = 'movies' | 'series' | 'anime' | 'kdrama' | 'podcasts';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
  { id: 'series', label: 'Series', icon: <Tv className="w-4 h-4" /> },
  { id: 'anime', label: 'Anime', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'kdrama', label: 'KDrama', icon: <Clapperboard className="w-4 h-4" /> },
  { id: 'podcasts', label: 'Podcasts', icon: <Mic className="w-4 h-4" /> },
];

const movieFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'poster', label: 'Poster URL', type: 'text', required: true },
  { key: 'rating', label: 'Rating (0-5)', type: 'number' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'genres', label: 'Genres (comma separated)', type: 'csv', placeholder: 'SCI-FI, THRILLER' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'duration', label: 'Duration', type: 'text', placeholder: '2h 15m' },
  { key: 'director', label: 'Director', type: 'text' },
];

const seriesFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'poster', label: 'Poster URL', type: 'text', required: true },
  { key: 'banner', label: 'Banner URL (optional)', type: 'text' },
  { key: 'rating', label: 'Rating (0-5)', type: 'number' },
  { key: 'seasons', label: 'Seasons', type: 'number' },
  { key: 'episodes', label: 'Episodes', type: 'number' },
  { key: 'genres', label: 'Genres (comma separated)', type: 'csv' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'isNewEpisode', label: 'New Episode?', type: 'checkbox' },
  { key: 'status', label: 'Status', type: 'text', placeholder: 'Completed / Renewed / Season 3 Now Airing' },
];

const animeFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'poster', label: 'Poster URL', type: 'text', required: true },
  { key: 'rating', label: 'Rating (0-5)', type: 'number' },
  { key: 'episodes', label: 'Episodes', type: 'number' },
  { key: 'genres', label: 'Genres (comma separated)', type: 'csv' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'studio', label: 'Studio', type: 'text' },
];

const kdramaFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'poster', label: 'Poster URL', type: 'text', required: true },
  { key: 'rating', label: 'Rating (0-5)', type: 'number' },
  { key: 'episodes', label: 'Episodes', type: 'number' },
  { key: 'genres', label: 'Genres (comma separated)', type: 'csv' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'network', label: 'Network', type: 'text' },
];

const podcastFields: FieldConfig[] = [
  { key: 'title', label: 'Episode Title', type: 'text', required: true },
  { key: 'podcastName', label: 'Podcast Name', type: 'text', required: true },
  { key: 'coverImage', label: 'Cover Image URL', type: 'text', required: true },
  { key: 'episodeNumber', label: 'Episode Number', type: 'number' },
  { key: 'duration', label: 'Duration', type: 'text', placeholder: '45m' },
  { key: 'category', label: 'Category', type: 'select', options: ['Tech', 'True Crime', 'Design', 'Entertainment', 'All'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'audioUrl', label: 'Audio URL (optional)', type: 'text' },
  { key: 'isFeatured', label: 'Featured on Podcasts page?', type: 'checkbox' },
];

export const AdminPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passErr, setPassErr] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('movies');

  useEffect(() => {
    document.title = 'Orca | Admin';
    if (localStorage.getItem('orca_admin_unlocked') === 'true') {
      setUnlocked(true);
    }
  }, []);

  const checkPasscode = () => {
    const correct = import.meta.env.VITE_ADMIN_PASSCODE as string;
    if (passcodeInput === correct) {
      localStorage.setItem('orca_admin_unlocked', 'true');
      setUnlocked(true);
      setPassErr(false);
    } else {
      setPassErr(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm neo-card p-8 space-y-5 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white font-sans">Admin Access</h1>
          <p className="text-xs text-gray-400 font-sans">Enter the passcode to manage Orca content.</p>
          <input
            type="password"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPasscode()}
            placeholder="Passcode"
            className="w-full bg-[#141313] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white text-center placeholder-gray-500 focus:outline-none focus:border-white/30"
          />
          {passErr && <p className="text-xs text-red-400 font-mono">Incorrect passcode.</p>}
          <button
            onClick={checkPasscode}
            className="w-full px-4 py-2.5 rounded-full bg-white text-black text-sm font-mono font-semibold hover:bg-gray-200 transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">Orca Admin</h1>
        <p className="text-sm text-gray-400 font-sans">Add, edit, or remove content across all categories.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all ${
              activeTab === tab.id
                ? 'bg-white text-black font-semibold'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {activeTab === 'movies' && (
        <AdminManager
          title="Movies"
          fields={movieFields}
          fetchAll={fetchMovies}
          upsert={upsertMovie}
          remove={(id) => deleteItem('movies', id)}
        />
      )}
      {activeTab === 'series' && (
        <AdminManager
          title="Series"
          fields={seriesFields}
          fetchAll={fetchSeries}
          upsert={upsertSeries}
          remove={(id) => deleteItem('series', id)}
        />
      )}
      {activeTab === 'anime' && (
        <AdminManager
          title="Anime"
          fields={animeFields}
          fetchAll={fetchAnime}
          upsert={upsertAnime}
          remove={(id) => deleteItem('anime', id)}
        />
      )}
      {activeTab === 'kdrama' && (
        <AdminManager
          title="KDrama"
          fields={kdramaFields}
          fetchAll={fetchKDrama}
          upsert={upsertKDrama}
          remove={(id) => deleteItem('kdrama', id)}
        />
      )}
      {activeTab === 'podcasts' && (
        <AdminManager
          title="Podcasts"
          fields={podcastFields}
          fetchAll={fetchAllPodcastsAdmin}
          upsert={upsertPodcast}
          remove={(id) => deleteItem('podcasts', id)}
          posterKey="coverImage"
        />
      )}
    </div>
  );
};
