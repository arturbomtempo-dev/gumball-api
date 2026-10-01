import Link from 'next/link';
import type { ResourceCount } from '@/lib/api';
import { capitalize } from '@/lib/navigation';

interface ResourceStatsProps {
    counts: readonly ResourceCount[];
}

export function ResourceStats({ counts }: ResourceStatsProps) {
    return (
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 lg:grid-cols-7">
            {counts.map((count) => (
                <li key={count.key} className="bg-background last:col-span-2 lg:last:col-span-1">
                    <Link
                        href={`/docs#${count.key}`}
                        className="flex h-full flex-col gap-1 px-5 py-5 transition-colors hover:bg-surface"
                    >
                        <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {count.total !== null ? count.total.toLocaleString('en-US') : '—'}
                        </span>
                        <span className="text-sm text-muted">{capitalize(count.key)}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
