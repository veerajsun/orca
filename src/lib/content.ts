import { supabase } from './supabase';
import { Movie, Series, Anime, KDrama, Podcast } from '../types/content';

// ---------- Row -> App type mappers (DB is snake_case, app types are camelCase) ----------

function mapSeries(row: any): Series {
  return {
    id: row.id,
    title: row.title,
    poster: row.poster,
    banner: row.banner ?? undefined,
    rating: Number(row.rating),
    seasons: row.seasons,
    episodes: row.episodes ?? undefined,
    genres: row.genres ?? [],
    description: row.description,
    isNewEpisode: row.is_new_episode ?? false,
    status: row.status ?? undefined,
  };
}

function mapPodcast(row: any): Podcast {
  return {
    id: row.id,
    title: row.title,
    podcastName: row.podcast_name,
    coverImage: row.cover_image,
    episodeNumber: row.episode_number,
    duration: row.duration,
    category: row.category,
    description: row.description,
    audioUrl: row.audio_url ?? undefined,
  };
}

// Movie, Anime, KDrama rows already map 1:1 to their app types (all snake_case-free)

// ---------- READ ----------

export async function fetchMovies(): Promise<Movie[]> {
  const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...r, rating: Number(r.rating) })) as Movie[];
}

export async function fetchSeries(): Promise<Series[]> {
  const { data, error } = await supabase.from('series').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapSeries);
}

export async function fetchAnime(): Promise<Anime[]> {
  const { data, error } = await supabase.from('anime').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...r, rating: Number(r.rating) })) as Anime[];
}

export async function fetchKDrama(): Promise<KDrama[]> {
  const { data, error } = await supabase.from('kdrama').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...r, rating: Number(r.rating) })) as KDrama[];
}

export async function fetchPodcasts(): Promise<{ featured: Podcast | null; list: Podcast[] }> {
  const { data, error } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []).map(mapPodcast);
  const featured = rows.find((p: any) => (data as any[]).find((r) => r.id === p.id)?.is_featured) ?? null;
  const list = rows.filter((p) => p.id !== featured?.id);
  return { featured, list };
}

// Admin-only: flat list of all podcasts with the isFeatured flag visible, for the manage table.
export async function fetchAllPodcastsAdmin(): Promise<(Podcast & { isFeatured: boolean })[]> {
  const { data, error } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...mapPodcast(r), isFeatured: !!r.is_featured }));
}

// ---------- WRITE (used by the admin panel) ----------

type TableName = 'movies' | 'series' | 'anime' | 'kdrama' | 'podcasts';

export async function deleteItem(table: TableName, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function upsertMovie(movie: Partial<Movie> & { id?: string }) {
  const { error } = await supabase.from('movies').upsert(movie);
  if (error) throw error;
}

export async function upsertSeries(series: Partial<Series> & { id?: string }) {
  const payload: any = { ...series };
  if ('isNewEpisode' in payload) {
    payload.is_new_episode = payload.isNewEpisode;
    delete payload.isNewEpisode;
  }
  const { error } = await supabase.from('series').upsert(payload);
  if (error) throw error;
}

export async function upsertAnime(anime: Partial<Anime> & { id?: string }) {
  const { error } = await supabase.from('anime').upsert(anime);
  if (error) throw error;
}

export async function upsertKDrama(kdrama: Partial<KDrama> & { id?: string }) {
  const { error } = await supabase.from('kdrama').upsert(kdrama);
  if (error) throw error;
}

export async function upsertPodcast(podcast: Partial<Podcast> & { id?: string; isFeatured?: boolean }) {
  const payload: any = { ...podcast };
  if ('podcastName' in payload) {
    payload.podcast_name = payload.podcastName;
    delete payload.podcastName;
  }
  if ('coverImage' in payload) {
    payload.cover_image = payload.coverImage;
    delete payload.coverImage;
  }
  if ('episodeNumber' in payload) {
    payload.episode_number = payload.episodeNumber;
    delete payload.episodeNumber;
  }
  if ('audioUrl' in payload) {
    payload.audio_url = payload.audioUrl;
    delete payload.audioUrl;
  }
  if ('isFeatured' in payload) {
    payload.is_featured = payload.isFeatured;
    delete payload.isFeatured;
  }
  const { error } = await supabase.from('podcasts').upsert(payload);
  if (error) throw error;
}
