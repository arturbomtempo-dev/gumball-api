import Image from 'next/image';
import type { Character } from '@/lib/api';
import { capitalize } from '@/lib/navigation';
import { API_URL } from '@/lib/site';

interface CharacterCardProps {
    character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
    const details = [character.species, capitalize(character.status)].filter(Boolean).join(' · ');

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
                        First seen in {character.firstAppearance.title}
                    </p>
                ) : null}
            </div>
        </a>
    );
}
