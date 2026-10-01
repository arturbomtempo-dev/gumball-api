interface MethodBadgeProps {
    method?: 'GET';
}

export function MethodBadge({ method = 'GET' }: MethodBadgeProps) {
    return (
        <span className="inline-flex h-5 items-center rounded bg-success-soft px-1.5 font-mono text-[11px] font-semibold tracking-wide text-success ring-1 ring-success-ring ring-inset">
            {method}
        </span>
    );
}
