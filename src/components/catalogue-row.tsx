'use client';

import type { IMethod } from '@/data/types';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { maturityOf } from '@/data/derive';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import {
    MethodTitle,
    MethodDescription,
    ReuseCount,
    TimeDelta,
    RatingLine,
    ShelfMarker,
} from '@/components/method-bits';
import { LanguageChip, SensitivityChip, MaturityChip } from '@/components/chips';

/**
 * An ergonomic catalogue row with ample breathing room, consistent font families
 * (Thmanyah Serif for Arabic titles, Thmanyah Sans for Arabic descriptions),
 * and bilingual sector/role metadata.
 */
export function CatalogueRow({
    method,
    isSelected,
    onSelect,
}: {
    method: IMethod;
    isSelected: boolean;
    onSelect: (id: string) => void;
}): React.ReactElement {
    const { isRTL } = useLanguage();
    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);

    const sectorName = isRTL ? sector?.nameAr || sector?.name : sector?.name;
    const roleName = isRTL ? role?.nameAr || role?.name : role?.name;

    return (
        <button
            type="button"
            onClick={() => onSelect(method.id)}
            aria-pressed={isSelected}
            className={cn(
                'group flex w-full items-stretch border-b border-rule bg-surface text-start transition-colors duration-150',
                'hover:bg-surface-sunk/60 focus-visible:bg-surface-sunk/60',
                isSelected && 'bg-accent-sunk/50 hover:bg-accent-sunk/50',
            )}
        >
            <ShelfMarker color={sector?.color ?? 'transparent'} />
            <div className="flex flex-1 flex-col gap-3 px-5 py-4.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                {/* Left content block: Title, description, chips */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                        <MethodTitle
                            method={method}
                            className="type-body block font-bold text-ink group-hover:text-accent sm:text-[17px]"
                        />
                    </div>
                    <div className="mt-1">
                        <MethodDescription
                            method={method}
                            className="type-meta line-clamp-2 text-ink-muted leading-relaxed"
                        />
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 type-meta text-ink-faint">
                        <span className="font-medium text-ink-muted">{roleName}</span>
                        <span aria-hidden>·</span>
                        <span className="flex items-center gap-1.5 text-ink-muted">
                            <span
                                aria-hidden
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: sector?.color }}
                            />
                            {sectorName}
                        </span>
                        <span className="ms-1 flex flex-wrap gap-1.5">
                            <LanguageChip language={method.language} />
                            <SensitivityChip sensitivity={method.sensitivity} />
                            <MaturityChip maturity={maturityOf(method)} />
                        </span>
                    </div>
                </div>

                {/* Right metrics block: Reuse count, time delta, rating */}
                <div className="flex shrink-0 items-center justify-between gap-6 border-t border-rule/60 pt-3 sm:flex-col sm:items-end sm:gap-1.5 sm:border-t-0 sm:pt-0">
                    <ReuseCount count={method.reuseCount} className="text-[17px] font-bold" />
                    <TimeDelta method={method} />
                    <div className="flex items-center gap-2">
                        <RatingLine method={method} />
                        <span
                            aria-hidden
                            className="text-accent opacity-0 transition-opacity group-hover:opacity-100 font-semibold text-sm hidden sm:inline"
                        >
                            {isRTL ? '←' : '→'}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}
