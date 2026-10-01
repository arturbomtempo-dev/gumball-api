import { SITE_NAME } from '@/lib/site';
import logo from '@/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    href: string;
    label: string;
}

export function Logo({ href, label }: LogoProps) {
    return (
        <Link href={href} className="flex items-center gap-2.5" aria-label={label}>
            <Image
                src={logo}
                alt=""
                sizes="36px"
                loading="eager"
                fetchPriority="low"
                className="h-auto w-9"
            />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
                {SITE_NAME}
            </span>
        </Link>
    );
}
