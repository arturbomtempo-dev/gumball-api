import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { DateField } from '../../../common/validation/date-field.decorator.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
import { EPISODE_LIMITS } from '../episode.constraints.js';
import {
    episodeStatusCodec,
    episodeTypeCodec,
    seriesCodec,
    type ApiEpisodeStatus,
    type ApiEpisodeType,
    type ApiSeries,
} from '../episode.enums.js';

export const EPISODE_SORT_FIELDS = [
    'id',
    'title',
    'overallNumber',
    'usAirDate',
    'createdAt',
    'updatedAt',
] as const;
export const EPISODE_SORT_VALUES = buildSortValues(EPISODE_SORT_FIELDS);

export type EpisodeSortField = (typeof EPISODE_SORT_FIELDS)[number];

export class ListEpisodesQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(EPISODE_LIMITS.search)
    search?: string;

    @IsOptional()
    @EnumField(seriesCodec.values)
    series?: ApiSeries;

    @IsOptional()
    @EnumField(episodeTypeCodec.values)
    type?: ApiEpisodeType;

    @IsOptional()
    @EnumField(episodeStatusCodec.values)
    status?: ApiEpisodeStatus;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(EPISODE_LIMITS.maxSeason)
    season?: number;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(EPISODE_LIMITS.person)
    writer?: string;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(EPISODE_LIMITS.person)
    storyboardArtist?: string;

    @IsOptional()
    @DateField()
    airedFrom?: string;

    @IsOptional()
    @DateField()
    airedTo?: string;

    @IsOptional()
    @IdListField(EPISODE_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(EPISODE_SORT_VALUES, {
        message: `sort must be one of: ${EPISODE_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
