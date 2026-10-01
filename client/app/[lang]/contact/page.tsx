import { ContactForm } from '@/components/ContactForm';
import { Container } from '@/components/Container';
import { SocialLinks } from '@/components/SocialLinks';
import { SponsorCard } from '@/components/SponsorCard';
import { isLocale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/i18n/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
    params,
}: PageProps<'/[lang]/contact'>): Promise<Metadata> {
    const { lang } = await params;

    if (!isLocale(lang)) {
        return {};
    }

    const { meta } = getDictionary(lang);

    return pageMetadata({
        locale: lang,
        path: '/contact',
        title: meta.contactTitle,
        description: meta.contactDescription,
    });
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
    const { lang } = await params;

    if (!isLocale(lang)) {
        notFound();
    }

    const { contact } = getDictionary(lang);
    const [beforeLink, afterLink] = contact.intro.split('{docs}');

    return (
        <Container className="max-w-3xl space-y-16 py-16 sm:py-24">
            <section className="space-y-10">
                <div className="space-y-4">
                    <p className="text-sm font-medium text-brand">{contact.eyebrow}</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                        {contact.title}
                    </h1>
                    <p className="max-w-2xl text-lg leading-8 text-pretty text-muted">
                        {beforeLink}
                        <Link
                            href={localizePath(lang, '/docs')}
                            className="text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                        >
                            {contact.docsLink}
                        </Link>
                        {afterLink}
                    </p>
                </div>
                <div className="space-y-4">
                    <SocialLinks labels={contact.social} />
                    <ContactForm />
                </div>
            </section>
            <SponsorCard text={contact.sponsor} />
        </Container>
    );
}
