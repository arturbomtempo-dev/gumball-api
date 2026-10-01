import { createApp } from './bootstrap/create-app.js';
import { AppConfigService } from './config/app-config.service.js';

async function bootstrap(): Promise<void> {
    const app = await createApp();

    await app.listen(app.get(AppConfigService).get('PORT'), '0.0.0.0');
}

await bootstrap();
