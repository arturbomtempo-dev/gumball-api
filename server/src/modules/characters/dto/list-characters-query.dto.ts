import { Transform } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayNotEmpty,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { CHARACTER_LIMITS } from '../character.constraints.js';
import {
    animationStyleCodec,
    genderCodec,
    roleCodec,
    statusCodec,
    type ApiAnimationStyle,
    type ApiGender,
    type ApiRole,
    type ApiStatus,
} from '../character.enums.js';
import { EnumField } from './enum-field.decorator.js';

export const CHARACTER_SORT_FIELDS = ['id', 'name', 'createdAt', 'updatedAt'] as const;
export const CHARACTER_SORT_VALUES = CHARACTER_SORT_FIELDS.flatMap((field) => [field, `-${field}`]);

export type CharacterSortField = (typeof CHARACTER_SORT_FIELDS)[number];

export class ListCharactersQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(CHARACTER_LIMITS.search)
    search?: string;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(CHARACTER_LIMITS.species)
    species?: string;

    @IsOptional()
    @EnumField(genderCodec.values)
    gender?: ApiGender;

    @IsOptional()
    @EnumField(roleCodec.values)
    role?: ApiRole;

    @IsOptional()
    @EnumField(statusCodec.values)
    status?: ApiStatus;

    @IsOptional()
    @EnumField(animationStyleCodec.values)
    animationStyle?: ApiAnimationStyle;

    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(CHARACTER_LIMITS.voiceActor)
    voiceActor?: string;

    @IsOptional()
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string'
            ? value
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map(Number)
            : value
    )
    @ArrayNotEmpty()
    @ArrayMaxSize(CHARACTER_LIMITS.ids)
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Max(2_147_483_647, { each: true })
    ids?: number[];

    @IsOptional()
    @IsIn(CHARACTER_SORT_VALUES, {
        message: `sort must be one of: ${CHARACTER_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
