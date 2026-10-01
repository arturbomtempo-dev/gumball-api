import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.png';
import { SITE_NAME } from '@/lib/site';

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
            <Image src={logo} alt="" width={36} height={34} priority />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
                {SITE_NAME}
            </span>
        </Link>
    );
}
