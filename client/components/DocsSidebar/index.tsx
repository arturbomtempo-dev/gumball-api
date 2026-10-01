'use client';

import { useActiveSection } from '@/hooks/useActiveSection';
import { useI18n } from '@/hooks/useI18n';
import { navigationSectionIds, type DocsNavGroup, type DocsNavItem } from '@/lib/navigation';
import { useMemo } from 'react';

function isWithin(item: DocsNavItem, active: string | undefined): boolean {
    return item.id === active || (item.children ?? []).some((child) => child.id === active);
}

interface DocsSidebarProps {
    navigation: readonly DocsNavGroup[];
}

export function DocsSidebar({ navigation }: DocsSidebarProps) {
    const { ui } = useI18n();
    const ids = useMemo(() => navigationSectionIds(navigation), [navigation]);
    const active = useActiveSection(ids);

    return (
        <nav aria-label={ui.docsNav.label} className="space-y-8 text-sm">
            {navigation.map((group) => (
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
