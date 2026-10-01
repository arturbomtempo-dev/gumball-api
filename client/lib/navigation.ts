import { RESOURCES, sectionId } from './docs';

export interface DocsNavItem {
    id: string;
    label: string;
    children?: readonly { id: string; label: string }[];
}

export interface DocsNavGroup {
    title: string;
    items: readonly DocsNavItem[];
}

export const GUIDE_SECTIONS: readonly DocsNavItem[] = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'base-url', label: 'Base URL' },
    { id: 'rate-limit', label: 'Rate limit and caching' },
    { id: 'pagination', label: 'Info and pagination' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'filtering', label: 'Filtering' },
    { id: 'references', label: 'Related resources' },
    { id: 'images', label: 'Images' },
    { id: 'errors', label: 'Errors' },
];

export function resourceSections(key: string, singular: string, plural: string) {
    return [
        { id: sectionId(key, 'schema'), label: `${capitalize(singular)} schema` },
        { id: sectionId(key, 'all'), label: `Get all ${plural}` },
        { id: sectionId(key, 'single'), label: `Get a single ${singular}` },
        { id: sectionId(key, 'slug'), label: `Get ${article(singular)} ${singular} by slug` },
        { id: sectionId(key, 'random'), label: `Get random ${plural}` },
        { id: sectionId(key, 'filter'), label: `Filter ${plural}` },
    ];
}

export function article(word: string): string {
    return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const DOCS_NAVIGATION: readonly DocsNavGroup[] = [
    { title: 'Getting started', items: GUIDE_SECTIONS },
    {
        title: 'Resources',
        items: RESOURCES.map((resource) => ({
            id: resource.key,
            label: capitalize(resource.plural),
            children: resourceSections(resource.key, resource.singular, resource.plural),
        })),
    },
];

export const DOCS_SECTION_IDS: readonly string[] = DOCS_NAVIGATION.flatMap((group) =>
    group.items.flatMap((item) => [item.id, ...(item.children ?? []).map((child) => child.id)])
);
