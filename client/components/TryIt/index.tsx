'use client';

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { ChevronDownIcon, PlayIcon } from '@/components/Icons';
import { MethodBadge } from '@/components/MethodBadge';
import { formatJson } from '@/lib/json';
import { API_URL } from '@/lib/site';

export interface TryItParameter {
    name: string;
    placeholder?: string;
    values?: readonly string[];
    defaultValue?: string;
}

interface TryItProps {
    path: string;
    pathParameters?: readonly TryItParameter[];
    queryParameters?: readonly TryItParameter[];
}

interface TryItResult {
    status: number;
    statusText: string;
    duration: number;
    size: number;
    body: string;
    isJson: boolean;
}

const STATUS_TEXT: Record<number, string> = {
    200: 'OK',
    400: 'Bad Request',
    404: 'Not Found',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
};

function initialValues(parameters: readonly TryItParameter[]): Record<string, string> {
    return Object.fromEntries(
        parameters.map((parameter) => [parameter.name, parameter.defaultValue ?? ''])
    );
}

function encodeValue(value: string): string {
    return encodeURIComponent(value).replace(/%2C/gi, ',');
}

function formatBytes(bytes: number): string {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

function statusClasses(status: number): string {
    if (status >= 500) {
        return 'bg-red-50 text-red-700 ring-red-600/20';
    }

    if (status >= 400) {
        return 'bg-amber-50 text-amber-800 ring-amber-600/25';
    }

    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
}

export function TryIt({ path, pathParameters = [], queryParameters = [] }: TryItProps) {
    const id = useId();
    const parameters = useMemo(
        () => [...pathParameters, ...queryParameters],
        [pathParameters, queryParameters]
    );
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState(() => initialValues(parameters));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TryItResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const controller = useRef<AbortController | null>(null);

    useEffect(() => () => controller.current?.abort(), []);

    const missingPathParameter = pathParameters.some(
        (parameter) => values[parameter.name].trim() === ''
    );

    const url = useMemo(() => {
        const resolvedPath = pathParameters.reduce(
            (current, parameter) =>
                current.replace(
                    `{${parameter.name}}`,
                    encodeURIComponent(values[parameter.name].trim()) || `{${parameter.name}}`
                ),
            path
        );
        const query = queryParameters
            .filter((parameter) => values[parameter.name].trim() !== '')
            .map((parameter) => `${parameter.name}=${encodeValue(values[parameter.name].trim())}`)
            .join('&');

        return `${API_URL}${resolvedPath}${query ? `?${query}` : ''}`;
    }, [path, pathParameters, queryParameters, values]);

    async function send(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (missingPathParameter) {
            return;
        }

        controller.current?.abort();
        const current = new AbortController();
        controller.current = current;

        setLoading(true);
        setError(null);

        const startedAt = performance.now();

        try {
            const response = await fetch(url, {
                signal: current.signal,
                headers: { Accept: 'application/json' },
            });
            const text = await response.text();
            const duration = Math.round(performance.now() - startedAt);
            let body = text;
            let isJson = false;

            try {
                body = formatJson(JSON.parse(text));
                isJson = true;
            } catch {
                isJson = false;
            }

            setResult({
                status: response.status,
                statusText: STATUS_TEXT[response.status] ?? response.statusText,
                duration,
                size: new Blob([text]).size,
                body,
                isJson,
            });
        } catch (caught) {
            if (caught instanceof DOMException && caught.name === 'AbortError') {
                return;
            }

            setResult(null);
            setError('The request could not be completed. Check your connection and try again.');
        } finally {
            if (controller.current === current) {
                setLoading(false);
            }
        }
    }

    function reset() {
        controller.current?.abort();
        setValues(initialValues(parameters));
        setResult(null);
        setError(null);
        setLoading(false);
    }

    function update(name: string, value: string) {
        setValues((current) => ({ ...current, [name]: value }));
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={`${id}-panel`}
                onClick={() => setOpen((current) => !current)}
                className="flex h-11 w-full items-center justify-between gap-3 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
                <span className="flex items-center gap-2">
                    <PlayIcon className="size-3.5 text-brand" />
                    Try it
                </span>
                <ChevronDownIcon
                    className={`text-subtle transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open ? (
                <form
                    id={`${id}-panel`}
                    onSubmit={send}
                    className="space-y-4 border-t border-border bg-surface/60 p-4"
                >
                    {parameters.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {parameters.map((parameter) => {
                                const inputId = `${id}-${parameter.name}`;
                                const required = pathParameters.includes(parameter);

                                return (
                                    <div key={parameter.name} className="space-y-1.5">
                                        <label
                                            htmlFor={inputId}
                                            className="flex items-center gap-1.5 font-mono text-xs text-muted"
                                        >
                                            {parameter.name}
                                            {required ? (
                                                <span className="font-sans text-[11px] text-subtle">
                                                    required
                                                </span>
                                            ) : null}
                                        </label>
                                        {parameter.values ? (
                                            <select
                                                id={inputId}
                                                value={values[parameter.name]}
                                                onChange={(event) =>
                                                    update(parameter.name, event.target.value)
                                                }
                                                className="h-9 w-full rounded-lg border border-border-strong bg-background px-2.5 font-mono text-[13px] text-foreground outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
                                            >
                                                <option value="">Any</option>
                                                {parameter.values.map((value) => (
                                                    <option key={value} value={value}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                id={inputId}
                                                value={values[parameter.name]}
                                                placeholder={parameter.placeholder}
                                                required={required}
                                                autoComplete="off"
                                                spellCheck={false}
                                                onChange={(event) =>
                                                    update(parameter.name, event.target.value)
                                                }
                                                className="h-9 w-full rounded-lg border border-border-strong bg-background px-2.5 font-mono text-[13px] text-foreground outline-none placeholder:text-subtle/70 focus:border-brand focus:ring-3 focus:ring-brand/15"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-background py-1 pr-1 pl-3">
                        <MethodBadge />
                        <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
                            {url}
                        </code>
                        <CopyButton value={url} label="Copy request URL" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="submit"
                            disabled={loading || missingPathParameter}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <span
                                    aria-hidden="true"
                                    className="size-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background"
                                />
                            ) : (
                                <PlayIcon className="size-3.5" />
                            )}
                            {loading ? 'Sending' : 'Send request'}
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
                        >
                            Reset
                        </button>
                    </div>

                    <div aria-live="polite" className="space-y-2">
                        {error ? (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </p>
                        ) : null}
                        {result ? (
                            <>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                                    <span
                                        className={`inline-flex h-6 items-center rounded-md px-2 font-mono font-semibold ring-1 ring-inset ${statusClasses(result.status)}`}
                                    >
                                        {result.status} {result.statusText}
                                    </span>
                                    <span>{result.duration} ms</span>
                                    <span>{formatBytes(result.size)}</span>
                                </div>
                                <CodeBlock
                                    code={result.body}
                                    title="Response"
                                    language={result.isJson ? 'json' : 'text'}
                                    scrollable
                                />
                            </>
                        ) : null}
                    </div>
                </form>
            ) : null}
        </div>
    );
}
