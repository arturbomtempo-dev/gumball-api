import { RichText } from '@/components/RichText';

interface ParagraphProps {
    children: string;
}

export function Paragraph({ children }: ParagraphProps) {
    return (
        <p className="text-[15px] leading-7 text-muted">
            <RichText text={children} />
        </p>
    );
}
