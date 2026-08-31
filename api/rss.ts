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

    const items = (feed.items || []).slice(0, 12).map((item, idx) => ({
      id: item.guid || item.link || `${idx}`,
      title: item.title || 'Untitled',
      link: item.link || '',
      thumbnail: extractImage(item),
      description: (item.contentSnippet || item.summary || '').slice(0, 200),
      publishedAt: item.pubDate || item.isoDate || '',
      category: (item.categories && item.categories[0]) || feed.title || '',
    }));

    const payload = { feedTitle: feed.title || '', items };

    cache.set(feedUrl, { data: payload, expires: Date.now() + CACHE_MS });

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch or parse RSS feed', details: String(err) });
  }
}
