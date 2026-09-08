'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import type { Maturity } from '@/data/types';
import { METHODS, getMethod } from '@/data/methods';
import { SECTORS } from '@/data/sectors';
import { maturityOf, timeSavedPerRun, summaryTiles } from '@/data/derive';
import { formatCount, cn } from '@/lib/utils';
import { CatalogueRow } from '@/components/catalogue-row';
import { FilterRail, EMPTY_FILTERS, type IFilterState } from '@/components/library/filter-rail';
import { MethodPreviewPanel } from '@/components/library/method-preview-panel';
import { SampleDataBanner } from '@/components/sample-data-banner';
import { IllustrativeChip } from '@/components/illustrative-chip';

type Sort = 'reused' | 'time' | 'rated' | 'newest';

const SORTS: { key: Sort; label: string }[] = [
    { key: 'reused', label: 'Most reused' },
    { key: 'time', label: 'Most time saved' },
    { key: 'rated', label: 'Highest rated' },
    { key: 'newest', label: 'Newest' },
];

function matches(method: (typeof METHODS)[number], filters: IFilterState): boolean {
    if (filters.sectors.length && !filters.sectors.includes(method.sectorId)) {
        return false;
    }
    if (filters.roles.length && !filters.roles.includes(method.roleId)) {
        return false;
    }
    if (filters.languages.length && !filters.languages.includes(method.language)) {
        return false;
    }
    if (filters.sensitivities.length && !filters.sensitivities.includes(method.sensitivity)) {
        return false;
    }
    if (filters.maturities.length) {
        const maturity: Maturity = maturityOf(method);
        if (!filters.maturities.includes(maturity)) {
            return false;
        }
    }
    return true;
}

function sortMethods(methods: typeof METHODS, sort: Sort): typeof METHODS {
    const copy = [...methods];
    switch (sort) {
        case 'time':
            return copy.sort(
                (a, b) => timeSavedPerRun(b) * b.reuseCount - timeSavedPerRun(a) * a.reuseCount,
            );
        case 'rated':
            return copy.sort(
                (a, b) => b.rating.score - a.rating.score || b.rating.count - a.rating.count,
            );
        case 'newest':
            return copy.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
        case 'reused':
        default:
            return copy.sort((a, b) => b.reuseCount - a.reuseCount);
    }
}

const TILE_LABELS = {
    published: 'Methods published',
    totalReuses: 'Total reuses',
    hoursReturned: 'Hours returned',
    avgReusePerMethod: 'Avg reuse per method',
} as const;

function LibraryContent(): React.ReactElement {
    const searchParams = useSearchParams();
    const sectorParam = searchParams.get('sector');

    const [filters, setFilters] = useState<IFilterState>(() => {
        if (sectorParam && SECTORS.some((sector) => sector.id === sectorParam)) {
            return { ...EMPTY_FILTERS, sectors: [sectorParam] };
        }
        return EMPTY_FILTERS;
    });

    const [sort, setSort] = useState<Sort>('reused');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const tiles = useMemo(() => summaryTiles(), []);
    const results = useMemo(
        () => sortMethods(METHODS.filter((method) => matches(method, filters)), sort),
        [filters, sort],
    );

    const selectedMethod = selectedId ? (getMethod(selectedId) ?? null) : null;
    const activeFilterCount =
        filters.sectors.length +
        filters.roles.length +
        filters.languages.length +
        filters.sensitivities.length +
        filters.maturities.length;

    return (
        <>
            <SampleDataBanner />

            <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-8 lg:pb-12">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="type-display-2 text-ink">The library</h1>
                        <p className="type-meta mt-1 text-ink-muted">
                            Catalogued by sector and role. Ranked by how many people reused each
                            method and the time it gave back.
                        </p>
                    </div>
                    <IllustrativeChip />
                </div>

                {/* Summary tiles */}
                <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-rule bg-rule lg:grid-cols-4">
                    {(Object.keys(TILE_LABELS) as (keyof typeof TILE_LABELS)[]).map((key) => (
                        <div key={key} className="bg-surface p-4">
                            <div className="type-disclosure text-ink-faint">{TILE_LABELS[key]}</div>
                            <div className="type-display-3 mt-1 tabular-nums text-ink">
                                {formatCount(tiles[key])}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile sector quick-filter + filter toggle */}
                <div className="mb-4 flex items-center gap-2 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(true)}
                        className="btn btn-secondary btn-sm shrink-0"
                    >
                        Filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
                    </button>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {SECTORS.map((sector) => {
                            const on = filters.sectors.includes(sector.id);
                            return (
                                <button
                                    key={sector.id}
                                    type="button"
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sectors: on
                                                ? prev.sectors.filter((id) => id !== sector.id)
                                                : [...prev.sectors, sector.id],
                                        }))
                                    }
                                    className={cn(
                                        'chip shrink-0 border',
                                        on
                                            ? 'border-accent bg-accent-sunk text-accent'
                                            : 'border-rule bg-surface text-ink-muted',
                                    )}
                                >
                                    <span
                                        aria-hidden
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: sector.color }}
                                    />
                                    {sector.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_340px]">
                    {/* Left — persistent index (desktop) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-6">
                            <FilterRail filters={filters} onChange={setFilters} />
                        </div>
                    </aside>

                    {/* Centre — the catalogue */}
                    <section className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <p className="type-meta text-ink-muted">
                                {formatCount(results.length)}{' '}
                                {results.length === 1 ? 'method' : 'methods'}
                            </p>
                            <label className="flex items-center gap-2 type-meta text-ink-muted">
                                Sort
                                <select
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value as Sort)}
                                    className="rounded-[4px] border border-rule bg-surface px-2 py-1 type-meta text-ink focus:border-accent"
                                >
                                    {SORTS.map((option) => (
                                        <option key={option.key} value={option.key}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {results.length > 0 ? (
                            <div className="overflow-hidden rounded-[8px] border border-rule">
                                {results.map((method) => (
                                    <CatalogueRow
                                        key={method.id}
                                        method={method}
                                        isSelected={method.id === selectedId}
                                        onSelect={setSelectedId}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[8px] border border-dashed border-rule-strong bg-surface p-12 text-center">
                                <p className="type-display-3 text-ink">
                                    No methods here yet. This is where the first one goes.
                                </p>
                                <Link href="/publish" className="btn btn-primary mt-5">
                                    Publish a method
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Right — preview (desktop) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-6 h-[calc(100vh-3rem)] overflow-hidden rounded-[8px] border border-rule">
                            <MethodPreviewPanel method={selectedMethod} />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile filter drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-ink/30"
                        onClick={() => setIsFilterOpen(false)}
                        aria-hidden
                    />
                    <div className="absolute inset-y-0 left-0 w-[85%] max-w-[340px] overflow-y-auto bg-surface p-5 shadow-none">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="type-label text-ink">Filters</h2>
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(false)}
                                className="type-meta text-ink-muted hover:text-ink"
                            >
                                Close
                            </button>
                        </div>
                        <FilterRail
                            filters={filters}
                            onChange={(next) => {
                                setFilters(next);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Mobile bottom sheet for method preview */}
            {selectedMethod && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-ink/30"
                        onClick={() => setSelectedId(null)}
                        aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 top-16 overflow-hidden rounded-t-[12px] border-t border-rule bg-surface">
                        <MethodPreviewPanel
                            method={selectedMethod}
                            onClose={() => setSelectedId(null)}
                        />
                    </div>
                </div>
            )}

            {/* Mobile bottom tab bar */}
            <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-rule bg-surface lg:hidden">
                <Link href="/library" className="py-3 text-center type-label text-accent">
                    Browse
                </Link>
                <Link href="/publish" className="py-3 text-center type-label text-ink-muted">
                    Create
                </Link>
                <Link href="/insights" className="py-3 text-center type-label text-ink-muted">
                    Insights
                </Link>
            </nav>
        </>
    );
}

export default function LibraryPage(): React.ReactElement {
    return (
        <Suspense fallback={null}>
            <LibraryContent />
        </Suspense>
    );
}
