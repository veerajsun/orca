// Add your RSS feed URLs here — you can add MULTIPLE feeds per category.
// All feeds in a category get merged into one list, sorted by publish date.
// Leave a category as an empty array ([]) to hide its RSS section on that page.

export type FeedCategory = 'movies' | 'series' | 'anime' | 'kdrama' | 'podcast';

export const CATEGORY_FEEDS: Record<FeedCategory, string[]> = {
  movies: [
    'https://screenrant.com/feed/',
  ],
  series: [
    'https://vodzilla.co/feed/',
    'https://www.whats-on-netflix.com/news/feed/',
  ],
  anime: [
    'https://animecorner.me/feed/',
    'https://otakuusamagazine.com/anime/feed/',
  ],
  kdrama: [
    'https://www.soompi.com/feed',
  ],
  podcast: [
    'https://podnews.net/latest',
  ],
};
