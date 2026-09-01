// Add your RSS feed URLs here — you can add MULTIPLE feeds per category.
// All feeds in a category get merged into one list, sorted by publish date.
// Leave a category as an empty array ([]) to hide its RSS section on that page.

export type FeedCategory = 'movies' | 'series' | 'anime' | 'kdrama' | 'podcast';

export const CATEGORY_FEEDS: Record<FeedCategory, string[]> = {
  movies: [],
  series: [],
  anime: [
    'https://animecorner.me/feed/',
    'https://otakuusamagazine.com/anime/feed/',
  ],
  kdrama: [],
  podcast: [],
};
