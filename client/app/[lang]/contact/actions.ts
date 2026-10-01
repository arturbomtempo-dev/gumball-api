'use server';

import { EMPTY_CONTACT_VALUES, parseContactForm, type ContactValidation } from '@/lib/contact';

export async function validateContactMessage(formData: FormData): Promise<ContactValidation> {
    const { values, errors, isSpam } = parseContactForm(formData);

    if (isSpam) {
        return { status: 'spam', errors: {}, values: EMPTY_CONTACT_VALUES };
    }

    if (Object.keys(errors).length > 0) {
        return { status: 'invalid', errors, values };
    }

    return { status: 'valid', errors: {}, values };
}
