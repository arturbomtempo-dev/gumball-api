import { Container } from '@/components/Container';
import { DocsGuide } from '@/components/DocsGuide';
import { DocsMobileNav } from '@/components/DocsMobileNav';
import { DocsSidebar } from '@/components/DocsSidebar';
import { ResourceSection } from '@/components/ResourceSection';
import { getExample, getResourceCounts } from '@/lib/api';
import { RESOURCES } from '@/lib/docs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Documentation',
    description:
        'Learn how to use the Gumball API: base URL, pagination, filters, sorting, errors and every resource, with live requests you can run from the page.',
    alternates: { canonical: '/docs' },
};

export default async function DocsPage() {
    const [counts, paginationExample, ...examples] = await Promise.all([
        getResourceCounts(),
        getExample('/characters?page=2&limit=2'),
        ...RESOURCES.map((resource) => getExample(`${resource.path}/${resource.exampleId}`)),
    ]);

    return (
        <Container className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <aside className="hidden lg:block">
                <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-10 pr-2">
                    <DocsSidebar />
                </div>
            </aside>
            <div className="min-w-0">
                <DocsMobileNav />
                <article className="max-w-3xl space-y-16 pt-10 pb-24 lg:pt-12">
                    <DocsGuide paginationExample={paginationExample} />
                    {RESOURCES.map((resource, index) => (
                        <ResourceSection
                            key={resource.key}
                            resource={resource}
                            example={examples[index]}
                            total={counts[index].total}
                        />
                    ))}
                </article>
            </div>
        </Container>
    );
}
