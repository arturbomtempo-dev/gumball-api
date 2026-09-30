import {
    AnimationStyle,
    CharacterGender,
    CharacterRole,
    CharacterStatus,
} from '../../generated/prisma/client.js';

interface EnumCodec<TDatabase extends string, TApi extends string> {
    values: readonly TApi[];
    toApi(value: TDatabase): TApi;
    toDatabase(value: TApi): TDatabase;
}

function createEnumCodec<TDatabase extends string, const TApi extends string>(
    mapping: Record<TDatabase, TApi>
): EnumCodec<TDatabase, TApi> {
    const entries = Object.entries(mapping) as [TDatabase, TApi][];
    const reverse = new Map(entries.map(([database, api]) => [api, database]));

    return {
        values: entries.map(([, api]) => api),
        toApi: (value) => mapping[value],
        toDatabase: (value) => {
            const database = reverse.get(value);

            if (database === undefined) {
                throw new RangeError(`Unknown value "${value}"`);
            }

            return database;
        },
    };
}

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
