import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildEpisode } from './fixtures/episode.fixture.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    episode: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
};

describe('Episodes (e2e)', () => {
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
        prismaMock.episode.findMany.mockReset();
    });

    it('GET /episodes returns a paginated list with neighbors and links', async () => {
        prismaMock.episode.findMany
            .mockResolvedValueOnce([buildEpisode({ id: 2, overallNumber: 2, episodeNumber: 2 })])
            .mockResolvedValueOnce([
                {
                    id: 1,
                    slug: 'the-dvd',
                    title: 'The DVD',
                    season: 1,
                    episodeNumber: 1,
                    overallNumber: 1,
                },
            ]);
        prismaMock.episode.count.mockResolvedValueOnce(305);

        const response = await request(app.getHttpServer())
            .get('/episodes?season=1&limit=1&page=2')
            .expect(200);

        expect(response.body.data[0]).toMatchObject({
            id: 2,
            code: 'S01E02',
            usAirDate: '2011-05-03',
            previous: { id: 1, code: 'S01E01', url: '/episodes/1' },
            next: null,
        });
        expect(response.body.meta).toMatchObject({ page: 2, limit: 1, totalItems: 305 });
        expect(response.body.links.next).toBe('/episodes?season=1&page=3&limit=1');
        expect(response.headers['cache-control']).toContain('public');
    });

    it('GET /episodes applies every filter and puts null dates last when sorting', async () => {
        prismaMock.episode.findMany.mockResolvedValueOnce([]);
        prismaMock.episode.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get(
                '/episodes?series=Wonderfully-Weird-World&type=episode&status=released&season=7' +
                    '&writer=Ben%20Bocquelet&storyboardArtist=Oliver%20Hamilton' +
                    '&airedFrom=2025-07-01&airedTo=2025-12-31&search=the&ids=1,2&sort=-usAirDate'
            )
            .expect(200);

        const [{ where, orderBy }] = prismaMock.episode.findMany.mock.calls[0] as [
            { where: Record<string, unknown>; orderBy: unknown },
        ];
        expect(where).toEqual({
            series: 'WONDERFULLY_WEIRD_WORLD',
            type: 'EPISODE',
            status: 'RELEASED',
            season: 7,
            id: { in: [1, 2] },
            title: { contains: 'the', mode: 'insensitive' },
            writers: { has: 'Ben Bocquelet' },
            storyboardArtists: { has: 'Oliver Hamilton' },
            usAirDate: {
                gte: new Date('2025-07-01T00:00:00.000Z'),
                lte: new Date('2025-12-31T00:00:00.000Z'),
            },
        });
        expect(orderBy).toEqual([{ usAirDate: { sort: 'desc', nulls: 'last' } }, { id: 'asc' }]);
    });

    it.each([
        ['an unknown series', 'series=regular-show'],
        ['an unknown type', 'type=movie'],
        ['an unknown status', 'status=cancelled'],
        ['season zero', 'season=0'],
        ['a season above the limit', 'season=100'],
        ['a malformed date', 'airedFrom=03/05/2011'],
        ['an impossible date', 'airedTo=2025-02-30'],
        ['an inverted date range', 'airedFrom=2020-01-01&airedTo=2019-01-01'],
        ['an invalid sort field', 'sort=season'],
        ['an unknown query parameter', 'gender=male'],
    ])('GET /episodes rejects %s with 400', async (_, query) => {
        const response = await request(app.getHttpServer()).get(`/episodes?${query}`).expect(400);

        expect(response.body).toMatchObject({ statusCode: 400, error: 'Bad Request' });
        expect(prismaMock.episode.findMany).not.toHaveBeenCalled();
    });

    it('GET /episodes/:id returns an episode with its neighbors', async () => {
        prismaMock.episode.findUnique.mockResolvedValueOnce(buildEpisode());
        prismaMock.episode.findMany.mockResolvedValueOnce([
            {
                id: 2,
                slug: 'the-responsible',
                title: 'The Responsible',
                season: 1,
                episodeNumber: 2,
                overallNumber: 2,
            },
        ]);

        const response = await request(app.getHttpServer()).get('/episodes/1').expect(200);

        expect(response.body).toMatchObject({
            id: 1,
            code: 'S01E01',
            previous: null,
            next: { id: 2, slug: 'the-responsible', code: 'S01E02' },
        });
    });

    it('GET /episodes/:id returns 404 for an unknown episode', async () => {
        prismaMock.episode.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/episodes/999').expect(404);

        expect(response.body.message).toBe('Episode with id 999 not found');
    });

    it.each(['abc', '0', '1.5'])('GET /episodes/%s returns 400', async (id) => {
        await request(app.getHttpServer()).get(`/episodes/${id}`).expect(400);
    });

    it('GET /episodes/slug/:slug returns an episode', async () => {
        prismaMock.episode.findUnique.mockResolvedValueOnce(buildEpisode());
        prismaMock.episode.findMany.mockResolvedValueOnce([]);

        await request(app.getHttpServer()).get('/episodes/slug/the-dvd').expect(200);

        expect(prismaMock.episode.findUnique).toHaveBeenCalledWith({ where: { slug: 'the-dvd' } });
    });

    it('GET /episodes/random returns the requested number of episodes', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 3 }, { id: 1 }]);
        prismaMock.episode.findMany
            .mockResolvedValueOnce([
                buildEpisode({ id: 1 }),
                buildEpisode({ id: 3, overallNumber: 3 }),
            ])
            .mockResolvedValueOnce([]);

        const response = await request(app.getHttpServer())
            .get('/episodes/random?count=2')
            .expect(200);

        expect(response.body.map((episode: { id: number }) => episode.id)).toEqual([3, 1]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)(
        '%s /episodes is not exposed',
        async (method) => {
            await request(app.getHttpServer())[method]('/episodes/1').send({}).expect(404);
        }
    );
});
