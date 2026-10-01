export const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? 'https://gumball-api-server.vercel.app'
).replace(/\/$/, '');

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000';

export const SITE_NAME = 'Gumball API';

export const SITE_DESCRIPTION =
    'A free, read-only REST API about The Amazing World of Gumball: characters, locations, episodes, seasons, songs, games and in-universe media.';

export const AUTHOR = {
    name: 'Artur Bomtempo',
    email: 'arturbcolen@gmail.com',
    github: 'https://github.com/arturbomtempo-dev',
    linkedin: 'https://www.linkedin.com/in/artur-bomtempo/',
    instagram: 'https://www.instagram.com/arturbomtempo.dev',
    sponsors: 'https://github.com/sponsors/arturbomtempo-dev',
};

export const REPOSITORY_URL = 'https://github.com/arturbomtempo-dev/gumball-api';

export const NAVIGATION = [
    { href: '/', label: 'Home' },
    { href: '/docs', label: 'Docs' },
    { href: '/contact', label: 'Contact' },
] as const;
