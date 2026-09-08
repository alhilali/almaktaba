'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import {
    reusePerSector,
    REUSE_REFERENCE_LINE,
    timeReductionByRole,
    ADOPTION_LADDER,
    REUSE_SPLIT,
    arabicCoverageByRole,
} from '@/data/insights';
import { summaryTiles } from '@/data/derive';
import { formatMinutes, formatCount, cn } from '@/lib/utils';
import { SampleDataBanner } from '@/components/sample-data-banner';
import { IllustrativeChip } from '@/components/illustrative-chip';

/**
 * Executive insights view (spec §5.5).
 * Everything here is illustrative. Muted palette, no gradients, direct labelling
 * instead of legends. Sits inside the wider AI Absorption programme.
 */
export default function InsightsPage(): React.ReactElement {
    const tiles = useMemo(() => summaryTiles(), []);
    const sectorData = useMemo(() => reusePerSector(), []);
    const roleData = useMemo(() => timeReductionByRole(), []);
    const arabicData = useMemo(() => arabicCoverageByRole(), []);

    const maxSectorReuse = Math.max(...sectorData.map((d) => d.reusePerMethod), 3.0);
    const maxBeforeMin = Math.max(...roleData.map((d) => d.beforeMin), 60);

    return (
        <>
            <SampleDataBanner />

            <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-8 lg:pb-16">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="type-display-2 text-ink">Insights & benchmarks</h1>
                        <p className="type-meta mt-1 max-w-[720px] text-ink-muted">
                            Executive telemetry on organisational AI absorption. Measures verified asset
                            reuse and returned working time across sectors and role families.
                        </p>
                    </div>
                    <IllustrativeChip />
                </div>

                {/* Summary KPI Tiles */}
                <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-rule bg-rule lg:grid-cols-4">
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Methods catalogued</div>
                        <div className="type-display-3 mt-1 tabular-nums text-ink">
                            {tiles.published}
                        </div>
                        <p className="type-disclosure mt-1 text-ink-muted">Across 10 sectors</p>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Verified reuses</div>
                        <div className="type-display-3 mt-1 tabular-nums text-accent">
                            {tiles.totalReuses}
                        </div>
                        <p className="type-disclosure mt-1 text-ink-muted">Distinct person-runs</p>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Time returned</div>
                        <div className="type-display-3 mt-1 tabular-nums text-measure">
                            {formatCount(tiles.hoursReturned)} hrs
                        </div>
                        <p className="type-disclosure mt-1 text-ink-muted">Calculated per verified run</p>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Average reuse ratio</div>
                        <div className="type-display-3 mt-1 tabular-nums text-ink">
                            {tiles.avgReusePerMethod}
                        </div>
                        <p className="type-disclosure mt-1 text-accent">Above 2.0 baseline</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Chart 1: Reuse per method by sector */}
                    <section className="rounded-[8px] border border-rule bg-surface p-6 md:p-8">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-4">
                            <div>
                                <h2 className="type-display-3 text-ink">Reuse per method by sector</h2>
                                <p className="type-meta mt-1 text-ink-muted">
                                    Horizontal bars compared against the 2.0 reference line.
                                </p>
                            </div>
                            <IllustrativeChip />
                        </div>

                        <div className="space-y-4">
                            {sectorData.map((sector) => {
                                const barWidth = (sector.reusePerMethod / maxSectorReuse) * 100;
                                const isAboveLine = sector.reusePerMethod >= REUSE_REFERENCE_LINE;

                                return (
                                    <div key={sector.sectorId} className="group">
                                        <div className="mb-1 flex items-center justify-between type-meta">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    aria-hidden
                                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                    style={{ backgroundColor: sector.color }}
                                                />
                                                <span className="font-medium text-ink">
                                                    {sector.name}
                                                </span>
                                                <span className="text-ink-faint">
                                                    ({sector.count} {sector.count === 1 ? 'method' : 'methods'})
                                                </span>
                                            </div>
                                            <span
                                                className={cn(
                                                    'font-semibold tabular-nums',
                                                    isAboveLine ? 'text-accent' : 'text-ink-muted',
                                                )}
                                            >
                                                {sector.reusePerMethod.toFixed(1)} / method
                                            </span>
                                        </div>

                                        <div className="relative h-6 rounded-[4px] bg-surface-sunk overflow-hidden">
                                            {/* Reference line marker (2.0) */}
                                            <div
                                                className="absolute inset-y-0 z-10 border-r-2 border-dashed border-rule-strong"
                                                style={{
                                                    left: `${(REUSE_REFERENCE_LINE / maxSectorReuse) * 100}%`,
                                                }}
                                                title={`Reference baseline: ${REUSE_REFERENCE_LINE}`}
                                            />

                                            <div
                                                className="h-full rounded-[4px] transition-all duration-300"
                                                style={{
                                                    width: `${barWidth}%`,
                                                    backgroundColor: sector.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reference line footer callout */}
                        <div className="mt-6 flex items-start gap-3 rounded-[4px] border border-rule bg-surface-sunk/50 p-3.5">
                            <div className="type-meta font-semibold text-accent shrink-0">
                                2.0 Baseline:
                            </div>
                            <p className="type-disclosure text-ink-muted">
                                Below roughly 2.0 a library has become a dumping ground — methods are published
                                but rarely picked up by colleagues. Sectors operating above 2.0 demonstrate genuine
                                cross-worker knowledge transfer.
                            </p>
                        </div>
                    </section>

                    {/* Chart 2: Time reduction by role family */}
                    <section className="rounded-[8px] border border-rule bg-surface p-6 md:p-8">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-4">
                            <div>
                                <h2 className="type-display-3 text-ink">Time reduction by role family</h2>
                                <p className="type-meta mt-1 text-ink-muted">
                                    Typical task duration before and after adopting catalogued methods, sorted by time saved.
                                </p>
                            </div>
                            <IllustrativeChip />
                        </div>

                        <div className="divide-y divide-rule">
                            {roleData.map((role) => {
                                const beforePct = (role.beforeMin / maxBeforeMin) * 100;
                                const afterPct = (role.afterMin / maxBeforeMin) * 100;

                                return (
                                    <div key={role.roleId} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="type-label font-medium text-ink">
                                                    {role.name}
                                                </span>
                                                <span className="chip bg-surface-sunk text-ink-faint text-[11px]">
                                                    {role.aiAddressable}% AI-addressable
                                                </span>
                                            </div>
                                            <div className="type-meta tabular-nums">
                                                <span className="text-ink-muted">
                                                    {formatMinutes(role.beforeMin)} → {formatMinutes(role.afterMin)}
                                                </span>
                                                <span className="ml-2 font-semibold text-measure">
                                                    (saved {formatMinutes(role.savedMin)})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Before / After visual bars */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-14 shrink-0 type-disclosure text-ink-faint">
                                                    Before
                                                </span>
                                                <div className="relative h-3 flex-1 rounded-[2px] bg-surface-sunk overflow-hidden">
                                                    <div
                                                        className="h-full rounded-[2px] bg-rule-strong"
                                                        style={{ width: `${beforePct}%` }}
                                                    />
                                                </div>
                                                <span className="w-16 shrink-0 type-disclosure tabular-nums text-right text-ink-faint">
                                                    {formatMinutes(role.beforeMin)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-14 shrink-0 type-disclosure text-ink-faint">
                                                    After
                                                </span>
                                                <div className="relative h-3 flex-1 rounded-[2px] bg-surface-sunk overflow-hidden">
                                                    <div
                                                        className="h-full rounded-[2px] bg-measure"
                                                        style={{ width: `${afterPct}%` }}
                                                    />
                                                </div>
                                                <span className="w-16 shrink-0 type-disclosure tabular-nums text-right text-measure font-medium">
                                                    {formatMinutes(role.afterMin)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 border-t border-rule pt-4">
                            <p className="type-disclosure text-ink-faint">
                                Showing the AI-addressable share alongside each role sets honest expectations: roles with lower
                                addressability (e.g. Operations &amp; Field at 25%) should not be read as laggards against roles
                                like Marketing (85%).
                            </p>
                        </div>
                    </section>

                    {/* Chart 3 & 4 Grid: Adoption Ladder + Reuse Split */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Adoption Ladder Distribution */}
                        <section className="flex flex-col justify-between rounded-[8px] border border-rule bg-surface p-6 md:p-8">
                            <div>
                                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-4">
                                    <div>
                                        <h2 className="type-display-3 text-ink">Adoption ladder distribution</h2>
                                        <p className="type-meta mt-1 text-ink-muted">
                                            Workforce population share at each stage.
                                        </p>
                                    </div>
                                    <IllustrativeChip />
                                </div>

                                <div className="space-y-4">
                                    {ADOPTION_LADDER.map((rung, index) => (
                                        <div
                                            key={rung.key}
                                            className={cn(
                                                'rounded-[6px] border p-3.5 transition-colors',
                                                rung.isMaktabaRung
                                                    ? 'border-accent bg-accent-sunk/40'
                                                    : 'border-rule bg-surface-sunk/30',
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="type-disclosure font-mono text-ink-faint">
                                                        0{index + 1}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'type-label',
                                                            rung.isMaktabaRung
                                                                ? 'font-semibold text-accent'
                                                                : 'text-ink',
                                                        )}
                                                    >
                                                        {rung.label}
                                                    </span>
                                                    {rung.isMaktabaRung && (
                                                        <span className="chip border border-accent bg-surface text-accent text-[11px] font-semibold">
                                                            Al-Maktaba focus
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={cn(
                                                        'type-meta tabular-nums font-medium',
                                                        rung.isMaktabaRung ? 'text-accent' : 'text-ink-muted',
                                                    )}
                                                >
                                                    {rung.population}%
                                                </span>
                                            </div>
                                            <div className="mt-2 h-2 rounded-full bg-surface overflow-hidden border border-rule/50">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full',
                                                        rung.isMaktabaRung ? 'bg-accent' : 'bg-rule-strong',
                                                    )}
                                                    style={{ width: `${rung.population}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-rule pt-4">
                                <p className="type-disclosure text-ink-faint">
                                    From the AI Absorption framework developed by the programme team. While access
                                    spreads organically, integration (habitual asset reuse across roles) represents the systemic bottleneck.
                                </p>
                            </div>
                        </section>

                        {/* Cross-Organisation vs Internal Reuse */}
                        <section className="flex flex-col justify-between rounded-[8px] border border-rule bg-surface p-6 md:p-8">
                            <div>
                                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-4">
                                    <div>
                                        <h2 className="type-display-3 text-ink">Reuse boundary split</h2>
                                        <p className="type-meta mt-1 text-ink-muted">
                                            Internal tenancy versus cross-organisation reuse.
                                        </p>
                                    </div>
                                    <IllustrativeChip />
                                </div>

                                <div className="space-y-6">
                                    {/* Stacked bar */}
                                    <div>
                                        <div className="h-8 rounded-[4px] overflow-hidden flex border border-rule">
                                            <div
                                                style={{ width: `${REUSE_SPLIT[0].share}%` }}
                                                className="bg-accent flex items-center justify-center text-white text-xs font-medium"
                                                title={`${REUSE_SPLIT[0].label}: ${REUSE_SPLIT[0].share}%`}
                                            >
                                                {REUSE_SPLIT[0].share}%
                                            </div>
                                            <div
                                                style={{ width: `${REUSE_SPLIT[1].share}%` }}
                                                className="bg-rule-strong flex items-center justify-center text-ink text-xs font-medium"
                                                title={`${REUSE_SPLIT[1].label}: ${REUSE_SPLIT[1].share}%`}
                                            >
                                                {REUSE_SPLIT[1].share}%
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between type-meta">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-3 w-3 rounded-full bg-accent" />
                                                    <span className="text-ink font-medium">
                                                        {REUSE_SPLIT[0].label}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-accent tabular-nums">
                                                    {REUSE_SPLIT[0].share}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between type-meta">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-3 w-3 rounded-full bg-rule-strong" />
                                                    <span className="text-ink-muted">
                                                        {REUSE_SPLIT[1].label}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-ink-muted tabular-nums">
                                                    {REUSE_SPLIT[1].share}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[4px] border border-rule bg-surface-sunk/40 p-4">
                                        <h3 className="type-label text-ink font-semibold mb-1">
                                            An honest metric
                                        </h3>
                                        <p className="type-meta text-ink-muted">
                                            Most reuse naturally occurs inside single organisations where context, taxonomy,
                                            and data sensitivity clearances are pre-aligned. Pretending cross-entity reuse is high
                                            would be an invented finding.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-rule pt-4">
                                <p className="type-disclosure text-ink-faint">
                                    Confidential methods stay inside organisation walls via the markdown export function.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Chart 5: Arabic vs English method coverage */}
                    <section className="rounded-[8px] border border-rule bg-surface p-6 md:p-8">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-4">
                            <div>
                                <h2 className="type-display-3 text-ink">Language coverage by role family</h2>
                                <p className="type-meta mt-1 text-ink-muted">
                                    Distribution of Arabic (including bilingual) versus English-only methods.
                                </p>
                            </div>
                            <IllustrativeChip />
                        </div>

                        <div className="space-y-4">
                            {arabicData.map((item) => {
                                const total = item.arabic + item.english;
                                const arabicPct = total > 0 ? (item.arabic / total) * 100 : 0;
                                const englishPct = total > 0 ? (item.english / total) * 100 : 0;

                                return (
                                    <div key={item.roleId} className="group">
                                        <div className="mb-1 flex items-center justify-between type-meta">
                                            <span className="font-medium text-ink">{item.name}</span>
                                            <span className="tabular-nums text-ink-muted text-xs">
                                                <span className="font-medium text-accent">{item.arabic} Arabic</span>
                                                {' · '}
                                                <span>{item.english} English</span>
                                            </span>
                                        </div>

                                        <div className="h-4 rounded-[3px] bg-surface-sunk overflow-hidden flex border border-rule">
                                            {item.arabic > 0 && (
                                                <div
                                                    className="h-full bg-accent"
                                                    style={{ width: `${arabicPct}%` }}
                                                    title={`${item.name}: ${item.arabic} Arabic / bilingual`}
                                                />
                                            )}
                                            {item.english > 0 && (
                                                <div
                                                    className="h-full bg-rule-strong"
                                                    style={{ width: `${englishPct}%` }}
                                                    title={`${item.name}: ${item.english} English`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-4">
                            <div className="flex items-center gap-5 type-disclosure text-ink-muted">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                                    Arabic &amp; Bilingual
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-rule-strong" />
                                    English only
                                </span>
                            </div>
                            <Link href="/library" className="btn btn-secondary btn-sm">
                                Explore catalogue
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            {/* Mobile bottom tab bar */}
            <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-rule bg-surface lg:hidden">
                <Link href="/library" className="py-3 text-center type-label text-ink-muted">
                    Browse
                </Link>
                <Link href="/publish" className="py-3 text-center type-label text-ink-muted">
                    Create
                </Link>
                <Link href="/insights" className="py-3 text-center type-label text-accent">
                    Insights
                </Link>
            </nav>
        </>
    );
}
