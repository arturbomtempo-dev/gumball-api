export type JsonTokenType = 'key' | 'string' | 'number' | 'literal' | 'punctuation' | 'text';

export interface JsonToken {
    type: JsonTokenType;
    value: string;
}

const TOKEN_PATTERN =
    /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g;

export function tokenizeJson(source: string): JsonToken[] {
    const tokens: JsonToken[] = [];
    let cursor = 0;

    for (const match of source.matchAll(TOKEN_PATTERN)) {
        const index = match.index ?? 0;

        if (index > cursor) {
            tokens.push({ type: 'text', value: source.slice(cursor, index) });
        }

        const [whole, text, colon, number, literal] = match;

        if (text !== undefined && colon !== undefined) {
            tokens.push({ type: 'key', value: text });
            tokens.push({ type: 'punctuation', value: colon });
        } else if (text !== undefined) {
            tokens.push({ type: 'string', value: text });
        } else if (number !== undefined) {
            tokens.push({ type: 'number', value: number });
        } else if (literal !== undefined) {
            tokens.push({ type: 'literal', value: literal });
        } else {
            tokens.push({ type: 'punctuation', value: whole });
        }

        cursor = index + whole.length;
    }

    if (cursor < source.length) {
        tokens.push({ type: 'text', value: source.slice(cursor) });
    }

    return tokens;
}

export function formatJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
}
