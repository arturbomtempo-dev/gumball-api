import { CopyButton } from '@/components/CopyButton';
import { API_URL } from '@/lib/site';

export function BaseUrl() {
    return (
        <div className="flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-surface py-1 pr-1 pl-3.5">
            <span className="text-xs font-medium tracking-wide text-subtle uppercase">
                Base URL
            </span>
            <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
                {API_URL}
            </code>
            <CopyButton value={API_URL} label="Copy base URL" />
        </div>
    );
}
