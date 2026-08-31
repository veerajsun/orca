import React from 'react';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-white/10 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <h2 className="font-extrabold text-3xl tracking-tighter text-white font-sans">
              ORCA
            </h2>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Immersive entertainment experiences tailored for the modern explorer. The deep sea of entertainment awaits.
            </p>
          </div>

          {/* Platform Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-gray-300 uppercase tracking-widest">Platform</h3>
            <ul className="space-y-2 text-xs font-sans text-gray-400">
              <li><NavLink to="/movies" className="hover:text-white transition-colors">Movies</NavLink></li>
              <li><NavLink to="/series" className="hover:text-white transition-colors">Series</NavLink></li>
              <li><NavLink to="/anime" className="hover:text-white transition-colors">Anime</NavLink></li>
              <li><NavLink to="/kdrama" className="hover:text-white transition-colors">KDrama</NavLink></li>
              <li><NavLink to="/podcast" className="hover:text-white transition-colors">Podcast</NavLink></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-gray-300 uppercase tracking-widest">Support</h3>
            <ul className="space-y-2 text-xs font-sans text-gray-400">
              <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#account" className="hover:text-white transition-colors">Account</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-gray-300 uppercase tracking-widest">Legal</h3>
            <ul className="space-y-2 text-xs font-sans text-gray-400">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#cookies" className="hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-500">
          <p>© 2024 ORCA ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
          <p className="pt-2 sm:pt-0">Crafted with Dark Neomorphism & Liquid Glass UI</p>
        </div>
      </div>
    </footer>
  );
};
