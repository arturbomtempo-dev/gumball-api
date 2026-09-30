import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdField } from '../../../common/validation/id-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
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

export const CHARACTER_SORT_FIELDS = ['id', 'name', 'createdAt', 'updatedAt'] as const;
export const CHARACTER_SORT_VALUES = buildSortValues(CHARACTER_SORT_FIELDS);

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
    @IdField()
    firstAppearanceId?: number;

    @IsOptional()
    @IdListField(CHARACTER_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(CHARACTER_SORT_VALUES, {
        message: `sort must be one of: ${CHARACTER_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
