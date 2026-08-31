import { Anime } from '../types/content';

export const animeData: Anime[] = [
  {
    id: 'a1',
    title: 'Mecha Soul',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    episodes: 24,
    genres: ['MECHA', 'ACTION', 'SCI-FI'],
    description: 'The remnants of humanity fight for survival using giant biomechanical avatars powered by human willpower.',
    studio: 'Mappa Nova'
  },
  {
    id: 'a2',
    title: 'Astral Echoes',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    episodes: 12,
    genres: ['FANTASY', 'MYSTERY'],
    description: 'A young stargazers guild discovers ancient glyphs in the night sky that unlock parallel dimensional gates.',
    studio: 'Ufotable X'
  },
  {
    id: 'a3',
    title: 'Chronos Vanguard',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    episodes: 26,
    genres: ['CYBERPUNK', 'TIME TRAVEL'],
    description: 'Time agents patrol alternate timelines to stop rogue temporal syndicate operatives from erasing history.',
    studio: 'Bones Neo'
  }
];
