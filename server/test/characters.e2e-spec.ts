import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildCharacter } from './fixtures/character.fixture.js';

const readerMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    character: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
};

describe('Characters (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
            .overrideProvider(PrismaService)
            .useValue(readerMock)
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
    });

    it('GET /characters returns a paginated list with links', async () => {
        readerMock.character.findMany.mockResolvedValueOnce([buildCharacter()]);
        readerMock.character.count.mockResolvedValueOnce(45);

        const response = await request(app.getHttpServer())
            .get('/characters?page=2&limit=20&species=cat')
            .expect(200);

        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toMatchObject({
            id: 1,
            gender: 'male',
            animationStyle: '2d',
        });
        expect(response.body.meta).toEqual({
            page: 2,
            limit: 20,
            totalItems: 45,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true,
        });
        expect(response.body.links.next).toBe('/characters?species=cat&page=3&limit=20');
        expect(response.headers['cache-control']).toContain('public');
        expect(readerMock.character.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ skip: 20, take: 20 })
        );
    });

    it('GET /characters applies defaults', async () => {
        readerMock.character.findMany.mockResolvedValueOnce([]);
        readerMock.character.count.mockResolvedValueOnce(0);

        const response = await request(app.getHttpServer()).get('/characters').expect(200);

        expect(response.body.meta).toMatchObject({ page: 1, limit: 20, totalPages: 1 });
        expect(readerMock.character.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ orderBy: [{ id: 'asc' }, { id: 'asc' }] })
        );
    });

    it('GET /characters filters by ids, enums and search', async () => {
        readerMock.character.findMany.mockResolvedValueOnce([]);
        readerMock.character.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get(
                '/characters?ids=1,2,3&gender=FEMALE&animationStyle=stop-motion&search=penny&sort=-name'
            )
            .expect(200);

        const [{ where, orderBy }] = readerMock.character.findMany.mock.calls[0] as [
            { where: Record<string, unknown>; orderBy: unknown },
        ];
        expect(where).toMatchObject({
            id: { in: [1, 2, 3] },
            gender: 'FEMALE',
            animationStyle: 'STOP_MOTION',
        });
        expect(where['OR']).toHaveLength(3);
        expect(orderBy).toEqual([{ name: 'desc' }, { id: 'asc' }]);
    });

    it('GET /characters filters by the first appearance episode', async () => {
        readerMock.character.findMany.mockResolvedValueOnce([]);
        readerMock.character.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer()).get('/characters?firstAppearanceId=1').expect(200);

        const [{ where }] = readerMock.character.findMany.mock.calls[0] as [
            { where: Record<string, unknown> },
        ];
        expect(where['firstAppearanceId']).toBe(1);
    });

    it('GET /characters rejects an invalid firstAppearanceId with 400', async () => {
        await request(app.getHttpServer()).get('/characters?firstAppearanceId=the-dvd').expect(400);
    });

    it.each([
        ['limit above the maximum', 'limit=101'],
        ['page zero', 'page=0'],
        ['an unknown gender', 'gender=robot'],
        ['an invalid sort field', 'sort=password'],
        ['non-numeric ids', 'ids=1,abc'],
        ['too many ids', `ids=${Array.from({ length: 101 }, (_, index) => index + 1).join(',')}`],
        ['an unknown query parameter', 'isAdmin=true'],
        ['a duplicated scalar parameter', 'gender=male&gender=female'],
    ])('GET /characters rejects %s with 400', async (_, query) => {
        const response = await request(app.getHttpServer()).get(`/characters?${query}`).expect(400);

        expect(response.body).toMatchObject({ statusCode: 400, error: 'Bad Request' });
        expect(readerMock.character.findMany).not.toHaveBeenCalled();
    });

    it('GET /characters/:id returns a character', async () => {
        readerMock.character.findUnique.mockResolvedValueOnce(buildCharacter());

        const response = await request(app.getHttpServer()).get('/characters/1').expect(200);

        expect(response.body).toMatchObject({
            id: 1,
            slug: 'gumball-watterson',
            url: '/characters/1',
        });
        expect(readerMock.character.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: {
                firstAppearance: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        season: true,
                        episodeNumber: true,
                    },
                },
            },
        });
        expect(response.body.firstAppearance).toEqual({
            id: 1,
            slug: 'the-dvd',
            title: 'The DVD',
            code: 'S01E01',
            url: '/episodes/1',
        });
    });

    it('GET /characters/:id returns 404 for an unknown character', async () => {
        readerMock.character.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/characters/999').expect(404);

        expect(response.body.message).toBe('Character with id 999 not found');
    });

    it.each(['abc', '0', '-1', '1.5', '99999999999'])(
        'GET /characters/%s returns 400',
        async (id) => {
            await request(app.getHttpServer()).get(`/characters/${id}`).expect(400);
            expect(readerMock.character.findUnique).not.toHaveBeenCalled();
        }
    );

    it('GET /characters/slug/:slug returns a character', async () => {
        readerMock.character.findUnique.mockResolvedValueOnce(buildCharacter());

        await request(app.getHttpServer()).get('/characters/slug/gumball-watterson').expect(200);

        expect(readerMock.character.findUnique).toHaveBeenCalledWith({
            where: { slug: 'gumball-watterson' },
            include: {
                firstAppearance: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        season: true,
                        episodeNumber: true,
                    },
                },
            },
        });
    });

    it('GET /characters/slug/:slug rejects an invalid slug', async () => {
        await request(app.getHttpServer()).get('/characters/slug/Not_A_Slug').expect(400);
    });

    it('GET /characters/random returns the requested number of characters', async () => {
        readerMock.$queryRaw.mockResolvedValueOnce([{ id: 2 }, { id: 1 }]);
        readerMock.character.findMany.mockResolvedValueOnce([
            buildCharacter({ id: 1 }),
            buildCharacter({ id: 2, slug: 'darwin-watterson' }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/characters/random?count=2')
            .expect(200);

        expect(response.body.map((character: { id: number }) => character.id)).toEqual([2, 1]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it('GET /characters/random rejects a count above the limit', async () => {
        await request(app.getHttpServer()).get('/characters/random?count=21').expect(400);
    });

    it.each(
        (['post', 'put', 'patch', 'delete'] as const).flatMap((method) =>
            ['/characters', '/characters/1', '/admin/characters'].map(
                (path) => [method, path] as const
            )
        )
    )('%s %s is not exposed', async (method, path) => {
        await request(app.getHttpServer())[method](path).send({ name: 'x' }).expect(404);
    });
});
