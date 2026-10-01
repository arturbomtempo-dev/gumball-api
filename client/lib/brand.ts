import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import logo from '@/public/logo.png';

export const LOGO_ASPECT_RATIO = logo.height / logo.width;

export async function readLogoDataUrl(): Promise<string> {
    const file = await readFile(join(process.cwd(), 'public/logo.png'));

    return `data:image/png;base64,${file.toString('base64')}`;
}
