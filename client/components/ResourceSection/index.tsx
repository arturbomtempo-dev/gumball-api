import { CodeBlock } from '@/components/CodeBlock';
import { DocHeading } from '@/components/DocHeading';
import { Endpoint } from '@/components/Endpoint';
import { Paragraph } from '@/components/Paragraph';
import { ParameterTable } from '@/components/ParameterTable';
import { PropertyTable } from '@/components/PropertyTable';
import { TryIt, type TryItParameter } from '@/components/TryIt';
import { PAGINATION_PARAMETERS, type DocParameter, type ResourceDoc } from '@/lib/docs';
import { formatJson } from '@/lib/json';
import { capitalize, resourceSections } from '@/lib/navigation';

interface ResourceSectionProps {
    resource: ResourceDoc;
    example: unknown | null;
    total: number | null;
}

function toTryIt(parameter: DocParameter): TryItParameter {
    return { name: parameter.name, placeholder: parameter.placeholder, values: parameter.values };
}

export function ResourceSection({ resource, example, total }: ResourceSectionProps) {
    const [schema, all, single, slug, random, filter] = resourceSections(
        resource.key,
        resource.singular,
        resource.plural
    );
    const sort: DocParameter = {
        name: 'sort',
        type: 'string',
        description: `Field to sort by. Prefix it with \`-\` for descending order. Defaults to \`${resource.defaultSort}\`.`,
        values: resource.sortFields.flatMap((field) => [field, `-${field}`]),
    };
    const count: DocParameter = {
        name: 'count',
        type: 'integer',
        description: `How many items to return, from 1 to ${resource.randomMax}. Defaults to 1.`,
        placeholder: '1',
    };
    const listParameters = [...PAGINATION_PARAMETERS, sort];

    return (
        <section className="space-y-14 border-t border-border pt-14">
            <div className="space-y-3">
                <DocHeading id={resource.key}>{capitalize(resource.plural)}</DocHeading>
                <Paragraph>{resource.summary}</Paragraph>
                {total !== null ? (
                    <p className="text-sm text-subtle">
                        {total.toLocaleString('en-US')} {resource.plural} available.
                    </p>
                ) : null}
            </div>

            <div className="space-y-4">
                <DocHeading id={schema.id} level={3}>
                    {schema.label}
                </DocHeading>
                <PropertyTable fields={resource.fields} />
            </div>

            <div className="space-y-4">
                <DocHeading id={all.id} level={3}>
                    {all.label}
                </DocHeading>
                <Paragraph>{`Returns a paginated list of every ${resource.singular}, 20 per page by default.`}</Paragraph>
                <Endpoint path={resource.path} />
                <ParameterTable parameters={listParameters} />
                <TryIt path={resource.path} queryParameters={listParameters.map(toTryIt)} />
            </div>

            <div className="space-y-4">
                <DocHeading id={single.id} level={3}>
                    {single.label}
                </DocHeading>
                <Paragraph>{`Returns one ${resource.singular} by its numeric id.`}</Paragraph>
                <Endpoint path={`${resource.path}/{id}`} />
                {example ? (
                    <CodeBlock
                        code={formatJson(example)}
                        title={`GET ${resource.path}/${resource.exampleId}`}
                        language="json"
                        scrollable
                    />
                ) : null}
                <TryIt
                    path={`${resource.path}/{id}`}
                    pathParameters={[
                        { name: 'id', defaultValue: String(resource.exampleId), placeholder: '1' },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <DocHeading id={slug.id} level={3}>
                    {slug.label}
                </DocHeading>
                <Paragraph>
                    Slugs are stable, human-readable identifiers, handy for URLs in your own app.
                </Paragraph>
                <Endpoint path={`${resource.path}/slug/{slug}`} />
                <TryIt
                    path={`${resource.path}/slug/{slug}`}
                    pathParameters={[
                        {
                            name: 'slug',
                            defaultValue: resource.exampleSlug,
                            placeholder: resource.exampleSlug,
                        },
                    ]}
                />
            </div>

            <div className="space-y-4">
                <DocHeading id={random.id} level={3}>
                    {random.label}
                </DocHeading>
                <Paragraph>{`Returns an array of random ${resource.plural}. Random responses are never cached, so every request returns a new selection.`}</Paragraph>
                <Endpoint path={`${resource.path}/random`} />
                <ParameterTable parameters={[count]} />
                <TryIt
                    path={`${resource.path}/random`}
                    queryParameters={[{ ...toTryIt(count), defaultValue: '3' }]}
                />
            </div>

            <div className="space-y-4">
                <DocHeading id={filter.id} level={3}>
                    {filter.label}
                </DocHeading>
                <Paragraph>
                    Combine any of these query parameters with each other, with pagination and with
                    sorting.
                </Paragraph>
                <ParameterTable parameters={[...resource.filters, sort]} />
                <CodeBlock code={`GET ${resource.filterExample}`} />
                <TryIt
                    path={resource.path}
                    queryParameters={[...resource.filters, sort, ...PAGINATION_PARAMETERS].map(
                        toTryIt
                    )}
                />
            </div>
        </section>
    );
}
