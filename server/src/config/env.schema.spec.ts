import { validateEnv } from './env.schema.js';

describe('validateEnv', () => {
    const databaseUrl = 'postgresql://user:password@localhost:5432/gumball';

    it('applies defaults to optional variables', () => {
        const env = validateEnv({ DATABASE_URL: databaseUrl });

        expect(env).toMatchObject({
            NODE_ENV: 'development',
            PORT: 3000,
            DATABASE_POOL_MAX: 10,
            CORS_ORIGINS: '*',
        });
    });

    it('coerces numeric variables', () => {
        const env = validateEnv({ DATABASE_URL: databaseUrl, PORT: '8080' });

        expect(env.PORT).toBe(8080);
    });

    it('treats an empty certificate authority as not set', () => {
        const env = validateEnv({ DATABASE_URL: databaseUrl, DATABASE_SSL_CA: '' });

        expect(env.DATABASE_SSL_CA).toBeUndefined();
    });

    it('rejects a missing database url', () => {
        expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
    });

    it('rejects a non-postgres database url', () => {
        expect(() => validateEnv({ DATABASE_URL: 'mysql://user:password@localhost/db' })).toThrow(
            /DATABASE_URL/
        );
    });
});
