import { Container } from '@/components/Container';
import { GithubIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import { MobileMenu } from '@/components/MobileMenu';
import { NavLink } from '@/components/NavLink';
import { NAVIGATION, REPOSITORY_URL } from '@/lib/site';

export function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-4">
                <Logo />
                <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
                    {NAVIGATION.map((item) => (
                        <NavLink key={item.href} href={item.href} label={item.label} />
                    ))}
                    <a
                        href={REPOSITORY_URL}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Source code on GitHub"
                        className="ml-1 rounded-md p-2 text-muted transition-colors hover:text-foreground"
                    >
                        <GithubIcon width={18} height={18} />
                    </a>
                </nav>
                <MobileMenu />
            </Container>
        </header>
    );
}
