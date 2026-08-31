import { KDrama } from '../types/content';

export const kdramaData: KDrama[] = [
  {
    id: 'k1',
    title: 'Seoul Midnight',
    poster: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    episodes: 16,
    genres: ['ROMANCE', 'MYSTERY', 'THRILLER'],
    description: 'A top defense lawyer and a midnight radio DJ unite to solve a cold case connecting Gangnam\'s elite.',
    network: 'tvN Global'
  },
  {
    id: 'k2',
    title: 'Moonlit Empire',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    episodes: 20,
    genres: ['HISTORICAL', 'FANTASY'],
    description: 'During the Joseon era, a secret astronomer discovers that the crown prince harbors a supernatural celestial curse.',
    network: 'JTBC'
  },
  {
    id: 'k3',
    title: 'Undercover Bloom',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    episodes: 16,
    genres: ['ACTION', 'COMEDY'],
    description: 'An elite NIS officer goes undercover as an eccentric florist in a high-rise luxury residential building.',
    network: 'ENA'
  }
];
