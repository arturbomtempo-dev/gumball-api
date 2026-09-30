import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SLUG_MAX_LENGTH, SLUG_PATTERN } from '../utils/slug.js';

@Injectable()
export class ParseSlugPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        if (value.length > SLUG_MAX_LENGTH || !SLUG_PATTERN.test(value)) {
            throw new BadRequestException(
                'slug must contain only lowercase letters, numbers and hyphens'
            );
        }

        return value;
    }
}
