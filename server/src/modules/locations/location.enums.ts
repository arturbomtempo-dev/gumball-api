import { createEnumCodec } from '../../common/utils/enum-codec.js';
import { LocationType } from '../../generated/prisma/client.js';

export const locationTypeCodec = createEnumCodec({
    [LocationType.TOWN]: 'town',
    [LocationType.RESIDENCE]: 'residence',
    [LocationType.SCHOOL]: 'school',
    [LocationType.SCHOOL_FACILITY]: 'school-facility',
    [LocationType.SHOP]: 'shop',
    [LocationType.RESTAURANT]: 'restaurant',
    [LocationType.BUSINESS]: 'business',
    [LocationType.PUBLIC_SERVICE]: 'public-service',
    [LocationType.LEISURE]: 'leisure',
    [LocationType.TRANSPORT]: 'transport',
    [LocationType.NATURE]: 'nature',
    [LocationType.OTHER_REALM]: 'other-realm',
    [LocationType.OTHER]: 'other',
});

export type ApiLocationType = (typeof locationTypeCodec.values)[number];
