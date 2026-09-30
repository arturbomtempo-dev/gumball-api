import { Transform } from 'class-transformer';

export function Trim(): PropertyDecorator {
    return Transform(({ value }: { value: unknown }) => {
        if (typeof value === 'string') {
            return value.trim();
        }

        return value;
    });
}
