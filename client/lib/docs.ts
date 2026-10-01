export interface FieldSpec {
    name: string;
    type: string;
    values?: readonly string[];
}

export interface ParameterSpec extends FieldSpec {
    placeholder?: string;
}

export interface DocField extends FieldSpec {
    description: string;
}

export interface DocParameter extends ParameterSpec {
    description: string;
}

export const RESOURCE_KEYS = [
    'characters',
    'locations',
    'episodes',
    'seasons',
    'songs',
    'games',
    'media',
] as const;

export type ResourceKey = (typeof RESOURCE_KEYS)[number];

export interface ResourceSpec {
    key: ResourceKey;
    path: string;
    exampleId: number;
    exampleSlug: string;
    randomMax: number;
    defaultSort: string;
    sortFields: readonly string[];
    fields: readonly FieldSpec[];
    filters: readonly ParameterSpec[];
    filterExample: string;
}

const GENDERS = ['male', 'female', 'other', 'unknown'] as const;
const ROLES = ['main', 'supporting', 'minor'] as const;
const CHARACTER_STATUSES = ['alive', 'deceased', 'undead', 'unknown'] as const;
const ANIMATION_STYLES = [
    '2d',
    'cgi',
    'stop-motion',
    'puppet',
    'live-action',
    'mixed-media',
    'other',
] as const;
const LOCATION_TYPES = [
    'town',
    'residence',
    'school',
    'school-facility',
    'shop',
    'restaurant',
    'business',
    'public-service',
    'leisure',
    'transport',
    'nature',
    'other-realm',
    'other',
] as const;
const SERIES = ['amazing-world', 'wonderfully-weird-world'] as const;
const EPISODE_TYPES = ['episode', 'special', 'short', 'pilot', 'film'] as const;
const EPISODE_STATUSES = ['released', 'unreleased', 'scrapped'] as const;
const SEASON_STATUSES = ['completed', 'airing', 'upcoming'] as const;
const SONG_TYPES = ['episode', 'theme', 'web'] as const;
const GAME_PLATFORMS = ['web', 'mobile', 'roblox', 'voice-assistant'] as const;
const GAME_STATUSES = ['available', 'discontinued', 'unknown'] as const;
const MEDIA_TYPES = ['tv-show', 'movie', 'comic', 'book', 'app', 'video-game', 'video'] as const;

const IDENTITY_FIELDS: readonly FieldSpec[] = [
    { name: 'id', type: 'integer' },
    { name: 'slug', type: 'string' },
];

const TRAILING_FIELDS: readonly FieldSpec[] = [
    { name: 'url', type: 'string' },
    { name: 'createdAt', type: 'datetime' },
    { name: 'updatedAt', type: 'datetime' },
];

const IDS_FILTER: ParameterSpec = { name: 'ids', type: 'integer[]', placeholder: '1,2,3' };

const SEARCH_FILTER: ParameterSpec = { name: 'search', type: 'string', placeholder: 'gumball' };

const FIRST_APPEARANCE_FILTER: ParameterSpec = {
    name: 'firstAppearanceId',
    type: 'integer',
    placeholder: '1',
};

export const RESOURCES: readonly ResourceSpec[] = [
    {
        key: 'characters',
        path: '/characters',
        exampleId: 1,
        exampleSlug: 'gumball-watterson',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'name', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'name', type: 'string' },
            { name: 'fullName', type: 'string | null' },
            { name: 'aliases', type: 'string[]' },
            { name: 'description', type: 'string | null' },
            { name: 'species', type: 'string | null' },
            { name: 'gender', type: 'enum', values: GENDERS },
            { name: 'age', type: 'integer | null' },
            { name: 'occupation', type: 'string | null' },
            { name: 'role', type: 'enum', values: ROLES },
            { name: 'status', type: 'enum', values: CHARACTER_STATUSES },
            { name: 'animationStyle', type: 'enum', values: ANIMATION_STYLES },
            { name: 'voiceActors', type: 'string[]' },
            { name: 'firstAppearance', type: 'EpisodeReference | null' },
            { name: 'colors', type: 'string[]' },
            { name: 'image', type: 'string' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'species', type: 'string', placeholder: 'Cat' },
            { name: 'gender', type: 'enum', values: GENDERS },
            { name: 'role', type: 'enum', values: ROLES },
            { name: 'status', type: 'enum', values: CHARACTER_STATUSES },
            { name: 'animationStyle', type: 'enum', values: ANIMATION_STYLES },
            { name: 'voiceActor', type: 'string', placeholder: 'Kwesi Boakye' },
            FIRST_APPEARANCE_FILTER,
            IDS_FILTER,
        ],
        filterExample: '/characters?species=cat&role=main',
    },
    {
        key: 'locations',
        path: '/locations',
        exampleId: 1,
        exampleSlug: 'elmore',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'name', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'name', type: 'string' },
            { name: 'description', type: 'string | null' },
            { name: 'type', type: 'enum', values: LOCATION_TYPES },
            { name: 'parent', type: 'LocationReference | null' },
            { name: 'firstAppearance', type: 'EpisodeReference | null' },
            { name: 'image', type: 'string' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'type', type: 'enum', values: LOCATION_TYPES },
            { name: 'parentId', type: 'integer', placeholder: '1' },
            FIRST_APPEARANCE_FILTER,
            IDS_FILTER,
        ],
        filterExample: '/locations?type=school-facility',
    },
    {
        key: 'episodes',
        path: '/episodes',
        exampleId: 1,
        exampleSlug: 'the-dvd',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'overallNumber', 'usAirDate', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string | null' },
            { name: 'series', type: 'enum', values: SERIES },
            { name: 'type', type: 'enum', values: EPISODE_TYPES },
            { name: 'status', type: 'enum', values: EPISODE_STATUSES },
            { name: 'season', type: 'integer | null' },
            { name: 'episodeNumber', type: 'integer | null' },
            { name: 'overallNumber', type: 'integer | null' },
            { name: 'code', type: 'string | null' },
            { name: 'productionCode', type: 'string | null' },
            { name: 'usAirDate', type: 'date | null' },
            { name: 'ukAirDate', type: 'date | null' },
            { name: 'writers', type: 'string[]' },
            { name: 'storyboardArtists', type: 'string[]' },
            { name: 'previous', type: 'EpisodeReference | null' },
            { name: 'next', type: 'EpisodeReference | null' },
            { name: 'image', type: 'string' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'series', type: 'enum', values: SERIES },
            { name: 'type', type: 'enum', values: EPISODE_TYPES },
            { name: 'status', type: 'enum', values: EPISODE_STATUSES },
            { name: 'season', type: 'integer', placeholder: '1' },
            { name: 'writer', type: 'string', placeholder: 'Ben Bocquelet' },
            { name: 'storyboardArtist', type: 'string', placeholder: 'Celine Gobinet' },
            { name: 'airedFrom', type: 'date', placeholder: '2011-05-03' },
            { name: 'airedTo', type: 'date', placeholder: '2011-12-31' },
            IDS_FILTER,
        ],
        filterExample: '/episodes?season=1&sort=-usAirDate',
    },
    {
        key: 'seasons',
        path: '/seasons',
        exampleId: 1,
        exampleSlug: 'season-1',
        randomMax: 10,
        defaultSort: 'number',
        sortFields: ['id', 'number', 'title', 'usPremiereDate', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'number', type: 'integer' },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string | null' },
            { name: 'series', type: 'enum', values: SERIES },
            { name: 'seriesSeasonNumber', type: 'integer' },
            { name: 'status', type: 'enum', values: SEASON_STATUSES },
            { name: 'episodeCount', type: 'integer | null' },
            { name: 'releasedEpisodeCount', type: 'integer' },
            { name: 'networks', type: 'string[]' },
            { name: 'usPremiereDate', type: 'date | null' },
            { name: 'usFinaleDate', type: 'date | null' },
            { name: 'ukPremiereDate', type: 'date | null' },
            { name: 'ukFinaleDate', type: 'date | null' },
            { name: 'episodes', type: 'string' },
            { name: 'image', type: 'string' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'series', type: 'enum', values: SERIES },
            { name: 'status', type: 'enum', values: SEASON_STATUSES },
            IDS_FILTER,
        ],
        filterExample: '/seasons?series=amazing-world',
    },
    {
        key: 'songs',
        path: '/songs',
        exampleId: 1,
        exampleSlug: 'opening-theme',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'durationSeconds', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string | null' },
            { name: 'type', type: 'enum', values: SONG_TYPES },
            { name: 'episode', type: 'EpisodeReference | null' },
            { name: 'characters', type: 'CharacterReference[]' },
            { name: 'vocalists', type: 'string[]' },
            { name: 'genres', type: 'string[]' },
            { name: 'duration', type: 'string | null' },
            { name: 'durationSeconds', type: 'integer | null' },
            { name: 'musicalKey', type: 'string | null' },
            { name: 'image', type: 'string | null' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'type', type: 'enum', values: SONG_TYPES },
            { name: 'episodeId', type: 'integer', placeholder: '1' },
            { name: 'season', type: 'integer', placeholder: '1' },
            { name: 'characterId', type: 'integer', placeholder: '1' },
            { name: 'vocalist', type: 'string', placeholder: 'Logan Grove' },
            { name: 'genre', type: 'string', placeholder: 'Pop' },
            IDS_FILTER,
        ],
        filterExample: '/songs?characterId=1&sort=-durationSeconds',
    },
    {
        key: 'games',
        path: '/games',
        exampleId: 1,
        exampleSlug: 'school-house-rush',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'releaseDate', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string | null' },
            { name: 'platforms', type: 'enum[]', values: GAME_PLATFORMS },
            { name: 'status', type: 'enum', values: GAME_STATUSES },
            { name: 'releaseDate', type: 'date | null' },
            { name: 'releaseYear', type: 'integer | null' },
            { name: 'developers', type: 'string[]' },
            { name: 'image', type: 'string' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'platform', type: 'enum', values: GAME_PLATFORMS },
            { name: 'status', type: 'enum', values: GAME_STATUSES },
            { name: 'developer', type: 'string', placeholder: 'Purple Tree Games' },
            { name: 'releaseYear', type: 'integer', placeholder: '2016' },
            IDS_FILTER,
        ],
        filterExample: '/games?platform=mobile&status=available',
    },
    {
        key: 'media',
        path: '/media',
        exampleId: 1,
        exampleSlug: 'alligators-on-a-train',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'createdAt', 'updatedAt'],
        fields: [
            ...IDENTITY_FIELDS,
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string | null' },
            { name: 'type', type: 'enum', values: MEDIA_TYPES },
            { name: 'parodyOf', type: 'string | null' },
            { name: 'firstAppearance', type: 'EpisodeReference | null' },
            { name: 'image', type: 'string' },
            ...TRAILING_FIELDS,
        ],
        filters: [
            SEARCH_FILTER,
            { name: 'type', type: 'enum', values: MEDIA_TYPES },
            FIRST_APPEARANCE_FILTER,
            IDS_FILTER,
        ],
        filterExample: '/media?type=movie',
    },
];

export const REFERENCE_NAMES = [
    'EpisodeReference',
    'CharacterReference',
    'LocationReference',
] as const;

export type ReferenceName = (typeof REFERENCE_NAMES)[number];

export const REFERENCE_OBJECTS: readonly { name: ReferenceName; fields: readonly FieldSpec[] }[] = [
    {
        name: 'EpisodeReference',
        fields: [
            { name: 'id', type: 'integer' },
            { name: 'slug', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'code', type: 'string | null' },
            { name: 'url', type: 'string' },
        ],
    },
    {
        name: 'CharacterReference',
        fields: [
            { name: 'id', type: 'integer' },
            { name: 'slug', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'url', type: 'string' },
        ],
    },
    {
        name: 'LocationReference',
        fields: [
            { name: 'id', type: 'integer' },
            { name: 'slug', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'url', type: 'string' },
        ],
    },
];

export const PAGINATION_FIELDS: readonly FieldSpec[] = [
    { name: 'data', type: 'array' },
    { name: 'meta.page', type: 'integer' },
    { name: 'meta.limit', type: 'integer' },
    { name: 'meta.totalItems', type: 'integer' },
    { name: 'meta.totalPages', type: 'integer' },
    { name: 'meta.hasNextPage', type: 'boolean' },
    { name: 'meta.hasPreviousPage', type: 'boolean' },
    { name: 'links.self', type: 'string' },
    { name: 'links.first', type: 'string' },
    { name: 'links.previous', type: 'string | null' },
    { name: 'links.next', type: 'string | null' },
    { name: 'links.last', type: 'string' },
];

export const PAGINATION_PARAMETERS: readonly ParameterSpec[] = [
    { name: 'page', type: 'integer', placeholder: '1' },
    { name: 'limit', type: 'integer', placeholder: '20' },
];

export const RATE_LIMIT_HEADERS: readonly FieldSpec[] = [
    { name: 'X-RateLimit-Limit', type: 'integer' },
    { name: 'X-RateLimit-Remaining', type: 'integer' },
    { name: 'X-RateLimit-Reset', type: 'integer' },
];

export const ERROR_FIELDS: readonly FieldSpec[] = [
    { name: 'statusCode', type: 'integer' },
    { name: 'error', type: 'string' },
    { name: 'message', type: 'string | string[]' },
    { name: 'path', type: 'string' },
    { name: 'timestamp', type: 'datetime' },
];

export const STATUS_CODES = [200, 400, 404, 429, 500] as const;

export type StatusCode = (typeof STATUS_CODES)[number];

export const ROOT_EXAMPLE = {
    name: 'The Amazing World of Gumball API',
    description:
        'A free, read-only REST API about The Amazing World of Gumball and The Wonderfully Weird World of Gumball. No authentication required.',
    resources: Object.fromEntries(RESOURCES.map((resource) => [resource.key, resource.path])),
};

export const ERROR_EXAMPLE = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Character with id 9999 not found',
    path: '/characters/9999',
    timestamp: '2026-10-01T12:00:00.000Z',
};

export function describe<T extends FieldSpec>(
    specs: readonly T[],
    descriptions: Readonly<Record<string, string>>,
    context: string
): (T & { description: string })[] {
    return specs.map((spec) => {
        const description = descriptions[spec.name];

        if (!description) {
            throw new Error(`Missing documentation for "${spec.name}" in ${context}.`);
        }

        return { ...spec, description };
    });
}

export function sectionId(...parts: string[]): string {
    return parts
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
