import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            new URL(
                'https://arturbomtempo-dev.github.io/arturbomtempo-cdn/assets/images/projects/gumball-api/**'
            ),
        ],
    },
};

export default nextConfig;
