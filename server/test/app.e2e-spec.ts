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

    it('GET /health reports the database as up', async () => {
        prismaMock.$queryRaw.mockResolvedValueOnce([{ result: 1 }]);

        const response = await request(app.getHttpServer()).get('/health').expect(200);

        expect(response.body.status).toBe('ok');
        expect(response.headers['cache-control']).toContain('no-store');
    });

    it('GET /health returns 503 when the database is unreachable', async () => {
        prismaMock.$queryRaw.mockRejectedValueOnce(new Error('connection refused'));

        const response = await request(app.getHttpServer()).get('/health').expect(503);

        expect(response.body.statusCode).toBe(503);
    });

    it('returns a consistent error body for unknown routes', async () => {
        const response = await request(app.getHttpServer()).get('/v1/unknown').expect(404);

        expect(response.body).toMatchObject({
            statusCode: 404,
            error: 'Not Found',
            path: '/v1/unknown',
        });
    });

    it('sets security headers', async () => {
        const response = await request(app.getHttpServer()).get('/health');

        expect(response.headers['x-powered-by']).toBeUndefined();
        expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
});
