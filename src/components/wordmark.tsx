'use client';

import Link from 'next/link';

import { LibraryMark } from '@/components/library-mark';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

/**
 * The wordmark lockup: the library mark, then المكتبة and Al-Maktaba.
 * Adapts order and emphasis dynamically to the current language.
 */
export function Wordmark({
    stacked = false,
    className,
}: {
    stacked?: boolean;
    className?: string;
}): React.ReactElement {
    const { isRTL } = useLanguage();

    return (
        <Link
            href="/"
            aria-label="Al-Maktaba — home"
            className={cn(
                'inline-flex items-center gap-3 text-ink hover:text-accent transition-colors',
                stacked && 'flex-col gap-2 text-center',
                className,
            )}
        >
            <LibraryMark size={stacked ? 44 : 32} className="text-accent shrink-0" />
            <span
                className={cn(
                    'flex items-baseline gap-2.5',
                    isRTL ? 'flex-row' : 'flex-row-reverse',
                    stacked && 'flex-col gap-1',
                )}
            >
                <span
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-[21px] font-bold leading-none tracking-tight text-ink"
                >
                    المكتبة
                </span>
                <span className="font-display text-[18px] font-semibold leading-none tracking-tight text-ink-muted">
                    Al-Maktaba
                </span>
            </span>
        </Link>
    );
}
