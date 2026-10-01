'use server';

import { EMPTY_CONTACT_VALUES, parseContactForm, type ContactFormState } from '@/lib/contact';

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

    return { status: 'unavailable', errors: {}, values };
}
