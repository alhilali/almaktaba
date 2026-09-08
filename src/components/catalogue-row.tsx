import type { IMethod } from '@/data/types';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { cn } from '@/lib/utils';
import {
    MethodTitle,
    ReuseCount,
    TimeDelta,
    RatingLine,
    ShelfMarker,
} from '@/components/method-bits';
import { LanguageChip, SensitivityChip } from '@/components/chips';

/**
 * A single catalogue row. Ruled, not floated — no card, no shadow, 0 radius.
 * The whole row is a control that opens the preview panel.
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
    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);

    return (
        <button
            type="button"
            onClick={() => onSelect(method.id)}
            aria-pressed={isSelected}
            className={cn(
                'group flex w-full items-stretch gap-0 border-b border-rule bg-surface text-left transition-colors',
                'hover:bg-surface-sunk/60',
                isSelected && 'bg-accent-sunk/50 hover:bg-accent-sunk/50',
            )}
        >
            <ShelfMarker color={sector?.color ?? 'transparent'} />
            <span className="flex flex-1 flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:gap-4">
                <span className="min-w-0 flex-1">
                    <MethodTitle
                        method={method}
                        className="type-body block font-medium text-ink group-hover:text-accent"
                    />
                    <span className="type-meta mt-0.5 block truncate text-ink-muted">
                        {method.description}
                    </span>
                    <span className="type-meta mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-faint">
                        <span>{role?.name}</span>
                        <span aria-hidden>·</span>
                        <span>{sector?.name}</span>
                        <span className="ml-1 flex gap-1.5">
                            <LanguageChip language={method.language} />
                            <SensitivityChip sensitivity={method.sensitivity} />
                        </span>
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-5 sm:flex-col sm:items-end sm:gap-1.5">
                    <ReuseCount count={method.reuseCount} className="text-lg" />
                    <TimeDelta method={method} />
                    <RatingLine method={method} />
                </span>
            </span>
        </button>
    );
}
