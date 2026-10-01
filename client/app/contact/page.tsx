import { ContactCard } from '@/components/ContactCard';
import { Container } from '@/components/Container';
import { BookIcon, GithubIcon } from '@/components/Icons';
import { AUTHOR } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Questions, ideas or a data correction for the Gumball API? Get in touch.',
    alternates: { canonical: '/contact' },
};

export default function ContactPage() {
    return (
        <Container className="max-w-4xl space-y-12 py-16 sm:py-24">
            <div className="max-w-2xl space-y-4">
                <p className="text-sm font-medium text-brand">Contact</p>
                <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                    Get in touch
                </h1>
                <p className="text-lg leading-8 text-pretty text-muted">
                    Found a wrong fact, missing a character or have an idea for the API? Feedback is
                    always welcome and helps keep the data accurate.
                </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <ContactCard
                    href={AUTHOR.github}
                    icon={<GithubIcon width={18} height={18} />}
                    title="GitHub"
                    description={`Follow the project and reach ${AUTHOR.name}, the maintainer of the Gumball API.`}
                    label={AUTHOR.github.replace('https://', '')}
                />
                <ContactCard
                    href="/docs"
                    icon={<BookIcon width={18} height={18} />}
                    title="Documentation"
                    description="Most questions are answered in the docs, with live requests for every route."
                    label="/docs"
                />
            </div>
        </Container>
    );
}
