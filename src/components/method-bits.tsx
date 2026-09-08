import type { IMethod } from '@/data/types';
import { cn, formatMinutes, formatRating } from '@/lib/utils';

/** Renders a method title with correct dir/lang so Arabic sets in place, at parity. */
export function MethodTitle({
    method,
    className,
}: {
    method: IMethod;
    className?: string;
}): React.ReactElement {
    const isArabic = method.titleLang === 'ar';
    return (
        <span
            lang={isArabic ? 'ar' : 'en'}
            dir={isArabic ? 'rtl' : 'ltr'}
            className={cn(isArabic && 'font-arabic', className)}
        >
            {method.title}
        </span>
    );
}

/** The reuse count — the most prominent number on a row, in the accent. */
export function ReuseCount({
    count,
    className,
}: {
    count: number;
    className?: string;
}): React.ReactElement {
    return (
        <span className={cn('tabular-nums font-semibold text-accent', className)}>
            {count}
            <span className="type-meta ml-1 font-normal text-ink-faint">
                {count === 1 ? 'reuse' : 'reuses'}
            </span>
        </span>
    );
}

/** Typical time before → after, with the saving in the measure (brass) tone. */
export function TimeDelta({ method }: { method: IMethod }): React.ReactElement {
    return (
        <span className="type-meta tabular-nums text-ink-muted">
            {formatMinutes(method.timeBeforeMin)}
            <span className="mx-1 text-ink-faint">→</span>
            <span className="font-semibold text-measure">{formatMinutes(method.timeAfterMin)}</span>
        </span>
    );
}

/** Rating with rater count — never a bare score (spec §2.2). */
export function RatingLine({
    method,
    className,
}: {
    method: IMethod;
    className?: string;
}): React.ReactElement {
    return (
        <span className={cn('type-meta tabular-nums text-ink-muted', className)}>
            {formatRating(method.rating.score, method.rating.count)}
        </span>
    );
}

/** The 3px sector shelf marker on the left edge of a catalogue row. */
export function ShelfMarker({
    color,
    className,
}: {
    color: string;
    className?: string;
}): React.ReactElement {
    return (
        <span
            aria-hidden
            className={cn('block w-[3px] shrink-0 self-stretch', className)}
            style={{ backgroundColor: color }}
        />
    );
}
