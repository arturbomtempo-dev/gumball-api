import { CodeBlock } from '@/components/CodeBlock';
import { DocHeading } from '@/components/DocHeading';
import { Endpoint } from '@/components/Endpoint';
import { ParameterTable } from '@/components/ParameterTable';
import { Paragraph } from '@/components/Paragraph';
import { PropertyTable, type TableLabels } from '@/components/PropertyTable';
import { TryIt, type TryItParameter } from '@/components/TryIt';
import {
    PAGINATION_PARAMETERS,
    describe,
    type DocParameter,
    type ParameterSpec,
    type ResourceSpec,
} from '@/lib/docs';
import { LOCALE_DETAILS, formatMessage, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { formatJson } from '@/lib/json';
import { resourceSectionId } from '@/lib/navigation';

interface ResourceSectionProps {
    locale: Locale;
    resource: ResourceSpec;
    docs: Dictionary['docs'];
    example: unknown | null;
    total: number | null;
}

function toTryIt(parameter: ParameterSpec): TryItParameter {
    return { name: parameter.name, placeholder: parameter.placeholder, values: parameter.values };
}

export function ResourceSection({ locale, resource, docs, example, total }: ResourceSectionProps) {
    const content = docs.resources[resource.key];
    const context = `${locale}/${resource.key}`;
    const fieldLabels: TableLabels = {
        name: docs.table.key,
        type: docs.table.type,
        description: docs.table.description,
    };
    const parameterLabels: TableLabels = { ...fieldLabels, name: docs.table.parameter };
    const sort: DocParameter = {
        name: 'sort',
        type: 'string',
        description: formatMessage(docs.endpoints.sort, { default: resource.defaultSort }),
        values: resource.sortFields.flatMap((field) => [field, `-${field}`]),
    };
    const count: DocParameter = {
        name: 'count',
        type: 'integer',
        description: formatMessage(docs.endpoints.count, { max: resource.randomMax }),
        placeholder: '1',
    };
    const pagination = describe(
        PAGINATION_PARAMETERS,
        docs.pagination.parameters,
        `${context} pagination`
    );
    const filters = describe(resource.filters, content.filters, `${context} filters`);
    const listParameters = [...pagination, sort];

    return (
        <section className="space-y-14 border-t border-border pt-14">
            <div className="space-y-3">
                <DocHeading id={resource.key}>{content.title}</DocHeading>
                <Paragraph>{content.summary}</Paragraph>
                {total !== null ? (
                    <p className="text-sm text-subtle">
                        {formatMessage(docs.endpoints.available, {
                            count: total.toLocaleString(LOCALE_DETAILS[locale].intl),
                            plural: content.plural,
                        })}
                    </p>
                ) : null}
            </div>

            <div className="space-y-4">
                <DocHeading id={resourceSectionId(resource.key, 'schema')} level={3}>
                    {content.sections.schema}
                </DocHeading>
                <PropertyTable
                    fields={describe(resource.fields, content.fields, `${context} fields`)}
                    labels={fieldLabels}
                />
            </div>

            <div className="space-y-4">
                <DocHeading id={resourceSectionId(resource.key, 'all')} level={3}>
                    {content.sections.all}
                </DocHeading>
                <Paragraph>
                    {formatMessage(docs.endpoints.all, { plural: content.plural })}
                </Paragraph>
                <Endpoint path={resource.path} />
                <ParameterTable parameters={listParameters} labels={parameterLabels} />
                <TryIt path={resource.path} queryParameters={listParameters.map(toTryIt)} />
            </div>

            <div className="space-y-4">
                <DocHeading id={resourceSectionId(resource.key, 'single')} level={3}>
                    {content.sections.single}
                </DocHeading>
                <Paragraph>{formatMessage(docs.endpoints.single, { one: content.one })}</Paragraph>
                <Endpoint path={`${resource.path}/{id}`} />
                {example ? (
                    <CodeBlock
                        code={formatJson(example)}
                        title={docs.exampleResponse}
                        titleStyle="label"
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
                <DocHeading id={resourceSectionId(resource.key, 'slug')} level={3}>
                    {content.sections.slug}
                </DocHeading>
                <Paragraph>{docs.endpoints.slug}</Paragraph>
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
                <DocHeading id={resourceSectionId(resource.key, 'random')} level={3}>
                    {content.sections.random}
                </DocHeading>
                <Paragraph>
                    {formatMessage(docs.endpoints.random, { plural: content.plural })}
                </Paragraph>
                <Endpoint path={`${resource.path}/random`} />
                <ParameterTable parameters={[count]} labels={parameterLabels} />
                <TryIt
                    path={`${resource.path}/random`}
                    queryParameters={[{ ...toTryIt(count), defaultValue: '3' }]}
                />
            </div>

            <div className="space-y-4">
                <DocHeading id={resourceSectionId(resource.key, 'filter')} level={3}>
                    {content.sections.filter}
                </DocHeading>
                <Paragraph>{docs.endpoints.filter}</Paragraph>
                <ParameterTable parameters={[...filters, sort]} labels={parameterLabels} />
                <CodeBlock code={`GET ${resource.filterExample}`} />
                <TryIt
                    path={resource.path}
                    queryParameters={[...filters, sort, ...pagination].map(toTryIt)}
                />
            </div>
        </section>
    );
}
