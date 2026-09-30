import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildSeason } from './fixtures/season.fixture.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    season: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
    episode: {
        groupBy: vi.fn(),
    },
};

describe('Seasons (e2e)', () => {
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
        prismaMock.season.findMany.mockReset();
        prismaMock.episode.groupBy.mockReset();
        prismaMock.episode.groupBy.mockResolvedValue([]);
    });

    it('GET /seasons returns a paginated list ordered by season number', async () => {
        prismaMock.season.findMany.mockResolvedValueOnce([buildSeason()]);
        prismaMock.season.count.mockResolvedValueOnce(8);
        prismaMock.episode.groupBy.mockResolvedValueOnce([{ season: 1, _count: { _all: 36 } }]);

        const response = await request(app.getHttpServer()).get('/seasons').expect(200);

        expect(response.body.data[0]).toMatchObject({
            id: 1,
            number: 1,
            releasedEpisodeCount: 36,
            episodes: '/episodes?season=1',
        });
        expect(response.body.meta).toMatchObject({ page: 1, totalItems: 8 });
        expect(response.headers['cache-control']).toContain('public');

        const [{ orderBy }] = prismaMock.season.findMany.mock.calls[0] as [{ orderBy: unknown }];
        expect(orderBy).toEqual([{ number: 'asc' }, { id: 'asc' }]);
        expect(prismaMock.episode.groupBy).toHaveBeenCalledWith({
            by: ['season'],
            where: { season: { in: [1] }, type: 'EPISODE', status: 'RELEASED' },
            _count: { _all: true },
        });
    });

    it('GET /seasons applies filters and puts seasons without dates last', async () => {
        prismaMock.season.findMany.mockResolvedValueOnce([]);
        prismaMock.season.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get(
                '/seasons?series=wonderfully-weird-world&status=Upcoming&search=season&ids=7,8&sort=-usPremiereDate'
            )
            .expect(200);

        const [{ where, orderBy }] = prismaMock.season.findMany.mock.calls[0] as [
            { where: unknown; orderBy: unknown },
        ];
        expect(where).toEqual({
            series: 'WONDERFULLY_WEIRD_WORLD',
            status: 'UPCOMING',
            id: { in: [7, 8] },
            title: { contains: 'season', mode: 'insensitive' },
        });
        expect(orderBy).toEqual([
            { usPremiereDate: { sort: 'desc', nulls: 'last' } },
            { id: 'asc' },
        ]);
        expect(prismaMock.episode.groupBy).not.toHaveBeenCalled();
    });

    it.each([
        ['an unknown series', 'series=regular-show'],
        ['an unknown status', 'status=cancelled'],
        ['an invalid sort field', 'sort=episodeCount'],
        ['limit above the maximum', 'limit=101'],
        ['an unknown query parameter', 'season=1'],
    ])('GET /seasons rejects %s with 400', async (_, query) => {
        await request(app.getHttpServer()).get(`/seasons?${query}`).expect(400);
        expect(prismaMock.season.findMany).not.toHaveBeenCalled();
    });

    it('GET /seasons/:id returns a season with its released episode count', async () => {
        prismaMock.season.findUnique.mockResolvedValueOnce(buildSeason({ id: 3, number: 3 }));
        prismaMock.episode.groupBy.mockResolvedValueOnce([{ season: 3, _count: { _all: 40 } }]);

        const response = await request(app.getHttpServer()).get('/seasons/3').expect(200);

        expect(response.body).toMatchObject({ id: 3, number: 3, releasedEpisodeCount: 40 });
    });

    it('GET /seasons/:id returns 404 for an unknown season', async () => {
        prismaMock.season.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/seasons/99').expect(404);

        expect(response.body.message).toBe('Season with id 99 not found');
    });

    it.each(['abc', '0', '1.5'])('GET /seasons/%s returns 400', async (id) => {
        await request(app.getHttpServer()).get(`/seasons/${id}`).expect(400);
    });

    it('GET /seasons/slug/:slug returns a season', async () => {
        prismaMock.season.findUnique.mockResolvedValueOnce(buildSeason());

        await request(app.getHttpServer()).get('/seasons/slug/season-1').expect(200);

        expect(prismaMock.season.findUnique).toHaveBeenCalledWith({ where: { slug: 'season-1' } });
    });

    it('GET /seasons/random caps the count at 10', async () => {
        await request(app.getHttpServer()).get('/seasons/random?count=11').expect(400);
    });

    it('GET /seasons/random returns seasons in random order', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 2 }, { id: 1 }]);
        prismaMock.season.findMany.mockResolvedValueOnce([
            buildSeason(),
            buildSeason({ id: 2, number: 2, slug: 'season-2' }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/seasons/random?count=2')
            .expect(200);

        expect(response.body.map((season: { id: number }) => season.id)).toEqual([2, 1]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)(
        '%s /seasons is not exposed',
        async (method) => {
            await request(app.getHttpServer())[method]('/seasons/1').send({}).expect(404);
        }
    );
});
