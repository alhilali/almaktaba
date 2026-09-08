import Link from 'next/link';

import { sectorCounts } from '@/data/derive';
import { ADOPTION_LADDER } from '@/data/insights';
import { cn } from '@/lib/utils';
import { CatalogueStrip } from '@/components/landing/catalogue-strip';
import { IllustrativeChip } from '@/components/illustrative-chip';

/*
 * Landing page. Built to the landing-page spec, which supersedes §3 and §5.1
 * of the main build spec. Verify SDAIA framework references at source before
 * showing to MCIT — names only are printed here, no unverified reference numbers.
 */

const HOW_IT_WORKS: { step: number; title: string; body: string }[] = [
    {
        step: 1,
        title: 'Publish',
        body: 'Describe the task, say how long it takes you today, and paste the method.',
    },
    {
        step: 2,
        title: 'Reuse',
        body: 'Someone doing the same job runs it. The library records that they did.',
    },
    {
        step: 3,
        title: 'Measure',
        body: 'Time before, time after — counted per run rather than self-reported.',
    },
];

const COMPARISON: { dimension: string; creator: string; maktaba: string }[] = [
    {
        dimension: 'What is counted',
        creator: 'Downloads and follows',
        maktaba: 'Distinct people who ran it, verified by the run',
    },
    {
        dimension: 'What is rewarded',
        creator: 'Audience size',
        maktaba: 'Time returned to someone else',
    },
    {
        dimension: 'Context',
        creator: 'None — a prompt is a prompt',
        maktaba: 'Role family and sector, with the addressable share stated',
    },
    {
        dimension: 'Language',
        creator: 'English-first, Arabic translated',
        maktaba: 'Arabic and English as equals',
    },
];

const FRAMEWORKS_SA: { name: string; note: string }[] = [
    {
        name: 'SDAIA AI Adoption Framework',
        note: 'national roadmap for AI adoption, with staged maturity levels and readiness templates',
    },
    {
        name: 'SDAIA National AI Index',
        note: 'institutional readiness assessed across three pillars, seven dimensions and twenty-three subcategories',
    },
    {
        name: 'SDAIA AI Ethics Principles & Generative AI Guidelines',
        note: 'issued in separate versions for government employees and for the public',
    },
    {
        name: 'Personal Data Protection Law (PDPL)',
        note: 'governs how anything measured here may be collected and retained',
    },
    {
        name: 'National Strategy for Data & AI',
        note: 'under Vision 2030',
    },
];

const FRAMEWORKS_INTL: { name: string; note: string }[] = [
    { name: 'NIST AI Risk Management Framework', note: '' },
    { name: 'ISO/IEC 42001', note: 'AI management systems' },
    { name: 'Bass diffusion model (1969)', note: 'the mathematics under the adoption simulation' },
];

function SectionHeading({ children }: { children: React.ReactNode }): React.ReactElement {
    return <h2 className="type-display-2 text-ink">{children}</h2>;
}

export default function LandingPage(): React.ReactElement {
    const sectors = sectorCounts();
    const maxSectorReuse = Math.max(...sectors.map((sector) => sector.totalReuse), 1);

    return (
        <div>
            {/* Section 1 — Hero */}
            <section className="border-b border-rule bg-surface">
                <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[58fr_42fr]">
                    <div className="max-w-[620px]">
                        <h1 className="type-display-1 text-ink">
                            Someone in your organisation has already solved this.
                        </h1>
                        <p className="type-body-lg mt-5 max-w-[600px] text-ink-muted">
                            A shared library of AI work methods for Saudi organisations. One person
                            works out how to get AI to do a piece of their job properly, publishes it
                            once, and anyone doing the same job can run it. The library counts how
                            many people reused it and how much time it gave them back.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link href="/library" className="btn btn-primary">
                                Browse the library
                            </Link>
                            <Link href="/publish" className="btn btn-secondary">
                                Publish a method
                            </Link>
                        </div>
                    </div>
                    <CatalogueStrip />
                </div>
            </section>

            {/* Section 2 — The problem */}
            <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-24">
                <div className="max-w-[680px] border-l border-rule-strong pl-6 md:pl-8">
                    <p className="type-display-3 text-ink">
                        AI use today is personal. Everyone solves the same problem alone.
                    </p>
                    <p className="type-display-3 mt-6 text-ink">
                        Methods die with the person who built them. The next person starts over.
                    </p>
                    <p className="type-display-3 mt-6 text-ink">
                        Nothing measures whether the work actually changed.
                    </p>
                </div>
            </section>

            {/* Section 3 — How it works */}
            <section className="border-y border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-24">
                    <div className="grid gap-10 md:grid-cols-3 md:gap-12">
                        {HOW_IT_WORKS.map((item) => (
                            <div key={item.step}>
                                <div className="font-display text-[34px] leading-none text-rule-strong">
                                    {item.step}
                                </div>
                                <h3 className="type-display-3 mt-3 text-ink">{item.title}</h3>
                                <p className="type-body mt-2 max-w-[320px] text-ink-muted">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="type-meta mt-10 text-ink-faint">
                        The measurement is a by-product of the use. Nobody fills in a form.
                    </p>
                </div>
            </section>

            {/* Section 4 — Where this sits */}
            <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-24">
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                    {/* Part A — the programme */}
                    <div className="max-w-[680px]">
                        <SectionHeading>Where this sits</SectionHeading>
                        <p className="type-body mt-5 text-ink">
                            Al-Maktaba is one component of the AI Absorption programme developed by
                            the team. That programme measures how far AI has been absorbed into an
                            organisation using a five-rung ladder — access, activation, habit,
                            integration, impact — and normalises scores against the share of each
                            role&rsquo;s work that AI can realistically address.
                        </p>
                        <p className="type-body mt-4 text-ink">
                            Its central finding is that access spreads on its own and integration
                            does not. Its central lever is asset reuse. Its highest-rated risk is
                            that no system exists to verify that reuse is happening.
                        </p>
                        <p className="type-display-3 mt-5 text-ink">This library is that system.</p>

                        {/* The five rungs — muted, structural */}
                        <div className="mt-8 flex items-end gap-1.5">
                            {ADOPTION_LADDER.map((rung, index) => (
                                <div key={rung.key} className="flex-1">
                                    <div
                                        className={cn(
                                            'rounded-t-[4px] border border-b-0',
                                            rung.isMaktabaRung
                                                ? 'border-accent bg-accent-sunk'
                                                : 'border-rule bg-surface-sunk',
                                        )}
                                        style={{ height: `${28 + index * 14}px` }}
                                    />
                                    <div
                                        className={cn(
                                            'border-t px-1 pt-1.5 type-disclosure',
                                            rung.isMaktabaRung
                                                ? 'border-accent font-semibold text-accent'
                                                : 'border-rule-strong text-ink-faint',
                                        )}
                                    >
                                        {rung.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="type-disclosure mt-2 text-ink-faint">
                            The five rungs are from the AI Absorption framework developed by the
                            programme team. Al-Maktaba operates on integration.
                        </p>
                    </div>

                    {/* Part B — frameworks */}
                    <div>
                        <h3 className="type-label mb-4 text-ink-faint">Saudi Arabia</h3>
                        <ul className="divide-y divide-rule border-y border-rule">
                            {FRAMEWORKS_SA.map((framework) => (
                                <li key={framework.name} className="py-3">
                                    <div className="type-label text-ink">{framework.name}</div>
                                    {framework.note && (
                                        <div className="type-meta text-ink-muted">
                                            {framework.note}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <h3 className="type-label mb-4 mt-8 text-ink-faint">International</h3>
                        <ul className="divide-y divide-rule border-y border-rule">
                            {FRAMEWORKS_INTL.map((framework) => (
                                <li key={framework.name} className="py-3">
                                    <div className="type-label text-ink">{framework.name}</div>
                                    {framework.note && (
                                        <div className="type-meta text-ink-muted">
                                            {framework.note}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 5 — What makes this different */}
            <section className="border-y border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-24">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div className="max-w-[540px]">
                            <SectionHeading>
                                An index tells you where you stand. It does not move you.
                            </SectionHeading>
                            <p className="type-body mt-4 text-ink-muted">
                                National indexes assess institutional readiness. They are periodic,
                                top-down, and their unit is the entity. Al-Maktaba works below that
                                line: continuous rather than periodic, and its unit is the task. It
                                does not compete with an index — it produces the kind of evidence an
                                index asks for.
                            </p>
                        </div>
                        <div className="max-w-[540px]">
                            <SectionHeading>
                                Popularity measures attention. Reuse measures usefulness.
                            </SectionHeading>
                            <p className="type-body mt-4 text-ink-muted">
                                Prompt libraries rank creators by downloads and followers. A download
                                is not a use, and neither can be checked. Here, reuse is counted when
                                someone actually runs a method, in the context of their own role and
                                sector, and the number that matters is the time it gave back to a
                                person who did not write it.
                            </p>
                        </div>
                    </div>

                    {/* Comparison table — hairline rules, not cards */}
                    <div className="mt-12 overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-rule-strong">
                                    <th className="type-label py-3 pr-4 font-medium text-ink-faint" />
                                    <th className="type-label py-3 pr-4 font-medium text-ink-muted">
                                        Creator libraries
                                    </th>
                                    <th className="type-label py-3 font-medium text-ink">
                                        Al-Maktaba
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON.map((row) => (
                                    <tr key={row.dimension} className="border-b border-rule">
                                        <td className="type-meta py-3 pr-4 font-medium text-ink">
                                            {row.dimension}
                                        </td>
                                        <td className="type-meta py-3 pr-4 text-ink-muted">
                                            {row.creator}
                                        </td>
                                        <td className="type-meta py-3 text-ink">{row.maktaba}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="type-display-3 mt-12 max-w-[680px] text-ink">
                        No framework, index or library currently measures whether one person&rsquo;s
                        work changed.
                    </p>
                </div>
            </section>

            {/* Section 6 — The catalogue at a glance */}
            <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-24">
                <div className="mb-6 flex items-center gap-3">
                    <SectionHeading>The catalogue at a glance</SectionHeading>
                    <IllustrativeChip />
                </div>
                <div className="divide-y divide-rule border-y border-rule">
                    {sectors.map((sector) => (
                        <Link
                            key={sector.sectorId}
                            href={`/library?sector=${sector.sectorId}`}
                            className="flex items-center gap-4 py-3 transition-colors hover:bg-surface-sunk/50"
                        >
                            <span
                                aria-hidden
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: sector.color }}
                            />
                            <span className="type-body w-52 shrink-0 truncate text-ink">
                                {sector.name}
                            </span>
                            <span className="type-meta w-24 shrink-0 tabular-nums text-ink-faint">
                                {sector.count} {sector.count === 1 ? 'method' : 'methods'}
                            </span>
                            <span className="hidden h-2 flex-1 overflow-hidden rounded-full bg-surface-sunk sm:block">
                                <span
                                    className="block h-full rounded-full"
                                    style={{
                                        width: `${(sector.totalReuse / maxSectorReuse) * 100}%`,
                                        backgroundColor: sector.color,
                                    }}
                                />
                            </span>
                            <span className="type-meta w-28 shrink-0 text-right tabular-nums text-ink-muted">
                                {sector.reusePerMethod} / method
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Section 7 — Close */}
            <section className="border-t border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-16 text-center md:px-8 md:py-24">
                    <p className="type-display-2 text-ink">Publish one method. See who uses it.</p>
                    <div className="mt-7 flex justify-center gap-3">
                        <Link href="/library" className="btn btn-primary">
                            Browse the library
                        </Link>
                        <Link href="/publish" className="btn btn-secondary">
                            Publish a method
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
