import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} · The Amazing World of Gumball REST API`,
        template: `%s · ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: ['Gumball', 'The Amazing World of Gumball', 'REST API', 'API', 'Cartoon Network'],
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: '/',
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: '#ffffff',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <body className="flex min-h-dvh flex-col">
                <a
                    href="#content"
                    className="sr-only rounded-md bg-foreground px-3 py-2 text-sm text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
                >
                    Skip to content
                </a>
                <ScrollToTop />
                <Header />
                <main id="content" className="flex-1">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
