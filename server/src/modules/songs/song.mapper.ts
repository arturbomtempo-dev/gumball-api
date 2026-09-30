import { toEpisodeReference } from '../episodes/episode-reference.js';
import type { SongResponseDto } from './dto/song-response.dto.js';
import { songTypeCodec } from './song.enums.js';
import type { SongWithRelations } from './songs.repository.js';

function formatDuration(seconds: number | null): string | null {
    if (seconds === null) {
        return null;
    }

    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export const SongMapper = {
    toResponse: (song: SongWithRelations): SongResponseDto => ({
        id: song.id,
        slug: song.slug,
        title: song.title,
        description: song.description,
        type: songTypeCodec.toApi(song.type),
        episode: toEpisodeReference(song.episode),
        characters: song.characters.map(({ character }) => ({
            id: character.id,
            slug: character.slug,
            name: character.name,
            url: `/characters/${character.id}`,
        })),
        vocalists: song.vocalists,
        genres: song.genres,
        duration: formatDuration(song.durationSeconds),
        durationSeconds: song.durationSeconds,
        musicalKey: song.musicalKey,
        image: song.imageUrl,
        url: `/songs/${song.id}`,
        createdAt: song.createdAt.toISOString(),
        updatedAt: song.updatedAt.toISOString(),
    }),
};
