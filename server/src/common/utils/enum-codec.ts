export interface EnumCodec<TDatabase extends string, TApi extends string> {
    values: readonly TApi[];
    toApi(value: TDatabase): TApi;
    toDatabase(value: TApi): TDatabase;
}

export function createEnumCodec<TDatabase extends string, const TApi extends string>(
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
