import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { EPISODE_LIMITS } from '../episode.constraints.js';

export class RandomEpisodesQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(EPISODE_LIMITS.randomCount)
    count: number = 1;
}
