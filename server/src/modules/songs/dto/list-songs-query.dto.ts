import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdField } from '../../../common/validation/id-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
import { SONG_LIMITS } from '../song.constraints.js';
import { songTypeCodec, type ApiSongType } from '../song.enums.js';

export const SONG_SORT_FIELDS = [
    'id',
    'title',
    'durationSeconds',
    'createdAt',
    'updatedAt',
] as const;
export const SONG_SORT_VALUES = buildSortValues(SONG_SORT_FIELDS);

export type SongSortField = (typeof SONG_SORT_FIELDS)[number];

const toTitleCase = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/(^|[\s-])(\p{L})/gu, (match) => match.toUpperCase());

export class ListSongsQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(SONG_LIMITS.search)
    search?: string;

    @IsOptional()
    @EnumField(songTypeCodec.values)
    type?: ApiSongType;

    @IsOptional()
    @IdField()
    episodeId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(99)
    season?: number;

    @IsOptional()
    @IdField()
    characterId?: number;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(SONG_LIMITS.vocalist)
    vocalist?: string;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? toTitleCase(value) : value
    )
    @IsString()
    @MaxLength(SONG_LIMITS.genre)
    genre?: string;

    @IsOptional()
    @IdListField(SONG_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(SONG_SORT_VALUES, {
        message: `sort must be one of: ${SONG_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
