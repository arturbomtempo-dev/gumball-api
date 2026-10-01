import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { MEDIA_LIMITS } from '../media.constraints.js';

export class RandomMediaQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(MEDIA_LIMITS.randomCount)
    count: number = 1;
}
