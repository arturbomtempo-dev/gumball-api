import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const MAX_ID = 2_147_483_647;

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        if (!/^[1-9]\d{0,9}$/.test(value)) {
            throw new BadRequestException('id must be a positive integer');
        }

        const id = Number(value);

        if (id > MAX_ID) {
            throw new BadRequestException('id must be a positive integer');
        }

        return id;
    }
}
