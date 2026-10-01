import type { Character } from '@/lib/api';
import { formatMessage } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { API_URL } from '@/lib/site';
import Image from 'next/image';

interface CharacterCardProps {
    character: Character;
    labels: Dictionary['home']['characters'];
}

export function CharacterCard({ character, labels }: CharacterCardProps) {
    const status = labels.status[character.status as keyof typeof labels.status] ?? null;
    const details = [character.species, status].filter(Boolean).join(' · ');

    return (
        <a
            href={`${API_URL}${character.url}`}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-border-strong"
        >
            <div className="relative aspect-square bg-surface">
                <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 50vw"
                    className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
                />
            </div>
            <div className="space-y-1 border-t border-border px-4 py-3.5">
                <p className="truncate text-sm font-medium text-foreground">{character.name}</p>
                <p className="truncate text-xs text-muted">{details}</p>
                {character.firstAppearance ? (
                    <p className="truncate text-xs text-subtle">
                        {formatMessage(labels.firstSeenIn, {
                            title: character.firstAppearance.title,
                        })}
                    </p>
                ) : null}
            </div>
        </a>
    );
}
