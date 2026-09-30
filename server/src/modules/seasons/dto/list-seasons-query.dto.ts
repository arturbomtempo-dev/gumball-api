import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
import { seriesCodec, type ApiSeries } from '../../episodes/episode.enums.js';
import { SEASON_LIMITS } from '../season.constraints.js';
import { seasonStatusCodec, type ApiSeasonStatus } from '../season.enums.js';

export const SEASON_SORT_FIELDS = [
    'id',
    'number',
    'title',
    'usPremiereDate',
    'createdAt',
    'updatedAt',
] as const;
export const SEASON_SORT_VALUES = buildSortValues(SEASON_SORT_FIELDS);

export type SeasonSortField = (typeof SEASON_SORT_FIELDS)[number];

export class ListSeasonsQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(SEASON_LIMITS.search)
    search?: string;

    @IsOptional()
    @EnumField(seriesCodec.values)
    series?: ApiSeries;

    @IsOptional()
    @EnumField(seasonStatusCodec.values)
    status?: ApiSeasonStatus;

    @IsOptional()
    @IdListField(SEASON_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(SEASON_SORT_VALUES, {
        message: `sort must be one of: ${SEASON_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'number';
}
