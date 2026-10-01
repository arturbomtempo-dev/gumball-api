import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from '@/components/Icons';
import { AUTHOR } from '@/lib/site';

const LINKS = [
    { href: `mailto:${AUTHOR.email}`, label: 'Email', icon: <MailIcon width={18} height={18} /> },
    { href: AUTHOR.linkedin, label: 'LinkedIn', icon: <LinkedinIcon width={16} height={16} /> },
    { href: AUTHOR.instagram, label: 'Instagram', icon: <InstagramIcon width={18} height={18} /> },
    { href: AUTHOR.github, label: 'GitHub', icon: <GithubIcon width={18} height={18} /> },
] as const;

export function SocialLinks() {
    return (
        <ul className="flex items-center gap-2">
            {LINKS.map((link) => (
                <li key={link.label}>
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                        title={link.label}
                        className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground"
                    >
                        {link.icon}
                    </a>
                </li>
            ))}
        </ul>
    );
}
