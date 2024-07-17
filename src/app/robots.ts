import { app } from '@/constants';
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/legal'],
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        allow: ['/'],
        disallow: ['/api/', '/legal'],
      },
    ],
    sitemap: `${app}/sitemap.xml`,
  };
}
