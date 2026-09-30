import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { GAME_LIMITS } from '../game.constraints.js';

export class RandomGamesQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(GAME_LIMITS.randomCount)
    count: number = 1;
}
