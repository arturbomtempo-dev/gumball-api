interface MethodBadgeProps {
    method?: 'GET';
}

export function MethodBadge({ method = 'GET' }: MethodBadgeProps) {
    return (
        <span className="inline-flex h-5 items-center rounded bg-emerald-50 px-1.5 font-mono text-[11px] font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
            {method}
        </span>
    );
}
