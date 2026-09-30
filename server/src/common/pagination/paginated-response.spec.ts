import { paginate } from './paginated-response.js';

describe('paginate', () => {
    const request = { path: '/characters', query: { species: 'cat', page: '2', limit: '10' } };

    it('builds metadata and relative links for a middle page', () => {
        const result = paginate(['a'], 35, { page: 2, limit: 10 }, request);

        expect(result.meta).toEqual({
            page: 2,
            limit: 10,
            totalItems: 35,
            totalPages: 4,
            hasNextPage: true,
            hasPreviousPage: true,
        });
        expect(result.links).toEqual({
            self: '/characters?species=cat&page=2&limit=10',
            first: '/characters?species=cat&page=1&limit=10',
            previous: '/characters?species=cat&page=1&limit=10',
            next: '/characters?species=cat&page=3&limit=10',
            last: '/characters?species=cat&page=4&limit=10',
        });
    });

    it('reports a single empty page when there are no items', () => {
        const result = paginate([], 0, { page: 1, limit: 20 }, { path: '/characters', query: {} });

        expect(result.meta.totalPages).toBe(1);
        expect(result.links.previous).toBeNull();
        expect(result.links.next).toBeNull();
    });

    it('points previous to the last page when the page is out of range', () => {
        const result = paginate([], 15, { page: 9, limit: 10 }, { path: '/characters', query: {} });

        expect(result.meta.hasNextPage).toBe(false);
        expect(result.links.previous).toBe('/characters?page=2&limit=10');
    });

    it('ignores non-string query values', () => {
        const result = paginate(
            [],
            1,
            { page: 1, limit: 20 },
            {
                path: '/characters',
                query: { nested: { value: 'x' }, list: ['a', 'b'] },
            }
        );

        expect(result.links.self).toBe('/characters?list=a&list=b&page=1&limit=20');
    });
});
