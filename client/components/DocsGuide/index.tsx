import { BaseUrl } from '@/components/BaseUrl';
import { CodeBlock } from '@/components/CodeBlock';
import { DocHeading } from '@/components/DocHeading';
import { Endpoint } from '@/components/Endpoint';
import { Paragraph } from '@/components/Paragraph';
import { ParameterTable } from '@/components/ParameterTable';
import { PropertyTable, type TableLabels } from '@/components/PropertyTable';
import { RichText } from '@/components/RichText';
import { TryIt } from '@/components/TryIt';
import {
    ERROR_EXAMPLE,
    ERROR_FIELDS,
    PAGINATION_FIELDS,
    PAGINATION_PARAMETERS,
    RATE_LIMIT_HEADERS,
    REFERENCE_OBJECTS,
    RESOURCES,
    ROOT_EXAMPLE,
    STATUS_CODES,
    describe,
} from '@/lib/docs';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { formatJson } from '@/lib/json';
import { GUIDE_SECTION_IDS } from '@/lib/navigation';

interface DocsGuideProps {
    docs: Dictionary['docs'];
    paginationExample: unknown | null;
}

export function DocsGuide({ docs, paginationExample }: DocsGuideProps) {
    const fieldLabels: TableLabels = {
        name: docs.table.key,
        type: docs.table.type,
        description: docs.table.description,
    };
    const parameterLabels: TableLabels = { ...fieldLabels, name: docs.table.parameter };
    const headerLabels: TableLabels = { ...fieldLabels, name: docs.table.header };

    return (
        <>
            <section className="space-y-5">
                <p className="text-sm font-medium text-brand">{docs.eyebrow}</p>
                <h1
                    id={GUIDE_SECTION_IDS.introduction}
                    className="text-4xl font-semibold tracking-tight text-foreground"
                >
                    {docs.sections.introduction}
                </h1>
                {docs.introduction.map((paragraph) => (
                    <Paragraph key={paragraph}>{paragraph}</Paragraph>
                ))}
                {docs.contentLanguage ? (
                    <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted">
                        {docs.contentLanguage}
                    </p>
                ) : null}
            </section>

            <section className="space-y-4">
                <DocHeading id={GUIDE_SECTION_IDS.baseUrl}>{docs.sections.baseUrl}</DocHeading>
                <Paragraph>{docs.baseUrl}</Paragraph>
                <BaseUrl label={docs.baseUrlLabel} />
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
                                    {docs.resources[resource.key].title}
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
                <DocHeading id={GUIDE_SECTION_IDS.rateLimit}>{docs.sections.rateLimit}</DocHeading>
                <Paragraph>{docs.rateLimit.description}</Paragraph>
                <PropertyTable
                    fields={describe(RATE_LIMIT_HEADERS, docs.rateLimit.headers, 'rate limit')}
                    labels={headerLabels}
                />
                <Paragraph>{docs.rateLimit.caching}</Paragraph>
            </section>

            <section className="space-y-4">
                <DocHeading id={GUIDE_SECTION_IDS.pagination}>
                    {docs.sections.pagination}
                </DocHeading>
                <Paragraph>{docs.pagination.description}</Paragraph>
                <ParameterTable
                    parameters={describe(
                        PAGINATION_PARAMETERS,
                        docs.pagination.parameters,
                        'pagination parameters'
                    )}
                    labels={parameterLabels}
                />
                <PropertyTable
                    fields={describe(PAGINATION_FIELDS, docs.pagination.fields, 'pagination')}
                    labels={fieldLabels}
                />
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
                <DocHeading id={GUIDE_SECTION_IDS.sorting}>{docs.sections.sorting}</DocHeading>
                <Paragraph>{docs.sorting}</Paragraph>
                <CodeBlock code={'GET /characters?sort=-name\nGET /episodes?sort=usAirDate'} />
            </section>

            <section className="space-y-4">
                <DocHeading id={GUIDE_SECTION_IDS.filtering}>{docs.sections.filtering}</DocHeading>
                <Paragraph>{docs.filtering.description}</Paragraph>
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted marker:text-subtle">
                    {docs.filtering.rules.map((rule) => (
                        <li key={rule}>
                            <RichText text={rule} />
                        </li>
                    ))}
                </ul>
                <CodeBlock code="GET /characters?species=cat&status=alive&sort=name" />
            </section>

            <section className="space-y-4">
                <DocHeading id={GUIDE_SECTION_IDS.references}>
                    {docs.sections.references}
                </DocHeading>
                <Paragraph>{docs.references.description}</Paragraph>
                {REFERENCE_OBJECTS.map((reference) => (
                    <div key={reference.name} className="space-y-2">
                        <p className="font-mono text-[13px] font-medium text-foreground">
                            {reference.name}
                        </p>
                        <PropertyTable
                            fields={describe(
                                reference.fields,
                                docs.references.fields[reference.name],
                                reference.name
                            )}
                            labels={fieldLabels}
                        />
                    </div>
                ))}
            </section>

            <section className="space-y-4">
                <DocHeading id={GUIDE_SECTION_IDS.images}>{docs.sections.images}</DocHeading>
                <Paragraph>{docs.images}</Paragraph>
            </section>

            <section className="space-y-4">
                <DocHeading id={GUIDE_SECTION_IDS.errors}>{docs.sections.errors}</DocHeading>
                <Paragraph>{docs.errors.description}</Paragraph>
                <PropertyTable
                    fields={describe(ERROR_FIELDS, docs.errors.fields, 'errors')}
                    labels={fieldLabels}
                />
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
                                    {docs.table.status}
                                </th>
                                <th scope="col" className="px-4 py-2.5 font-medium">
                                    {docs.table.meaning}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {STATUS_CODES.map((code) => (
                                <tr key={code}>
                                    <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">
                                        {code}
                                    </td>
                                    <td className="px-4 py-2.5 text-muted">
                                        {docs.errors.statusCodes[code]}
                                    </td>
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
