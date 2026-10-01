import { BaseUrl } from '@/components/BaseUrl';
import { CodeBlock } from '@/components/CodeBlock';
import { DocHeading } from '@/components/DocHeading';
import { Endpoint } from '@/components/Endpoint';
import { Paragraph } from '@/components/Paragraph';
import { ParameterTable } from '@/components/ParameterTable';
import { PropertyTable } from '@/components/PropertyTable';
import { RichText } from '@/components/RichText';
import { TryIt } from '@/components/TryIt';
import {
    ERROR_FIELDS,
    PAGINATION_FIELDS,
    PAGINATION_PARAMETERS,
    REFERENCE_OBJECTS,
    RESOURCES,
    ROOT_EXAMPLE,
    STATUS_CODES,
} from '@/lib/docs';
import { formatJson } from '@/lib/json';
import { capitalize } from '@/lib/navigation';

interface DocsGuideProps {
    paginationExample: unknown | null;
}

const ERROR_EXAMPLE = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Character with id 9999 not found',
    path: '/characters/9999',
    timestamp: '2026-10-01T12:00:00.000Z',
};

const RATE_LIMIT_HEADERS = [
    { name: 'X-RateLimit-Limit', type: 'integer', description: 'Requests allowed per minute.' },
    {
        name: 'X-RateLimit-Remaining',
        type: 'integer',
        description: 'Requests left in the current window.',
    },
    {
        name: 'X-RateLimit-Reset',
        type: 'integer',
        description: 'Seconds until the window resets.',
    },
];

export function DocsGuide({ paginationExample }: DocsGuideProps) {
    return (
        <>
            <section className="space-y-5">
                <p className="text-sm font-medium text-brand">Documentation</p>
                <h1
                    id="introduction"
                    className="text-4xl font-semibold tracking-tight text-foreground"
                >
                    Introduction
                </h1>
                <Paragraph>
                    The Gumball API is a free, read-only REST API with data about The Amazing World
                    of Gumball and The Wonderfully Weird World of Gumball. It serves characters,
                    locations, episodes, seasons, songs, games and in-universe media as JSON.
                </Paragraph>
                <Paragraph>
                    There is no authentication, no API key and no sign-up. Every route is a `GET`
                    request, so you can call it from a browser, a server or the terminal. Open any
                    `Try it` panel on this page to send a real request and see the response.
                </Paragraph>
            </section>

            <section className="space-y-4">
                <DocHeading id="base-url">Base URL</DocHeading>
                <Paragraph>
                    All requests start with the base URL below. Its root lists every available
                    resource, which makes it a good first request.
                </Paragraph>
                <BaseUrl />
                <Endpoint path="/" />
                <CodeBlock code={formatJson(ROOT_EXAMPLE)} title="GET /" language="json" />
                <TryIt path="/" />
                <ul className="grid gap-2 sm:grid-cols-2">
                    {RESOURCES.map((resource) => (
                        <li key={resource.key}>
                            <a
                                href={`#${resource.key}`}
                                className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-sm transition-colors hover:border-border-strong hover:bg-surface"
                            >
                                <span className="font-medium text-foreground">
                                    {capitalize(resource.plural)}
                                </span>
                                <code className="font-mono text-[13px] text-subtle">
                                    {resource.path}
                                </code>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-4">
                <DocHeading id="rate-limit">Rate limit and caching</DocHeading>
                <Paragraph>
                    Each IP address can make up to 100 requests per minute. Every response reports
                    your current usage in the headers below. When the limit is reached, the API
                    answers with `429 Too Many Requests` until the window resets.
                </Paragraph>
                <PropertyTable fields={RATE_LIMIT_HEADERS} nameLabel="Header" />
                <Paragraph>
                    Lists and single items are cached for 5 minutes with `Cache-Control: public`, so
                    repeated requests are fast. Random routes are never cached. Please cache
                    responses on your side whenever possible.
                </Paragraph>
            </section>

            <section className="space-y-4">
                <DocHeading id="pagination">Info and pagination</DocHeading>
                <Paragraph>
                    List routes return 20 items per page by default. Use `page` and `limit` to move
                    through the results. Besides the items in `data`, every list response includes
                    `meta` with totals and `links` with ready-to-use paths to other pages.
                </Paragraph>
                <ParameterTable parameters={PAGINATION_PARAMETERS} />
                <PropertyTable fields={PAGINATION_FIELDS} />
                {paginationExample ? (
                    <CodeBlock
                        code={formatJson(paginationExample)}
                        title="GET /characters?page=2&limit=2"
                        language="json"
                        scrollable
                    />
                ) : null}
            </section>

            <section className="space-y-4">
                <DocHeading id="sorting">Sorting</DocHeading>
                <Paragraph>
                    Use the `sort` parameter with a field name for ascending order, or prefix it
                    with `-` for descending order. Items without a value for that field always come
                    last. Each resource documents its sortable fields.
                </Paragraph>
                <CodeBlock code={'GET /characters?sort=-name\nGET /episodes?sort=usAirDate'} />
            </section>

            <section className="space-y-4">
                <DocHeading id="filtering">Filtering</DocHeading>
                <Paragraph>
                    Every list route accepts filters as query parameters, and they can be combined
                    freely. A few rules apply to all resources:
                </Paragraph>
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted marker:text-subtle">
                    <li>
                        <RichText text="`search` is a case-insensitive partial match on the name or title." />
                    </li>
                    <li>
                        <RichText text="Enum values are lowercase and kebab-case, such as `stop-motion` or `school-facility`." />
                    </li>
                    <li>
                        <RichText text="`ids` takes a comma-separated list, such as `ids=1,2,3`, to fetch several items at once." />
                    </li>
                    <li>
                        <RichText text="Unknown or invalid parameters are rejected with `400 Bad Request`, so typos never go unnoticed." />
                    </li>
                </ul>
                <CodeBlock code="GET /characters?species=cat&status=alive&sort=name" />
            </section>

            <section className="space-y-4">
                <DocHeading id="references">Related resources</DocHeading>
                <Paragraph>
                    Resources link to each other with small reference objects instead of bare ids.
                    Each reference includes a `url` with the path to the full item.
                </Paragraph>
                {REFERENCE_OBJECTS.map((reference) => (
                    <div key={reference.name} className="space-y-2">
                        <p className="font-mono text-[13px] font-medium text-foreground">
                            {reference.name}
                        </p>
                        <PropertyTable fields={reference.fields} />
                    </div>
                ))}
            </section>

            <section className="space-y-4">
                <DocHeading id="images">Images</DocHeading>
                <Paragraph>
                    Images are served as WebP files from a public CDN through the `image` field of
                    each item. They are high quality and most character images have a transparent
                    background, so they work on any color.
                </Paragraph>
            </section>

            <section className="space-y-4">
                <DocHeading id="errors">Errors</DocHeading>
                <Paragraph>
                    Errors use standard HTTP status codes and always return the same JSON shape.
                </Paragraph>
                <PropertyTable fields={ERROR_FIELDS} />
                <CodeBlock
                    code={formatJson(ERROR_EXAMPLE)}
                    title="GET /characters/9999"
                    language="json"
                />
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface text-xs text-subtle">
                            <tr>
                                <th scope="col" className="px-4 py-2.5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-2.5 font-medium">
                                    Meaning
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {STATUS_CODES.map((status) => (
                                <tr key={status.code}>
                                    <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">
                                        {status.code}
                                    </td>
                                    <td className="px-4 py-2.5 text-muted">{status.meaning}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <TryIt
                    path="/characters/{id}"
                    pathParameters={[{ name: 'id', defaultValue: '9999', placeholder: '9999' }]}
                />
            </section>
        </>
    );
}
