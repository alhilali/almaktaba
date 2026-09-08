'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { METHODS, getMethod } from '@/data/methods';
import { SECTORS } from '@/data/sectors';
import { maturityOf, timeSavedPerRun, summaryTiles } from '@/data/derive';
import { formatCount, cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { CatalogueRow } from '@/components/catalogue-row';
import { MethodPreviewPanel } from '@/components/library/method-preview-panel';
import { SampleDataBanner } from '@/components/sample-data-banner';
import { IllustrativeChip } from '@/components/illustrative-chip';

type Sort = 'reused' | 'time' | 'rated' | 'newest';

function matchesSearch(method: (typeof METHODS)[number], query: string): boolean {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
        method.title.toLowerCase().includes(q) ||
        method.description.toLowerCase().includes(q) ||
        method.roleId.toLowerCase().includes(q) ||
        method.sectorId.toLowerCase().includes(q) ||
        method.whatItDoes.toLowerCase().includes(q)
    );
}

function LibraryContent(): React.ReactElement {
    const { t, isRTL } = useLanguage();
    const searchParams = useSearchParams();
    const sectorParam = searchParams.get('sector');

    const [selectedSector, setSelectedSector] = useState<string>(() => {
        if (sectorParam && SECTORS.some((s) => s.id === sectorParam)) {
            return sectorParam;
        }
        return '';
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [selectedSensitivity, setSelectedSensitivity] = useState<string>('');
    const [selectedMaturity, setSelectedMaturity] = useState<string>('');
    const [sort, setSort] = useState<Sort>('reused');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // ESC key closes preview
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === 'Escape') {
                setSelectedId(null);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const tiles = useMemo(() => summaryTiles(), []);

    const filteredMethods = useMemo(() => {
        const list = METHODS.filter((method) => {
            if (selectedSector && method.sectorId !== selectedSector) return false;
            if (selectedLanguage && method.language !== selectedLanguage) return false;
            if (selectedSensitivity && method.sensitivity !== selectedSensitivity) return false;
            if (selectedMaturity && maturityOf(method) !== selectedMaturity) return false;
            if (!matchesSearch(method, searchQuery)) return false;
            return true;
        });

        const copy = [...list];
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
    }, [
        selectedSector,
        selectedLanguage,
        selectedSensitivity,
        selectedMaturity,
        searchQuery,
        sort,
    ]);

    const selectedMethod = selectedId ? getMethod(selectedId) ?? null : null;

    const hasActiveFilters =
        !!selectedSector ||
        !!selectedLanguage ||
        !!selectedSensitivity ||
        !!selectedMaturity ||
        !!searchQuery.trim();

    function clearFilters(): void {
        setSelectedSector('');
        setSelectedLanguage('');
        setSelectedSensitivity('');
        setSelectedMaturity('');
        setSearchQuery('');
    }

    return (
        <>
            <SampleDataBanner />

            <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-8 md:px-8 lg:pb-16">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="type-display-2 text-ink">{t('libraryTitle')}</h1>
                        <p className="type-meta mt-1 max-w-[720px] text-ink-muted">
                            {t('librarySubtitle')}
                        </p>
                    </div>
                    <IllustrativeChip />
                </div>

                {/* KPI Summary Tiles */}
                <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-rule bg-rule lg:grid-cols-4">
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">
                            {t('methodsPublished')}
                        </div>
                        <div className="type-display-3 mt-1 tabular-nums text-ink">
                            {formatCount(tiles.published)}
                        </div>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">{t('totalReuses')}</div>
                        <div className="type-display-3 mt-1 tabular-nums text-accent">
                            {formatCount(tiles.totalReuses)}
                        </div>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">{t('hoursReturned')}</div>
                        <div className="type-display-3 mt-1 tabular-nums text-measure">
                            {formatCount(tiles.hoursReturned)} {t('hours')}
                        </div>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">{t('avgReuse')}</div>
                        <div className="type-display-3 mt-1 tabular-nums text-ink">
                            {tiles.avgReusePerMethod}
                        </div>
                    </div>
                </div>

                {/* Sector Shelf Strip */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setSelectedSector('')}
                            className={cn(
                                'chip shrink-0 border px-3 py-1.5 transition-colors',
                                selectedSector === ''
                                    ? 'border-accent bg-accent text-white font-semibold'
                                    : 'border-rule bg-surface text-ink-muted hover:border-rule-strong',
                            )}
                        >
                            {t('allSectors')} ({METHODS.length})
                        </button>
                        {SECTORS.map((sector) => {
                            const count = METHODS.filter((m) => m.sectorId === sector.id).length;
                            const isSelected = selectedSector === sector.id;
                            const name = isRTL ? sector.nameAr : sector.name;

                            return (
                                <button
                                    key={sector.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedSector(isSelected ? '' : sector.id)
                                    }
                                    className={cn(
                                        'chip shrink-0 border px-3 py-1.5 transition-colors',
                                        isSelected
                                            ? 'border-accent bg-accent-sunk text-accent font-semibold'
                                            : 'border-rule bg-surface text-ink-muted hover:border-rule-strong',
                                    )}
                                >
                                    <span
                                        aria-hidden
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ backgroundColor: sector.color }}
                                    />
                                    <span>{name}</span>
                                    <span className="text-ink-faint text-[11px]">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Search and Secondary Filter Toolbar */}
                <div className="mb-6 flex flex-col gap-4 rounded-[8px] border border-rule bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 start-3 flex items-center text-ink-faint text-sm pointer-events-none">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="w-full rounded-[4px] border border-rule bg-surface-sunk/30 ps-9 pe-3 py-2 type-meta text-ink placeholder:text-ink-faint focus:border-accent focus:bg-surface"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 end-3 flex items-center text-ink-faint hover:text-ink text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Filter Dropdowns & Sort */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Language */}
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            aria-label={t('languageTitle')}
                            className="rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink focus:border-accent"
                        >
                            <option value="">{isRTL ? 'جميع اللغات' : 'All languages'}</option>
                            <option value="Arabic">{isRTL ? 'العربية' : 'Arabic'}</option>
                            <option value="English">{isRTL ? 'الإنجليزية' : 'English'}</option>
                            <option value="Bilingual">{isRTL ? 'ثنائي اللغة' : 'Bilingual'}</option>
                        </select>

                        {/* Sensitivity */}
                        <select
                            value={selectedSensitivity}
                            onChange={(e) => setSelectedSensitivity(e.target.value)}
                            aria-label={t('sensitivityTitle')}
                            className="rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink focus:border-accent"
                        >
                            <option value="">{isRTL ? 'حساسية البيانات' : 'All sensitivities'}</option>
                            <option value="Public">{isRTL ? 'عام (Public)' : 'Public'}</option>
                            <option value="Internal">{isRTL ? 'داخلي (Internal)' : 'Internal'}</option>
                            <option value="Confidential">{isRTL ? 'سري (Confidential)' : 'Confidential'}</option>
                        </select>

                        {/* Maturity */}
                        <select
                            value={selectedMaturity}
                            onChange={(e) => setSelectedMaturity(e.target.value)}
                            aria-label={t('maturityTitle')}
                            className="rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink focus:border-accent"
                        >
                            <option value="">{isRTL ? 'مستوى النضج' : 'All maturities'}</option>
                            <option value="New">{isRTL ? 'جديد (New)' : 'New'}</option>
                            <option value="Proven">{isRTL ? 'مجرّب (Proven)' : 'Proven (5+)'}</option>
                            <option value="Established">{isRTL ? 'راسخ (Established)' : 'Established (20+)'}</option>
                        </select>

                        {/* Sort */}
                        <div className="flex items-center gap-1.5 border-s border-rule ps-2.5">
                            <span className="type-disclosure text-ink-faint">{t('sortLabel')}</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as Sort)}
                                aria-label={t('sortLabel')}
                                className="rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink font-medium focus:border-accent"
                            >
                                <option value="reused">{t('sortReused')}</option>
                                <option value="time">{t('sortTime')}</option>
                                <option value="rated">{t('sortRated')}</option>
                                <option value="newest">{t('sortNewest')}</option>
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="type-meta text-accent hover:underline font-medium ms-1"
                            >
                                {t('clearAll')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Results count indicator */}
                <div className="mb-3 flex items-center justify-between type-meta text-ink-muted">
                    <span>
                        {formatCount(filteredMethods.length)}{' '}
                        {filteredMethods.length === 1 ? t('method') : t('methods')}
                    </span>
                    <span className="type-disclosure text-ink-faint hidden sm:inline">
                        {isRTL
                            ? 'انقر على أي أسلوب لفتح المعاينة السريعة وخيارات التشغيل'
                            : 'Click any row to open quick preview & run options'}
                    </span>
                </div>

                {/* Catalogue Main List (Consumes Full Screen Width) */}
                {filteredMethods.length > 0 ? (
                    <div className="overflow-hidden rounded-[8px] border border-rule bg-surface">
                        {filteredMethods.map((method) => (
                            <CatalogueRow
                                key={method.id}
                                method={method}
                                isSelected={method.id === selectedId}
                                onSelect={(id) => setSelectedId(id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[8px] border border-dashed border-rule-strong bg-surface p-12 text-center">
                        <p className="type-display-3 text-ink">{t('emptyMethodsTitle')}</p>
                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="btn btn-secondary"
                            >
                                {t('clearAll')}
                            </button>
                            <Link href="/publish" className="btn btn-primary">
                                {t('emptyMethodsAction')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-over Preview Inspector Drawer (Only activated when a method is selected) */}
            {selectedMethod && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-ink/40 transition-opacity duration-200"
                        onClick={() => setSelectedId(null)}
                        aria-hidden
                    />

                    {/* Drawer sheet: slides in from trailing edge */}
                    <div
                        className={cn(
                            'absolute inset-y-0 max-w-full flex',
                            isRTL ? 'left-0' : 'right-0',
                        )}
                    >
                        <div className="w-screen max-w-lg">
                            <MethodPreviewPanel
                                method={selectedMethod}
                                onClose={() => setSelectedId(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
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
