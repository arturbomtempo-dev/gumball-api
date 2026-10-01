import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdField } from '../../../common/validation/id-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
import { MEDIA_LIMITS } from '../media.constraints.js';
import { mediaTypeCodec, type ApiMediaType } from '../media.enums.js';

export const MEDIA_SORT_FIELDS = ['id', 'title', 'createdAt', 'updatedAt'] as const;
export const MEDIA_SORT_VALUES = buildSortValues(MEDIA_SORT_FIELDS);

export type MediaSortField = (typeof MEDIA_SORT_FIELDS)[number];

export class ListMediaQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(MEDIA_LIMITS.search)
    search?: string;

    @IsOptional()
    @EnumField(mediaTypeCodec.values)
    type?: ApiMediaType;

    @IsOptional()
    @IdField()
    firstAppearanceId?: number;

    @IsOptional()
    @IdListField(MEDIA_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(MEDIA_SORT_VALUES, {
        message: `sort must be one of: ${MEDIA_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
