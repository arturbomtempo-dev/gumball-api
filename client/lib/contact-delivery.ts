import type { ContactSubject, ContactValues } from './contact';
import { LOCALE_DETAILS, type Locale } from './i18n/config';
import { getDictionary } from './i18n/dictionaries';
import { AUTHOR, SITE_NAME, SITE_URL } from './site';

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax';
const TIMEOUT_MS = 10_000;

interface FormSubmitResponse {
    success?: boolean | string;
    message?: string;
}

function recipient(): string {
    return encodeURIComponent(process.env.FORMSUBMIT_ENDPOINT?.trim() || AUTHOR.email);
}

export async function deliverContactMessage(
    values: ContactValues,
    locale: Locale
): Promise<boolean> {
    const subjects = getDictionary('en').ui.contactForm.subjects;
    const subject = subjects[values.subject as ContactSubject] ?? values.subject;

    try {
        const response = await fetch(`${FORMSUBMIT_URL}/${recipient()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Origin: SITE_URL,
                Referer: `${SITE_URL}/contact`,
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                subject,
                language: LOCALE_DETAILS[locale].name,
                message: values.message,
                _subject: `${SITE_NAME}: ${subject} from ${values.name}`,
                _replyto: values.email,
                _template: 'table',
                _captcha: 'false',
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        const result = (await response.json().catch(() => ({}))) as FormSubmitResponse;
        const delivered = response.ok && String(result.success) === 'true';

        if (!delivered) {
            console.error(
                `Contact message was not delivered (status ${response.status}): ${result.message ?? 'no details'}`
            );
        }

        return delivered;
    } catch (error) {
        console.error('Contact message delivery failed.', error);
        return false;
    }
}
