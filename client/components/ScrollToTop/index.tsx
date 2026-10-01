'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function ScrollToTop() {
    const pathname = usePathname();
    const previousPathname = useRef(pathname);
    const restoringHistory = useRef(false);

    useEffect(() => {
        const onPopState = () => {
            restoringHistory.current = true;
        };

        window.addEventListener('popstate', onPopState);

        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        if (previousPathname.current === pathname) {
            return;
        }

        previousPathname.current = pathname;

        if (restoringHistory.current) {
            restoringHistory.current = false;
            return;
        }

        if (window.location.hash) {
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }, [pathname]);

    return null;
}
