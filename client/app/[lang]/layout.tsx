import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { I18nProvider } from '@/components/I18nProvider';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Toaster } from '@/components/Toaster';
import { LOCALES, LOCALE_DETAILS, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/i18n/metadata';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { THEME_SCRIPT } from '@/lib/theme';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export function generateStaticParams() {
    return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
    const { lang } = await params;

    if (!isLocale(lang)) {
        return { metadataBase: new URL(SITE_URL) };
    }

    const { meta } = getDictionary(lang);
    const localized = pageMetadata({ locale: lang, path: '/', description: meta.description });

    return {
        ...localized,
        metadataBase: new URL(SITE_URL),
        title: {
            default: meta.title,
            template: `%s · ${SITE_NAME}`,
        },
        applicationName: SITE_NAME,
        keywords: ['Gumball', 'The Amazing World of Gumball', 'REST API', 'API', 'Cartoon Network'],
        openGraph: {
            ...localized.openGraph,
            type: 'website',
            siteName: SITE_NAME,
            title: SITE_NAME,
        },
        twitter: {
            ...localized.twitter,
            card: 'summary_large_image',
            title: SITE_NAME,
        },
    };
}

export const viewport: Viewport = {
    themeColor: '#ffffff',
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
    const { lang } = await params;

    if (!isLocale(lang)) {
        notFound();
    }

    const locale = lang;
    const dictionary = getDictionary(locale);

    return (
        <html
            lang={LOCALE_DETAILS[locale].htmlLang}
            data-theme="light"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
            </head>
            <body className="flex min-h-dvh flex-col">
                <I18nProvider locale={locale} ui={dictionary.ui}>
                    <a
                        href="#content"
                        className="sr-only rounded-md bg-foreground px-3 py-2 text-sm text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
                    >
                        {dictionary.ui.skipToContent}
                    </a>
                    <ScrollToTop />
                    <Header locale={locale} ui={dictionary.ui} />
                    <main id="content" className="flex-1">
                        {children}
                    </main>
                    <Footer locale={locale} dictionary={dictionary} />
                    <Toaster />
                </I18nProvider>
            </body>
        </html>
    );
}
