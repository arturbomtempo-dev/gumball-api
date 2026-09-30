import { toEpisodeReference } from '../episodes/episode-reference.js';
import type { LocationResponseDto } from './dto/location-response.dto.js';
import { locationTypeCodec } from './location.enums.js';
import type { LocationWithParent } from './locations.repository.js';

const locationUrl = (id: number) => `/locations/${id}`;

export const LocationMapper = {
    toResponse: (location: LocationWithParent): LocationResponseDto => ({
        id: location.id,
        slug: location.slug,
        name: location.name,
        description: location.description,
        type: locationTypeCodec.toApi(location.type),
        parent: location.parent
            ? {
                  id: location.parent.id,
                  slug: location.parent.slug,
                  name: location.parent.name,
                  url: locationUrl(location.parent.id),
              }
            : null,
        firstAppearance: toEpisodeReference(location.firstAppearance),
        image: location.imageUrl,
        url: locationUrl(location.id),
        createdAt: location.createdAt.toISOString(),
        updatedAt: location.updatedAt.toISOString(),
    }),
};
