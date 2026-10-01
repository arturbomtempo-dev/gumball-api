import { toEpisodeReference } from '../episodes/episode-reference.js';
import type { MediaResponseDto } from './dto/media-response.dto.js';
import { mediaTypeCodec } from './media.enums.js';
import type { MediaWithRelations } from './media.repository.js';

export const MediaMapper = {
    toResponse: (media: MediaWithRelations): MediaResponseDto => ({
        id: media.id,
        slug: media.slug,
        title: media.title,
        description: media.description,
        type: mediaTypeCodec.toApi(media.type),
        parodyOf: media.parodyOf,
        firstAppearance: toEpisodeReference(media.firstAppearance),
        image: media.imageUrl,
        url: `/media/${media.id}`,
        createdAt: media.createdAt.toISOString(),
        updatedAt: media.updatedAt.toISOString(),
    }),
};
