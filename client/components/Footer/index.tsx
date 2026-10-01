import Link from 'next/link';
import { Container } from '@/components/Container';
import { AUTHOR, NAVIGATION, REPOSITORY_URL, SITE_NAME } from '@/lib/site';

export function Footer() {
    return (
        <footer className="mt-auto border-t border-border">
            <Container className="flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-start md:justify-between">
                <div className="max-w-md space-y-2">
                    <p className="font-medium text-foreground">{SITE_NAME}</p>
                    <p className="leading-relaxed">
                        An unofficial fan project. The Amazing World of Gumball and its characters
                        are trademarks of Warner Bros. Discovery.
                    </p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                    <nav aria-label="Footer" className="flex gap-5">
                        {NAVIGATION.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="transition-colors hover:text-foreground"
                            >
                                {item.label}
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
                        Made by{' '}
                        <a
                            href={AUTHOR.github}
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
