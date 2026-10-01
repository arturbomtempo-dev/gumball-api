import { splitLocale } from './i18n/config';

export const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? 'https://gumball-api-server.vercel.app'
).replace(/\/$/, '');

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000';

export const SITE_NAME = 'Gumball API';

export const AUTHOR = {
    name: 'Artur Bomtempo',
    fullName: 'Artur Bomtempo Colen',
    email: 'arturbcolen@gmail.com',
    github: 'https://github.com/arturbomtempo-dev',
    linkedin: 'https://www.linkedin.com/in/artur-bomtempo/',
    instagram: 'https://www.instagram.com/arturbomtempo.dev',
    sponsors: 'https://github.com/sponsors/arturbomtempo-dev',
};

export const REPOSITORY_URL = 'https://github.com/arturbomtempo-dev/gumball-api';

export const NAVIGATION = [
    { path: '/', key: 'home' },
    { path: '/docs', key: 'docs' },
    { path: '/contact', key: 'contact' },
] as const;

export type NavigationKey = (typeof NAVIGATION)[number]['key'];

export function isActivePath(pathname: string, path: string): boolean {
    const current = splitLocale(pathname).path;

    return path === '/' ? current === '/' : current.startsWith(path);
}
