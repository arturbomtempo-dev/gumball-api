import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildSong } from './fixtures/song.fixture.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    song: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
};

const SONG_INCLUDE = {
    episode: {
        select: { id: true, slug: true, title: true, season: true, episodeNumber: true },
    },
    characters: {
        select: { character: { select: { id: true, slug: true, name: true } } },
        orderBy: { character: { id: 'asc' } },
    },
};

describe('Songs (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
            .overrideProvider(PrismaService)
            .useValue(prismaMock)
            .compile();

        app = moduleRef.createNestApplication<NestExpressApplication>();
        configureApp(app as NestExpressApplication);
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        prismaMock.song.findMany.mockReset();
    });

    it('GET /songs returns a paginated list with episode and character references', async () => {
        prismaMock.song.findMany.mockResolvedValueOnce([buildSong()]);
        prismaMock.song.count.mockResolvedValueOnce(160);

        const response = await request(app.getHttpServer()).get('/songs?limit=1').expect(200);

        expect(response.body.data[0]).toMatchObject({
            id: 1,
            duration: '2:36',
            episode: { code: 'S01E04', url: '/episodes/4' },
            characters: [{ slug: 'gaylord-robinson', url: '/characters/12' }],
        });
        expect(response.body.meta).toMatchObject({ totalItems: 160, totalPages: 160 });
        expect(response.body.links.next).toBe('/songs?page=2&limit=1');
        expect(response.headers['cache-control']).toContain('public');
    });

    it('GET /songs applies filters across relations and normalizes the genre', async () => {
        prismaMock.song.findMany.mockResolvedValueOnce([]);
        prismaMock.song.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get(
                '/songs?type=EPISODE&episodeId=4&season=1&characterId=12' +
                    '&vocalist=Dan%20Russell&genre=hip-hop&search=free&ids=1,2&sort=-durationSeconds'
            )
            .expect(200);

        const [{ where, orderBy, include }] = prismaMock.song.findMany.mock.calls[0] as [
            { where: unknown; orderBy: unknown; include: unknown },
        ];
        expect(where).toEqual({
            type: 'EPISODE',
            episodeId: 4,
            episode: { season: 1 },
            characters: { some: { characterId: 12 } },
            id: { in: [1, 2] },
            title: { contains: 'free', mode: 'insensitive' },
            vocalists: { has: 'Dan Russell' },
            genres: { has: 'Hip-Hop' },
        });
        expect(orderBy).toEqual([
            { durationSeconds: { sort: 'desc', nulls: 'last' } },
            { id: 'asc' },
        ]);
        expect(include).toEqual(SONG_INCLUDE);
    });

    it.each([
        ['an unknown type', 'type=opera'],
        ['a non-numeric episodeId', 'episodeId=the-debt'],
        ['a zero characterId', 'characterId=0'],
        ['season zero', 'season=0'],
        ['an invalid sort field', 'sort=genre'],
        ['an unknown query parameter', 'singer=Gumball'],
    ])('GET /songs rejects %s with 400', async (_, query) => {
        await request(app.getHttpServer()).get(`/songs?${query}`).expect(400);
        expect(prismaMock.song.findMany).not.toHaveBeenCalled();
    });

    it('GET /songs/:id returns a song', async () => {
        prismaMock.song.findUnique.mockResolvedValueOnce(buildSong());

        const response = await request(app.getHttpServer()).get('/songs/1').expect(200);

        expect(response.body).toMatchObject({ id: 1, title: 'I Wanna Be Free' });
        expect(prismaMock.song.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: SONG_INCLUDE,
        });
    });

    it('GET /songs/:id returns 404 for an unknown song', async () => {
        prismaMock.song.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/songs/999').expect(404);

        expect(response.body.message).toBe('Song with id 999 not found');
    });

    it('GET /songs/slug/:slug returns a song', async () => {
        prismaMock.song.findUnique.mockResolvedValueOnce(buildSong());

        await request(app.getHttpServer()).get('/songs/slug/i-wanna-be-free').expect(200);

        expect(prismaMock.song.findUnique).toHaveBeenCalledWith({
            where: { slug: 'i-wanna-be-free' },
            include: SONG_INCLUDE,
        });
    });

    it('GET /songs/random returns songs in random order', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 2 }, { id: 1 }]);
        prismaMock.song.findMany.mockResolvedValueOnce([
            buildSong(),
            buildSong({ id: 2, slug: 'the-dumb-song' }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/songs/random?count=2')
            .expect(200);

        expect(response.body.map((song: { id: number }) => song.id)).toEqual([2, 1]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)(
        '%s /songs is not exposed',
        async (method) => {
            await request(app.getHttpServer())[method]('/songs/1').send({}).expect(404);
        }
    );
});
