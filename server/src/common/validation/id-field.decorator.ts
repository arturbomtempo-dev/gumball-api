import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { MAX_ID } from '../pipes/parse-id.pipe.js';

export function IdField(): PropertyDecorator {
    return applyDecorators(
        Type(() => Number),
        IsInt(),
        Min(1),
        Max(MAX_ID)
    );
}
