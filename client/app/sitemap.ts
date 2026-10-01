import type { MetadataRoute } from 'next';
import { NAVIGATION, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    return NAVIGATION.map((item) => ({
        url: `${SITE_URL}${item.href === '/' ? '' : item.href}`,
        changeFrequency: 'weekly',
        priority: item.href === '/' ? 1 : 0.8,
    }));
}
