interface RichTextProps {
    text: string;
}

export function RichText({ text }: RichTextProps) {
    return (
        <>
            {text.split(/(`[^`]+`)/g).map((part, index) =>
                part.startsWith('`') && part.endsWith('`') ? (
                    <code
                        key={index}
                        className="rounded bg-surface-strong px-1 py-0.5 font-mono text-[0.85em] text-foreground"
                    >
                        {part.slice(1, -1)}
                    </code>
                ) : (
                    part
                )
            )}
        </>
    );
}
