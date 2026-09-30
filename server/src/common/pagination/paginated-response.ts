export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginationLinks {
    self: string;
    first: string;
    previous: string | null;
    next: string | null;
    last: string;
}

export interface PaginatedResponse<TItem> {
    data: TItem[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

export interface PaginationRequest {
    path: string;
    query: Record<string, unknown>;
}

export function paginate<TItem>(
    data: TItem[],
    totalItems: number,
    { page, limit }: { page: number; limit: number },
    request: PaginationRequest
): PaginatedResponse<TItem> {
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const linkTo = (target: number) => buildPageLink(request, target, limit);

    return {
        data,
        meta: { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage },
        links: {
            self: linkTo(page),
            first: linkTo(1),
            previous: hasPreviousPage ? linkTo(Math.min(page - 1, totalPages)) : null,
            next: hasNextPage ? linkTo(page + 1) : null,
            last: linkTo(totalPages),
        },
    };
}

function buildPageLink(request: PaginationRequest, page: number, limit: number): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(request.query)) {
        if (key === 'page' || key === 'limit') {
            continue;
        }

        for (const item of Array.isArray(value) ? value : [value]) {
            if (typeof item === 'string') {
                params.append(key, item);
            }
        }
    }

    params.set('page', String(page));
    params.set('limit', String(limit));

    return `${request.path}?${params.toString()}`;
}
