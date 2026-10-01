import type { ContactValues } from './contact';
import { AUTHOR, SITE_NAME } from './site';

const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent(AUTHOR.email)}`;
const TIMEOUT_MS = 15_000;

interface DeliveryDetails {
    subject: string;
    language: string;
}

interface FormSubmitResponse {
    success?: boolean | string;
    message?: string;
}

export async function deliverContactMessage(
    values: ContactValues,
    { subject, language }: DeliveryDetails
): Promise<boolean> {
    try {
        const response = await fetch(FORMSUBMIT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                subject,
                language,
                message: values.message,
                _subject: `${SITE_NAME}: ${subject} from ${values.name}`,
                _replyto: values.email,
                _template: 'table',
                _captcha: 'false',
            }),
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        const result = (await response.json().catch(() => ({}))) as FormSubmitResponse;
        const delivered = response.ok && String(result.success) === 'true';

        if (!delivered) {
            console.error(
                `Contact message was not delivered: ${result.message ?? response.status}`
            );
        }

        return delivered;
    } catch (error) {
        console.error('Contact message delivery failed.', error);
        return false;
    }
}
