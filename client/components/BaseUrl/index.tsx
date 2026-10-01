import { CopyButton } from '@/components/CopyButton';
import { API_URL } from '@/lib/site';

interface BaseUrlProps {
    label: string;
}

export function BaseUrl({ label }: BaseUrlProps) {
    return (
        <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-surface py-1 pr-1 pl-3.5">
            <span className="text-xs font-medium tracking-wide whitespace-nowrap text-subtle uppercase">
                {label}
            </span>
            <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
                {API_URL}
            </code>
            <CopyButton value={API_URL} labelKey="baseUrl" />
        </div>
    );
}
