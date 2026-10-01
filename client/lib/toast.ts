export type ToastVariant = 'success' | 'error';

export interface Toast {
    id: number;
    variant: ToastVariant;
    title: string;
    description?: string;
    leaving: boolean;
}

const DURATION_MS = 6000;
const EXIT_MS = 180;
const MAX_TOASTS = 3;
const NO_TOASTS: Toast[] = [];

let toasts: Toast[] = NO_TOASTS;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

export function subscribeToToasts(listener: () => void): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function getToasts(): Toast[] {
    return toasts;
}

export function getServerToasts(): Toast[] {
    return NO_TOASTS;
}

export function dismissToast(id: number) {
    if (!toasts.some((toast) => toast.id === id && !toast.leaving)) {
        return;
    }

    toasts = toasts.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast));
    emit();

    setTimeout(() => {
        toasts = toasts.filter((toast) => toast.id !== id);
        emit();
    }, EXIT_MS);
}

function show(variant: ToastVariant, title: string, description?: string) {
    const id = nextId++;

    toasts = [
        ...toasts.slice(-(MAX_TOASTS - 1)),
        { id, variant, title, description, leaving: false },
    ];
    emit();

    setTimeout(() => dismissToast(id), DURATION_MS);
}

export const toast = {
    success: (title: string, description?: string) => show('success', title, description),
    error: (title: string, description?: string) => show('error', title, description),
};
