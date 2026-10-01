import { HeartIcon, StarIcon } from '@/components/Icons';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { AUTHOR, REPOSITORY_URL } from '@/lib/site';

interface SponsorCardProps {
    text: Dictionary['contact']['sponsor'];
}

export function SponsorCard({ text }: SponsorCardProps) {
    return (
        <section
            aria-labelledby="support"
            className="overflow-hidden rounded-2xl border border-border bg-surface"
        >
            <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="space-y-3">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-highlight">
                        <HeartIcon className="size-4" />
                        {text.eyebrow}
                    </p>
                    <h2
                        id="support"
                        className="text-2xl font-semibold tracking-tight text-balance text-foreground"
                    >
                        {text.title}
                    </h2>
                    <p className="max-w-xl leading-7 text-pretty text-muted">{text.description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                    <a
                        href={AUTHOR.sponsors}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
                    >
                        <HeartIcon className="text-pink-400" />
                        {text.sponsor}
                    </a>
                    <a
                        href={REPOSITORY_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border-strong bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-strong"
                    >
                        <StarIcon />
                        {text.star}
                    </a>
                </div>
            </div>
            <p className="border-t border-border px-6 py-4 text-sm text-muted sm:px-8">
                {text.footnote}
            </p>
        </section>
    );
}
