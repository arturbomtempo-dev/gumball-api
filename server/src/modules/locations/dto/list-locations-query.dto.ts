import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination/pagination-query.dto.js';
import { buildSortValues } from '../../../common/pagination/sort.js';
import { Trim } from '../../../common/utils/trim.transform.js';
import { EnumField } from '../../../common/validation/enum-field.decorator.js';
import { IdField } from '../../../common/validation/id-field.decorator.js';
import { IdListField } from '../../../common/validation/id-list-field.decorator.js';
import { LOCATION_LIMITS } from '../location.constraints.js';
import { locationTypeCodec, type ApiLocationType } from '../location.enums.js';

export const LOCATION_SORT_FIELDS = ['id', 'name', 'createdAt', 'updatedAt'] as const;
export const LOCATION_SORT_VALUES = buildSortValues(LOCATION_SORT_FIELDS);

export type LocationSortField = (typeof LOCATION_SORT_FIELDS)[number];

export class ListLocationsQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Trim()
    @IsString()
    @MaxLength(LOCATION_LIMITS.search)
    search?: string;

    @IsOptional()
    @EnumField(locationTypeCodec.values)
    type?: ApiLocationType;

    @IsOptional()
    @IdField()
    parentId?: number;

    @IsOptional()
    @IdListField(LOCATION_LIMITS.ids)
    ids?: number[];

    @IsOptional()
    @IsIn(LOCATION_SORT_VALUES, {
        message: `sort must be one of: ${LOCATION_SORT_VALUES.join(', ')}`,
    })
    sort: string = 'id';
}
