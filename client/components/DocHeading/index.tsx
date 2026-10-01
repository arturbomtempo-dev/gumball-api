import type { ReactNode } from 'react';
import { HashIcon } from '@/components/Icons';

interface DocHeadingProps {
    id: string;
    level?: 2 | 3;
    children: ReactNode;
}

const STYLES = {
    2: 'text-2xl font-semibold tracking-tight',
    3: 'text-lg font-semibold tracking-tight',
};

export function DocHeading({ id, level = 2, children }: DocHeadingProps) {
    const Tag = level === 2 ? 'h2' : 'h3';

    return (
        <Tag id={id} className={`group text-foreground ${STYLES[level]}`}>
            <a href={`#${id}`} className="inline-flex items-center gap-2">
                {children}
                <HashIcon className="text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
        </Tag>
    );
}
