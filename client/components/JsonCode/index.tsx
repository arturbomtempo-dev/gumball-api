import { tokenizeJson, type JsonTokenType } from '@/lib/json';

const TOKEN_CLASSES: Record<JsonTokenType, string> = {
    key: 'text-code-key',
    string: 'text-code-string',
    number: 'text-code-number',
    literal: 'text-code-literal',
    punctuation: 'text-code-punctuation',
    text: '',
};

interface JsonCodeProps {
    source: string;
}

export function JsonCode({ source }: JsonCodeProps) {
    return (
        <>
            {tokenizeJson(source).map((token, index) =>
                token.type === 'text' ? (
                    token.value
                ) : (
                    <span key={index} className={TOKEN_CLASSES[token.type]}>
                        {token.value}
                    </span>
                )
            )}
        </>
    );
}
