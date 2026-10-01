import { BrandMark } from '@/components/BrandMark';
import { SITE_NAME } from '@/lib/site';
import Link from 'next/link';

interface LogoProps {
    href: string;
    label: string;
}

export function Logo({ href, label }: LogoProps) {
    return (
        <Link href={href} className="group flex items-center gap-2.5" aria-label={label}>
            <BrandMark className="h-7 w-auto text-foreground transition-colors group-hover:text-brand" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
                {SITE_NAME}
            </span>
        </Link>
    );
}
