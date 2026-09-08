/** Join class names, dropping falsy values. Kept dependency-free. */
export function cn(...parts: (string | false | null | undefined)[]): string {
    return parts.filter(Boolean).join(' ');
}

/** Format minutes as a compact human string, e.g. 45 → "45 min", 120 → "2h". */
export function formatMinutes(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = minutes / 60;
    const rounded = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
    return `${rounded}h`;
}

/** Format an ISO date as e.g. "22 Jan 2025". */
export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/** Rating shown with its rater count, never bare (spec §2.2). */
export function formatRating(score: number, count: number): string {
    if (count === 0) {
        return 'No ratings yet';
    }
    return `${score.toFixed(1)} · ${count} ${count === 1 ? 'rating' : 'ratings'}`;
}

/** Format a whole-number count with a thousands separator. */
export function formatCount(value: number): string {
    return value.toLocaleString('en-US');
}
