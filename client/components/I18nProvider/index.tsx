'use client';

import type { Locale } from '@/lib/i18n/config';
import type { UiDictionary } from '@/lib/i18n/dictionaries';
import { createContext, useMemo, type ReactNode } from 'react';

export interface I18nContextValue {
    locale: Locale;
    ui: UiDictionary;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps extends I18nContextValue {
    children: ReactNode;
}

export function I18nProvider({ locale, ui, children }: I18nProviderProps) {
    const value = useMemo(() => ({ locale, ui }), [locale, ui]);

    return <I18nContext value={value}>{children}</I18nContext>;
}
