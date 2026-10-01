'use client';

import { validateContactMessage } from '@/app/[lang]/contact/actions';
import { FormField } from '@/components/FormField';
import { ArrowRightIcon, ChevronDownIcon } from '@/components/Icons';
import { useI18n } from '@/hooks/useI18n';
import {
    CONTACT_FIELDS,
    CONTACT_LIMITS,
    CONTACT_SUBJECTS,
    EMPTY_CONTACT_VALUES,
    INITIAL_CONTACT_STATE,
    type ContactErrorCode,
    type ContactField,
    type ContactFormState,
    type ContactSubject,
} from '@/lib/contact';
import { deliverContactMessage } from '@/lib/contact-delivery';
import { LOCALE_DETAILS, formatMessage } from '@/lib/i18n/config';
import { AUTHOR } from '@/lib/site';
import { toast } from '@/lib/toast';
import { useActionState, useEffect, useState } from 'react';

const INPUT_CLASSES =
    'w-full rounded-lg border bg-background px-3.5 text-sm text-foreground transition-colors outline-none placeholder:text-subtle focus:border-brand focus:ring-3 focus:ring-brand/15 aria-invalid:border-danger/60 aria-invalid:focus:ring-danger/15';

const ERROR_VALUES: Record<ContactErrorCode, Record<string, number>> = {
    nameRequired: {},
    nameTooLong: { max: CONTACT_LIMITS.name },
    emailInvalid: {},
    subjectRequired: {},
    messageTooShort: { min: CONTACT_LIMITS.messageMin },
    messageTooLong: { max: CONTACT_LIMITS.messageMax },
};

export function ContactForm() {
    const { locale, ui } = useI18n();
    const text = ui.contactForm;

    async function submit(
        _previousState: ContactFormState,
        formData: FormData
    ): Promise<ContactFormState> {
        const validation = await validateContactMessage(formData);

        if (validation.status === 'invalid') {
            return { status: 'invalid', errors: validation.errors, values: validation.values };
        }

        if (validation.status === 'spam') {
            return { status: 'success', errors: {}, values: EMPTY_CONTACT_VALUES };
        }

        const delivered = await deliverContactMessage(validation.values, {
            subject: text.subjects[validation.values.subject as ContactSubject],
            language: LOCALE_DETAILS[locale].name,
        });

        return delivered
            ? { status: 'success', errors: {}, values: EMPTY_CONTACT_VALUES }
            : { status: 'error', errors: {}, values: validation.values };
    }

    const [state, formAction, pending] = useActionState(submit, INITIAL_CONTACT_STATE);
    const [submittedState, setSubmittedState] = useState(state);
    const [messageLength, setMessageLength] = useState(state.values.message.length);

    if (submittedState !== state) {
        setSubmittedState(state);
        setMessageLength(state.values.message.length);
    }

    useEffect(() => {
        if (state.status === 'success') {
            toast.success(text.toasts.successTitle, text.toasts.successDescription);
        } else if (state.status === 'invalid') {
            toast.error(text.toasts.invalidTitle, text.toasts.invalidDescription);

            const firstInvalid = CONTACT_FIELDS.find((field) => state.errors[field]);

            if (firstInvalid) {
                document.getElementById(firstInvalid)?.focus();
            }
        } else if (state.status === 'error') {
            toast.error(
                text.toasts.errorTitle,
                formatMessage(text.toasts.errorDescription, { email: AUTHOR.email })
            );
        }
    }, [state, text]);

    function errorMessage(field: ContactField): string | undefined {
        const code = state.errors[field];

        return code ? formatMessage(text.errors[code], ERROR_VALUES[code]) : undefined;
    }

    function fieldProps(field: ContactField) {
        const error = state.errors[field];

        return {
            id: field,
            name: field,
            defaultValue: state.values[field],
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${field}-error` : undefined,
        };
    }

    return (
        <form
            action={formAction}
            noValidate
            className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-xs sm:p-8"
        >
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField id="name" label={text.name} error={errorMessage('name')}>
                    <input
                        {...fieldProps('name')}
                        type="text"
                        autoComplete="name"
                        placeholder={text.namePlaceholder}
                        maxLength={CONTACT_LIMITS.name}
                        required
                        className={`h-11 border-border-strong ${INPUT_CLASSES}`}
                    />
                </FormField>
                <FormField id="email" label={text.email} error={errorMessage('email')}>
                    <input
                        {...fieldProps('email')}
                        type="email"
                        autoComplete="email"
                        placeholder={text.emailPlaceholder}
                        maxLength={CONTACT_LIMITS.email}
                        required
                        className={`h-11 border-border-strong ${INPUT_CLASSES}`}
                    />
                </FormField>
            </div>

            <FormField id="subject" label={text.subject} error={errorMessage('subject')}>
                <div className="relative">
                    <select
                        key={`subject-${state.values.subject}`}
                        {...fieldProps('subject')}
                        required
                        className={`h-11 appearance-none border-border-strong pr-10 ${INPUT_CLASSES}`}
                    >
                        <option value="" disabled>
                            {text.subjectPlaceholder}
                        </option>
                        {CONTACT_SUBJECTS.map((subject) => (
                            <option key={subject} value={subject}>
                                {text.subjects[subject]}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-subtle" />
                </div>
            </FormField>

            <FormField
                id="message"
                label={text.message}
                error={errorMessage('message')}
                hint={`${messageLength} / ${CONTACT_LIMITS.messageMax}`}
            >
                <textarea
                    {...fieldProps('message')}
                    rows={6}
                    placeholder={text.messagePlaceholder}
                    maxLength={CONTACT_LIMITS.messageMax}
                    required
                    onChange={(event) => setMessageLength(event.target.value.trim().length)}
                    className={`min-h-36 resize-none border-border-strong py-3 leading-6 ${INPUT_CLASSES}`}
                />
            </FormField>

            <div aria-hidden="true" className="sr-only">
                <label htmlFor="website">{text.honeypot}</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-subtle">{text.privacy}</p>
                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending ? (
                        <span
                            aria-hidden="true"
                            className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background"
                        />
                    ) : null}
                    {pending ? text.submitting : text.submit}
                    {pending ? null : <ArrowRightIcon />}
                </button>
            </div>
        </form>
    );
}
