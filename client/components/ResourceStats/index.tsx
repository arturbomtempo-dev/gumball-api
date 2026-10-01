import type { ResourceCount } from '@/lib/api';
import { LOCALE_DETAILS, localizePath, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import Link from 'next/link';

interface ResourceStatsProps {
    locale: Locale;
    counts: readonly ResourceCount[];
    resources: Dictionary['docs']['resources'];
}

export function ResourceStats({ locale, counts, resources }: ResourceStatsProps) {
    return (
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 lg:grid-cols-7">
            {counts.map((count) => (
                <li key={count.key} className="bg-background last:col-span-2 lg:last:col-span-1">
                    <Link
                        href={`${localizePath(locale, '/docs')}#${count.key}`}
                        className="flex h-full flex-col gap-1 px-5 py-5 transition-colors hover:bg-surface"
                    >
                        <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {count.total !== null
                                ? count.total.toLocaleString(LOCALE_DETAILS[locale].intl)
                                : '—'}
                        </span>
                        <span className="text-sm text-muted">{resources[count.key].title}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
