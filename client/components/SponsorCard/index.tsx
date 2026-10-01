import { HeartIcon, StarIcon } from '@/components/Icons';
import { AUTHOR, REPOSITORY_URL } from '@/lib/site';

export function SponsorCard() {
    return (
        <section
            aria-labelledby="support"
            className="overflow-hidden rounded-2xl border border-border bg-surface"
        >
            <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="space-y-3">
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-highlight">
                        <HeartIcon className="size-4" />
                        Support the project
                    </p>
                    <h2
                        id="support"
                        className="text-2xl font-semibold tracking-tight text-balance text-foreground"
                    >
                        Free for everyone, made with care
                    </h2>
                    <p className="max-w-xl leading-7 text-pretty text-muted">
                        The Gumball API is free and open source, and it will stay that way.
                        Researching and writing original data for hundreds of entries, preparing
                        every image and keeping the servers online takes time and money. If the API
                        is useful to you, consider sponsoring its development. Every contribution
                        helps keep it online, accurate and growing.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                    <a
                        href={AUTHOR.sponsors}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
                    >
                        <HeartIcon className="text-pink-400" />
                        Sponsor on GitHub
                    </a>
                    <a
                        href={REPOSITORY_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border-strong bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-strong"
                    >
                        <StarIcon />
                        Star the repository
                    </a>
                </div>
            </div>
            <p className="border-t border-border px-6 py-4 text-sm text-muted sm:px-8">
                Not able to sponsor? Starring the repository, reporting wrong data and sharing the
                API with other developers help just as much.
            </p>
        </section>
    );
}
