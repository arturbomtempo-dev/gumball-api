'use client';

import { useActiveSection } from '@/hooks/useActiveSection';
import { DOCS_NAVIGATION, DOCS_SECTION_IDS, type DocsNavItem } from '@/lib/navigation';

function isWithin(item: DocsNavItem, active: string | undefined): boolean {
    return item.id === active || (item.children ?? []).some((child) => child.id === active);
}

export function DocsSidebar() {
    const active = useActiveSection(DOCS_SECTION_IDS);

    return (
        <nav aria-label="Documentation" className="space-y-8 text-sm">
            {DOCS_NAVIGATION.map((group) => (
                <div key={group.title} className="space-y-2">
                    <p className="px-3 text-xs font-medium tracking-wide text-subtle uppercase">
                        {group.title}
                    </p>
                    <ul className="space-y-0.5">
                        {group.items.map((item) => {
                            const expanded = isWithin(item, active);

                            return (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        aria-current={item.id === active ? 'location' : undefined}
                                        className={`block rounded-md px-3 py-1.5 transition-colors ${
                                            expanded
                                                ? 'font-medium text-foreground'
                                                : 'text-muted hover:text-foreground'
                                        } ${item.id === active ? 'bg-surface-strong' : ''}`}
                                    >
                                        {item.label}
                                    </a>
                                    {item.children && expanded ? (
                                        <ul className="mt-0.5 mb-2 ml-3 space-y-0.5 border-l border-border">
                                            {item.children.map((child) => (
                                                <li key={child.id}>
                                                    <a
                                                        href={`#${child.id}`}
                                                        aria-current={
                                                            child.id === active
                                                                ? 'location'
                                                                : undefined
                                                        }
                                                        className={`-ml-px block border-l py-1 pr-2 pl-3 text-[13px] transition-colors ${
                                                            child.id === active
                                                                ? 'border-brand text-foreground'
                                                                : 'border-transparent text-muted hover:text-foreground'
                                                        }`}
                                                    >
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
