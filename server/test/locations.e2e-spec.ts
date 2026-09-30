import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { buildLocation } from './fixtures/location.fixture.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
    location: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
    },
};

describe('Locations (e2e)', () => {
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
    });

    it('GET /locations returns a paginated list with links', async () => {
        prismaMock.location.findMany.mockResolvedValueOnce([buildLocation()]);
        prismaMock.location.count.mockResolvedValueOnce(112);

        const response = await request(app.getHttpServer())
            .get('/locations?page=2&limit=10&type=school')
            .expect(200);

        expect(response.body.data[0]).toMatchObject({
            id: 2,
            type: 'school',
            parent: { id: 1, slug: 'elmore', url: '/locations/1' },
        });
        expect(response.body.meta).toEqual({
            page: 2,
            limit: 10,
            totalItems: 112,
            totalPages: 12,
            hasNextPage: true,
            hasPreviousPage: true,
        });
        expect(response.body.links.next).toBe('/locations?type=school&page=3&limit=10');
        expect(response.headers['cache-control']).toContain('public');
    });

    it('GET /locations filters by type, parent, ids and search and sorts', async () => {
        prismaMock.location.findMany.mockResolvedValueOnce([]);
        prismaMock.location.count.mockResolvedValueOnce(0);

        await request(app.getHttpServer())
            .get('/locations?type=School-Facility&parentId=2&ids=3,4&search=room&sort=-name')
            .expect(200);

        const [{ where, orderBy, include }] = prismaMock.location.findMany.mock.calls[0] as [
            { where: Record<string, unknown>; orderBy: unknown; include: unknown },
        ];
        expect(where).toEqual({
            type: 'SCHOOL_FACILITY',
            parentId: 2,
            id: { in: [3, 4] },
            name: { contains: 'room', mode: 'insensitive' },
        });
        expect(orderBy).toEqual([{ name: 'desc' }, { id: 'asc' }]);
        expect(include).toEqual({ parent: { select: { id: true, slug: true, name: true } } });
    });

    it.each([
        ['an unknown type', 'type=castle'],
        ['a non-numeric parentId', 'parentId=elmore'],
        ['a zero parentId', 'parentId=0'],
        ['limit above the maximum', 'limit=101'],
        ['an invalid sort field', 'sort=type'],
        ['an unknown query parameter', 'gender=male'],
    ])('GET /locations rejects %s with 400', async (_, query) => {
        const response = await request(app.getHttpServer()).get(`/locations?${query}`).expect(400);

        expect(response.body).toMatchObject({ statusCode: 400, error: 'Bad Request' });
        expect(prismaMock.location.findMany).not.toHaveBeenCalled();
    });

    it('GET /locations/:id returns a location', async () => {
        prismaMock.location.findUnique.mockResolvedValueOnce(buildLocation());

        const response = await request(app.getHttpServer()).get('/locations/2').expect(200);

        expect(response.body).toMatchObject({ id: 2, url: '/locations/2' });
        expect(prismaMock.location.findUnique).toHaveBeenCalledWith({
            where: { id: 2 },
            include: { parent: { select: { id: true, slug: true, name: true } } },
        });
    });

    it('GET /locations/:id returns 404 for an unknown location', async () => {
        prismaMock.location.findUnique.mockResolvedValueOnce(null);

        const response = await request(app.getHttpServer()).get('/locations/999').expect(404);

        expect(response.body.message).toBe('Location with id 999 not found');
    });

    it.each(['abc', '0', '-1', '1.5'])('GET /locations/%s returns 400', async (id) => {
        await request(app.getHttpServer()).get(`/locations/${id}`).expect(400);
        expect(prismaMock.location.findUnique).not.toHaveBeenCalled();
    });

    it('GET /locations/slug/:slug returns a location', async () => {
        prismaMock.location.findUnique.mockResolvedValueOnce(buildLocation());

        await request(app.getHttpServer()).get('/locations/slug/elmore-junior-high').expect(200);

        expect(prismaMock.location.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({ where: { slug: 'elmore-junior-high' } })
        );
    });

    it('GET /locations/slug/:slug rejects an invalid slug', async () => {
        await request(app.getHttpServer()).get('/locations/slug/Elmore_High').expect(400);
    });

    it('GET /locations/random returns the requested number of locations', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ id: 5 }, { id: 2 }]);
        prismaMock.location.findMany.mockResolvedValueOnce([
            buildLocation({ id: 2 }),
            buildLocation({ id: 5, slug: 'wattersons-house' }),
        ]);

        const response = await request(app.getHttpServer())
            .get('/locations/random?count=2')
            .expect(200);

        expect(response.body.map((location: { id: number }) => location.id)).toEqual([5, 2]);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)(
        '%s /locations is not exposed',
        async (method) => {
            await request(app.getHttpServer())[method]('/locations/1').send({}).expect(404);
        }
    );
});
