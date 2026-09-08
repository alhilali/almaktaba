'use client';

import type { IMethod } from '@/data/types';
import { cn, formatMinutes } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

/** Renders a method title with correct dir/lang and Thmanyah Serif Display for Arabic. */
export function MethodTitle({
    method,
    className,
}: {
    method: IMethod;
    className?: string;
}): React.ReactElement {
    const isArabic =
        method.titleLang === 'ar' ||
        method.language === 'Arabic' ||
        /[\u0600-\u06FF]/.test(method.title);

    return (
        <span
            lang={isArabic ? 'ar' : 'en'}
            dir={isArabic ? 'rtl' : 'ltr'}
            className={cn(isArabic ? 'font-arabic-display' : 'font-display', className)}
        >
            {method.title}
        </span>
    );
}

/** Renders a method description with matching Thmanyah Sans for Arabic. */
export function MethodDescription({
    method,
    className,
}: {
    method: IMethod;
    className?: string;
}): React.ReactElement {
    const isArabic =
        method.titleLang === 'ar' ||
        method.language === 'Arabic' ||
        /[\u0600-\u06FF]/.test(method.description);

    return (
        <span
            lang={isArabic ? 'ar' : 'en'}
            dir={isArabic ? 'rtl' : 'ltr'}
            className={cn(isArabic ? 'font-arabic' : '', className)}
        >
            {method.description}
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
    const { isRTL } = useLanguage();

    return (
        <span className={cn('tabular-nums font-semibold text-accent', className)}>
            {count}
            <span className="type-meta ms-1 font-normal text-ink-faint">
                {isRTL ? 'استخدام' : count === 1 ? 'reuse' : 'reuses'}
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
    const { isRTL } = useLanguage();

    return (
        <span className={cn('type-meta tabular-nums text-ink-muted', className)}>
            ★ {method.rating.score > 0 ? method.rating.score.toFixed(1) : '—'}
            <span className="text-ink-faint ms-1">
                ({method.rating.count} {isRTL ? 'تقييم' : 'ratings'})
            </span>
        </span>
    );
}

/** The 3px/4px sector shelf marker on the leading edge of a catalogue row. */
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
            className={cn('block w-[4px] shrink-0 self-stretch transition-all', className)}
            style={{ backgroundColor: color }}
        />
    );
}
