import { CopyButton } from '@/components/CopyButton';
import { MethodBadge } from '@/components/MethodBadge';
import { API_URL } from '@/lib/site';

interface EndpointProps {
    path: string;
}

export function Endpoint({ path }: EndpointProps) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface py-1 pr-1 pl-3">
            <MethodBadge />
            <code className="min-w-0 flex-1 truncate font-mono text-[13px]">
                {path.split(/(\{[^}]+\})/g).map((part, index) =>
                    part.startsWith('{') ? (
                        <span key={index} className="text-code-key">
                            {part}
                        </span>
                    ) : (
                        <span key={index} className="text-foreground">
                            {part}
                        </span>
                    )
                )}
            </code>
            <CopyButton value={`${API_URL}${path}`} label="Copy endpoint URL" />
        </div>
    );
}
