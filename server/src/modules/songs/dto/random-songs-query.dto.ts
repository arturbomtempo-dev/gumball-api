import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { SONG_LIMITS } from '../song.constraints.js';

export class RandomSongsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(SONG_LIMITS.randomCount)
    count: number = 1;
}
