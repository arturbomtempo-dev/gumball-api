import Link from 'next/link';
import type { ReactNode } from 'react';

interface ButtonLinkProps {
    href: string;
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}

const VARIANTS = {
    primary: 'bg-foreground text-background hover:bg-foreground/85',
    secondary: 'border border-border-strong bg-background text-foreground hover:bg-surface-strong',
};

export function ButtonLink({ href, children, variant = 'primary' }: ButtonLinkProps) {
    return (
        <Link
            href={href}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${VARIANTS[variant]}`}
        >
            {children}
        </Link>
    );
}
