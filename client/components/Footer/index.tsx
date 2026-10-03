import { Container } from '@/components/Container';
import { localizePath, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { AUTHOR, NAVIGATION, REPOSITORY_URL, SITE_NAME } from '@/lib/site';
import Link from 'next/link';

interface FooterProps {
    locale: Locale;
    dictionary: Dictionary;
}

export function Footer({ locale, dictionary }: FooterProps) {
    return (
        <footer className="mt-auto border-t border-border">
            <Container className="flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-start md:justify-between">
                <div className="max-w-md space-y-2">
                    <p className="font-medium text-foreground">{SITE_NAME}</p>
                    <p className="leading-relaxed">{dictionary.footer.disclaimer}</p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                    <nav
                        aria-label={dictionary.ui.nav.footer}
                        className="flex flex-wrap gap-x-5 gap-y-2"
                    >
                        {NAVIGATION.map((item) => (
                            <Link
                                key={item.key}
                                href={localizePath(locale, item.path)}
                                className="transition-colors hover:text-foreground"
                            >
                                {dictionary.ui.nav[item.key]}
                            </Link>
                        ))}
                        <a
                            href={REPOSITORY_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-foreground"
                        >
                            GitHub
                        </a>
                    </nav>
                    <p className="text-subtle">
                        {dictionary.footer.madeBy}{' '}
                        <a
                            href={AUTHOR.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted transition-colors hover:text-foreground"
                        >
                            {AUTHOR.name}
                        </a>
                    </p>
                </div>
            </Container>
        </footer>
    );
}
