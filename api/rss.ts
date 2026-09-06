import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail']],
  },
});

// Simple in-memory cache so we don't hammer the source feeds on every page view.
// (Resets whenever the serverless function cold-starts — that's fine for this use case.)
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_MS = 10 * 60 * 1000; // 10 minutes

function extractImage(item: any): string {
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  const match = item.content?.match(/<img[^>]+src="([^">]+)"/i);
  if (match) return match[1];
  return '';
}

// Fallback: visit the article page itself and pull its og:image / twitter:image
// meta tag. Used only when the RSS feed didn't include an image at all.
async function fetchOgImage(pageUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrcaBot/1.0)' },
    });
    clearTimeout(timeout);

    if (!res.ok) return '';

    const reader = res.body?.getReader();
    let html = '';
    if (reader) {
      const decoder = new TextDecoder();
      let bytesRead = 0;
      while (bytesRead < 150_000) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
        bytesRead += value.length;
      }
      reader.cancel();
    } else {
      html = await res.text();
    }

    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch) return ogMatch[1];

    const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twitterMatch) return twitterMatch[1];

    // Last resort: many WordPress sites (common among RSS sources) don't set
    // og:image at all, but still have a normal featured image in the article
    // body under /wp-content/uploads/. WordPress auto-generates resized
    // filenames like "-700x467.jpg" for real content images — sidebar logos,
    // channel icons, and nav graphics almost never have that suffix, so
    // prefer a resize-suffixed match first before falling back to any upload.
    const uploadMatches = [...html.matchAll(/https?:\/\/[^"'\s]+\/wp-content\/uploads\/[^"'\s]+?\.(?:jpg|jpeg|png|webp)/gi)]
      .map((m) => m[0])
      .filter((url) => !/logo|icon|favicon|avatar|badge|sprite/i.test(url));

    const resized = uploadMatches.find((url) => /-\d{2,4}x\d{2,4}\.(?:jpg|jpeg|png|webp)$/i.test(url));
    if (resized) return resized;
    if (uploadMatches.length) return uploadMatches[0];

    return '';
  } catch {
    return '';
  }
}

async function fetchOneFeed(feedUrl: string) {
  const feed = await parser.parseURL(feedUrl);
  return (feed.items || []).slice(0, 12).map((item, idx) => ({
    id: item.guid || item.link || `${feedUrl}-${idx}`,
    title: item.title || 'Untitled',
    link: item.link || '',
    thumbnail: extractImage(item),
    description: (item.contentSnippet || item.summary || '').slice(0, 200),
    publishedAt: item.pubDate || item.isoDate || '',
    category: (item.categories && item.categories[0]) || feed.title || '',
    sourceName: feed.title || '',
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Accept either ?url=a&url=b (repeated param) or ?url=a,b (comma-separated)
  const rawUrl = req.query.url;
  let feedUrls: string[] = [];
  if (Array.isArray(rawUrl)) {
    feedUrls = rawUrl as string[];
  } else if (typeof rawUrl === 'string') {
    feedUrls = rawUrl.split(',').map((u) => u.trim()).filter(Boolean);
  }

  if (feedUrls.length === 0) {
    res.status(400).json({ error: 'Missing "url" query parameter' });
    return;
  }

  const cacheKey = feedUrls.slice().sort().join(',');
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    res.status(200).json(cached.data);
    return;
  }

  try {
    // Fetch all feeds in parallel; a single failing feed shouldn't break the others
    const results = await Promise.allSettled(feedUrls.map(fetchOneFeed));
    let items = results
      .filter((r): r is PromiseFulfilledResult<any[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    // Merge duplicates (rare, but possible if two feeds share an item), sort newest first
    const seen = new Set<string>();
    items = items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    items = items.slice(0, 12);

    // Fill in missing images from the article page's og:image, in parallel
    items = await Promise.all(
      items.map(async (item) => {
        if (item.thumbnail || !item.link) return item;
        const ogImage = await fetchOgImage(item.link);
        return { ...item, thumbnail: ogImage };
      })
    );

    const payload = { items };
    cache.set(cacheKey, { data: payload, expires: Date.now() + CACHE_MS });

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch or parse RSS feed(s)', details: String(err) });
  }
}
