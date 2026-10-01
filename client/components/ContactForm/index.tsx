'use client';

import { sendContactMessage } from '@/app/contact/actions';
import { FormField } from '@/components/FormField';
import { ArrowRightIcon, ChevronDownIcon } from '@/components/Icons';
import {
    CONTACT_LIMITS,
    CONTACT_SUBJECTS,
    INITIAL_CONTACT_STATE,
    type ContactField,
} from '@/lib/contact';
import { toast } from '@/lib/toast';
import { useActionState, useEffect, useState } from 'react';

const INPUT_CLASSES =
    'w-full rounded-lg border bg-background px-3.5 text-sm text-foreground transition-colors outline-none placeholder:text-subtle focus:border-brand focus:ring-3 focus:ring-brand/15 aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/15';

const FIELD_ORDER: readonly ContactField[] = ['name', 'email', 'subject', 'message'];

export function ContactForm() {
    const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_CONTACT_STATE);
    const [submittedState, setSubmittedState] = useState(state);
    const [messageLength, setMessageLength] = useState(state.values.message.length);

    if (submittedState !== state) {
        setSubmittedState(state);
        setMessageLength(state.values.message.length);
    }

    useEffect(() => {
        if (!state.message) {
            return;
        }

        if (state.status === 'success') {
            toast.success('Message sent', state.message);
            return;
        }

        if (state.status === 'invalid') {
            toast.error('Please review the form', state.message);

            const firstInvalid = FIELD_ORDER.find((field) => state.errors[field]);

            if (firstInvalid) {
                document.getElementById(firstInvalid)?.focus();
            }

            return;
        }

        toast.error('Message not sent', state.message);
    }, [state]);

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
            className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:p-8"
        >
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField id="name" label="Name" error={state.errors.name}>
                    <input
                        {...fieldProps('name')}
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        maxLength={CONTACT_LIMITS.name}
                        required
                        className={`h-11 border-border-strong ${INPUT_CLASSES}`}
                    />
                </FormField>
                <FormField id="email" label="Email" error={state.errors.email}>
                    <input
                        {...fieldProps('email')}
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        maxLength={CONTACT_LIMITS.email}
                        required
                        className={`h-11 border-border-strong ${INPUT_CLASSES}`}
                    />
                </FormField>
            </div>

            <FormField id="subject" label="Subject" error={state.errors.subject}>
                <div className="relative">
                    <select
                        key={`subject-${state.values.subject}`}
                        {...fieldProps('subject')}
                        required
                        className={`h-11 appearance-none border-border-strong pr-10 ${INPUT_CLASSES}`}
                    >
                        <option value="" disabled>
                            Choose a subject
                        </option>
                        {CONTACT_SUBJECTS.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-subtle" />
                </div>
            </FormField>

            <FormField
                id="message"
                label="Message"
                error={state.errors.message}
                hint={`${messageLength} / ${CONTACT_LIMITS.messageMax}`}
            >
                <textarea
                    {...fieldProps('message')}
                    rows={6}
                    placeholder="Tell me what you have in mind..."
                    maxLength={CONTACT_LIMITS.messageMax}

                    required
                    onChange={(event) => setMessageLength(event.target.value.trim().length)}
                    className={`min-h-36 resize-none border-border-strong py-3 leading-6 ${INPUT_CLASSES}`}
                />
            </FormField>

            <div aria-hidden="true" className="sr-only">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-subtle">
                    Your details are only used to reply to your message.
                </p>
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
                    {pending ? 'Sending...' : 'Send message'}
                    {pending ? null : <ArrowRightIcon />}
                </button>
            </div>
        </form>
    );
}
