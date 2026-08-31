export type ContentCategory = 'movie' | 'series' | 'anime' | 'kdrama' | 'podcast' | 'news';

export interface Movie {
  id: string;
  title: string;
  poster: string;
  banner?: string;
  rating: number;
  year: number;
  genres: string[];
  description: string;
  duration?: string;
  director?: string;
}

export interface Series {
  id: string;
  title: string;
  poster: string;
  banner?: string;
  rating: number;
  seasons: number;
  episodes?: number;
  genres: string[];
  description: string;
  isNewEpisode?: boolean;
  status?: string;
}

export interface Anime {
  id: string;
  title: string;
  poster: string;
  rating: number;
  episodes: number;
  genres: string[];
  description: string;
  studio?: string;
}

export interface KDrama {
  id: string;
  title: string;
  poster: string;
  rating: number;
  episodes: number;
  genres: string[];
  description: string;
  network?: string;
}

export interface Podcast {
  id: string;
  title: string;
  podcastName: string;
  coverImage: string;
  episodeNumber: number;
  duration: string;
  category: 'Tech' | 'True Crime' | 'Design' | 'Entertainment' | 'All';
  description: string;
  audioUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  description: string;
  publishedAt: string;
  readTime?: string;
}

export interface MagicSiteConfig {
  movies: string;
  series: string;
  anime: string;
  kdrama: string;
  podcast: string;
}

export interface SearchResult {
  id: string;
  title: string;
  category: ContentCategory;
  image: string;
  subtitle: string;
  description: string;
}
