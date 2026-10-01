'use server';

import { EMPTY_CONTACT_VALUES, parseContactForm, type ContactFormState } from '@/lib/contact';
import { deliverContactMessage } from '@/lib/contact-delivery';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';

export async function sendContactMessage(
    _previousState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const { values, errors, isSpam } = parseContactForm(formData);

    if (isSpam) {
        return { status: 'success', errors: {}, values: EMPTY_CONTACT_VALUES };
    }

    if (Object.keys(errors).length > 0) {
        return { status: 'invalid', errors, values };
    }

    const requestedLocale = formData.get('locale');
    const locale =
        typeof requestedLocale === 'string' && isLocale(requestedLocale)
            ? requestedLocale
            : DEFAULT_LOCALE;

    if (await deliverContactMessage(values, locale)) {
        return { status: 'success', errors: {}, values: EMPTY_CONTACT_VALUES };
    }

    return { status: 'error', errors: {}, values };
}
