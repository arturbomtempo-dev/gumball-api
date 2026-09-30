import {
    AnimationStyle,
    CharacterGender,
    CharacterRole,
    CharacterStatus,
} from '../../generated/prisma/client.js';
import { createEnumCodec } from '../../common/utils/enum-codec.js';

export const genderCodec = createEnumCodec({
    [CharacterGender.MALE]: 'male',
    [CharacterGender.FEMALE]: 'female',
    [CharacterGender.OTHER]: 'other',
    [CharacterGender.UNKNOWN]: 'unknown',
});

export const roleCodec = createEnumCodec({
    [CharacterRole.MAIN]: 'main',
    [CharacterRole.SUPPORTING]: 'supporting',
    [CharacterRole.MINOR]: 'minor',
});

export const statusCodec = createEnumCodec({
    [CharacterStatus.ALIVE]: 'alive',
    [CharacterStatus.DECEASED]: 'deceased',
    [CharacterStatus.UNDEAD]: 'undead',
    [CharacterStatus.UNKNOWN]: 'unknown',
});

export const animationStyleCodec = createEnumCodec({
    [AnimationStyle.TWO_D]: '2d',
    [AnimationStyle.CGI]: 'cgi',
    [AnimationStyle.STOP_MOTION]: 'stop-motion',
    [AnimationStyle.PUPPET]: 'puppet',
    [AnimationStyle.LIVE_ACTION]: 'live-action',
    [AnimationStyle.MIXED_MEDIA]: 'mixed-media',
    [AnimationStyle.OTHER]: 'other',
});

export type ApiGender = (typeof genderCodec.values)[number];
export type ApiRole = (typeof roleCodec.values)[number];
export type ApiStatus = (typeof statusCodec.values)[number];
export type ApiAnimationStyle = (typeof animationStyleCodec.values)[number];
