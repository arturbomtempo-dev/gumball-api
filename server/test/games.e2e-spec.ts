import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildGame } from './fixtures/game.fixture.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    game: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
};

describe('Games (e2e)', () => {
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
        prismaMock.game.findMany.mockReset();
    });

    it('GET /games returns a paginated list', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce([buildGame()]);
        prismaMock.game.count.mockResolvedValueOnce(81);

        const response = await request(app.getHttpServer()).get('/games?limit=10').expect(200);

        expect(response.body.data[0]).toMatchObject({
            id: 1,
            platforms: ['web'],
            status: 'discontinued',
            releaseDate: '2012-01-30',
            url: '/games/1',
        });
        expect(response.body.data[0]).not.toHaveProperty('isCrossover');
        expect(response.body.meta).toMatchObject({ totalItems: 81, totalPages: 9 });
        expect(response.body.links.next).toBe('/games?page=2&limit=10');
        expect(response.headers['cache-control']).toContain('public');
    });

    it('GET /games applies every filter and puts undated games last', async () => {
        prismaMock.game.findMany.mockResolvedValueOnce([]);
        prismaMock.game.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get(
                '/games?platform=Mobile&status=available&developer=Purple%20Tree%20Games' +
                    '&releaseYear=2016&search=pizza&ids=1,2&sort=-releaseDate'
            )
            .expect(200);

        const [{ where, orderBy }] = prismaMock.game.findMany.mock.calls[0] as [
            { where: unknown; orderBy: unknown },
        ];
        expect(where).toEqual({
            status: 'AVAILABLE',
            releaseYear: 2016,
            platforms: { has: 'MOBILE' },
            developers: { has: 'Purple Tree Games' },
            id: { in: [1, 2] },
            title: { contains: 'pizza', mode: 'insensitive' },
        });
        expect(orderBy).toEqual([{ releaseDate: { sort: 'desc', nulls: 'last' } }, { id: 'asc' }]);
    });

    it.each([
        ['an unknown platform', 'platform=console'],
        ['an unknown status', 'status=cancelled'],
        ['the removed crossover filter', 'isCrossover=true'],
        ['a release year before 1990', 'releaseYear=1989'],
        ['an invalid sort field', 'sort=platforms'],
        ['an unknown query parameter', 'genre=racing'],
    ])('GET /games rejects %s with 400', async (_, query) => {
        await request(app.getHttpServer()).get(`/games?${query}`).expect(400);
        expect(prismaMock.game.findMany).not.toHaveBeenCalled();
    });

    it('GET /games/:id returns a game', async () => {
        prismaMock.game.findUnique.mockResolvedValueOnce(buildGame());

        const response = await request(app.getHttpServer()).get('/games/1').expect(200);

        expect(response.body).toMatchObject({ id: 1, title: 'School House Rush' });
        expect(prismaMock.game.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('GET /games/:id returns 404 for an unknown game', async () => {
        prismaMock.game.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/games/999').expect(404);

        expect(response.body.message).toBe('Game with id 999 not found');
    });

    it('GET /games/slug/:slug returns a game', async () => {
        prismaMock.game.findUnique.mockResolvedValueOnce(buildGame());

        await request(app.getHttpServer()).get('/games/slug/school-house-rush').expect(200);

        expect(prismaMock.game.findUnique).toHaveBeenCalledWith({
            where: { slug: 'school-house-rush' },
        });
    });

    it('GET /games/random returns games in random order', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 2 }, { id: 1 }]);
        prismaMock.game.findMany.mockResolvedValueOnce([
            buildGame(),
            buildGame({ id: 2, slug: 'blind-fooled' }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/games/random?count=2')
            .expect(200);

        expect(response.body.map((game: { id: number }) => game.id)).toEqual([2, 1]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)(
        '%s /games is not exposed',
        async (method) => {
            await request(app.getHttpServer())[method]('/games/1').send({}).expect(404);
        }
    );
});
