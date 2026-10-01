import { RESOURCES, type ResourceKey } from './docs';
import { API_URL } from './site';

const REVALIDATE_SECONDS = 3600;

export interface EpisodeReference {
    id: number;
    slug: string;
    title: string;
    code: string | null;
    url: string;
}

export interface Character {
    id: number;
    slug: string;
    name: string;
    species: string | null;
    status: string;
    role: string;
    image: string;
    firstAppearance: EpisodeReference | null;
    url: string;
}

export interface Paginated<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    links: Record<string, string | null>;
}

export interface ResourceCount {
    key: ResourceKey;
    path: string;
    total: number | null;
}

async function fetchJson<T>(path: string): Promise<T | null> {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        return response.ok ? ((await response.json()) as T) : null;
    } catch {
        return null;
    }
}

export async function getResourceCounts(): Promise<ResourceCount[]> {
    return Promise.all(
        RESOURCES.map(async (resource) => {
            const page = await fetchJson<Paginated<unknown>>(`${resource.path}?limit=1`);

            return { key: resource.key, path: resource.path, total: page?.meta.totalItems ?? null };
        })
    );
}

export async function getRandomCharacters(count: number): Promise<Character[]> {
    return (await fetchJson<Character[]>(`/characters/random?count=${count}`)) ?? [];
}

export async function getExample(path: string): Promise<unknown | null> {
    return fetchJson<unknown>(path);
}
