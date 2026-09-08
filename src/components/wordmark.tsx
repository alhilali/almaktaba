import Link from 'next/link';

import { MeemMark } from '@/components/meem-mark';
import { cn } from '@/lib/utils';

/**
 * The wordmark lockup: the mark, then المكتبة in the Arabic face and
 * Al-Maktaba in the Latin display face, sitting on a shared shelf rule.
 */
export function Wordmark({
    stacked = false,
    className,
}: {
    stacked?: boolean;
    className?: string;
}): React.ReactElement {
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
            <MeemMark size={stacked ? 44 : 30} className="text-accent shrink-0" />
            <span className={cn('flex items-baseline gap-2.5', stacked && 'flex-col gap-1')}>
                <span
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-[19px] font-semibold leading-none"
                >
                    المكتبة
                </span>
                <span className="font-display text-[19px] font-semibold leading-none tracking-tight">
                    Al-Maktaba
                </span>
            </span>
        </Link>
    );
}
