import { ContactCard } from '@/components/ContactCard';
import { Container } from '@/components/Container';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from '@/components/Icons';
import { SponsorCard } from '@/components/SponsorCard';
import { AUTHOR } from '@/lib/site';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Questions, ideas or a data correction for the Gumball API? Get in touch or support the project.',
    alternates: { canonical: '/contact' },
};

const CHANNELS = [
    {
        href: `mailto:${AUTHOR.email}`,
        icon: <MailIcon width={18} height={18} />,
        title: 'Email',
        description: 'The best way to reach me about partnerships, questions or data corrections.',
        label: AUTHOR.email,
    },
    {
        href: AUTHOR.linkedin,
        icon: <LinkedinIcon width={17} height={17} />,
        title: 'LinkedIn',
        description: 'Connect with me and follow my work as a software developer.',
        label: 'in/artur-bomtempo',
    },
    {
        href: AUTHOR.instagram,
        icon: <InstagramIcon width={18} height={18} />,
        title: 'Instagram',
        description:
            'Behind the scenes of this and other projects, plus content about development.',
        label: '@arturbomtempo.dev',
    },
    {
        href: AUTHOR.github,
        icon: <GithubIcon width={18} height={18} />,
        title: 'GitHub',
        description: 'Explore my open source projects and follow what I am building next.',
        label: 'arturbomtempo-dev',
    },
] as const;

export default function ContactPage() {
    return (
        <Container className="max-w-4xl space-y-14 py-16 sm:py-24">
            <div className="max-w-2xl space-y-4">
                <p className="text-sm font-medium text-brand">Contact</p>
                <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                    Get in touch
                </h1>
                <p className="text-lg leading-8 text-pretty text-muted">
                    Found a wrong fact, missing a character or have an idea for the API? Feedback is
                    always welcome and helps keep the data accurate. For questions about routes and
                    parameters, check the{' '}
                    <Link
                        href="/docs"
                        className="text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                        documentation
                    </Link>{' '}
                    first.
                </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
                {CHANNELS.map((channel) => (
                    <li key={channel.title} className="flex">
                        <ContactCard {...channel} />
                    </li>
                ))}
            </ul>
            <SponsorCard />
        </Container>
    );
}
