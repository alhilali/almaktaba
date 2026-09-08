import Link from 'next/link';

import { getMethod } from '@/data/methods';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { MethodTitle, ReuseCount, ShelfMarker } from '@/components/method-bits';

/** Six catalogue rows, Arabic and English interleaved — the product premise. */
const STRIP_IDS = [
    'gov-arabic-correspondence',
    'banking-credit-memo',
    'telecom-cs-response',
    'professional-proposal',
    'admin-meeting-minutes',
    'energy-hse-report',
];

function StripRow({ id }: { id: string }): React.ReactElement | null {
    const method = getMethod(id);
    if (!method) {
        return null;
    }
    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);
    return (
        <Link
            href={`/library/${method.id}`}
            className="flex items-stretch border-b border-rule bg-surface transition-colors hover:bg-surface-sunk/60"
        >
            <ShelfMarker color={sector?.color ?? 'transparent'} />
            <span className="flex flex-1 items-center gap-3 px-4 py-3.5">
                <span className="min-w-0 flex-1">
                    <MethodTitle
                        method={method}
                        className="type-body block truncate font-medium text-ink"
                    />
                    <span className="type-meta block truncate text-ink-faint">{role?.name}</span>
                </span>
                <ReuseCount count={method.reuseCount} />
            </span>
        </Link>
    );
}

/**
 * The hero catalogue strip. A tall column that scrolls upward and loops; on
 * mobile it becomes a horizontal scroller. The track is duplicated so the loop
 * is seamless. Frozen under prefers-reduced-motion (handled in CSS).
 */
export function CatalogueStrip(): React.ReactElement {
    const rows = [...STRIP_IDS, ...STRIP_IDS];
    return (
        <div className="overflow-hidden rounded-[8px] border border-rule bg-surface">
            <div className="flex items-center justify-between border-b border-rule-strong bg-surface-sunk px-4 py-2">
                <span className="type-label text-ink-muted">From the shelves</span>
                <span className="type-disclosure text-ink-faint">live catalogue</span>
            </div>

            {/* Desktop / tablet: vertical scroll */}
            <div className="relative hidden h-[420px] overflow-hidden sm:block">
                <div className="marquee-track">
                    {rows.map((id, index) => (
                        <StripRow key={`${id}-${index}`} id={id} />
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-surface to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
            </div>

            {/* Mobile: horizontal scroll of the same rows */}
            <div className="flex gap-3 overflow-x-auto p-3 sm:hidden">
                {STRIP_IDS.map((id) => {
                    const method = getMethod(id);
                    const sector = method ? getSector(method.sectorId) : undefined;
                    const role = method ? getRole(method.roleId) : undefined;
                    if (!method) {
                        return null;
                    }
                    return (
                        <Link
                            key={id}
                            href={`/library/${id}`}
                            className="flex w-56 shrink-0 flex-col rounded-[8px] border border-rule bg-surface"
                        >
                            <span
                                className="h-1 w-full rounded-t-[8px]"
                                style={{ backgroundColor: sector?.color }}
                            />
                            <span className="flex flex-1 flex-col gap-2 p-3">
                                <MethodTitle
                                    method={method}
                                    className="type-body font-medium text-ink"
                                />
                                <span className="type-meta text-ink-faint">{role?.name}</span>
                                <ReuseCount count={method.reuseCount} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
