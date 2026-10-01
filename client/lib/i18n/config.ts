export const LOCALES = ['en', 'pt-br', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_DETAILS: Record<
    Locale,
    { name: string; shortName: string; htmlLang: string; openGraph: string; intl: string }
> = {
    en: { name: 'English', shortName: 'EN', htmlLang: 'en', openGraph: 'en_US', intl: 'en-US' },
    'pt-br': {
        name: 'Português',
        shortName: 'PT',
        htmlLang: 'pt-BR',
        openGraph: 'pt_BR',
        intl: 'pt-BR',
    },
    es: { name: 'Español', shortName: 'ES', htmlLang: 'es', openGraph: 'es_ES', intl: 'es-ES' },
};

export function isLocale(value: string | undefined): value is Locale {
    return LOCALES.includes(value as Locale);
}

export function localizePath(locale: Locale, path: string): string {
    if (locale === DEFAULT_LOCALE) {
        return path;
    }

    return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

export function splitLocale(pathname: string): { locale: Locale; path: string } {
    const [, segment, ...rest] = pathname.split('/');

    if (isLocale(segment)) {
        return { locale: segment, path: `/${rest.join('/')}` };
    }

    return { locale: DEFAULT_LOCALE, path: pathname || '/' };
}

export function alternateLanguages(path: string): Record<string, string> {
    return {
        ...Object.fromEntries(
            LOCALES.map((locale) => [LOCALE_DETAILS[locale].htmlLang, localizePath(locale, path)])
        ),
        'x-default': localizePath(DEFAULT_LOCALE, path),
    };
}

export function formatMessage(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) =>
        key in values ? String(values[key]) : match
    );
}
