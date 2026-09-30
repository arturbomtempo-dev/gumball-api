import { fromDateOnly, toDateOnly } from './date.js';

describe('date helpers', () => {
    it('formats a date as YYYY-MM-DD in UTC', () => {
        expect(toDateOnly(new Date('2011-05-03T00:00:00.000Z'))).toBe('2011-05-03');
    });

    it('returns null for a missing date', () => {
        expect(toDateOnly(null)).toBeNull();
    });

    it('parses a date-only string at UTC midnight', () => {
        expect(fromDateOnly('2025-07-28').toISOString()).toBe('2025-07-28T00:00:00.000Z');
    });
});
