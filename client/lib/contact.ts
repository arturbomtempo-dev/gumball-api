export const CONTACT_SUBJECTS = [
    'General question',
    'Data correction',
    'Bug report',
    'Feature request',
    'Partnership or sponsorship',
    'Other',
] as const;

export const CONTACT_LIMITS = {
    name: 100,
    email: 254,
    messageMin: 20,
    messageMax: 2000,
} as const;

export type ContactField = 'name' | 'email' | 'subject' | 'message';

export type ContactValues = Record<ContactField, string>;

export interface ContactFormState {
    status: 'idle' | 'invalid' | 'error' | 'success';
    message: string | null;
    errors: Partial<Record<ContactField, string>>;
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
    message: null,
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

    if (values.name.length < 2) {
        errors.name = 'Please enter your name.';
    } else if (values.name.length > CONTACT_LIMITS.name) {
        errors.name = `Your name must have at most ${CONTACT_LIMITS.name} characters.`;
    }

    if (!EMAIL_PATTERN.test(values.email) || values.email.length > CONTACT_LIMITS.email) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!(CONTACT_SUBJECTS as readonly string[]).includes(values.subject)) {
        errors.subject = 'Please choose a subject.';
    }

    if (values.message.length < CONTACT_LIMITS.messageMin) {
        errors.message = `Your message must have at least ${CONTACT_LIMITS.messageMin} characters.`;
    } else if (values.message.length > CONTACT_LIMITS.messageMax) {
        errors.message = `Your message must have at most ${CONTACT_LIMITS.messageMax} characters.`;
    }

    return { values, errors, isSpam: read(formData, 'website') !== '' };
}
