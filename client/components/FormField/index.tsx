import type { ReactNode } from 'react';

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    hint?: ReactNode;
    children: ReactNode;
}

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label}
                </label>
                {hint ? <span className="text-xs text-subtle tabular-nums">{hint}</span> : null}
            </div>
            {children}
            {error ? (
                <p id={`${id}-error`} className="text-sm text-red-600">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
