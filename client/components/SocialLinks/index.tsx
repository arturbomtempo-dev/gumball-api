import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from '@/components/Icons';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { AUTHOR } from '@/lib/site';

interface SocialLinksProps {
    labels: Dictionary['contact']['social'];
}

export function SocialLinks({ labels }: SocialLinksProps) {
    const links = [
        { key: 'email', href: `mailto:${AUTHOR.email}`, icon: <MailIcon width={18} height={18} /> },
        { key: 'linkedin', href: AUTHOR.linkedin, icon: <LinkedinIcon width={16} height={16} /> },
        {
            key: 'instagram',
            href: AUTHOR.instagram,
            icon: <InstagramIcon width={18} height={18} />,
        },
        { key: 'github', href: AUTHOR.github, icon: <GithubIcon width={18} height={18} /> },
    ] as const;

    return (
        <ul className="flex items-center gap-2">
            {links.map((link) => (
                <li key={link.key}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={labels[link.key]}
                        title={labels[link.key]}
                        className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground"
                    >
                        {link.icon}
                    </a>
                </li>
            ))}
        </ul>
    );
}
