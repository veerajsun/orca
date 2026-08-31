import React, { useState, useEffect } from 'react';
import { Film, Tv, Disc, Radio, ArrowLeft, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { magicSiteLinks } from '../data/magicSite';

export const MagicSite: React.FC = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Orca | Directory';
  }, []);

  const categories = [
    { id: 'movies', name: 'Movies', icon: <Film className="w-8 h-8 text-white" /> },
    { id: 'series', name: 'Series', icon: <Tv className="w-8 h-8 text-white" /> },
    { id: 'anime', name: 'Anime', icon: <Disc className="w-8 h-8 text-white" /> },
    { id: 'kdrama', name: 'KDrama', icon: <span className="text-2xl font-bold font-sans">한a</span> },
    { id: 'podcast', name: 'Podcast', icon: <Radio className="w-8 h-8 text-white" /> },
  ];

  const handleCategoryClick = (catId: keyof typeof magicSiteLinks, name: string) => {
    const url = magicSiteLinks[catId];
    if (url && url.trim().length > 0) {
      window.location.href = url;
    } else {
      setActiveModal(name);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden animate-fade-in">
      
      {/* Directory Main Section matching Screenshot 5 */}
      <div className="max-w-6xl mx-auto w-full my-auto space-y-12 text-center py-12">
        
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight font-sans">
            Directory
          </h1>
          <p className="text-base sm:text-lg text-gray-400 font-sans">
            Access the core entertainment clusters.
          </p>
        </div>

        {/* 5 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto pt-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id as keyof typeof magicSiteLinks, cat.name)}
              className="neo-card p-8 flex flex-col items-center justify-center space-y-6 cursor-pointer group hover:scale-105 transition-all duration-300 min-h-[220px]"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/15 transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-bold text-xl text-white font-sans group-hover:text-amber-300 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Back to Home Button */}
        <div className="pt-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-full btn-glass text-xs font-mono tracking-widest text-gray-300 hover:text-white inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500">
        <div className="space-y-1 text-left">
          <span className="font-bold text-white text-lg font-sans block">ORCA</span>
          <span>Immersive entertainment experiences.</span>
        </div>
        <div className="flex space-x-4 pt-4 sm:pt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Us</span>
        </div>
      </div>

      {/* Info Modal when URL is unconfigured */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="neo-card p-6 max-w-md w-full space-y-4 text-left border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-300">
                <ExternalLink className="w-5 h-5" />
                <h3 className="font-bold text-lg text-white font-sans">{activeModal} Link</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              External redirection link for <strong>{activeModal}</strong> is currently unconfigured.
            </p>

            <div className="p-3 neo-inset rounded-lg text-[11px] font-mono text-gray-400">
              Set <span className="text-emerald-400">magicSiteLinks.{activeModal.toLowerCase()}</span> in <code className="text-white">src/data/magicSite.ts</code> when ready!
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-full btn-glass-primary text-xs font-mono text-white"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
