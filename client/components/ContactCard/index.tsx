import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRightIcon, ArrowUpRightIcon } from '@/components/Icons';

interface ContactCardProps {
    href: string;
    icon: ReactNode;
    title: string;
    description: string;
    label: string;
}

const CARD_CLASSES =
    'group flex flex-col gap-4 rounded-2xl border border-border p-6 transition-colors hover:border-border-strong hover:bg-surface';

export function ContactCard({ href, icon, title, description, label }: ContactCardProps) {
    const external = href.startsWith('http');
    const content = (
        <>
            <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                    {icon}
                </div>
                {external ? (
                    <ArrowUpRightIcon className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                ) : (
                    <ArrowRightIcon className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                )}
            </div>
            <div className="space-y-1.5">
                <h2 className="font-medium text-foreground">{title}</h2>
                <p className="text-sm leading-6 text-muted">{description}</p>
            </div>
            <p className="mt-auto font-mono text-[13px] text-subtle">{label}</p>
        </>
    );

    return external ? (
        <a href={href} target="_blank" rel="noreferrer" className={CARD_CLASSES}>
            {content}
        </a>
    ) : (
        <Link href={href} className={CARD_CLASSES}>
            {content}
        </Link>
    );
}
