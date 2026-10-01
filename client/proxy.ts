import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE,
    isLocale,
    localizePath,
    splitLocale,
} from '@/lib/i18n/config';
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const [, firstSegment] = pathname.split('/');

    if (firstSegment === DEFAULT_LOCALE) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/';

        return NextResponse.redirect(url, 308);
    }

    if (isLocale(firstSegment)) {
        return NextResponse.next();
    }

    const preferred = request.cookies.get(LOCALE_COOKIE)?.value;

    if (isLocale(preferred) && preferred !== DEFAULT_LOCALE) {
        const url = request.nextUrl.clone();
        url.pathname = localizePath(preferred, splitLocale(pathname).path);

        return NextResponse.redirect(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        '/((?!_next/|api/|icon|apple-icon|opengraph-image|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)',
    ],
};
