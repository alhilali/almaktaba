import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { METHODS, getMethod } from '@/data/methods';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { maturityOf } from '@/data/derive';
import { formatMinutes, formatRating, formatDate, formatCount } from '@/lib/utils';
import { MethodTitle, MethodDescription } from '@/components/method-bits';
import { LanguageChip, SensitivityChip, MaturityChip } from '@/components/chips';
import { IllustrativeChip } from '@/components/illustrative-chip';
import { MethodActions } from '@/components/method/method-actions';
import { SampleShowcase } from '@/components/method/sample-showcase';
import { SharedAgentsCard } from '@/components/method/shared-agents-card';
import { PipelineCombinations } from '@/components/method/pipeline-combinations';

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
    titleAr,
    children,
    chip,
}: {
    title: string;
    titleAr?: string;
    children: React.ReactNode;
    chip?: React.ReactNode;
}): React.ReactElement {
    return (
        <section className="border-t border-rule py-7">
            <div className="mb-3 flex items-center gap-2">
                <h2 className="type-label font-bold text-ink">
                    {titleAr ? `${titleAr} · ${title}` : title}
                </h2>
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
            <Link href="/library" className="type-meta text-ink-muted hover:text-accent font-medium">
                ← العودة إلى المكتبة · Back to library
            </Link>

            {/* Header */}
            <header className="mt-5">
                <div className="type-meta mb-2.5 flex items-center gap-2 text-ink-faint">
                    <span
                        aria-hidden
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: sector?.color }}
                    />
                    <span className="font-semibold text-ink-muted">
                        {sector?.nameAr} ({sector?.name})
                    </span>
                    <span>·</span>
                    <span>{role?.nameAr} ({role?.name})</span>
                </div>
                <h1 className="type-display-1 text-ink leading-snug">
                    <MethodTitle method={method} />
                </h1>
                <div className="mt-3">
                    <MethodDescription
                        method={method}
                        className="type-body-lg text-ink-muted leading-relaxed"
                    />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 type-meta text-ink-faint">
                    <span className="font-medium text-ink">{method.author}</span>
                    <span aria-hidden>·</span>
                    <span>{method.organisation}</span>
                    <span aria-hidden>·</span>
                    <span className="font-mono">{method.version}</span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(method.publishDate)}</span>
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
                    <div className="type-disclosure text-ink-faint">مرات الاستخدام · Reuses</div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-accent font-bold">
                        {formatCount(method.reuseCount)}
                    </div>
                </div>
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">الوقت المستعاد · Time returned</div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-measure font-semibold">
                        {formatMinutes(method.timeBeforeMin)} → {formatMinutes(method.timeAfterMin)}
                    </div>
                </div>
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">التقييم · Rating</div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-ink">
                        {formatRating(method.rating.score, method.rating.count)}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
                <MethodActions method={method} />
            </div>

            <Section title="What it does" titleAr="ما ينجزه هذا الأسلوب">
                <p className="type-body text-ink leading-relaxed">{method.whatItDoes}</p>
            </Section>

            <Section title="Sample Input & Output Showcase" titleAr="أمثلة المدخلات والمخرجات المعتمدة">
                <SampleShowcase method={method} />
            </Section>

            <Section title="Inputs required" titleAr="المدخلات المطلوبة للتشغيل">
                <ul className="space-y-2">
                    {method.inputsRequired.map((input) => (
                        <li key={input} className="type-body flex gap-2.5 text-ink">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{input}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="Suggested Shared Agents" titleAr="الوكلاء المشتركون المقترحون لضبط الجودة والأمان">
                <SharedAgentsCard method={method} />
            </Section>

            <Section title="Pipeline Combinations" titleAr="سلاسل العمل التراكمية وخطوط الإنتاج">
                <PipelineCombinations method={method} />
            </Section>

            <Section title="What stays human" titleAr="ما يبقى بمسؤولية الإنسان">
                <p className="type-body-lg text-ink font-medium leading-relaxed">
                    {method.whatStaysHuman}
                </p>
            </Section>

            <Section title="Provenance" titleAr="توثيق النموذج والمصدر" chip={<IllustrativeChip />}>
                <div className="rounded-[8px] border border-rule bg-surface p-4">
                    <p className="type-body text-ink">
                        <span className="font-semibold">بُني واختُبر على (Built &amp; tested on):</span>{' '}
                        {method.provenance.builtOn}
                    </p>
                    <p className="type-body mt-1 text-ink">
                        <span className="font-semibold">يعمل أيضاً على (Also reported working):</span>{' '}
                        {method.provenance.alsoReported.join(', ')}
                    </p>
                    <p className="type-meta mt-2 text-ink-faint">
                        معلومات مقدمة من المؤلف ومن أعادوا استخدام الأسلوب. لا تعد مقارنة معيارية.
                    </p>
                </div>
            </Section>

            <Section title="Performance" titleAr="الأداء والوقت المستغرق" chip={<IllustrativeChip />}>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <div className="type-disclosure text-ink-faint">الوقت المعتاد قبل الأسلوب</div>
                        <div className="type-display-3 tabular-nums text-ink">
                            {formatMinutes(method.timeBeforeMin)}
                        </div>
                    </div>
                    <div>
                        <div className="type-disclosure text-ink-faint">الوقت المعتاد بعد الأسلوب</div>
                        <div className="type-display-3 tabular-nums text-measure font-bold">
                            {formatMinutes(method.timeAfterMin)}
                        </div>
                    </div>
                    <div>
                        <div className="type-disclosure text-ink-faint">عمليات التشغيل المساهمة</div>
                        <div className="type-display-3 tabular-nums text-ink">
                            {formatCount(method.performance.runs)}
                        </div>
                    </div>
                </div>
                <p className="type-meta mt-3 text-ink-muted leading-relaxed">
                    {method.performance.accuracyNote}
                </p>
            </Section>

            <Section title="Reuse trail" titleAr="سجل إعادة الاستخدام">
                {method.reuseCount === 0 ? (
                    <p className="type-body text-ink-muted">
                        لم يتم إعادة استخدامه بعد. عند تشغيل هذا الأسلوب من قبل زميل آخر، يُسجل الاستخدام تلقائياً بصورة مجهولة الهوية ودون ذكر أسماء الأفراد.
                    </p>
                ) : (
                    <>
                        <p className="type-body text-ink font-medium">
                            تمت إعادة استخدامه بواسطة{' '}
                            <span className="font-bold text-accent">
                                {method.reuseTrail.people} شخصاً
                            </span>{' '}
                            عبر {method.reuseTrail.organisations}{' '}
                            {method.reuseTrail.organisations === 1 ? 'منظمة' : 'منظمات'}.
                        </p>
                        <div className="mt-3 space-y-2">
                            {method.reuseTrail.sectorBreakdown.map((entry) => {
                                const entrySector = getSector(entry.sectorId);
                                const share = Math.round(
                                    (entry.count / method.reuseTrail.people) * 100,
                                );
                                return (
                                    <div key={entry.sectorId} className="flex items-center gap-3">
                                        <span className="type-meta w-52 shrink-0 text-ink-muted">
                                            {entrySector?.nameAr || entrySector?.name}
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
                                        <span className="type-meta w-10 shrink-0 text-end tabular-nums text-ink-faint font-mono">
                                            {entry.count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="type-disclosure mt-2.5 text-ink-faint">
                            سجل مجهول الهوية بالكامل. لا يتم تتبع أو ذكر أسماء الأفراد لحماية الخصوصية.
                        </p>
                    </>
                )}
            </Section>

            <Section title="Ratings" titleAr="تقييمات الزملاء">
                {method.rating.count === 0 ? (
                    <p className="type-body text-ink-muted">لا توجد تقييمات مسجلة بعد.</p>
                ) : (
                    <div className="max-w-[420px] space-y-2">
                        <p className="type-body text-ink font-semibold">
                            {formatRating(method.rating.score, method.rating.count)}
                        </p>
                        {method.rating.distribution.map((count, index) => (
                            <div key={STAR_LABELS[index]} className="flex items-center gap-3">
                                <span className="type-meta w-6 shrink-0 text-ink-muted">
                                    {STAR_LABELS[index]} ★
                                </span>
                                <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunk">
                                    <span
                                        className="block h-full rounded-full bg-accent"
                                        style={{
                                            width: `${(count / maxRating) * 100}%`,
                                        }}
                                    />
                                </span>
                                <span className="type-meta w-8 shrink-0 text-end tabular-nums text-ink-faint font-mono">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            <Section title="Version history" titleAr="سجل الإصدارات والتطوير">
                <div className="divide-y divide-rule border-y border-rule">
                    {method.versionHistory.map((entry) => (
                        <div key={entry.version} className="py-3 flex items-start justify-between gap-4">
                            <div>
                                <div className="type-label font-bold text-ink">
                                    {entry.version}{' '}
                                    {entry.isCurrent && (
                                        <span className="chip border border-accent bg-accent-sunk text-accent text-[11px] font-semibold ms-2">
                                            الإصدار الحالي · Current
                                        </span>
                                    )}
                                </div>
                                <p className="type-meta text-ink-muted mt-0.5">{entry.note}</p>
                                <p className="type-disclosure text-ink-faint mt-1">
                                    بواسطة {entry.author} · {formatDate(entry.date)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </article>
    );
}
