import { toEpisodeReference } from '../episodes/episode-reference.js';
import { animationStyleCodec, genderCodec, roleCodec, statusCodec } from './character.enums.js';
import type { CharacterWithRelations } from './characters.repository.js';
import type { CharacterResponseDto } from './dto/character-response.dto.js';

export const CharacterMapper = {
    toResponse: (character: CharacterWithRelations): CharacterResponseDto => ({
        id: character.id,
        slug: character.slug,
        name: character.name,
        fullName: character.fullName,
        aliases: character.aliases,
        description: character.description,
        species: character.species,
        gender: genderCodec.toApi(character.gender),
        age: character.age,
        occupation: character.occupation,
        role: roleCodec.toApi(character.role),
        status: statusCodec.toApi(character.status),
        animationStyle: animationStyleCodec.toApi(character.animationStyle),
        voiceActors: character.voiceActors,
        firstAppearance: toEpisodeReference(character.firstAppearance),
        colors: character.colors,
        image: character.imageUrl,
        url: `/characters/${character.id}`,
        createdAt: character.createdAt.toISOString(),
        updatedAt: character.updatedAt.toISOString(),
    }),
};
