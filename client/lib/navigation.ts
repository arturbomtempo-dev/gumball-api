import { RESOURCES, sectionId, type ResourceKey } from './docs';
import type { Dictionary } from './i18n/dictionaries';

export interface DocsNavItem {
    id: string;
    label: string;
    children?: readonly { id: string; label: string }[];
}

export interface DocsNavGroup {
    title: string;
    items: readonly DocsNavItem[];
}

export const GUIDE_SECTION_KEYS = [
    'introduction',
    'baseUrl',
    'rateLimit',
    'pagination',
    'sorting',
    'filtering',
    'references',
    'images',
    'errors',
] as const;

export type GuideSectionKey = (typeof GUIDE_SECTION_KEYS)[number];

export const GUIDE_SECTION_IDS: Record<GuideSectionKey, string> = {
    introduction: 'introduction',
    baseUrl: 'base-url',
    rateLimit: 'rate-limit',
    pagination: 'pagination',
    sorting: 'sorting',
    filtering: 'filtering',
    references: 'references',
    images: 'images',
    errors: 'errors',
};

export const RESOURCE_SECTION_KEYS = [
    'schema',
    'all',
    'single',
    'slug',
    'random',
    'filter',
] as const;

export type ResourceSectionKey = (typeof RESOURCE_SECTION_KEYS)[number];

export function resourceSectionId(resource: ResourceKey, section: ResourceSectionKey): string {
    return sectionId(resource, section);
}

export function buildDocsNavigation(docs: Dictionary['docs']): DocsNavGroup[] {
    return [
        {
            title: docs.groups.gettingStarted,
            items: GUIDE_SECTION_KEYS.map((key) => ({
                id: GUIDE_SECTION_IDS[key],
                label: docs.sections[key],
            })),
        },
        {
            title: docs.groups.resources,
            items: RESOURCES.map((resource) => {
                const content = docs.resources[resource.key];

                return {
                    id: resource.key,
                    label: content.title,
                    children: RESOURCE_SECTION_KEYS.map((section) => ({
                        id: resourceSectionId(resource.key, section),
                        label: content.sections[section],
                    })),
                };
            }),
        },
    ];
}

export function navigationSectionIds(groups: readonly DocsNavGroup[]): string[] {
    return groups.flatMap((group) =>
        group.items.flatMap((item) => [item.id, ...(item.children ?? []).map((child) => child.id)])
    );
}
