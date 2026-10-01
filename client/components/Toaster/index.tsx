'use client';

import { AlertCircleIcon, CheckCircleIcon, CloseIcon } from '@/components/Icons';
import { dismissToast, getServerToasts, getToasts, subscribeToToasts } from '@/lib/toast';
import { useSyncExternalStore } from 'react';

const VARIANTS = {
    success: { icon: CheckCircleIcon, iconClasses: 'text-emerald-600' },
    error: { icon: AlertCircleIcon, iconClasses: 'text-red-600' },
};

export function Toaster() {
    const toasts = useSyncExternalStore(subscribeToToasts, getToasts, getServerToasts);

    return (
        <section
            aria-label="Notifications"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
        >
            {toasts.map((toast) => {
                const { icon: Icon, iconClasses } = VARIANTS[toast.variant];

                return (
                    <div
                        key={toast.id}
                        role={toast.variant === 'error' ? 'alert' : 'status'}
                        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-background p-4 shadow-[0_12px_32px_-12px_rgba(24,24,27,0.25)] ${
                            toast.leaving ? 'animate-toast-out' : 'animate-toast-in'
                        }`}
                    >
                        <Icon width={18} height={18} className={`mt-px shrink-0 ${iconClasses}`} />
                        <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-sm font-medium text-foreground">{toast.title}</p>
                            {toast.description ? (
                                <p className="text-sm leading-5 text-muted">{toast.description}</p>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            aria-label="Dismiss notification"
                            className="-mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-surface-strong hover:text-foreground"
                        >
                            <CloseIcon width={14} height={14} />
                        </button>
                    </div>
                );
            })}
        </section>
    );
}
