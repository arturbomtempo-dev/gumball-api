import type { Prisma } from '../../generated/prisma/client.js';

export interface ParsedSort<TField extends string> {
    field: TField;
    direction: Prisma.SortOrder;
}

export function buildSortValues<TField extends string>(fields: readonly TField[]): string[] {
    return fields.flatMap((field) => [field, `-${field}`]);
}

export function parseSort<TField extends string>(sort: string): ParsedSort<TField> {
    const descending = sort.startsWith('-');

    return {
        field: (descending ? sort.slice(1) : sort) as TField,
        direction: descending ? 'desc' : 'asc',
    };
}
