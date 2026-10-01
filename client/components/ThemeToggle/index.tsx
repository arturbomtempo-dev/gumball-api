'use client';

import { MoonIcon, SunIcon } from '@/components/Icons';
import { useI18n } from '@/hooks/useI18n';
import { getServerTheme, getTheme, setTheme, subscribeToTheme, syncThemeColor } from '@/lib/theme';
import { useEffect, useSyncExternalStore } from 'react';

export function ThemeToggle() {
    const { ui } = useI18n();
    const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const label = ui.theme[nextTheme];

    useEffect(() => {
        syncThemeColor(theme);
    }, [theme]);

    return (
        <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            aria-label={label}
            title={label}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
        >
            {theme === 'dark' ? (
                <SunIcon width={18} height={18} />
            ) : (
                <MoonIcon width={18} height={18} />
            )}
        </button>
    );
}
