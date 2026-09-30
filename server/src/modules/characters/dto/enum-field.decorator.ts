import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export function EnumField(values: readonly string[]): PropertyDecorator {
    return applyDecorators(
        Transform(({ value }: { value: unknown }) =>
            typeof value === 'string' ? value.trim().toLowerCase() : value
        ),
        IsIn(values, { message: `$property must be one of: ${values.join(', ')}` })
    );
}
