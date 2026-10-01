import { ImageResponse } from 'next/og';
import { LOGO_ASPECT_RATIO, readLogoDataUrl } from '@/lib/brand';

export const size = { width: 512, height: 512 };

export const contentType = 'image/png';

export default async function Icon() {
    const width = size.width;

    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
