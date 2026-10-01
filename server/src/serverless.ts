import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Express } from 'express';
import { createApp } from './bootstrap/create-app.js';

let expressApp: Promise<Express> | undefined;

async function initialize(): Promise<Express> {
    const app = await createApp();

    await app.init();

    return app.getHttpAdapter().getInstance() as Express;
}

export default async function handler(
    request: IncomingMessage,
    response: ServerResponse
): Promise<void> {
    expressApp ??= initialize().catch((error: unknown) => {
        expressApp = undefined;
        throw error;
    });

    const app = await expressApp;

    app(request, response);
}
