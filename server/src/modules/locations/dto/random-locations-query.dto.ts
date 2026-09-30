import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { LOCATION_LIMITS } from '../location.constraints.js';

export class RandomLocationsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(LOCATION_LIMITS.randomCount)
    count: number = 1;
}
