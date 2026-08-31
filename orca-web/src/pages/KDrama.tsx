import React, { useEffect, useState } from 'react';
import { KDramaCard } from '../components/KDramaCard';
import { RssFeed } from '../components/RssFeed';
import { fetchKDrama } from '../lib/content';
import { KDrama } from '../types/content';

export const KDramaPage: React.FC = () => {
  const [kdramaData, setKdramaData] = useState<KDrama[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Orca | KDrama';
    fetchKDrama()
      .then(setKdramaData)
      .catch((err) => console.error('Failed to load kdrama:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">
          KDrama
        </h1>
        <p className="text-sm text-gray-400 font-sans">
          Top rated Korean dramas, suspense thrillers, romance, and historical fantasies.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 neo-card text-gray-400 font-mono text-sm">
          Loading KDramas...
        </div>
      ) : kdramaData.length === 0 ? (
        <div className="text-center py-20 neo-card text-gray-400 font-mono text-sm">
          No KDramas added yet. Add some from the admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kdramaData.map((kdrama) => (
            <KDramaCard key={kdrama.id} kdrama={kdrama} />
          ))}
        </div>
      )}

      {/* RSS Feed Section — configure the feed URL in src/config/feeds.ts */}
      <RssFeed category="kdrama" title="Latest KDrama News" />
    </div>
  );
};
