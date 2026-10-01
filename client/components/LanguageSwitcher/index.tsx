'use client';

import { CheckIcon, ChevronDownIcon, GlobeIcon } from '@/components/Icons';
import { useI18n } from '@/hooks/useI18n';
import {
    LOCALES,
    LOCALE_COOKIE,
    LOCALE_COOKIE_MAX_AGE,
    LOCALE_DETAILS,
    localizePath,
    splitLocale,
    type Locale,
} from '@/lib/i18n/config';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

function rememberLocale(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

export function LanguageSwitcher() {
    const { locale, ui } = useI18n();
    const path = splitLocale(usePathname()).path;
    const [open, setOpen] = useState(false);
    const id = useId();
    const container = useRef<HTMLDivElement>(null);
    const button = useRef<HTMLButtonElement>(null);
    const items = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        if (!open) {
            return;
        }

        items.current[LOCALES.indexOf(locale)]?.focus();

        const onPointerDown = (event: PointerEvent) => {
            if (!container.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);

        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, locale]);

    function onMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
        const current = items.current.findIndex((item) => item === document.activeElement);
        const last = LOCALES.length - 1;
        const focus = (index: number) => {
            event.preventDefault();
            items.current[index]?.focus();
        };

        if (event.key === 'ArrowDown') {
            focus(current >= last ? 0 : current + 1);
        } else if (event.key === 'ArrowUp') {
            focus(current <= 0 ? last : current - 1);
        } else if (event.key === 'Home') {
            focus(0);
        } else if (event.key === 'End') {
            focus(last);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            button.current?.focus();
        } else if (event.key === 'Tab') {
            setOpen(false);
        }
    }

    return (
        <div ref={container} className="relative">
            <button
                ref={button}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={`${id}-menu`}
                aria-label={`${ui.language.change}: ${LOCALE_DETAILS[locale].name}`}
                title={ui.language.change}
                onClick={() => setOpen((current) => !current)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
            >
                <GlobeIcon width={17} height={17} />
                <span className="font-medium">{LOCALE_DETAILS[locale].shortName}</span>
                <ChevronDownIcon
                    width={13}
                    height={13}
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open ? (
                <ul
                    id={`${id}-menu`}
                    role="menu"
                    aria-label={ui.language.label}
                    onKeyDown={onMenuKeyDown}
                    className="absolute top-full right-0 z-50 mt-2 w-44 animate-menu-in rounded-xl border border-border bg-background p-1 shadow-elevated"
                >
                    {LOCALES.map((option, index) => {
                        const selected = option === locale;

                        return (
                            <li key={option} role="none">
                                <a
                                    ref={(element) => {
                                        items.current[index] = element;
                                    }}
                                    href={localizePath(option, path)}
                                    hrefLang={LOCALE_DETAILS[option].htmlLang}
                                    lang={LOCALE_DETAILS[option].htmlLang}
                                    role="menuitemradio"
                                    aria-checked={selected}
                                    onClick={(event) => {
                                        rememberLocale(option);
                                        event.currentTarget.hash = window.location.hash;
                                    }}
                                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors outline-none hover:bg-surface-strong focus-visible:bg-surface-strong ${
                                        selected ? 'font-medium text-foreground' : 'text-muted'
                                    }`}
                                >
                                    {LOCALE_DETAILS[option].name}
                                    {selected ? (
                                        <CheckIcon width={15} height={15} className="text-brand" />
                                    ) : null}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
