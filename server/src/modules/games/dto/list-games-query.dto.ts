import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
import { GAME_LIMITS } from '../game.constraints.js';
import {
    gamePlatformCodec,
    gameStatusCodec,
    type ApiGamePlatform,
    type ApiGameStatus,
} from '../game.enums.js';

export const GAME_SORT_FIELDS = ['id', 'title', 'releaseDate', 'createdAt', 'updatedAt'] as const;
export const GAME_SORT_VALUES = buildSortValues(GAME_SORT_FIELDS);

export type GameSortField = (typeof GAME_SORT_FIELDS)[number];

export class ListGamesQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(GAME_LIMITS.search)
    search?: string;

    @IsOptional()
    @EnumField(gamePlatformCodec.values)
    platform?: ApiGamePlatform;

    @IsOptional()
    @EnumField(gameStatusCodec.values)
    status?: ApiGameStatus;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(GAME_LIMITS.developer)
    developer?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(GAME_LIMITS.minReleaseYear)
    @Max(GAME_LIMITS.maxReleaseYear)
    releaseYear?: number;

    @IsOptional()
    @IdListField(GAME_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(GAME_SORT_VALUES, {
        message: `sort must be one of: ${GAME_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
