'use client';

import { useId, useState } from 'react';
import { CopyButton } from '@/components/CopyButton';

interface CodeTab {
    label: string;
    code: string;
}

interface CodeTabsProps {
    tabs: readonly CodeTab[];
}

export function CodeTabs({ tabs }: CodeTabsProps) {
    const [selected, setSelected] = useState(0);
    const id = useId();
    const current = tabs[selected];

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-code-background">
            <div className="flex items-center justify-between border-b border-border pr-1 pl-2">
                <div role="tablist" aria-label="Code examples" className="flex">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            type="button"
                            role="tab"
                            id={`${id}-tab-${index}`}
                            aria-selected={index === selected}
                            aria-controls={`${id}-panel`}
                            onClick={() => setSelected(index)}
                            className={`relative h-10 px-3 text-xs font-medium transition-colors ${
                                index === selected
                                    ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-px after:bg-foreground'
                                    : 'text-subtle hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <CopyButton value={current.code} label="Copy code" />
            </div>
            <pre
                role="tabpanel"
                id={`${id}-panel`}
                aria-labelledby={`${id}-tab-${selected}`}
                className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground"
            >
                <code>{current.code}</code>
            </pre>
        </div>
    );
}
