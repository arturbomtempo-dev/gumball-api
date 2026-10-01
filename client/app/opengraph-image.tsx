import { LOGO_ASPECT_RATIO, readLogoDataUrl } from '@/lib/brand';
import { SITE_NAME } from '@/lib/site';
import { ImageResponse } from 'next/og';

export const alt = SITE_NAME;

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default async function OpenGraphImage() {
    const width = 470;

    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafaf9',
            }}
        >
            <img
                src={await readLogoDataUrl()}
                alt=""
                width={width}
                height={Math.round(width * LOGO_ASPECT_RATIO)}
            />
        </div>,
        size
    );
}
