'use client';

import { useEffect, useState } from 'react';

const OFFSET = 150;

export function useActiveSection(ids: readonly string[]): string | undefined {
    const [active, setActive] = useState<string | undefined>(ids[0]);
    const key = ids.join(' ');

    useEffect(() => {
        const elements = key
            .split(' ')
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) {
            return;
        }

        let frame = 0;

        const update = () => {
            frame = 0;

            const atBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

            if (atBottom) {
                setActive(elements[elements.length - 1].id);
                return;
            }

            let current = elements[0].id;

            for (const element of elements) {
                if (element.getBoundingClientRect().top > OFFSET) {
                    break;
                }

                current = element.id;
            }

            setActive(current);
        };

        const onScroll = () => {
            if (frame === 0) {
                frame = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [key]);

    return active;
}
