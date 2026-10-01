import { LOCALES, alternateLanguages, localizePath } from '@/lib/i18n/config';
import { NAVIGATION, SITE_URL } from '@/lib/site';
import type { MetadataRoute } from 'next';

function absolute(path: string): string {
    return `${SITE_URL}${path === '/' ? '' : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
    return NAVIGATION.flatMap((item) =>
        LOCALES.map((locale) => ({
            url: absolute(localizePath(locale, item.path)),
            changeFrequency: 'weekly' as const,
            priority: item.path === '/' ? 1 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    Object.entries(alternateLanguages(item.path)).map(([language, path]) => [
                        language,
                        absolute(path),
                    ])
                ),
            },
        }))
    );
}
