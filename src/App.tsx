import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MagicSiteButton } from './components/MagicSiteButton';
import { SearchModal } from './components/SearchModal';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { Series } from './pages/Series';
import { AnimePage } from './pages/Anime';
import { KDramaPage } from './pages/KDrama';
import { PodcastPage } from './pages/Podcast';
import { MagicSite } from './pages/MagicSite';
import { AdminPage } from './pages/Admin';

const AppLayout: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isMagicSite = location.pathname === '/magic-site';
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#121212] text-[#e5e2e1]">
      {/* Hide Navbar & Footer on MagicSite and Admin pages */}
      {!isMagicSite && !isAdmin && <Navbar onOpenSearch={() => setSearchOpen(true)} />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/kdrama" element={<KDramaPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/magic-site" element={<MagicSite />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {!isMagicSite && !isAdmin && <Footer />}

      {/* Floating Magic Site Action Button */}
      {!isMagicSite && !isAdmin && <MagicSiteButton />}

      {/* Search Dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
