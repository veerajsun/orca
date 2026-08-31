import { Podcast } from '../types/content';

export const featuredPodcast: Podcast = {
  id: 'p-featured',
  title: 'The Depth of Sound Design',
  podcastName: 'Orca | Podcasts',
  coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
  episodeNumber: 42,
  duration: '45:00',
  category: 'Tech',
  description: 'Explore the intricate process of creating immersive soundscapes for modern cinema. We sit down with industry veterans to discuss the art of silence and the impact of low-frequency oscillations.',
};

export const podcastsData: Podcast[] = [
  {
    id: 'p1',
    title: 'Silicon Shadows',
    podcastName: 'Tech Unwrapped',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    episodeNumber: 12,
    duration: '1h 15m',
    category: 'Tech',
    description: 'Navigating the ethical implications of emerging AI in consumer tech and cognitive interfaces.',
  },
  {
    id: 'p2',
    title: 'Echoes in the Alley',
    podcastName: 'The Midnight Logs',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    episodeNumber: 8,
    duration: '45m',
    category: 'True Crime',
    description: 'Unraveling the decades-old mystery of the missing cyber-architect in Neo-London.',
  },
  {
    id: 'p3',
    title: 'Form & Void',
    podcastName: 'Design Discourse',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    episodeNumber: 21,
    duration: '55m',
    category: 'Design',
    description: 'How negative space and dark neomorphism shape our emotional perception of modern interfaces.',
  }
];
