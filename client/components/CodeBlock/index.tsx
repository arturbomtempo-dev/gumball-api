import { CopyButton } from '@/components/CopyButton';
import { JsonCode } from '@/components/JsonCode';

interface CodeBlockProps {
    code: string;
    title?: string;
    language?: 'json' | 'text';
    scrollable?: boolean;
}

export function CodeBlock({ code, title, language = 'text', scrollable = false }: CodeBlockProps) {
    return (
        <figure className="group relative overflow-hidden rounded-xl border border-border bg-code-background">
            {title ? (
                <figcaption className="flex h-10 items-center justify-between border-b border-border pr-1 pl-4 text-xs text-subtle">
                    <span className="font-mono">{title}</span>
                    <CopyButton value={code} labelKey="code" />
                </figcaption>
            ) : (
                <CopyButton
                    value={code}
                    labelKey="code"
                    className="absolute top-2 right-2 bg-code-background opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                />
            )}
            <pre
                className={`overflow-auto p-4 font-mono text-[13px] leading-relaxed text-foreground ${
                    language === 'json' ? 'break-words whitespace-pre-wrap' : ''
                } ${scrollable ? 'max-h-96' : ''}`}
            >
                <code>{language === 'json' ? <JsonCode source={code} /> : code}</code>
            </pre>
        </figure>
    );
}
