import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { METHODS, getMethod } from '@/data/methods';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { maturityOf } from '@/data/derive';
import { formatMinutes, formatRating, formatDate, formatCount } from '@/lib/utils';
import { MethodTitle } from '@/components/method-bits';
import { LanguageChip, SensitivityChip, MaturityChip } from '@/components/chips';
import { IllustrativeChip } from '@/components/illustrative-chip';
import { MethodActions } from '@/components/method/method-actions';

export function generateStaticParams(): { id: string }[] {
    return METHODS.map((method) => ({ id: method.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const method = getMethod(id);
    if (!method) {
        return { title: 'Method not found · Al-Maktaba' };
    }
    return { title: `${method.title} · Al-Maktaba`, description: method.description };
}

function Section({
    title,
    children,
    chip,
}: {
    title: string;
    children: React.ReactNode;
    chip?: React.ReactNode;
}): React.ReactElement {
    return (
        <section className="border-t border-rule py-7">
            <div className="mb-3 flex items-center gap-2">
                <h2 className="type-label text-ink-faint">{title}</h2>
                {chip}
            </div>
            {children}
        </section>
    );
}

const STAR_LABELS = ['5', '4', '3', '2', '1'];

export default async function MethodDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
    const { id } = await params;
    const method = getMethod(id);
    if (!method) {
        notFound();
    }

    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);
    const maxRating = Math.max(1, ...method.rating.distribution);

    return (
        <article className="mx-auto max-w-[820px] px-5 pb-24 pt-8 md:px-8 lg:pb-16">
            <Link href="/library" className="type-meta text-ink-muted hover:text-accent">
                ← Back to the library
            </Link>

            {/* Header */}
            <header className="mt-4">
                <div className="type-meta mb-2 flex items-center gap-1.5 text-ink-faint">
                    <span
                        aria-hidden
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: sector?.color }}
                    />
                    {sector?.name} · {role?.name}
                </div>
                <h1 className="type-display-1 text-ink">
                    <MethodTitle method={method} />
                </h1>
                <p className="type-body-lg mt-3 text-ink-muted">{method.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 type-meta text-ink-faint">
                    <span>{method.author}</span>
                    <span aria-hidden>·</span>
                    <span>{method.organisation}</span>
                    <span aria-hidden>·</span>
                    <span>{method.version}</span>
                    <span aria-hidden>·</span>
                    <span>Published {formatDate(method.publishDate)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    <LanguageChip language={method.language} />
                    <SensitivityChip sensitivity={method.sensitivity} />
                    <MaturityChip maturity={maturityOf(method)} />
                </div>
            </header>

            {/* Headline numbers */}
            <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-rule bg-rule">
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">Reuses</div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-accent">
                        {formatCount(method.reuseCount)}
                    </div>
                </div>
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">Time returned per run</div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-measure">
                        {formatMinutes(method.timeBeforeMin)} → {formatMinutes(method.timeAfterMin)}
                    </div>
                </div>
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">Rating</div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-ink">
                        {formatRating(method.rating.score, method.rating.count)}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
                <MethodActions method={method} />
            </div>

            <Section title="What it does">
                <p className="type-body text-ink">{method.whatItDoes}</p>
            </Section>

            <Section title="Inputs required">
                <ul className="space-y-1.5">
                    {method.inputsRequired.map((input) => (
                        <li key={input} className="type-body flex gap-2 text-ink">
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                            {input}
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="What stays human">
                <p className="type-body-lg text-ink">{method.whatStaysHuman}</p>
            </Section>

            <Section title="Provenance" chip={<IllustrativeChip />}>
                <div className="rounded-[8px] border border-rule bg-surface p-4">
                    <p className="type-body text-ink">
                        <span className="font-semibold">Built and tested on:</span>{' '}
                        {method.provenance.builtOn}
                    </p>
                    <p className="type-body mt-1 text-ink">
                        <span className="font-semibold">Also reported working:</span>{' '}
                        {method.provenance.alsoReported.join(', ')}
                    </p>
                    <p className="type-meta mt-2 text-ink-faint">
                        Reported by the author and by people who reused it. Not a benchmark.
                    </p>
                </div>
            </Section>

            <Section title="Performance" chip={<IllustrativeChip />}>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <div className="type-disclosure text-ink-faint">Typical time before</div>
                        <div className="type-display-3 tabular-nums text-ink">
                            {formatMinutes(method.timeBeforeMin)}
                        </div>
                    </div>
                    <div>
                        <div className="type-disclosure text-ink-faint">Typical time after</div>
                        <div className="type-display-3 tabular-nums text-measure">
                            {formatMinutes(method.timeAfterMin)}
                        </div>
                    </div>
                    <div>
                        <div className="type-disclosure text-ink-faint">Runs contributing</div>
                        <div className="type-display-3 tabular-nums text-ink">
                            {formatCount(method.performance.runs)}
                        </div>
                    </div>
                </div>
                <p className="type-meta mt-3 text-ink-muted">{method.performance.accuracyNote}</p>
            </Section>

            <Section title="Reuse trail">
                {method.reuseCount === 0 ? (
                    <p className="type-body text-ink-muted">
                        Not yet reused. When someone runs this method, the library records it here —
                        anonymised, never naming an individual.
                    </p>
                ) : (
                    <>
                        <p className="type-body text-ink">
                            Reused by{' '}
                            <span className="font-semibold text-accent">
                                {method.reuseTrail.people} people
                            </span>{' '}
                            across {method.reuseTrail.organisations}{' '}
                            {method.reuseTrail.organisations === 1 ? 'organisation' : 'organisations'}.
                        </p>
                        <div className="mt-3 space-y-1.5">
                            {method.reuseTrail.sectorBreakdown.map((entry) => {
                                const entrySector = getSector(entry.sectorId);
                                const share = Math.round(
                                    (entry.count / method.reuseTrail.people) * 100,
                                );
                                return (
                                    <div key={entry.sectorId} className="flex items-center gap-3">
                                        <span className="type-meta w-52 shrink-0 text-ink-muted">
                                            {entrySector?.name}
                                        </span>
                                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunk">
                                            <span
                                                className="block h-full rounded-full"
                                                style={{
                                                    width: `${share}%`,
                                                    backgroundColor: entrySector?.color,
                                                }}
                                            />
                                        </span>
                                        <span className="type-meta w-8 shrink-0 text-right tabular-nums text-ink-faint">
                                            {entry.count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="type-disclosure mt-2 text-ink-faint">
                            Anonymised. Individuals are never named.
                        </p>
                    </>
                )}
            </Section>

            <Section title="Ratings">
                {method.rating.count === 0 ? (
                    <p className="type-body text-ink-muted">No ratings yet.</p>
                ) : (
                    <div className="max-w-[420px] space-y-1.5">
                        <p className="type-body mb-2 text-ink">
                            {formatRating(method.rating.score, method.rating.count)}
                        </p>
                        {method.rating.distribution.map((count, index) => (
                            <div key={STAR_LABELS[index]} className="flex items-center gap-3">
                                <span className="type-meta w-8 shrink-0 text-ink-muted">
                                    {STAR_LABELS[index]}★
                                </span>
                                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunk">
                                    <span
                                        className="block h-full rounded-full bg-accent"
                                        style={{ width: `${(count / maxRating) * 100}%` }}
                                    />
                                </span>
                                <span className="type-meta w-8 shrink-0 text-right tabular-nums text-ink-faint">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            <Section title="Version history">
                <ol className="space-y-3">
                    {method.versionHistory.map((version) => (
                        <li key={version.version} className="flex gap-3">
                            <span
                                className={
                                    version.isCurrent
                                        ? 'type-label mt-0.5 shrink-0 text-accent'
                                        : 'type-label mt-0.5 shrink-0 text-ink-faint'
                                }
                            >
                                {version.version}
                            </span>
                            <span className="min-w-0">
                                <span className="type-body text-ink">{version.note}</span>
                                <span className="type-meta ml-2 text-ink-faint">
                                    {formatDate(version.date)} · {version.author}
                                    {version.isCurrent ? ' · current' : ''}
                                </span>
                            </span>
                        </li>
                    ))}
                </ol>
                <p className="type-disclosure mt-3 text-ink-faint">
                    Improvements create a new version and credit the original author. They never
                    overwrite.
                </p>
            </Section>
        </article>
    );
}
