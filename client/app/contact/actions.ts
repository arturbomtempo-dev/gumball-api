'use server';

import { EMPTY_CONTACT_VALUES, parseContactForm, type ContactFormState } from '@/lib/contact';
import { AUTHOR } from '@/lib/site';

export async function sendContactMessage(
    _previousState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const { values, errors, isSpam } = parseContactForm(formData);

    if (isSpam) {
        return {
            status: 'success',
            message: 'Thanks for reaching out. I will get back to you soon.',
            errors: {},
            values: EMPTY_CONTACT_VALUES,
        };
    }

    if (Object.keys(errors).length > 0) {
        return {
            status: 'invalid',
            message: 'Some fields need your attention before sending.',
            errors,
            values,
        };
    }

    return {
        status: 'error',
        message: `Sending messages from this form is not available yet. Please email ${AUTHOR.email} in the meantime.`,
        errors: {},
        values,
    };
}
