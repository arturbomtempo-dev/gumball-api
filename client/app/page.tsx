import { BaseUrl } from '@/components/BaseUrl';
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
import { formatJson } from '@/lib/json';
import { API_URL } from '@/lib/site';
import logo from '@/public/logo.png';
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

export default async function HomePage() {
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
                            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Free · Read-only · No API key
                            </p>
                            <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                                The Amazing World of Gumball API
                            </h1>
                            <p className="max-w-xl text-lg leading-8 text-pretty text-muted">
                                Characters, locations, episodes, seasons, songs, games and
                                in-universe media from Elmore, ready to use in your next project
                                through a simple REST API.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <ButtonLink href="/docs">
                                Read the docs
                                <ArrowRightIcon />
                            </ButtonLink>
                            <ButtonLink href="/docs#base-url" variant="secondary">
                                Make your first request
                            </ButtonLink>
                        </div>
                        <BaseUrl />
                    </div>
                    <div className="mx-auto w-64 sm:w-80 lg:w-full">
                        <Image
                            src={logo}
                            alt="Gumball waving above the Gumball API logo"
                            priority
                            sizes="(min-width: 1024px) 24rem, 20rem"
                            className="h-auto w-full drop-shadow-[0_18px_30px_rgba(11,134,201,0.18)]"
                        />
                    </div>
                </Container>
            </section>

            <section>
                <Container className="space-y-8 py-16 sm:py-20">
                    <SectionIntro eyebrow="Resources" title="Seven resources, one consistent API">
                        Every resource supports pagination, filters, sorting, lookups by id or slug
                        and random picks.
                    </SectionIntro>
                    <ResourceStats counts={counts} />
                </Container>
            </section>

            <section className="border-y border-border bg-surface">
                <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-start">
                    <div className="min-w-0 space-y-8">
                        <SectionIntro eyebrow="Quick start" title="Your first request in seconds">
                            No sign-up, no keys and no SDK. Send a GET request from any language and
                            get JSON back.
                        </SectionIntro>
                        <CodeTabs tabs={QUICK_START} />
                    </div>
                    {response ? (
                        <div className="min-w-0">
                            <CodeBlock code={response} title="Response" language="json" />
                        </div>
                    ) : null}
                </Container>
            </section>

            {characters.length > 0 ? (
                <section>
                    <Container className="space-y-8 py-16 sm:py-20">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <SectionIntro eyebrow="Characters" title="Meet the residents of Elmore">
                                A random selection from the API, refreshed every hour.
                            </SectionIntro>
                            <ButtonLink href="/docs#characters" variant="secondary">
                                Explore characters
                            </ButtonLink>
                        </div>
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {characters.map((character) => (
                                <li key={character.id}>
                                    <CharacterCard character={character} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            ) : null}

            <section className="border-t border-border">
                <Container className="grid gap-10 py-16 sm:grid-cols-3 sm:py-20">
                    <FeatureCard icon={<KeyOffIcon />} title="Free and open">
                        No authentication and CORS enabled for every origin. Call it from the
                        browser, a server or the terminal.
                    </FeatureCard>
                    <FeatureCard icon={<LinkIcon />} title="Connected data">
                        Characters, songs and locations link to the episodes they appear in, so you
                        can follow the story across resources.
                    </FeatureCard>
                    <FeatureCard icon={<LayersIcon />} title="Predictable by design">
                        The same pagination, filters, sorting and error format on every route, all
                        documented with live examples.
                    </FeatureCard>
                </Container>
            </section>
        </>
    );
}
