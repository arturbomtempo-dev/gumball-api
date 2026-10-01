import { LOGO_ASPECT_RATIO, readLogoDataUrl } from '@/lib/brand';
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };

export const contentType = 'image/png';

export default async function AppleIcon() {
    const width = 160;

    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
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
