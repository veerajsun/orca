// Add your RSS feed URLs here — one per category.
// Leave a category as an empty string ('') to hide its RSS section on that page.

export type FeedCategory = 'movies' | 'series' | 'anime' | 'kdrama' | 'podcast';

export const CATEGORY_FEEDS: Record<FeedCategory, string> = {
  movies: '',   // e.g. 'https://example.com/movies/rss'
  series: '',   // e.g. 'https://example.com/series/rss'
  anime: 'https://animecorner.me/feed/',
  kdrama: '',   // e.g. 'https://example.com/kdrama/rss'
  podcast: '',  // e.g. 'https://example.com/podcast/rss'
};
