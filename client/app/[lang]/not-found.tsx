import { ButtonLink } from '@/components/ButtonLink';
import { Container } from '@/components/Container';
import { DEFAULT_LOCALE, isLocale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { lang } from 'next/root-params';

export default async function NotFound() {
    const current = await lang();
    const locale = isLocale(current) ? current : DEFAULT_LOCALE;
    const { notFound, meta } = getDictionary(locale);

    return (
        <Container className="flex flex-col items-start gap-6 py-24 sm:py-32">
            <title>{meta.notFoundTitle}</title>
            <p className="font-mono text-sm text-brand">404</p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                {notFound.title}
            </h1>
            <p className="max-w-md text-lg leading-8 text-muted">{notFound.description}</p>
            <div className="flex flex-wrap gap-3">
                <ButtonLink href={localizePath(locale, '/')}>{notFound.home}</ButtonLink>
                <ButtonLink href={localizePath(locale, '/docs')} variant="secondary">
                    {notFound.docs}
                </ButtonLink>
            </div>
        </Container>
    );
}
