import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CHARACTER_LIMITS } from '../character.constraints.js';

export class RandomCharactersQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(CHARACTER_LIMITS.randomCount)
    count: number = 1;
}
