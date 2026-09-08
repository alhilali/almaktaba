'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

/** Marks any figure or chart as sample data, never measured (spec §2.1). */
export function IllustrativeChip({ className }: { className?: string }): React.ReactElement {
    const { t } = useLanguage();

    return (
        <span
            className={cn('chip bg-measure-sunk text-measure font-medium', className)}
            title={t('illustrativeTitle')}
        >
            {t('illustrativeBadge')}
        </span>
    );
}
