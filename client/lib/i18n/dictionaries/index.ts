import type { Locale } from '../config';
import { en, type Dictionary } from './en';
import { es } from './es';
import { ptBr } from './pt-br';

const DICTIONARIES: Record<Locale, Dictionary> = {
    en,
    'pt-br': ptBr,
    es,
};

export type { Dictionary };

export type UiDictionary = Dictionary['ui'];

export function getDictionary(locale: Locale): Dictionary {
    return DICTIONARIES[locale];
}
