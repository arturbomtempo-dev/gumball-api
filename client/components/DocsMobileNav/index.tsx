'use client';

import { useRef } from 'react';
import { ChevronDownIcon, MenuIcon } from '@/components/Icons';
import { useActiveSection } from '@/hooks/useActiveSection';
import { DOCS_NAVIGATION, DOCS_SECTION_IDS } from '@/lib/navigation';

const LABELS = new Map(
    DOCS_NAVIGATION.flatMap((group) =>
        group.items.flatMap((item) => [
            [item.id, item.label] as const,
            ...(item.children ?? []).map((child) => [child.id, child.label] as const),
        ])
    )
);

export function DocsMobileNav() {
    const active = useActiveSection(DOCS_SECTION_IDS);
    const details = useRef<HTMLDetailsElement>(null);

    function close() {
        details.current?.removeAttribute('open');
    }

    return (
        <details
            ref={details}
            className="group sticky top-16 z-30 -mx-5 border-b border-border bg-background/95 backdrop-blur-md sm:-mx-8 lg:hidden"
        >
            <summary className="flex h-12 cursor-pointer list-none items-center gap-2 px-5 text-sm sm:px-8 [&::-webkit-details-marker]:hidden">
                <MenuIcon className="text-subtle" />
                <span className="min-w-0 flex-1 truncate text-foreground">
                    {(active && LABELS.get(active)) ?? 'On this page'}
                </span>
                <ChevronDownIcon className="text-subtle transition-transform group-open:rotate-180" />
            </summary>
            <nav
                aria-label="Documentation"
                className="max-h-[65vh] space-y-6 overflow-y-auto border-t border-border px-5 py-4 text-sm sm:px-8"
            >
                {DOCS_NAVIGATION.map((group) => (
                    <div key={group.title} className="space-y-2">
                        <p className="text-xs font-medium tracking-wide text-subtle uppercase">
                            {group.title}
                        </p>
                        <ul className="space-y-1">
                            {group.items.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        onClick={close}
                                        className={`block py-1 ${
                                            item.id === active
                                                ? 'font-medium text-foreground'
                                                : 'text-muted'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                    {item.children ? (
                                        <ul className="ml-1 space-y-1 border-l border-border pl-3">
                                            {item.children.map((child) => (
                                                <li key={child.id}>
                                                    <a
                                                        href={`#${child.id}`}
                                                        onClick={close}
                                                        className={`block py-0.5 text-[13px] ${
                                                            child.id === active
                                                                ? 'text-foreground'
                                                                : 'text-muted'
                                                        }`}
                                                    >
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </details>
    );
}
