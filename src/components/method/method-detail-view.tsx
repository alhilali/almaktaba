'use client';

import Link from 'next/link';
import type { IMethod, ISector, IRoleFamily } from '@/data/types';
import { getSector } from '@/data/sectors';
import { maturityOf } from '@/data/derive';
import { formatMinutes, formatRating, formatDate, formatCount } from '@/lib/utils';
import { MethodTitle, MethodDescription } from '@/components/method-bits';
import { LanguageChip, SensitivityChip, MaturityChip } from '@/components/chips';
import { IllustrativeChip } from '@/components/illustrative-chip';
import { MethodActions } from '@/components/method/method-actions';
import { SampleShowcase } from '@/components/method/sample-showcase';
import { SharedAgentsCard } from '@/components/method/shared-agents-card';
import { PipelineCombinations } from '@/components/method/pipeline-combinations';
import { useLanguage } from '@/context/language-context';

function Section({
    title,
    titleAr,
    children,
    chip,
    isAr,
}: {
    title: string;
    titleAr: string;
    children: React.ReactNode;
    chip?: React.ReactNode;
    isAr: boolean;
}): React.ReactElement {
    return (
        <section className="border-t border-rule py-7">
            <div className="mb-3 flex items-center gap-2">
                <h2 className="type-label font-bold text-ink">
                    {isAr ? titleAr : title}
                </h2>
                {chip}
            </div>
            {children}
        </section>
    );
}

const STAR_LABELS = ['5', '4', '3', '2', '1'];

export function MethodDetailView({
    method,
    sector,
    role,
}: {
    method: IMethod;
    sector?: ISector;
    role?: IRoleFamily;
}): React.ReactElement {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const maxRating = Math.max(1, ...method.rating.distribution);

    return (
        <article className="mx-auto max-w-[820px] px-5 pb-24 pt-8 md:px-8 lg:pb-16">
            <Link
                href="/library"
                className="type-meta text-ink-muted hover:text-accent font-medium inline-flex items-center gap-1.5"
            >
                <span>{isAr ? '← العودة إلى المكتبة' : '← Back to library'}</span>
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
                        {isAr ? sector?.nameAr || sector?.name : sector?.name}
                    </span>
                    <span>·</span>
                    <span>{isAr ? role?.nameAr || role?.name : role?.name}</span>
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
                    <span className="font-medium text-ink">
                        {isAr ? `بواسطة ${method.author}` : `By ${method.author}`}
                    </span>
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
                    <div className="type-disclosure text-ink-faint">
                        {isAr ? 'مرات الاستخدام المعتمدة' : 'Verified reuses'}
                    </div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-accent font-bold">
                        {formatCount(method.reuseCount)}
                    </div>
                </div>
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">
                        {isAr ? 'الوقت المستعاد للمهمة' : 'Time returned'}
                    </div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-measure font-semibold">
                        {formatMinutes(method.timeBeforeMin)} → {formatMinutes(method.timeAfterMin)}
                    </div>
                </div>
                <div className="bg-surface p-4">
                    <div className="type-disclosure text-ink-faint">
                        {isAr ? 'تقييم الزملاء' : 'Peer rating'}
                    </div>
                    <div className="type-display-3 mt-0.5 tabular-nums text-ink">
                        {formatRating(method.rating.score, method.rating.count)}
                    </div>
                </div>
            </div>

            {/* Actions: Run & Execute Drawer */}
            <div className="mt-6">
                <MethodActions method={method} />
            </div>

            <Section title="What it does" titleAr="ما ينجزه هذا الأسلوب" isAr={isAr}>
                <p className="type-body text-ink leading-relaxed">{method.whatItDoes}</p>
            </Section>

            <Section
                title="Sample Input & Output Showcase"
                titleAr="أمثلة المدخلات والمخرجات المعتمدة"
                isAr={isAr}
            >
                <SampleShowcase method={method} />
            </Section>

            <Section title="Inputs required" titleAr="المدخلات المطلوبة للتشغيل" isAr={isAr}>
                <ul className="space-y-2">
                    {method.inputsRequired.map((input) => (
                        <li key={input} className="type-body flex gap-2.5 text-ink">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{input}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section
                title="Suggested Shared Agents"
                titleAr="الوكلاء المشتركون المقترحون لضبط الجودة والأمان"
                isAr={isAr}
            >
                <SharedAgentsCard method={method} />
            </Section>

            <Section
                title="Pipeline Combinations"
                titleAr="سلاسل العمل التراكمية وخطوط الإنتاج"
                isAr={isAr}
            >
                <PipelineCombinations method={method} />
            </Section>

            <Section title="What stays human" titleAr="ما يبقى بمسؤولية الإنسان" isAr={isAr}>
                <p className="type-body-lg text-ink font-medium leading-relaxed">
                    {method.whatStaysHuman}
                </p>
            </Section>

            <Section
                title="Provenance"
                titleAr="توثيق النموذج والمصدر"
                chip={<IllustrativeChip />}
                isAr={isAr}
            >
                <div className="rounded-[8px] border border-rule bg-surface p-4">
                    <p className="type-body text-ink">
                        <span className="font-semibold">
                            {isAr ? 'بُني واختُبر على:' : 'Built & tested on:'}
                        </span>{' '}
                        {method.provenance.builtOn}
                    </p>
                    <p className="type-body mt-1 text-ink">
                        <span className="font-semibold">
                            {isAr ? 'يعمل أيضاً على:' : 'Also reported working on:'}
                        </span>{' '}
                        {method.provenance.alsoReported.join(isAr ? '، ' : ', ')}
                    </p>
                    <p className="type-meta mt-2 text-ink-faint">
                        {isAr
                            ? 'معلومات مقدمة من المؤلف ومن أعادوا استخدام الأسلوب. لا تعد مقارنة معيارية.'
                            : 'Reported by author and verified reusers. Not an independent benchmark.'}
                    </p>
                </div>
            </Section>

            <Section
                title="Performance"
                titleAr="الأداء والوقت المستغرق"
                chip={<IllustrativeChip />}
                isAr={isAr}
            >
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <div className="type-disclosure text-ink-faint">
                            {isAr ? 'الوقت المعتاد قبل الأسلوب' : 'Typical time before'}
                        </div>
                        <div className="type-display-3 tabular-nums text-ink">
                            {formatMinutes(method.timeBeforeMin)}
                        </div>
                    </div>
                    <div>
                        <div className="type-disclosure text-ink-faint">
                            {isAr ? 'الوقت المعتاد بعد الأسلوب' : 'Typical time after'}
                        </div>
                        <div className="type-display-3 tabular-nums text-measure font-bold">
                            {formatMinutes(method.timeAfterMin)}
                        </div>
                    </div>
                    <div>
                        <div className="type-disclosure text-ink-faint">
                            {isAr ? 'عمليات التشغيل المساهمة' : 'Runs contributing'}
                        </div>
                        <div className="type-display-3 tabular-nums text-ink">
                            {formatCount(method.performance.runs)}
                        </div>
                    </div>
                </div>
                <p className="type-meta mt-3 text-ink-muted leading-relaxed">
                    {method.performance.accuracyNote}
                </p>
            </Section>

            <Section
                title="Reuse trail"
                titleAr="سجل إعادة الاستخدام والاعتماد"
                isAr={isAr}
            >
                {method.reuseCount === 0 ? (
                    <p className="type-body text-ink-muted">
                        {isAr
                            ? 'لم يتم إعادة استخدامه بعد. عند تشغيل هذا الأسلوب من قبل زميل آخر، يُسجل الاستخدام تلقائياً بصورة مجهولة الهوية ودون ذكر أسماء الأفراد.'
                            : 'Not reused yet. When another colleague runs this method, their run is recorded anonymously.'}
                    </p>
                ) : (
                    <>
                        <p className="type-body text-ink font-medium">
                            {isAr ? (
                                <>
                                    تمت إعادة استخدامه بواسطة{' '}
                                    <span className="font-bold text-accent">
                                        {method.reuseTrail.people} شخصاً
                                    </span>{' '}
                                    عبر {method.reuseTrail.organisations}{' '}
                                    {method.reuseTrail.organisations === 1 ? 'منظمة' : 'منظمات'}.
                                </>
                            ) : (
                                <>
                                    Reused by{' '}
                                    <span className="font-bold text-accent">
                                        {method.reuseTrail.people} people
                                    </span>{' '}
                                    across {method.reuseTrail.organisations}{' '}
                                    {method.reuseTrail.organisations === 1 ? 'organisation' : 'organisations'}.
                                </>
                            )}
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
                                            {isAr
                                                ? entrySector?.nameAr || entrySector?.name
                                                : entrySector?.name}
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
                            {isAr
                                ? 'سجل مجهول الهوية بالكامل. لا يتم تتبع أو ذكر أسماء الأفراد لحماية الخصوصية.'
                                : 'Fully anonymised log. Personal names are never stored or tracked.'}
                        </p>
                    </>
                )}
            </Section>

            <Section title="Peer ratings" titleAr="تقييمات الزملاء" isAr={isAr}>
                {method.rating.count === 0 ? (
                    <p className="type-body text-ink-muted">
                        {isAr ? 'لا توجد تقييمات مسجلة بعد.' : 'No ratings recorded yet.'}
                    </p>
                ) : (
                    <div className="max-w-[420px] space-y-2">
                        <p className="type-body text-ink font-semibold">
                            {formatRating(method.rating.score, method.rating.count)}
                        </p>
                        {method.rating.distribution.map((count, index) => (
                            <div key={STAR_LABELS[index]} className="flex items-center gap-3">
                                <span className="type-meta w-14 shrink-0 text-ink-muted">
                                    {isAr ? `${STAR_LABELS[index]} نجوم` : `${STAR_LABELS[index]} ★`}
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

            <Section
                title="Version history"
                titleAr="سجل الإصدارات والتطوير"
                isAr={isAr}
            >
                <div className="divide-y divide-rule border-y border-rule">
                    {method.versionHistory.map((entry) => (
                        <div key={entry.version} className="py-3 flex items-start justify-between gap-4">
                            <div>
                                <div className="type-label font-bold text-ink">
                                    {entry.version}{' '}
                                    {entry.isCurrent && (
                                        <span className="chip border border-accent bg-accent-sunk text-accent text-[11px] font-semibold ms-2">
                                            {isAr ? 'الإصدار الحالي' : 'Current version'}
                                        </span>
                                    )}
                                </div>
                                <p className="type-meta text-ink-muted mt-0.5">{entry.note}</p>
                                <p className="type-disclosure text-ink-faint mt-1">
                                    {isAr
                                        ? `بواسطة ${entry.author} · ${formatDate(entry.date)}`
                                        : `By ${entry.author} · ${formatDate(entry.date)}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </article>
    );
}
