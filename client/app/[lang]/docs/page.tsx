import { Container } from '@/components/Container';
import { DocsGuide } from '@/components/DocsGuide';
import { DocsMobileNav } from '@/components/DocsMobileNav';
import { DocsSidebar } from '@/components/DocsSidebar';
import { ResourceSection } from '@/components/ResourceSection';
import { getExample, getResourceCounts } from '@/lib/api';
import { RESOURCES } from '@/lib/docs';
import { isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/i18n/metadata';
import { buildDocsNavigation } from '@/lib/navigation';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: PageProps<'/[lang]/docs'>): Promise<Metadata> {
    const { lang } = await params;

    if (!isLocale(lang)) {
        return {};
    }

    const { meta } = getDictionary(lang);

    return pageMetadata({
        locale: lang,
        path: '/docs',
        title: meta.docsTitle,
        description: meta.docsDescription,
    });
}

export default async function DocsPage({ params }: PageProps<'/[lang]/docs'>) {
    const { lang } = await params;

    if (!isLocale(lang)) {
        notFound();
    }

    const locale = lang;
    const { docs } = getDictionary(locale);
    const navigation = buildDocsNavigation(docs);
    const [counts, paginationExample, ...examples] = await Promise.all([
        getResourceCounts(),
        getExample('/characters?page=2&limit=2'),
        ...RESOURCES.map((resource) => getExample(`${resource.path}/${resource.exampleId}`)),
    ]);

    return (
        <Container className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <aside className="hidden lg:block">
                <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-10 pr-2">
                    <DocsSidebar navigation={navigation} />
                </div>
            </aside>
            <div className="min-w-0">
                <DocsMobileNav navigation={navigation} />
                <article className="max-w-3xl space-y-16 pt-10 pb-24 lg:pt-12">
                    <DocsGuide docs={docs} paginationExample={paginationExample} />
                    {RESOURCES.map((resource, index) => (
                        <ResourceSection
                            key={resource.key}
                            locale={locale}
                            resource={resource}
                            docs={docs}
                            example={examples[index]}
                            total={counts[index].total}
                        />
                    ))}
                </article>
            </div>
        </Container>
    );
}
