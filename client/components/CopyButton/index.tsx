'use client';

import { CheckIcon, CopyIcon } from '@/components/Icons';
import { useI18n } from '@/hooks/useI18n';
import type { UiDictionary } from '@/lib/i18n/dictionaries';
import { useEffect, useState } from 'react';

interface CopyButtonProps {
    value: string;
    labelKey?: Exclude<keyof UiDictionary['copy'], 'copied'>;
    className?: string;
}

export function CopyButton({ value, labelKey = 'copy', className = '' }: CopyButtonProps) {
    const { ui } = useI18n();
    const [copied, setCopied] = useState(false);
    const label = copied ? ui.copy.copied : ui.copy[labelKey];

    useEffect(() => {
        if (!copied) {
            return;
        }

        const timeout = setTimeout(() => setCopied(false), 1800);

        return () => clearTimeout(timeout);
    }, [copied]);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={label}
            title={label}
            className={`inline-flex size-8 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-strong hover:text-foreground ${className}`}
        >
            {copied ? <CheckIcon className="text-code-string" /> : <CopyIcon />}
        </button>
    );
}
