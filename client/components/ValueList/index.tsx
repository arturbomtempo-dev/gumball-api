interface ValueListProps {
    values: readonly string[];
}

export function ValueList({ values }: ValueListProps) {
    return (
        <ul className="flex flex-wrap gap-1.5">
            {values.map((value) => (
                <li
                    key={value}
                    className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground"
                >
                    {value}
                </li>
            ))}
        </ul>
    );
}
