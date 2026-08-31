import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroCanvas } from './HeroCanvas';

interface HeroProps {
  onExploreClick?: () => void;
  onDiscoverClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onDiscoverClick }) => {
  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden bg-[#121212]">
      {/* 3D Motion Canvas */}
      <HeroCanvas />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white font-sans drop-shadow-2xl">
          ORCA
        </h1>

        {/* Subtitle / Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-300 max-w-2xl mx-auto tracking-tight font-sans leading-snug">
          Your world of stories, entertainment and discovery.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-glass-primary font-mono text-sm tracking-wider flex items-center justify-center space-x-2 group"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onDiscoverClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-glass font-mono text-sm tracking-wider text-gray-300 hover:text-white"
          >
            Discover Stories
          </button>
        </div>
      </div>

      {/* Subtle Bottom Ambient Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none z-10" />
    </section>
  );
};
