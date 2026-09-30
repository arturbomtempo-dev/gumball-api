import { BadRequestException } from '@nestjs/common';
import { ParseIdPipe } from './parse-id.pipe.js';

describe('ParseIdPipe', () => {
    const pipe = new ParseIdPipe();

    it.each([
        ['1', 1],
        ['42', 42],
        ['2147483647', 2_147_483_647],
    ])('parses %s', (value, expected) => {
        expect(pipe.transform(value)).toBe(expected);
    });

    it.each(['0', '-1', '01', '1.5', 'abc', '1e3', '2147483648', '99999999999', ''])(
        'rejects %s',
        (value) => {
            expect(() => pipe.transform(value)).toThrow(BadRequestException);
        }
    );
});
