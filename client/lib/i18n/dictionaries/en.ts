function commonFields(of: string, path: string) {
    return {
        id: `The unique id of ${of}.`,
        slug: `A unique, URL-friendly identifier of ${of}.`,
        url: `The path of ${of} in the API, such as \`${path}/1\`.`,
        createdAt: 'When the item was added to the API, in ISO 8601.',
        updatedAt: 'When the item was last updated, in ISO 8601.',
    };
}

const searchByName = 'Case-insensitive partial match on the name.';
const searchByTitle = 'Case-insensitive partial match on the title.';
const idsFilter = 'Comma-separated list of ids, up to 100.';
const firstAppearanceFilter = 'Id of the episode where it first appears.';

export const en = {
    meta: {
        title: 'Gumball API · The Amazing World of Gumball REST API',
        description:
            'A free, read-only REST API about The Amazing World of Gumball: characters, locations, episodes, seasons, songs, games and in-universe media.',
        docsTitle: 'Documentation',
        docsDescription:
            'Learn how to use the Gumball API: base URL, pagination, filters, sorting, errors and every resource, with live requests you can run from the page.',
        contactTitle: 'Contact',
        contactDescription:
            'Questions, ideas or a data correction for the Gumball API? Send a message or support the project.',
        notFoundTitle: 'Page not found',
    },
    ui: {
        skipToContent: 'Skip to content',
        nav: {
            home: 'Home',
            docs: 'Docs',
            contact: 'Contact',
            main: 'Main',
            mobile: 'Mobile',
            footer: 'Footer',
            homeLink: 'Gumball API home',
            github: 'Source code on GitHub',
            viewOnGithub: 'View on GitHub',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
        },
        theme: {
            dark: 'Switch to dark theme',
            light: 'Switch to light theme',
        },
        language: {
            label: 'Language',
            change: 'Change language',
        },
        copy: {
            copy: 'Copy',
            copied: 'Copied',
            code: 'Copy code',
            baseUrl: 'Copy base URL',
            endpoint: 'Copy endpoint URL',
            requestUrl: 'Copy request URL',
        },
        codeExamples: 'Code examples',
        tryIt: {
            toggle: 'Try it',
            required: 'required',
            any: 'Any',
            send: 'Send request',
            sending: 'Sending',
            reset: 'Reset',
            response: 'Response',
            networkError:
                'The request could not be completed. Check your connection and try again.',
        },
        docsNav: {
            label: 'Documentation',
            onThisPage: 'On this page',
        },
        toast: {
            region: 'Notifications',
            dismiss: 'Dismiss notification',
        },
        contactForm: {
            name: 'Name',
            namePlaceholder: 'Your name',
            email: 'Email',
            emailPlaceholder: 'you@example.com',
            subject: 'Subject',
            subjectPlaceholder: 'Choose a subject',
            message: 'Message',
            messagePlaceholder: 'Tell me what you have in mind...',
            honeypot: 'Website',
            privacy: 'Your details are only used to reply to your message.',
            submit: 'Send message',
            submitting: 'Sending...',
            subjects: {
                general: 'General question',
                'data-correction': 'Data correction',
                'bug-report': 'Bug report',
                'feature-request': 'Feature request',
                partnership: 'Partnership or sponsorship',
                other: 'Other',
            },
            errors: {
                nameRequired: 'Please enter your name.',
                nameTooLong: 'Your name must have at most {max} characters.',
                emailInvalid: 'Please enter a valid email address.',
                subjectRequired: 'Please choose a subject.',
                messageTooShort: 'Your message must have at least {min} characters.',
                messageTooLong: 'Your message must have at most {max} characters.',
            },
            toasts: {
                invalidTitle: 'Please review the form',
                invalidDescription: 'Some fields need your attention before sending.',
                successTitle: 'Message sent',
                successDescription:
                    'Thanks for reaching out! Your message is on its way and I will reply to your email as soon as possible.',
                errorTitle: 'Message not sent',
                errorDescription:
                    'Something went wrong while sending your message. Please try again in a moment or email {email}.',
            },
        },
    },
    footer: {
        disclaimer:
            'An unofficial fan project. The Amazing World of Gumball and its characters are trademarks of Warner Bros. Discovery.',
        madeBy: 'Made by',
    },
    notFound: {
        title: 'This page wandered off',
        description:
            'Like most things in Elmore, it is not where you expected. Try the docs or head back home.',
        home: 'Back home',
        docs: 'Read the docs',
    },
    home: {
        title: 'The Amazing World of Gumball API',
        description:
            'Characters, locations, episodes, seasons, songs, games and in-universe media from Elmore, ready to use in your next project through a simple REST API.',
        readDocs: 'Read the docs',
        firstRequest: 'Make your first request',
        logoAlt: 'Gumball waving above the Gumball API logo',
        resources: {
            eyebrow: 'Resources',
            title: 'Seven resources, one consistent API',
            description:
                'Every resource supports pagination, filters, sorting, lookups by id or slug and random picks.',
        },
        quickStart: {
            eyebrow: 'Quick start',
            title: 'Your first request in seconds',
            description:
                'No sign-up, no keys and no SDK. Send a GET request from any language and get JSON back.',
            response: 'Response',
        },
        characters: {
            eyebrow: 'Characters',
            title: 'Meet the residents of Elmore',
            description: 'A random selection from the API, refreshed every hour.',
            explore: 'Explore characters',
            firstSeenIn: 'First seen in {title}',
            status: {
                alive: 'Alive',
                deceased: 'Deceased',
                undead: 'Undead',
                unknown: 'Unknown',
            },
        },
        features: {
            open: {
                title: 'Free and open',
                description:
                    'No authentication and CORS enabled for every origin. Call it from the browser, a server or the terminal.',
            },
            connected: {
                title: 'Connected data',
                description:
                    'Characters, songs and locations link to the episodes they appear in, so you can follow the story across resources.',
            },
            predictable: {
                title: 'Predictable by design',
                description:
                    'The same pagination, filters, sorting and error format on every route, all documented with live examples.',
            },
        },
    },
    contact: {
        eyebrow: 'Contact',
        title: 'Get in touch',
        intro: 'Found a wrong fact, missing a character or have an idea for the API? Send a message and I will get back to you. For questions about routes and parameters, check the {docs} first.',
        docsLink: 'documentation',
        social: {
            email: 'Email',
            linkedin: 'LinkedIn',
            instagram: 'Instagram',
            github: 'GitHub',
        },
        sponsor: {
            eyebrow: 'Support the project',
            title: 'Free for everyone, made with care',
            description:
                'The Gumball API is free and open source, and it will stay that way. Researching and writing original data for hundreds of entries, preparing every image and keeping the servers online takes time and money. If the API is useful to you, consider sponsoring its development. Every contribution helps keep it online, accurate and growing.',
            sponsor: 'Sponsor on GitHub',
            star: 'Star the repository',
            footnote:
                'Not able to sponsor? Starring the repository, reporting wrong data and sharing the API with other developers help just as much.',
        },
    },
    docs: {
        eyebrow: 'Documentation',
        groups: {
            gettingStarted: 'Getting started',
            resources: 'Resources',
        },
        sections: {
            introduction: 'Introduction',
            baseUrl: 'Base URL',
            rateLimit: 'Rate limit and caching',
            pagination: 'Info and pagination',
            sorting: 'Sorting',
            filtering: 'Filtering',
            references: 'Related resources',
            images: 'Images',
            errors: 'Errors',
        },
        table: {
            key: 'Key',
            header: 'Header',
            parameter: 'Parameter',
            type: 'Type',
            description: 'Description',
            status: 'Status',
            meaning: 'Meaning',
        },
        baseUrlLabel: 'Base URL',
        exampleResponse: 'Example response',
        introduction: [
            'The Gumball API is a free, read-only REST API with data about The Amazing World of Gumball and The Wonderfully Weird World of Gumball. It serves characters, locations, episodes, seasons, songs, games and in-universe media as JSON.',
            'There is no authentication, no API key and no sign-up. Every route is a `GET` request, so you can call it from a browser, a server or the terminal. Open any `Try it` panel on this page to send a real request and see the response.',
        ],
        contentLanguage: '',
        baseUrl:
            'All requests start with the base URL below. Its root lists every available resource, which makes it a good first request.',
        rateLimit: {
            description:
                'Each IP address can make up to 100 requests per minute. Every response reports your current usage in the headers below. When the limit is reached, the API answers with `429 Too Many Requests` until the window resets.',
            caching:
                'Lists and single items are cached for 5 minutes with `Cache-Control: public`, so repeated requests are fast. Random routes are never cached. Please cache responses on your side whenever possible.',
            headers: {
                'X-RateLimit-Limit': 'Requests allowed per minute.',
                'X-RateLimit-Remaining': 'Requests left in the current window.',
                'X-RateLimit-Reset': 'Seconds until the window resets.',
            },
        },
        pagination: {
            description:
                'List routes return 20 items per page by default. Use `page` and `limit` to move through the results. Besides the items in `data`, every list response includes `meta` with totals and `links` with ready-to-use paths to other pages.',
            parameters: {
                page: 'The page to return, starting at 1.',
                limit: 'Items per page, from 1 to 100. Defaults to 20.',
            },
            fields: {
                data: 'The items of the current page.',
                'meta.page': 'The current page, starting at 1.',
                'meta.limit': 'The number of items per page.',
                'meta.totalItems': 'The total number of items.',
                'meta.totalPages': 'The total number of pages.',
                'meta.hasNextPage': 'Whether a next page exists.',
                'meta.hasPreviousPage': 'Whether a previous page exists.',
                'links.self': 'The path of the current page.',
                'links.first': 'The path of the first page.',
                'links.previous': 'The path of the previous page, if any.',
                'links.next': 'The path of the next page, if any.',
                'links.last': 'The path of the last page.',
            },
        },
        sorting:
            'Use the `sort` parameter with a field name for ascending order, or prefix it with `-` for descending order. Items without a value for that field always come last. Each resource documents its sortable fields.',
        filtering: {
            description:
                'Every list route accepts filters as query parameters, and they can be combined freely. A few rules apply to all resources:',
            rules: [
                '`search` is a case-insensitive partial match on the name or title.',
                'Enum values are lowercase and kebab-case, such as `stop-motion` or `school-facility`.',
                '`ids` takes a comma-separated list, such as `ids=1,2,3`, to fetch several items at once.',
                'Unknown or invalid parameters are rejected with `400 Bad Request`, so typos never go unnoticed.',
            ],
        },
        references: {
            description:
                'Resources link to each other with small reference objects instead of bare ids. Each reference includes a `url` with the path to the full item.',
            fields: {
                EpisodeReference: {
                    id: 'The id of the episode.',
                    slug: 'The slug of the episode.',
                    title: 'The title of the episode.',
                    code: 'Season and episode code, such as `S01E01`.',
                    url: 'The path of the episode.',
                },
                CharacterReference: {
                    id: 'The id of the character.',
                    slug: 'The slug of the character.',
                    name: 'The name of the character.',
                    url: 'The path of the character.',
                },
                LocationReference: {
                    id: 'The id of the location.',
                    slug: 'The slug of the location.',
                    name: 'The name of the location.',
                    url: 'The path of the location.',
                },
            },
        },
        images: 'Images are served as WebP files from a public CDN through the `image` field of each item. They are high quality and most character images have a transparent background, so they work on any color.',
        errors: {
            description:
                'Errors use standard HTTP status codes and always return the same JSON shape.',
            fields: {
                statusCode: 'The HTTP status code.',
                error: 'The HTTP status text.',
                message: 'What went wrong. Validation errors list every problem.',
                path: 'The requested path.',
                timestamp: 'When the error happened.',
            },
            statusCodes: {
                200: 'The request succeeded.',
                400: 'An id, slug or query parameter is invalid.',
                404: 'The item or route does not exist.',
                429: 'The rate limit was exceeded. Wait for the window to reset.',
                500: 'Something went wrong on our side.',
            },
        },
        endpoints: {
            all: 'Returns a paginated list of {plural}, 20 per page by default.',
            single: 'Returns {one} by its numeric id.',
            slug: 'Slugs are stable, human-readable identifiers, handy for URLs in your own app.',
            random: 'Returns an array of random {plural}. Random responses are never cached, so every request returns a new selection.',
            filter: 'Combine any of these query parameters with each other, with pagination and with sorting.',
            sort: 'Field to sort by. Prefix it with `-` for descending order. Defaults to `{default}`.',
            count: 'How many items to return, from 1 to {max}. Defaults to 1.',
            available: '{count} {plural} available.',
        },
        resources: {
            characters: {
                title: 'Characters',
                plural: 'characters',
                one: 'one character',
                summary:
                    'Every named character of the series, from the Watterson family to the one-episode residents of Elmore.',
                sections: {
                    schema: 'Character schema',
                    all: 'Get all characters',
                    single: 'Get a single character',
                    slug: 'Get a character by slug',
                    random: 'Get random characters',
                    filter: 'Filter characters',
                },
                fields: {
                    ...commonFields('the character', '/characters'),
                    name: 'The name the character is best known by.',
                    fullName: 'The full name, when known.',
                    aliases: 'Nicknames and alternative names.',
                    description: 'A short description.',
                    species: 'The species or kind of being, such as `Cat` or `Fish`.',
                    gender: 'The gender of the character.',
                    age: 'The age in years, when stated in the show.',
                    occupation: 'The main occupation.',
                    role: 'How important the character is to the series.',
                    status: 'Whether the character is alive.',
                    animationStyle: 'How the character is animated.',
                    voiceActors: 'The actors who voiced the character.',
                    firstAppearance: 'The episode where the character first appears.',
                    colors: 'The main colors of the character, as hex codes.',
                    image: 'URL of the character image (WebP).',
                },
                filters: {
                    search: 'Case-insensitive partial match on the name and full name.',
                    species: 'Exact species, case-insensitive.',
                    gender: 'Filter by gender.',
                    role: 'Filter by role.',
                    status: 'Filter by status.',
                    animationStyle: 'Filter by animation style.',
                    voiceActor: 'Exact name of one of the voice actors.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
            locations: {
                title: 'Locations',
                plural: 'locations',
                one: 'one location',
                summary:
                    'Places of the Gumball universe, organized in a hierarchy: a classroom belongs to a school, which belongs to Elmore.',
                sections: {
                    schema: 'Location schema',
                    all: 'Get all locations',
                    single: 'Get a single location',
                    slug: 'Get a location by slug',
                    random: 'Get random locations',
                    filter: 'Filter locations',
                },
                fields: {
                    ...commonFields('the location', '/locations'),
                    name: 'The name of the location.',
                    description: 'A short description.',
                    type: 'The kind of place.',
                    parent: 'The location that contains this one.',
                    firstAppearance: 'The episode where the location first appears.',
                    image: 'URL of the location image (WebP).',
                },
                filters: {
                    search: searchByName,
                    type: 'Filter by type.',
                    parentId: 'Id of the parent location.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
            episodes: {
                title: 'Episodes',
                plural: 'episodes',
                one: 'one episode',
                summary:
                    'All episodes, specials, shorts and pilots, with air dates, credits and links to the previous and next episode.',
                sections: {
                    schema: 'Episode schema',
                    all: 'Get all episodes',
                    single: 'Get a single episode',
                    slug: 'Get an episode by slug',
                    random: 'Get random episodes',
                    filter: 'Filter episodes',
                },
                fields: {
                    ...commonFields('the episode', '/episodes'),
                    title: 'The title of the episode.',
                    description: 'A short synopsis.',
                    series: 'The series the episode belongs to.',
                    type: 'The kind of episode.',
                    status: 'Whether the episode was released.',
                    season: 'The season number.',
                    episodeNumber: 'The number of the episode within its season.',
                    overallNumber: 'The number of the episode across the whole series.',
                    code: 'Season and episode code, such as `S01E01`.',
                    productionCode: 'The production code.',
                    usAirDate: 'First US air date.',
                    ukAirDate: 'First UK air date.',
                    writers: 'The writers of the episode.',
                    storyboardArtists: 'The storyboard artists of the episode.',
                    previous: 'The previous episode in order.',
                    next: 'The next episode in order.',
                    image: 'URL of the episode image (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    series: 'Filter by series.',
                    type: 'Filter by type.',
                    status: 'Filter by status.',
                    season: 'Season number.',
                    writer: 'Exact name of one of the writers.',
                    storyboardArtist: 'Exact name of one of the storyboard artists.',
                    airedFrom: 'Aired in the US on or after this date (`YYYY-MM-DD`).',
                    airedTo: 'Aired in the US on or before this date (`YYYY-MM-DD`).',
                    ids: idsFilter,
                },
            },
            seasons: {
                title: 'Seasons',
                plural: 'seasons',
                one: 'one season',
                summary:
                    'The six seasons of The Amazing World of Gumball and the seasons of The Wonderfully Weird World of Gumball.',
                sections: {
                    schema: 'Season schema',
                    all: 'Get all seasons',
                    single: 'Get a single season',
                    slug: 'Get a season by slug',
                    random: 'Get random seasons',
                    filter: 'Filter seasons',
                },
                fields: {
                    ...commonFields('the season', '/seasons'),
                    number: 'The season number across both series.',
                    title: 'The title of the season.',
                    description: 'A short overview.',
                    series: 'The series the season belongs to.',
                    seriesSeasonNumber: 'The season number within its series.',
                    status: 'Whether the season is completed, airing or upcoming.',
                    episodeCount: 'The planned number of episodes.',
                    releasedEpisodeCount: 'The number of episodes already released.',
                    networks: 'The networks that aired it.',
                    usPremiereDate: 'US premiere date.',
                    usFinaleDate: 'US finale date.',
                    ukPremiereDate: 'UK premiere date.',
                    ukFinaleDate: 'UK finale date.',
                    episodes: 'Path that lists the episodes of the season.',
                    image: 'URL of the season image (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    series: 'Filter by series.',
                    status: 'Filter by status.',
                    ids: idsFilter,
                },
            },
            songs: {
                title: 'Songs',
                plural: 'songs',
                one: 'one song',
                summary:
                    'Songs performed in the show, from the opening theme to the musical numbers of each episode.',
                sections: {
                    schema: 'Song schema',
                    all: 'Get all songs',
                    single: 'Get a single song',
                    slug: 'Get a song by slug',
                    random: 'Get random songs',
                    filter: 'Filter songs',
                },
                fields: {
                    ...commonFields('the song', '/songs'),
                    title: 'The title of the song.',
                    description: 'A short description.',
                    type: 'The kind of song.',
                    episode: 'The episode where the song is performed.',
                    characters: 'The characters who sing it.',
                    vocalists: 'The real-world vocalists.',
                    genres: 'Musical genres.',
                    duration: 'Duration formatted as `m:ss`.',
                    durationSeconds: 'Duration in seconds.',
                    musicalKey: 'The musical key.',
                    image: 'URL of the song image (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    type: 'Filter by type.',
                    episodeId: 'Id of the episode.',
                    season: 'Season number of the episode.',
                    characterId: 'Id of a character who sings it.',
                    vocalist: 'Exact name of one of the vocalists.',
                    genre: 'Exact name of one of the genres.',
                    ids: idsFilter,
                },
            },
            games: {
                title: 'Games',
                plural: 'games',
                one: 'one game',
                summary:
                    'Official games set exclusively in the Gumball universe, from browser games to mobile apps.',
                sections: {
                    schema: 'Game schema',
                    all: 'Get all games',
                    single: 'Get a single game',
                    slug: 'Get a game by slug',
                    random: 'Get random games',
                    filter: 'Filter games',
                },
                fields: {
                    ...commonFields('the game', '/games'),
                    title: 'The title of the game.',
                    description: 'A short description.',
                    platforms: 'The platforms the game was released on.',
                    status: 'Whether the game is still available.',
                    releaseDate: 'The release date.',
                    releaseYear: 'The release year.',
                    developers: 'The studios behind the game.',
                    image: 'URL of the game image (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    platform: 'Filter by platform.',
                    status: 'Filter by status.',
                    developer: 'Exact name of one of the developers.',
                    releaseYear: 'Release year.',
                    ids: idsFilter,
                },
            },
            media: {
                title: 'Media',
                plural: 'media items',
                one: 'one media item',
                summary:
                    'Movies, shows, books and games that exist inside the Gumball universe, many of them parodies of real ones.',
                sections: {
                    schema: 'Media schema',
                    all: 'Get all media',
                    single: 'Get a single media item',
                    slug: 'Get a media item by slug',
                    random: 'Get random media',
                    filter: 'Filter media',
                },
                fields: {
                    ...commonFields('the media item', '/media'),
                    title: 'The title of the media item.',
                    description: 'A short description.',
                    type: 'The kind of media.',
                    parodyOf: 'The real-world work it parodies.',
                    firstAppearance: 'The episode where it first appears.',
                    image: 'URL of the media image (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    type: 'Filter by type.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
        },
    },
};

export type Dictionary = typeof en;
