import React from 'react';
import { Sparkles } from 'lucide-react';

export const MagicSiteButton: React.FC = () => {
  const handleOpenMagicSite = () => {
    window.open('/magic-site', '_blank');
  };

  return (
    <button
      onClick={handleOpenMagicSite}
      title="Open Magic Site Directory"
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full btn-glass text-white shadow-2xl flex items-center space-x-2 group hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-xl"
    >
      <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline font-mono text-xs font-semibold tracking-wider text-gray-200 group-hover:text-white">
        Magic Site
      </span>
    </button>
  );
};
