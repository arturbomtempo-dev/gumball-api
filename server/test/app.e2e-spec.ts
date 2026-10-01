import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap/configure-app.js';
import { PrismaService } from '../src/database/prisma.service.js';

const prismaMock = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn(),
};

describe('Gumball API (e2e)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
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

    it('GET / describes the API and lists every resource', async () => {
        const response = await request(app.getHttpServer()).get('/').expect(200);

        expect(response.body).toMatchObject({
            name: 'The Amazing World of Gumball API',
            description: expect.stringContaining('read-only'),
        });
        expect(response.body.resources).toEqual({
            characters: '/characters',
            locations: '/locations',
            episodes: '/episodes',
            seasons: '/seasons',
            songs: '/songs',
            games: '/games',
            media: '/media',
        });
        expect(response.headers['cache-control']).toContain('public');
    });

    it('GET / does not query the database', async () => {
        await request(app.getHttpServer()).get('/').expect(200);

        expect(prismaMock.$queryRaw).not.toHaveBeenCalled();
    });

    it.each(['post', 'put', 'patch', 'delete'] as const)('%s / is not exposed', async (method) => {
        await request(app.getHttpServer())[method]('/').send({}).expect(404);
    });

    it('returns a consistent error body for unknown routes', async () => {
        const response = await request(app.getHttpServer()).get('/unknown').expect(404);

        expect(response.body).toMatchObject({
            statusCode: 404,
            error: 'Not Found',
            path: '/unknown',
        });
    });

    it('sets security headers', async () => {
        const response = await request(app.getHttpServer()).get('/');

        expect(response.headers['x-powered-by']).toBeUndefined();
        expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
});
