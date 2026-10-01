import { ButtonLink } from '@/components/ButtonLink';
import { CharacterCard } from '@/components/CharacterCard';
import { CodeBlock } from '@/components/CodeBlock';
import { CodeTabs } from '@/components/CodeTabs';
import { Container } from '@/components/Container';
import { FeatureCard } from '@/components/FeatureCard';
import { ArrowRightIcon, KeyOffIcon, LayersIcon, LinkIcon } from '@/components/Icons';
import { ResourceStats } from '@/components/ResourceStats';
import { SectionIntro } from '@/components/SectionIntro';
import { getExample, getRandomCharacters, getResourceCounts } from '@/lib/api';
import { isLocale, localizePath } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { pageMetadata } from '@/lib/i18n/metadata';
import { formatJson } from '@/lib/json';
import { API_URL } from '@/lib/site';
import logo from '@/public/logo.png';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const QUICK_START = [
    { label: 'cURL', code: `curl ${API_URL}/characters/1` },
    {
        label: 'JavaScript',
        code: `const response = await fetch('${API_URL}/characters/1');\nconst character = await response.json();\n\nconsole.log(character.name);`,
    },
    {
        label: 'Python',
        code: `import requests\n\ncharacter = requests.get('${API_URL}/characters/1').json()\n\nprint(character['name'])`,
    },
] as const;

const PREVIEW_FIELDS = ['id', 'name', 'species', 'status', 'firstAppearance', 'image'];

function preview(value: unknown): string | null {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const record = value as Record<string, unknown>;

    return formatJson(Object.fromEntries(PREVIEW_FIELDS.map((field) => [field, record[field]])));
}

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
    const { lang } = await params;

    if (!isLocale(lang)) {
        return {};
    }

    return pageMetadata({
        locale: lang,
        path: '/',
        description: getDictionary(lang).meta.description,
    });
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
    const { lang } = await params;

    if (!isLocale(lang)) {
        notFound();
    }

    const locale = lang;
    const { home, docs } = getDictionary(locale);
    const docsPath = localizePath(locale, '/docs');
    const [counts, characters, example] = await Promise.all([
        getResourceCounts(),
        getRandomCharacters(8),
        getExample('/characters/1'),
    ]);
    const response = preview(example);

    return (
        <>
            <section className="border-b border-border">
                <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-24">
                    <div className="min-w-0 space-y-8">
                        <div className="space-y-5">
                            <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                                {home.title}
                            </h1>
                            <p className="max-w-xl text-lg leading-8 text-pretty text-muted">
                                {home.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <ButtonLink href={docsPath}>
                                {home.readDocs}
                                <ArrowRightIcon />
                            </ButtonLink>
                            <ButtonLink href={`${docsPath}#base-url`} variant="secondary">
                                {home.firstRequest}
                            </ButtonLink>
                        </div>
                    </div>
                    <div className="mx-auto w-64 sm:w-80 lg:w-full">
                        <Image
                            src={logo}
                            alt={home.logoAlt}
                            loading="eager"
                            fetchPriority="high"
                            sizes="(min-width: 1024px) 24rem, 20rem"
                            className="h-auto w-full drop-shadow-[0_18px_30px_rgba(11,134,201,0.18)]"
                        />
                    </div>
                </Container>
            </section>

            <section>
                <Container className="space-y-8 py-16 sm:py-20">
                    <SectionIntro eyebrow={home.resources.eyebrow} title={home.resources.title}>
                        {home.resources.description}
                    </SectionIntro>
                    <ResourceStats locale={locale} counts={counts} resources={docs.resources} />
                </Container>
            </section>

            <section className="border-y border-border bg-surface">
                <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-start">
                    <div className="min-w-0 space-y-8">
                        <SectionIntro
                            eyebrow={home.quickStart.eyebrow}
                            title={home.quickStart.title}
                        >
                            {home.quickStart.description}
                        </SectionIntro>
                        <CodeTabs tabs={QUICK_START} />
                    </div>
                    {response ? (
                        <div className="min-w-0">
                            <CodeBlock
                                code={response}
                                title={home.quickStart.response}
                                language="json"
                            />
                        </div>
                    ) : null}
                </Container>
            </section>

            {characters.length > 0 ? (
                <section>
                    <Container className="space-y-8 py-16 sm:py-20">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <SectionIntro
                                eyebrow={home.characters.eyebrow}
                                title={home.characters.title}
                            >
                                {home.characters.description}
                            </SectionIntro>
                            <ButtonLink href={`${docsPath}#characters`} variant="secondary">
                                {home.characters.explore}
                            </ButtonLink>
                        </div>
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {characters.map((character) => (
                                <li key={character.id}>
                                    <CharacterCard character={character} labels={home.characters} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            ) : null}

            <section className="border-t border-border">
                <Container className="grid gap-10 py-16 sm:grid-cols-3 sm:py-20">
                    <FeatureCard icon={<KeyOffIcon />} title={home.features.open.title}>
                        {home.features.open.description}
                    </FeatureCard>
                    <FeatureCard icon={<LinkIcon />} title={home.features.connected.title}>
                        {home.features.connected.description}
                    </FeatureCard>
                    <FeatureCard icon={<LayersIcon />} title={home.features.predictable.title}>
                        {home.features.predictable.description}
                    </FeatureCard>
                </Container>
            </section>
        </>
    );
}
