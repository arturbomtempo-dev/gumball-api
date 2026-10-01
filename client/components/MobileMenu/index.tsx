'use client';

import { ArrowUpRightIcon, CloseIcon, GithubIcon, MenuIcon } from '@/components/Icons';
import { NAVIGATION, REPOSITORY_URL, isActivePath } from '@/lib/site';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function MobileMenu() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [currentPathname, setCurrentPathname] = useState(pathname);
    const button = useRef<HTMLButtonElement>(null);
    const firstLink = useRef<HTMLAnchorElement>(null);

    if (currentPathname !== pathname) {
        setCurrentPathname(pathname);
        setOpen(false);
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        const media = window.matchMedia('(min-width: 40rem)');
        const previousOverflow = document.body.style.overflow;

        const close = () => setOpen(false);
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                button.current?.focus();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        media.addEventListener('change', close);
        firstLink.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
            media.removeEventListener('change', close);
        };
    }, [open]);

    return (
        <>
            <button
                ref={button}
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((current) => !current)}
                className="-mr-2 inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-strong sm:hidden"
            >
                {open ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
            </button>
            {open
                ? createPortal(
                      <div
                          id="mobile-menu"
                          className="fixed inset-x-0 top-16 bottom-0 z-40 sm:hidden"
                      >
                          <div
                              aria-hidden="true"
                              onClick={() => setOpen(false)}
                              className="absolute inset-0 animate-fade-in bg-foreground/15 backdrop-blur-[2px]"
                          />
                          <nav
                              aria-label="Mobile"
                              className="relative animate-menu-in border-b border-border bg-background px-5 pt-2 pb-5 shadow-[0_16px_32px_-16px_rgba(24,24,27,0.2)]"
                          >
                              <ul className="divide-y divide-border">
                                  {NAVIGATION.map((item, index) => {
                                      const active = isActivePath(pathname, item.href);

                                      return (
                                          <li key={item.href}>
                                              <Link
                                                  ref={index === 0 ? firstLink : undefined}
                                                  href={item.href}
                                                  aria-current={active ? 'page' : undefined}
                                                  onClick={() => setOpen(false)}
                                                  className={`flex items-center justify-between py-3.5 text-base transition-colors ${
                                                      active
                                                          ? 'font-medium text-foreground'
                                                          : 'text-muted hover:text-foreground'
                                                  }`}
                                              >
                                                  {item.label}
                                                  {active ? (
                                                      <span className="size-1.5 rounded-full bg-brand" />
                                                  ) : null}
                                              </Link>
                                          </li>
                                      );
                                  })}
                              </ul>
                              <a
                                  href={REPOSITORY_URL}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg border border-border-strong text-sm font-medium text-foreground transition-colors hover:bg-surface-strong"
                              >
                                  <GithubIcon width={16} height={16} />
                                  View on GitHub
                                  <ArrowUpRightIcon className="text-subtle" />
                              </a>
                          </nav>
                      </div>,
                      document.body
                  )
                : null}
        </>
    );
}
