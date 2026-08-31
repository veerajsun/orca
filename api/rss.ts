import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail']],
  },
});

// Simple in-memory cache so we don't hammer the source feed on every page view.
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

    // Only read the first ~50KB — the <head> with meta tags is always near the top,
    // no need to download the whole page.
    const reader = res.body?.getReader();
    let html = '';
    if (reader) {
      const decoder = new TextDecoder();
      let bytesRead = 0;
      while (bytesRead < 50_000) {
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

    return '';
  } catch {
    return '';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const feedUrl = req.query.url as string;

  if (!feedUrl) {
    res.status(400).json({ error: 'Missing "url" query parameter' });
    return;
  }

  const cached = cache.get(feedUrl);
  if (cached && cached.expires > Date.now()) {
    res.status(200).json(cached.data);
    return;
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    const rawItems = (feed.items || []).slice(0, 12);

    // First pass: pull whatever image info is already in the feed itself.
    const partialItems = rawItems.map((item, idx) => ({
      id: item.guid || item.link || `${idx}`,
      title: item.title || 'Untitled',
      link: item.link || '',
      thumbnail: extractImage(item),
      description: (item.contentSnippet || item.summary || '').slice(0, 200),
      publishedAt: item.pubDate || item.isoDate || '',
      category: (item.categories && item.categories[0]) || feed.title || '',
    }));

    // Second pass: for items with no image, fetch the article page's og:image.
    // Runs in parallel, capped at 5s each, so a slow site can't stall the whole request.
    const items = await Promise.all(
      partialItems.map(async (item) => {
        if (item.thumbnail || !item.link) return item;
        const ogImage = await fetchOgImage(item.link);
        return { ...item, thumbnail: ogImage };
      })
    );

    const payload = { feedTitle: feed.title || '', items };

    cache.set(feedUrl, { data: payload, expires: Date.now() + CACHE_MS });

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch or parse RSS feed', details: String(err) });
  }
}
