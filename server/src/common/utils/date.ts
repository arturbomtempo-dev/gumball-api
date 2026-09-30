export function toDateOnly(date: Date | null): string | null {
    return date ? date.toISOString().slice(0, 10) : null;
}

export function fromDateOnly(value: string): Date {
    return new Date(`${value}T00:00:00.000Z`);
}
