import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildMedia } from './fixtures/media.fixture.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    media: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
};

const MEDIA_INCLUDE = {
    firstAppearance: {
        select: { id: true, slug: true, title: true, season: true, episodeNumber: true },
    },
};

describe('Media (e2e)', () => {
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
        prismaMock.media.findMany.mockReset();
    });

    it('GET /media returns a paginated list with first appearance references', async () => {
        prismaMock.media.findMany.mockResolvedValueOnce([buildMedia()]);
        prismaMock.media.count.mockResolvedValueOnce(16);

        const response = await request(app.getHttpServer()).get('/media?limit=5').expect(200);

        expect(response.body.data[0]).toMatchObject({
            id: 1,
            type: 'movie',
            parodyOf: 'Star Wars',
            firstAppearance: { code: 'S05E38', url: '/episodes/194' },
            url: '/media/1',
        });
        expect(response.body.meta).toMatchObject({ totalItems: 16, totalPages: 4 });
        expect(response.body.links.next).toBe('/media?page=2&limit=5');
        expect(response.headers['cache-control']).toContain('public');
    });

    it('GET /media applies filters and sorting', async () => {
        prismaMock.media.findMany.mockResolvedValueOnce([]);
        prismaMock.media.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get('/media?type=TV-Show&firstAppearanceId=8&search=show&ids=1,2&sort=-title')
            .expect(200);

        const [{ where, orderBy, include }] = prismaMock.media.findMany.mock.calls[0] as [
            { where: unknown; orderBy: unknown; include: unknown },
        ];
        expect(where).toEqual({
            type: 'TV_SHOW',
            firstAppearanceId: 8,
            id: { in: [1, 2] },
            title: { contains: 'show', mode: 'insensitive' },
        });
        expect(orderBy).toEqual([{ title: 'desc' }, { id: 'asc' }]);
        expect(include).toEqual(MEDIA_INCLUDE);
    });

    it.each([
        ['an unknown type', 'type=podcast'],
        ['a non-numeric firstAppearanceId', 'firstAppearanceId=the-line'],
        ['an invalid sort field', 'sort=type'],
        ['an unknown query parameter', 'parodyOf=Star%20Wars'],
    ])('GET /media rejects %s with 400', async (_, query) => {
        await request(app.getHttpServer()).get(`/media?${query}`).expect(400);
        expect(prismaMock.media.findMany).not.toHaveBeenCalled();
    });

    it('GET /media/:id returns a media item', async () => {
        prismaMock.media.findUnique.mockResolvedValueOnce(buildMedia());

        const response = await request(app.getHttpServer()).get('/media/1').expect(200);

        expect(response.body).toMatchObject({ id: 1, title: 'Stellar Odyssey' });
        expect(prismaMock.media.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: MEDIA_INCLUDE,
        });
    });

    it('GET /media/:id returns 404 for an unknown item', async () => {
        prismaMock.media.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/media/99').expect(404);

        expect(response.body.message).toBe('Media with id 99 not found');
    });

    it('GET /media/slug/:slug returns a media item', async () => {
        prismaMock.media.findUnique.mockResolvedValueOnce(buildMedia());

        await request(app.getHttpServer()).get('/media/slug/stellar-odyssey').expect(200);

        expect(prismaMock.media.findUnique).toHaveBeenCalledWith({
            where: { slug: 'stellar-odyssey' },
            include: MEDIA_INCLUDE,
        });
    });

    it('GET /media/random returns items in random order', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 2 }, { id: 1 }]);
        prismaMock.media.findMany.mockResolvedValueOnce([
            buildMedia(),
            buildMedia({ id: 2, slug: 'clik-sap' }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/media/random?count=2')
            .expect(200);

        expect(response.body.map((item: { id: number }) => item.id)).toEqual([2, 1]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)(
        '%s /media is not exposed',
        async (method) => {
            await request(app.getHttpServer())[method]('/media/1').send({}).expect(404);
        }
    );
});
