import { Router, Request, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';

const router = Router();

const BASE_URL = process.env.SITE_URL || 'https://nanoflows.com';

const generateXMLSitemap = (urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }>) => {
  const urlset = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
};

router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }> = [];

    urls.push({ loc: `${BASE_URL}/shop`, changefreq: 'daily', priority: '1.0' });
    urls.push({ loc: `${BASE_URL}/shop/products`, changefreq: 'daily', priority: '0.9' });
    urls.push({ loc: `${BASE_URL}/shop/deals`, changefreq: 'daily', priority: '0.8' });
    urls.push({ loc: `${BASE_URL}/shop/about`, changefreq: 'monthly', priority: '0.5' });
    urls.push({ loc: `${BASE_URL}/shop/contact`, changefreq: 'monthly', priority: '0.5' });

    if (db) {
      const categories = await db.query.categories.findMany({
        where: eq(schema.categories.isActive, true),
      });

      categories.forEach((cat) => {
        urls.push({
          loc: `${BASE_URL}/shop/category/${cat.slug}`,
          lastmod: cat.updatedAt?.toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8',
        });
      });

      const products = await db.query.products.findMany({
        where: eq(schema.products.isActive, true),
      });

      products.forEach((product) => {
        urls.push({
          loc: `${BASE_URL}/shop/product/${product.slug}`,
          lastmod: product.updatedAt?.toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    res.set('Content-Type', 'application/xml');
    res.send(generateXMLSitemap(urls));
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate sitemap' });
  }
});

router.get('/robots.txt', (req: Request, res: Response) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /cart
Disallow: /account/

Sitemap: ${BASE_URL}/shop/sitemap.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

router.get('/manifest.json', (req: Request, res: Response) => {
  const manifest = {
    name: 'NanoFlows Digital Hub Shop',
    short_name: 'NanoFlows Shop',
    description: 'Your one-stop digital marketplace',
    start_url: '/shop',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  res.set('Content-Type', 'application/json');
  res.json(manifest);
});

export default router;
