import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/checkout', '/order-success'] },
    sitemap: 'https://sphinx-store.vercel.app/sitemap.xml',
  };
}
