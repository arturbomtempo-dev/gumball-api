'use client';

import { isActivePath } from '@/lib/site';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
    href: string;
    label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
    const pathname = usePathname();
    const active = isActivePath(pathname, href);

    return (
        <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                active ? 'text-foreground' : 'text-muted hover:text-foreground'
            }`}
        >
            {label}
        </Link>
    );
}
