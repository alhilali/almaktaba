'use client';

import Link from 'next/link';

import { getMethod } from '@/data/methods';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { useLanguage } from '@/context/language-context';
import { MethodTitle, ReuseCount, ShelfMarker } from '@/components/method-bits';

const STRIP_IDS = [
    'gov-arabic-correspondence',
    'banking-credit-memo',
    'telecom-cs-response',
    'professional-proposal',
    'admin-meeting-minutes',
    'energy-hse-report',
];

function StripRow({ id }: { id: string }): React.ReactElement | null {
    const { isRTL } = useLanguage();
    const method = getMethod(id);
    if (!method) {
        return null;
    }
    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);
    const roleName = isRTL ? role?.nameAr || role?.name : role?.name;

    return (
        <Link
            href={`/library/${method.id}`}
            className="flex items-stretch border-b border-rule bg-surface transition-colors hover:bg-surface-sunk/70 group"
        >
            <ShelfMarker color={sector?.color ?? 'transparent'} />
            <span className="flex flex-1 items-center gap-3 px-4 py-3.5">
                <span className="min-w-0 flex-1">
                    <MethodTitle
                        method={method}
                        className="type-body block truncate font-medium text-ink group-hover:text-accent"
                    />
                    <span className="type-meta block truncate text-ink-faint mt-0.5">
                        {roleName}
                    </span>
                </span>
                <ReuseCount count={method.reuseCount} />
            </span>
        </Link>
    );
}

export function CatalogueStrip(): React.ReactElement {
    const { t, isRTL } = useLanguage();
    const rows = [...STRIP_IDS, ...STRIP_IDS];

    return (
        <div className="overflow-hidden rounded-[8px] border border-rule bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-rule-strong bg-surface-sunk px-4 py-2.5">
                <span className="type-label font-medium text-ink-muted">
                    {t('fromTheShelves')}
                </span>
                <span className="chip bg-accent-sunk text-accent text-[11px] font-semibold">
                    {t('liveCatalogue')}
                </span>
            </div>

            {/* Desktop / tablet: vertical scroll with hover pause */}
            <div className="relative hidden h-[420px] overflow-hidden sm:block group">
                <div className="marquee-track group-hover:[animation-play-state:paused]">
                    {rows.map((id, index) => (
                        <StripRow key={`${id}-${index}`} id={id} />
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-surface to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
            </div>

            {/* Mobile: horizontal snap-scroll cards */}
            <div className="flex gap-3 overflow-x-auto p-3.5 sm:hidden snap-x snap-mandatory">
                {STRIP_IDS.map((id) => {
                    const method = getMethod(id);
                    const sector = method ? getSector(method.sectorId) : undefined;
                    const role = method ? getRole(method.roleId) : undefined;
                    const roleName = isRTL ? role?.nameAr || role?.name : role?.name;
                    if (!method) {
                        return null;
                    }
                    return (
                        <Link
                            key={id}
                            href={`/library/${id}`}
                            className="snap-start flex w-[230px] shrink-0 flex-col justify-between rounded-[8px] border border-rule bg-surface p-3 transition-colors hover:border-rule-strong"
                        >
                            <div>
                                <span
                                    className="block h-1 w-full rounded-t-[4px] mb-2"
                                    style={{ backgroundColor: sector?.color }}
                                />
                                <MethodTitle
                                    method={method}
                                    className="type-body font-medium text-ink line-clamp-2"
                                />
                                <span className="type-disclosure text-ink-faint mt-1 block truncate">
                                    {roleName}
                                </span>
                            </div>
                            <div className="mt-3 pt-2 border-t border-rule/60 flex items-center justify-between">
                                <span className="type-disclosure text-ink-muted">
                                    {isRTL ? sector?.nameAr : sector?.name}
                                </span>
                                <ReuseCount count={method.reuseCount} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
