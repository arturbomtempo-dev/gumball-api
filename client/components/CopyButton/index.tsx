'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon } from '@/components/Icons';

interface CopyButtonProps {
    value: string;
    label?: string;
    className?: string;
}

export function CopyButton({ value, label = 'Copy', className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

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
            aria-label={copied ? 'Copied' : label}
            title={copied ? 'Copied' : label}
            className={`inline-flex size-8 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-strong hover:text-foreground ${className}`}
        >
            {copied ? <CheckIcon className="text-code-string" /> : <CopyIcon />}
        </button>
    );
}
