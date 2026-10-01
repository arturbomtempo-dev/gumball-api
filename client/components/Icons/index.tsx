import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            width={16}
            height={16}
            {...props}
        >
            {children}
        </svg>
    );
}

export function GithubIcon(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            width={16}
            height={16}
            {...props}
        >
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
    );
}

export function CopyIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
        </BaseIcon>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M20 6 9 17l-5-5" />
        </BaseIcon>
    );
}

export function ChevronDownIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m6 9 6 6 6-6" />
        </BaseIcon>
    );
}

export function ArrowRightIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </BaseIcon>
    );
}

export function ArrowUpRightIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
        </BaseIcon>
    );
}

export function PlayIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" />
        </BaseIcon>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </BaseIcon>
    );
}

export function HashIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M5 9h14" />
            <path d="M4 15h14" />
            <path d="M10 3 8 21" />
            <path d="M16 3l-2 18" />
        </BaseIcon>
    );
}

export function BookIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5a2.5 2.5 0 0 0 0 5H19" />
        </BaseIcon>
    );
}

export function KeyOffIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <circle cx="7.5" cy="15.5" r="4.5" />
            <path d="m10.7 12.3 9.8-9.8" />
            <path d="m16 7 3 3" />
        </BaseIcon>
    );
}

export function LinkIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
        </BaseIcon>
    );
}

export function LayersIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 13 9 5 9-5" />
        </BaseIcon>
    );
}
