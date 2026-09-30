import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { SEASON_LIMITS } from '../season.constraints.js';

export class RandomSeasonsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(SEASON_LIMITS.randomCount)
    count: number = 1;
}
