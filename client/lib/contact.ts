export const CONTACT_SUBJECTS = [
    'general',
    'data-correction',
    'bug-report',
    'feature-request',
    'partnership',
    'other',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_LIMITS = {
    nameMin: 2,
    name: 100,
    email: 254,
    messageMin: 20,
    messageMax: 2000,
} as const;

export const CONTACT_FIELDS = ['name', 'email', 'subject', 'message'] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export type ContactValues = Record<ContactField, string>;

export type ContactErrorCode =
    | 'nameRequired'
    | 'nameTooLong'
    | 'emailInvalid'
    | 'subjectRequired'
    | 'messageTooShort'
    | 'messageTooLong';

export interface ContactFormState {
    status: 'idle' | 'invalid' | 'error' | 'success';
    errors: Partial<Record<ContactField, ContactErrorCode>>;
    values: ContactValues;
}

export interface ContactValidation {
    status: 'invalid' | 'valid' | 'spam';
    errors: ContactFormState['errors'];
    values: ContactValues;
}

export const EMPTY_CONTACT_VALUES: ContactValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
};

export const INITIAL_CONTACT_STATE: ContactFormState = {
    status: 'idle',
    errors: {},
    values: EMPTY_CONTACT_VALUES,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(formData: FormData, field: string): string {
    const value = formData.get(field);

    return typeof value === 'string' ? value.trim() : '';
}

export function parseContactForm(formData: FormData) {
    const values: ContactValues = {
        name: read(formData, 'name'),
        email: read(formData, 'email'),
        subject: read(formData, 'subject'),
        message: read(formData, 'message'),
    };
    const errors: ContactFormState['errors'] = {};

    if (values.name.length < CONTACT_LIMITS.nameMin) {
        errors.name = 'nameRequired';
    } else if (values.name.length > CONTACT_LIMITS.name) {
        errors.name = 'nameTooLong';
    }

    if (!EMAIL_PATTERN.test(values.email) || values.email.length > CONTACT_LIMITS.email) {
        errors.email = 'emailInvalid';
    }

    if (!(CONTACT_SUBJECTS as readonly string[]).includes(values.subject)) {
        errors.subject = 'subjectRequired';
    }

    if (values.message.length < CONTACT_LIMITS.messageMin) {
        errors.message = 'messageTooShort';
    } else if (values.message.length > CONTACT_LIMITS.messageMax) {
        errors.message = 'messageTooLong';
    }

    return { values, errors, isSpam: read(formData, 'website') !== '' };
}
