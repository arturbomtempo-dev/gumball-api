export interface DocField {
    name: string;
    type: string;
    description: string;
}

export interface DocParameter {
    name: string;
    type: string;
    description: string;
    values?: readonly string[];
    placeholder?: string;
}

export interface ResourceDoc {
    key: string;
    singular: string;
    plural: string;
    path: string;
    summary: string;
    exampleId: number;
    exampleSlug: string;
    randomMax: number;
    defaultSort: string;
    sortFields: readonly string[];
    fields: readonly DocField[];
    filters: readonly DocParameter[];
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

const list = (values: readonly string[]) => values.map((value) => `\`${value}\``).join(', ');

const timestamps: DocField[] = [
    {
        name: 'createdAt',
        type: 'datetime',
        description: 'When the item was added to the API, in ISO 8601.',
    },
    {
        name: 'updatedAt',
        type: 'datetime',
        description: 'When the item was last updated, in ISO 8601.',
    },
];

const identity = (singular: string): DocField[] => [
    { name: 'id', type: 'integer', description: `The unique id of the ${singular}.` },
    {
        name: 'slug',
        type: 'string',
        description: `A unique, URL-friendly identifier of the ${singular}.`,
    },
];

const pathField = (singular: string, path: string): DocField[] => [
    {
        name: 'url',
        type: 'string',
        description: `The path of the ${singular}, e.g. \`${path}/1\`.`,
    },
];

const idsFilter: DocParameter = {
    name: 'ids',
    type: 'integer[]',
    description: 'Comma-separated list of ids, up to 100.',
    placeholder: '1,2,3',
};

const searchFilter = (target: string): DocParameter => ({
    name: 'search',
    type: 'string',
    description: `Case-insensitive partial match on the ${target}.`,
    placeholder: 'gumball',
});

const firstAppearanceFilter: DocParameter = {
    name: 'firstAppearanceId',
    type: 'integer',
    description: 'Id of the episode where it first appears.',
    placeholder: '1',
};

export const RESOURCES: readonly ResourceDoc[] = [
    {
        key: 'characters',
        singular: 'character',
        plural: 'characters',
        path: '/characters',
        summary:
            'Every named character of the series, from the Watterson family to the one-episode residents of Elmore.',
        exampleId: 1,
        exampleSlug: 'gumball-watterson',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'name', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('character'),
            {
                name: 'name',
                type: 'string',
                description: 'The name the character is best known by.',
            },
            { name: 'fullName', type: 'string | null', description: 'The full name, when known.' },
            { name: 'aliases', type: 'string[]', description: 'Nicknames and alternative names.' },
            { name: 'description', type: 'string | null', description: 'A short description.' },
            {
                name: 'species',
                type: 'string | null',
                description: 'The species or kind of being, e.g. `Cat` or `Fish`.',
            },
            { name: 'gender', type: 'enum', description: `One of ${list(GENDERS)}.` },
            {
                name: 'age',
                type: 'integer | null',
                description: 'The age in years, when stated in the show.',
            },
            { name: 'occupation', type: 'string | null', description: 'The main occupation.' },
            { name: 'role', type: 'enum', description: `One of ${list(ROLES)}.` },
            { name: 'status', type: 'enum', description: `One of ${list(CHARACTER_STATUSES)}.` },
            {
                name: 'animationStyle',
                type: 'enum',
                description: `How the character is animated. One of ${list(ANIMATION_STYLES)}.`,
            },
            {
                name: 'voiceActors',
                type: 'string[]',
                description: 'The actors who voiced the character.',
            },
            {
                name: 'firstAppearance',
                type: 'EpisodeReference | null',
                description: 'The episode where the character first appears.',
            },
            {
                name: 'colors',
                type: 'string[]',
                description: 'The main colors of the character, as hex codes.',
            },
            { name: 'image', type: 'string', description: 'URL of the character image (WebP).' },
            ...pathField('character', '/characters'),
            ...timestamps,
        ],
        filters: [
            searchFilter('name and full name'),
            {
                name: 'species',
                type: 'string',
                description: 'Exact species, case-insensitive.',
                placeholder: 'Cat',
            },
            { name: 'gender', type: 'enum', description: 'Filter by gender.', values: GENDERS },
            { name: 'role', type: 'enum', description: 'Filter by role.', values: ROLES },
            {
                name: 'status',
                type: 'enum',
                description: 'Filter by status.',
                values: CHARACTER_STATUSES,
            },
            {
                name: 'animationStyle',
                type: 'enum',
                description: 'Filter by animation style.',
                values: ANIMATION_STYLES,
            },
            {
                name: 'voiceActor',
                type: 'string',
                description: 'Exact name of one of the voice actors.',
                placeholder: 'Kwesi Boakye',
            },
            firstAppearanceFilter,
            idsFilter,
        ],
        filterExample: '/characters?species=cat&role=main',
    },
    {
        key: 'locations',
        singular: 'location',
        plural: 'locations',
        path: '/locations',
        summary:
            'Places of the Gumball universe, organized in a hierarchy: a classroom belongs to a school, which belongs to Elmore.',
        exampleId: 1,
        exampleSlug: 'elmore',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'name', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('location'),
            { name: 'name', type: 'string', description: 'The name of the location.' },
            { name: 'description', type: 'string | null', description: 'A short description.' },
            { name: 'type', type: 'enum', description: `One of ${list(LOCATION_TYPES)}.` },
            {
                name: 'parent',
                type: 'LocationReference | null',
                description: 'The location that contains this one.',
            },
            {
                name: 'firstAppearance',
                type: 'EpisodeReference | null',
                description: 'The episode where the location first appears.',
            },
            { name: 'image', type: 'string', description: 'URL of the location image (WebP).' },
            ...pathField('location', '/locations'),
            ...timestamps,
        ],
        filters: [
            searchFilter('name'),
            { name: 'type', type: 'enum', description: 'Filter by type.', values: LOCATION_TYPES },
            {
                name: 'parentId',
                type: 'integer',
                description: 'Id of the parent location.',
                placeholder: '1',
            },
            firstAppearanceFilter,
            idsFilter,
        ],
        filterExample: '/locations?type=school-facility',
    },
    {
        key: 'episodes',
        singular: 'episode',
        plural: 'episodes',
        path: '/episodes',
        summary:
            'All episodes, specials, shorts and pilots, with air dates, credits and links to the previous and next episode.',
        exampleId: 1,
        exampleSlug: 'the-dvd',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'overallNumber', 'usAirDate', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('episode'),
            { name: 'title', type: 'string', description: 'The title of the episode.' },
            { name: 'description', type: 'string | null', description: 'A short synopsis.' },
            { name: 'series', type: 'enum', description: `One of ${list(SERIES)}.` },
            { name: 'type', type: 'enum', description: `One of ${list(EPISODE_TYPES)}.` },
            { name: 'status', type: 'enum', description: `One of ${list(EPISODE_STATUSES)}.` },
            { name: 'season', type: 'integer | null', description: 'The season number.' },
            {
                name: 'episodeNumber',
                type: 'integer | null',
                description: 'The number of the episode within its season.',
            },
            {
                name: 'overallNumber',
                type: 'integer | null',
                description: 'The number of the episode across the whole series.',
            },
            {
                name: 'code',
                type: 'string | null',
                description: 'Season and episode code, e.g. `S01E01`.',
            },
            {
                name: 'productionCode',
                type: 'string | null',
                description: 'The production code.',
            },
            { name: 'usAirDate', type: 'date | null', description: 'First US air date.' },
            { name: 'ukAirDate', type: 'date | null', description: 'First UK air date.' },
            { name: 'writers', type: 'string[]', description: 'The writers of the episode.' },
            {
                name: 'storyboardArtists',
                type: 'string[]',
                description: 'The storyboard artists of the episode.',
            },
            {
                name: 'previous',
                type: 'EpisodeReference | null',
                description: 'The previous episode in order.',
            },
            {
                name: 'next',
                type: 'EpisodeReference | null',
                description: 'The next episode in order.',
            },
            { name: 'image', type: 'string', description: 'URL of the episode image (WebP).' },
            ...pathField('episode', '/episodes'),
            ...timestamps,
        ],
        filters: [
            searchFilter('title'),
            { name: 'series', type: 'enum', description: 'Filter by series.', values: SERIES },
            { name: 'type', type: 'enum', description: 'Filter by type.', values: EPISODE_TYPES },
            {
                name: 'status',
                type: 'enum',
                description: 'Filter by status.',
                values: EPISODE_STATUSES,
            },
            { name: 'season', type: 'integer', description: 'Season number.', placeholder: '1' },
            {
                name: 'writer',
                type: 'string',
                description: 'Exact name of one of the writers.',
                placeholder: 'Ben Bocquelet',
            },
            {
                name: 'storyboardArtist',
                type: 'string',
                description: 'Exact name of one of the storyboard artists.',
                placeholder: 'Celine Gobinet',
            },
            {
                name: 'airedFrom',
                type: 'date',
                description: 'Aired in the US on or after this date (`YYYY-MM-DD`).',
                placeholder: '2011-05-03',
            },
            {
                name: 'airedTo',
                type: 'date',
                description: 'Aired in the US on or before this date (`YYYY-MM-DD`).',
                placeholder: '2011-12-31',
            },
            idsFilter,
        ],
        filterExample: '/episodes?season=1&sort=-usAirDate',
    },
    {
        key: 'seasons',
        singular: 'season',
        plural: 'seasons',
        path: '/seasons',
        summary:
            'The six seasons of The Amazing World of Gumball and the seasons of The Wonderfully Weird World of Gumball.',
        exampleId: 1,
        exampleSlug: 'season-1',
        randomMax: 10,
        defaultSort: 'number',
        sortFields: ['id', 'number', 'title', 'usPremiereDate', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('season'),
            {
                name: 'number',
                type: 'integer',
                description: 'The season number across both series.',
            },
            { name: 'title', type: 'string', description: 'The title of the season.' },
            { name: 'description', type: 'string | null', description: 'A short overview.' },
            { name: 'series', type: 'enum', description: `One of ${list(SERIES)}.` },
            {
                name: 'seriesSeasonNumber',
                type: 'integer',
                description: 'The season number within its series.',
            },
            { name: 'status', type: 'enum', description: `One of ${list(SEASON_STATUSES)}.` },
            {
                name: 'episodeCount',
                type: 'integer | null',
                description: 'The planned number of episodes.',
            },
            {
                name: 'releasedEpisodeCount',
                type: 'integer',
                description: 'The number of episodes already released.',
            },
            { name: 'networks', type: 'string[]', description: 'The networks that aired it.' },
            { name: 'usPremiereDate', type: 'date | null', description: 'US premiere date.' },
            { name: 'usFinaleDate', type: 'date | null', description: 'US finale date.' },
            { name: 'ukPremiereDate', type: 'date | null', description: 'UK premiere date.' },
            { name: 'ukFinaleDate', type: 'date | null', description: 'UK finale date.' },
            {
                name: 'episodes',
                type: 'string',
                description: 'Path that lists the episodes of the season.',
            },
            { name: 'image', type: 'string', description: 'URL of the season image (WebP).' },
            ...pathField('season', '/seasons'),
            ...timestamps,
        ],
        filters: [
            searchFilter('title'),
            { name: 'series', type: 'enum', description: 'Filter by series.', values: SERIES },
            {
                name: 'status',
                type: 'enum',
                description: 'Filter by status.',
                values: SEASON_STATUSES,
            },
            idsFilter,
        ],
        filterExample: '/seasons?series=amazing-world',
    },
    {
        key: 'songs',
        singular: 'song',
        plural: 'songs',
        path: '/songs',
        summary:
            'Songs performed in the show, from the opening theme to the musical numbers of each episode.',
        exampleId: 1,
        exampleSlug: 'opening-theme',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'durationSeconds', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('song'),
            { name: 'title', type: 'string', description: 'The title of the song.' },
            { name: 'description', type: 'string | null', description: 'A short description.' },
            { name: 'type', type: 'enum', description: `One of ${list(SONG_TYPES)}.` },
            {
                name: 'episode',
                type: 'EpisodeReference | null',
                description: 'The episode where the song is performed.',
            },
            {
                name: 'characters',
                type: 'CharacterReference[]',
                description: 'The characters who sing it.',
            },
            { name: 'vocalists', type: 'string[]', description: 'The real-world vocalists.' },
            { name: 'genres', type: 'string[]', description: 'Musical genres.' },
            {
                name: 'duration',
                type: 'string | null',
                description: 'Duration formatted as `m:ss`.',
            },
            {
                name: 'durationSeconds',
                type: 'integer | null',
                description: 'Duration in seconds.',
            },
            { name: 'musicalKey', type: 'string | null', description: 'The musical key.' },
            { name: 'image', type: 'string | null', description: 'URL of the song image (WebP).' },
            ...pathField('song', '/songs'),
            ...timestamps,
        ],
        filters: [
            searchFilter('title'),
            { name: 'type', type: 'enum', description: 'Filter by type.', values: SONG_TYPES },
            {
                name: 'episodeId',
                type: 'integer',
                description: 'Id of the episode.',
                placeholder: '1',
            },
            {
                name: 'season',
                type: 'integer',
                description: 'Season number of the episode.',
                placeholder: '1',
            },
            {
                name: 'characterId',
                type: 'integer',
                description: 'Id of a character who sings it.',
                placeholder: '1',
            },
            {
                name: 'vocalist',
                type: 'string',
                description: 'Exact name of one of the vocalists.',
                placeholder: 'Logan Grove',
            },
            {
                name: 'genre',
                type: 'string',
                description: 'Exact name of one of the genres.',
                placeholder: 'Pop',
            },
            idsFilter,
        ],
        filterExample: '/songs?characterId=1&sort=-durationSeconds',
    },
    {
        key: 'games',
        singular: 'game',
        plural: 'games',
        path: '/games',
        summary:
            'Official games set exclusively in the Gumball universe, from browser games to mobile apps.',
        exampleId: 1,
        exampleSlug: 'school-house-rush',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'releaseDate', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('game'),
            { name: 'title', type: 'string', description: 'The title of the game.' },
            { name: 'description', type: 'string | null', description: 'A short description.' },
            {
                name: 'platforms',
                type: 'enum[]',
                description: `Any of ${list(GAME_PLATFORMS)}.`,
            },
            { name: 'status', type: 'enum', description: `One of ${list(GAME_STATUSES)}.` },
            { name: 'releaseDate', type: 'date | null', description: 'The release date.' },
            {
                name: 'releaseYear',
                type: 'integer | null',
                description: 'The release year.',
            },
            { name: 'developers', type: 'string[]', description: 'The studios behind the game.' },
            { name: 'image', type: 'string', description: 'URL of the game image (WebP).' },
            ...pathField('game', '/games'),
            ...timestamps,
        ],
        filters: [
            searchFilter('title'),
            {
                name: 'platform',
                type: 'enum',
                description: 'Filter by platform.',
                values: GAME_PLATFORMS,
            },
            {
                name: 'status',
                type: 'enum',
                description: 'Filter by status.',
                values: GAME_STATUSES,
            },
            {
                name: 'developer',
                type: 'string',
                description: 'Exact name of one of the developers.',
                placeholder: 'Purple Tree Games',
            },
            {
                name: 'releaseYear',
                type: 'integer',
                description: 'Release year.',
                placeholder: '2016',
            },
            idsFilter,
        ],
        filterExample: '/games?platform=mobile&status=available',
    },
    {
        key: 'media',
        singular: 'media item',
        plural: 'media',
        path: '/media',
        summary:
            'Movies, shows, books and games that exist inside the Gumball universe, many of them parodies of real ones.',
        exampleId: 1,
        exampleSlug: 'alligators-on-a-train',
        randomMax: 20,
        defaultSort: 'id',
        sortFields: ['id', 'title', 'createdAt', 'updatedAt'],
        fields: [
            ...identity('media item'),
            { name: 'title', type: 'string', description: 'The title of the media item.' },
            { name: 'description', type: 'string | null', description: 'A short description.' },
            { name: 'type', type: 'enum', description: `One of ${list(MEDIA_TYPES)}.` },
            {
                name: 'parodyOf',
                type: 'string | null',
                description: 'The real-world work it parodies.',
            },
            {
                name: 'firstAppearance',
                type: 'EpisodeReference | null',
                description: 'The episode where it first appears.',
            },
            { name: 'image', type: 'string', description: 'URL of the media image (WebP).' },
            ...pathField('media item', '/media'),
            ...timestamps,
        ],
        filters: [
            searchFilter('title'),
            { name: 'type', type: 'enum', description: 'Filter by type.', values: MEDIA_TYPES },
            firstAppearanceFilter,
            idsFilter,
        ],
        filterExample: '/media?type=movie',
    },
];

export const REFERENCE_OBJECTS: readonly { name: string; fields: readonly DocField[] }[] = [
    {
        name: 'EpisodeReference',
        fields: [
            { name: 'id', type: 'integer', description: 'The id of the episode.' },
            { name: 'slug', type: 'string', description: 'The slug of the episode.' },
            { name: 'title', type: 'string', description: 'The title of the episode.' },
            { name: 'code', type: 'string | null', description: 'Code such as `S01E01`.' },
            { name: 'url', type: 'string', description: 'The path of the episode.' },
        ],
    },
    {
        name: 'CharacterReference',
        fields: [
            { name: 'id', type: 'integer', description: 'The id of the character.' },
            { name: 'slug', type: 'string', description: 'The slug of the character.' },
            { name: 'name', type: 'string', description: 'The name of the character.' },
            { name: 'url', type: 'string', description: 'The path of the character.' },
        ],
    },
    {
        name: 'LocationReference',
        fields: [
            { name: 'id', type: 'integer', description: 'The id of the location.' },
            { name: 'slug', type: 'string', description: 'The slug of the location.' },
            { name: 'name', type: 'string', description: 'The name of the location.' },
            { name: 'url', type: 'string', description: 'The path of the location.' },
        ],
    },
];

export const PAGINATION_FIELDS: readonly DocField[] = [
    { name: 'data', type: 'array', description: 'The items of the current page.' },
    { name: 'meta.page', type: 'integer', description: 'The current page, starting at 1.' },
    { name: 'meta.limit', type: 'integer', description: 'The number of items per page.' },
    { name: 'meta.totalItems', type: 'integer', description: 'The total number of items.' },
    { name: 'meta.totalPages', type: 'integer', description: 'The total number of pages.' },
    { name: 'meta.hasNextPage', type: 'boolean', description: 'Whether a next page exists.' },
    {
        name: 'meta.hasPreviousPage',
        type: 'boolean',
        description: 'Whether a previous page exists.',
    },
    { name: 'links.self', type: 'string', description: 'The path of the current page.' },
    { name: 'links.first', type: 'string', description: 'The path of the first page.' },
    { name: 'links.previous', type: 'string | null', description: 'The previous page, if any.' },
    { name: 'links.next', type: 'string | null', description: 'The next page, if any.' },
    { name: 'links.last', type: 'string', description: 'The path of the last page.' },
];

export const PAGINATION_PARAMETERS: readonly DocParameter[] = [
    {
        name: 'page',
        type: 'integer',
        description: 'The page to return, starting at 1.',
        placeholder: '1',
    },
    {
        name: 'limit',
        type: 'integer',
        description: 'Items per page, from 1 to 100. Defaults to 20.',
        placeholder: '20',
    },
];

export const ERROR_FIELDS: readonly DocField[] = [
    { name: 'statusCode', type: 'integer', description: 'The HTTP status code.' },
    { name: 'error', type: 'string', description: 'The HTTP status text.' },
    {
        name: 'message',
        type: 'string | string[]',
        description: 'What went wrong. Validation errors list every problem.',
    },
    { name: 'path', type: 'string', description: 'The requested path.' },
    { name: 'timestamp', type: 'datetime', description: 'When the error happened.' },
];

export const STATUS_CODES: readonly { code: number; meaning: string }[] = [
    { code: 200, meaning: 'The request succeeded.' },
    { code: 400, meaning: 'An id, slug or query parameter is invalid.' },
    { code: 404, meaning: 'The item or route does not exist.' },
    { code: 429, meaning: 'The rate limit was exceeded. Wait for the window to reset.' },
    { code: 500, meaning: 'Something went wrong on our side.' },
];

export const ROOT_EXAMPLE = {
    name: 'The Amazing World of Gumball API',
    description:
        'A free, read-only REST API about The Amazing World of Gumball and The Wonderfully Weird World of Gumball. No authentication required.',
    resources: Object.fromEntries(RESOURCES.map((resource) => [resource.key, resource.path])),
};

export function sectionId(...parts: string[]): string {
    return parts
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
