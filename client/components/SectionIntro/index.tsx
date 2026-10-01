import type { ReactNode } from 'react';

interface SectionIntroProps {
    eyebrow: string;
    title: string;
    children?: ReactNode;
}

export function SectionIntro({ eyebrow, title, children }: SectionIntroProps) {
    return (
        <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium text-brand">{eyebrow}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground">
                {title}
            </h2>
            {children ? (
                <p className="text-base leading-7 text-pretty text-muted">{children}</p>
            ) : null}
        </div>
    );
}
