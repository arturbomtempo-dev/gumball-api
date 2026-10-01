import type { Metadata } from 'next';
import { LOCALES, LOCALE_DETAILS, alternateLanguages, localizePath, type Locale } from './config';

interface PageMetadataOptions {
    locale: Locale;
    path: string;
    title?: string;
    description: string;
}

export function pageMetadata({ locale, path, title, description }: PageMetadataOptions): Metadata {
    const url = localizePath(locale, path);

    return {
        ...(title ? { title } : {}),
        description,
        alternates: {
            canonical: url,
            languages: alternateLanguages(path),
        },
        openGraph: {
            ...(title ? { title } : {}),
            description,
            url,
            locale: LOCALE_DETAILS[locale].openGraph,
            alternateLocale: LOCALES.filter((other) => other !== locale).map(
                (other) => LOCALE_DETAILS[other].openGraph
            ),
        },
        twitter: {
            ...(title ? { title } : {}),
            description,
        },
    };
}
