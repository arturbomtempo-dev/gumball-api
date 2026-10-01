import type { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}

export function FeatureCard({ icon, title, children }: FeatureCardProps) {
    return (
        <div className="space-y-3">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground">
                {icon}
            </div>
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm leading-6 text-muted">{children}</p>
        </div>
    );
}
