import { Container } from '@/components/Container';
import { GithubIcon } from '@/components/Icons';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Logo } from '@/components/Logo';
import { MobileMenu } from '@/components/MobileMenu';
import { NavLink } from '@/components/NavLink';
import { ThemeToggle } from '@/components/ThemeToggle';
import { localizePath, type Locale } from '@/lib/i18n/config';
import type { UiDictionary } from '@/lib/i18n/dictionaries';
import { NAVIGATION, REPOSITORY_URL } from '@/lib/site';

interface HeaderProps {
    locale: Locale;
    ui: UiDictionary;
}

export function Header({ locale, ui }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-4">
                <Logo href={localizePath(locale, '/')} label={ui.nav.homeLink} />
                <div className="flex items-center gap-1">
                    <nav aria-label={ui.nav.main} className="hidden items-center gap-1 sm:flex">
                        {NAVIGATION.map((item) => (
                            <NavLink
                                key={item.key}
                                href={localizePath(locale, item.path)}
                                path={item.path}
                                label={ui.nav[item.key]}
                            />
                        ))}
                        <a
                            href={REPOSITORY_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={ui.nav.github}
                            title={ui.nav.github}
                            className="ml-1 inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
                        >
                            <GithubIcon width={18} height={18} />
                        </a>
                    </nav>
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <MobileMenu />
                </div>
            </Container>
        </header>
    );
}
