import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsInt, Max, Min } from 'class-validator';
import { MAX_ID } from '../pipes/parse-id.pipe.js';

export function IdListField(maxItems: number): PropertyDecorator {
    return applyDecorators(
        Transform(({ value }: { value: unknown }) =>
            typeof value === 'string'
                ? value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map(Number)
                : value
        ),
        ArrayNotEmpty(),
        ArrayMaxSize(maxItems),
        IsInt({ each: true }),
        Min(1, { each: true }),
        Max(MAX_ID, { each: true })
    );
}
