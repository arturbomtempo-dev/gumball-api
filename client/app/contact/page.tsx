import { ContactForm } from '@/components/ContactForm';
import { Container } from '@/components/Container';
import { SocialLinks } from '@/components/SocialLinks';
import { SponsorCard } from '@/components/SponsorCard';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'Questions, ideas or a data correction for the Gumball API? Send a message or support the project.',
    alternates: { canonical: '/contact' },
};

export default function ContactPage() {
    return (
        <Container className="max-w-3xl space-y-16 py-16 sm:py-24">
            <section className="space-y-10">
                <div className="space-y-4">
                    <p className="text-sm font-medium text-brand">Contact</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                        Get in touch
                    </h1>
                    <p className="max-w-2xl text-lg leading-8 text-pretty text-muted">
                        Found a wrong fact, missing a character or have an idea for the API? Send a
                        message and I will get back to you. For questions about routes and
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
                <div className="space-y-4">
                    <SocialLinks />
                    <ContactForm />
                </div>
            </section>
            <SponsorCard />
        </Container>
    );
}
