import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Series', path: '/series' },
    { label: 'Anime', path: '/anime' },
    { label: 'KDrama', path: '/kdrama' },
    { label: 'Podcast', path: '/podcast' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#121212]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center cursor-pointer group"
        >
          <span className="font-extrabold text-3xl tracking-tighter text-white font-sans group-hover:opacity-90 transition-opacity">
            ORCA
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-mono tracking-wide transition-all rounded-full ${
                  isActive
                    ? 'text-white border-b-2 border-white bg-white/5 font-semibold shadow-inner'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Search & User */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-4 py-2 rounded-full btn-glass text-xs font-mono text-gray-400 hover:text-white transition-all w-48 lg:w-60 justify-between"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-gray-400">⌘K</kbd>
          </button>

          <button className="p-2 rounded-full btn-glass text-gray-300 hover:text-white transition-all">
            <User className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full btn-glass text-gray-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full btn-glass text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden backdrop-blur-2xl bg-[#121212]/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-mono ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold border-l-4 border-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
