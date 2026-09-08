'use client';

import { useState } from 'react';
import Link from 'next/link';

import { sectorCounts } from '@/data/derive';
import { ADOPTION_LADDER } from '@/data/insights';
import { METHODS } from '@/data/methods';
import { cn, formatCount } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { CatalogueStrip } from '@/components/landing/catalogue-strip';
import { IllustrativeChip } from '@/components/illustrative-chip';

function SectionHeading({ children }: { children: React.ReactNode }): React.ReactElement {
    return <h2 className="type-display-2 text-ink">{children}</h2>;
}

export default function LandingPage(): React.ReactElement {
    const { t, isRTL } = useLanguage();
    const sectors = sectorCounts();
    const maxSectorReuse = Math.max(...sectors.map((sector) => sector.totalReuse), 1);

    // Interactive Absorption Ladder state
    const [activeRungKey, setActiveRungKey] = useState<string>('habit');

    // Interactive ROI Calculator state
    const [teamSize, setTeamSize] = useState<number>(35);
    const [runsPerWeek, setRunsPerWeek] = useState<number>(3);

    // Interactive Sector Explorer state
    const [previewSectorId, setPreviewSectorId] = useState<string>('government');

    // ROI Calculations (Average 32 minutes saved per run, 48 work weeks/year)
    const annualHoursSaved = Math.round(teamSize * runsPerWeek * 0.53 * 48);
    const productiveDays = Math.round(annualHoursSaved / 8);

    // Dynamic ladder tier calculated directly from user input
    const calculatedRungKey =
        runsPerWeek <= 1
            ? 'activation'
            : runsPerWeek <= 3
              ? 'habit'
              : runsPerWeek <= 6
                ? 'integration'
                : 'impact';

    const ladderTiers: Record<
        string,
        {
            labelAr: string;
            labelEn: string;
            badgeAr: string;
            badgeEn: string;
            descAr: string;
            descEn: string;
            color: string;
        }
    > = {
        access: {
            labelAr: 'الدرجة 1: الوصول (Access)',
            labelEn: 'Rung 1: Access',
            badgeAr: 'توفير الحسابات',
            badgeEn: 'Tool Access',
            descAr: 'مجرد توفير التراخيص وأدوات الذكاء الاصطناعي دون أساليب عمل معيارية.',
            descEn: 'Merely provisioning tool accounts without standardized methods.',
            color: 'var(--color-ink-faint)',
        },
        activation: {
            labelAr: 'الدرجة 2: التفعيل التجريبي (Activation)',
            labelEn: 'Rung 2: Activation',
            badgeAr: 'تجارب فردية متفرقة',
            badgeEn: 'Occasional Trials',
            descAr: 'تجارب شخصية متفرقة (تشغيل واحد أسبوعياً) لحل مهام معزولة دون أساليب موحدة.',
            descEn: 'Individual experimentation (~1 task/week) without standard team workflows.',
            color: 'var(--color-ink-muted)',
        },
        habit: {
            labelAr: 'الدرجة 3: العادة الفردية (Habit)',
            labelEn: 'Rung 3: Habit',
            badgeAr: 'روتين شخصي متكرر',
            badgeEn: 'Personal Routine',
            descAr: 'اعتياد أسبوعي منتظم (2-3 مهام أسبوعياً)، لكن الأساليب تظل حبيسة أجهزة الأفراد.',
            descEn: 'Regular reliance on AI (2-3 tasks/week), but methods remain siloed with individuals.',
            color: 'var(--color-measure)',
        },
        integration: {
            labelAr: 'الدرجة 4: التكامل المؤسسي (Integration)',
            labelEn: 'Rung 4: Integration',
            badgeAr: 'نطاق المكتبة المستهدف 🎯',
            badgeEn: 'Al-Maktaba Sweet Spot 🎯',
            descAr: 'المرحلة المستهدفة (4-6 مهام أسبوعياً): إعادة استخدام منهجية لأساليب معتمدة ومفحوصة بجودة وأمان.',
            descEn: 'The sweet spot (4-6 tasks/week): team-wide systematic reuse of vetted methods with quality gates.',
            color: 'var(--color-accent)',
        },
        impact: {
            labelAr: 'الدرجة 5: الأثر والتحول (Impact)',
            labelEn: 'Rung 5: Strategic Impact',
            badgeAr: 'تحول استراتيجي شامل',
            badgeEn: 'Strategic Transformation',
            descAr: 'تحول مؤسسي شامل (7+ مهام أسبوعياً): سلاسل وكلاء متعددين وقياس مستمر لعائد الساعات المحررة.',
            descEn: 'Transformative operations (7+ tasks/week): chained multi-agent pipelines with verified capacity returns.',
            color: 'var(--color-accent)',
        },
    };

    const currentLadder = ladderTiers[calculatedRungKey];
    const activeRung = ADOPTION_LADDER.find((r) => r.key === activeRungKey) || ADOPTION_LADDER[2];

    const rungDescriptions: Record<string, { ar: string; en: string }> = {
        access: {
            ar: 'توفير التراخيص والنفاذ لأدوات الذكاء الاصطناعي لكافة الموظفين. ينتشر تلقائياً ولا يعكس بالضرورة تغيراً في المهام.',
            en: 'Procuring and provisioning AI tools across the organisation. Spreads organically without fundamentally altering workflow.',
        },
        activation: {
            ar: 'تجربة فردية متقطعة لحل مهام معزولة. غالبية المستخدمين يبقون في هذه المرحلة عبر محادثات عشوائية.',
            en: 'Individual experimentation on isolated tasks. Most enterprise users plateau here with ad-hoc chat prompts.',
        },
        habit: {
            ar: 'اعتياد الموظف على الاستعانة بالذكاء الاصطناعي أسبوعياً في مهامه المعتادة، لكن أساليبه تظل حبيسة جهازه.',
            en: 'Regular weekly reliance on AI for personal duties, but prompts remain siloed with individual workers.',
        },
        integration: {
            ar: 'المرحلة الحرجة ونطاق عمل "المكتبة": تحويل الحلول الفردية إلى أساليب عمل موثقة ومفهرسة يُعاد استخدامها عبر المنظمة.',
            en: 'The systemic bottleneck and Al-Maktaba’s core focus: turning isolated tricks into verified, repeatable institutional workflows.',
        },
        impact: {
            ar: 'تحول جوهري وقابل للقياس في إنتاجية الفرق وإعادة توجيه ساعات العمل المستعادة نحو مهام استراتيجية.',
            en: 'Sustained, measured reduction in task durations and reallocation of hours toward strategic initiatives.',
        },
    };

    const selectedSectorMethods = METHODS.filter((m) => m.sectorId === previewSectorId);
    const topMethod = selectedSectorMethods[0] || METHODS[0];

    const HOW_IT_WORKS = [
        {
            step: 1,
            title: t('step1Title'),
            body: t('step1Body'),
        },
        {
            step: 2,
            title: t('step2Title'),
            body: t('step2Body'),
        },
        {
            step: 3,
            title: t('step3Title'),
            body: t('step3Body'),
        },
    ];

    const COMPARISON = [
        {
            dimension: isRTL ? 'ما يتم إحصاؤه' : 'What is counted',
            creator: isRTL ? 'التنزيلات والمتابعات' : 'Downloads and follows',
            maktaba: isRTL
                ? 'أشخاص مستقلون شغّلوا الأسلوب وتحققت المنصة من تشغيله'
                : 'Distinct people who ran it, verified by the run',
        },
        {
            dimension: isRTL ? 'ما يتم مكافأته' : 'What is rewarded',
            creator: isRTL ? 'حجم الجمهور والشهرة' : 'Audience size',
            maktaba: isRTL ? 'ساعات العمل المستعادة للزملاء' : 'Time returned to someone else',
        },
        {
            dimension: isRTL ? 'سياق الاستخدام' : 'Context',
            creator: isRTL ? 'معدوم — الموجه مجرد نص عام' : 'None — a prompt is a prompt',
            maktaba: isRTL
                ? 'القطاع وعائلة الأدوار مع بيان نسبة الأتمتة القابلة للتطبيق'
                : 'Role family and sector, with addressable share stated',
        },
        {
            dimension: isRTL ? 'اللغة' : 'Language',
            creator: isRTL ? 'الإنجليزية أولاً والعربية مترجمة' : 'English-first, Arabic translated',
            maktaba: isRTL ? 'العربية والإنجليزية على قدم المساواة وبخط موحد' : 'Arabic and English as equals',
        },
    ];

    const FRAMEWORKS_SA = [
        {
            name: isRTL ? 'إطار سدايا لتبني الذكاء الاصطناعي' : 'SDAIA AI Adoption Framework',
            note: isRTL
                ? 'خارطة الطريق الوطنية مع مستويات نضج مرحلية ونماذج تقييم الجاهزية'
                : 'national roadmap for AI adoption, with staged maturity levels and readiness templates',
        },
        {
            name: isRTL ? 'المؤشر الوطني للذكاء الاصطناعي' : 'SDAIA National AI Index',
            note: isRTL
                ? 'جاهزية مؤسسية تُقاس عبر 3 ركائز و7 أبعاد و23 فئة فرعية'
                : 'institutional readiness assessed across three pillars, seven dimensions and twenty-three subcategories',
        },
        {
            name: isRTL ? 'مبادئ أخلاقيات الذكاء الاصطناعي وموجهات التوليدي' : 'SDAIA AI Ethics Principles & Guidelines',
            note: isRTL
                ? 'صادرة بنسخ خاصة لموظفي القطاع الحكومي ولعموم الجمهور'
                : 'issued in separate versions for government employees and for the public',
        },
        {
            name: isRTL ? 'نظام حماية البيانات الشخصية (PDPL)' : 'Personal Data Protection Law (PDPL)',
            note: isRTL
                ? 'يحكم سرية البيانات وتصدير الأساليب الحساسة للبيئات الداخلية'
                : 'governs how anything measured here may be collected and retained',
        },
    ];

    return (
        <div>
            {/* Section 1 — Hero */}
            <section className="border-b border-rule bg-surface">
                <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[58fr_42fr]">
                    <div className="max-w-[620px]">
                        <h1 className="type-display-1 text-ink leading-[1.15]">
                            {t('heroTitle')}
                        </h1>
                        <p className="type-body-lg mt-5 max-w-[600px] text-ink-muted leading-relaxed">
                            {t('heroSubtitle')}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/library" className="btn btn-primary">
                                {t('heroBrowseBtn')}
                            </Link>
                            <Link href="/publish" className="btn btn-secondary">
                                {t('heroPublishBtn')}
                            </Link>
                        </div>
                    </div>
                    <CatalogueStrip />
                </div>
            </section>

            {/* Section 2 — The problem */}
            <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
                <div className="max-w-[680px] border-s-2 border-rule-strong ps-6 md:ps-8">
                    <p className="type-display-3 text-ink leading-snug">
                        {t('problem1')}
                    </p>
                    <p className="type-display-3 mt-6 text-ink leading-snug">
                        {t('problem2')}
                    </p>
                    <p className="type-display-3 mt-6 text-ink leading-snug">
                        {t('problem3')}
                    </p>
                </div>
            </section>

            {/* Section 3 — How it works */}
            <section className="border-y border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
                    <div className="mb-8">
                        <SectionHeading>{t('howItWorksTitle')}</SectionHeading>
                        <p className="type-meta text-ink-muted mt-1">
                            {t('howItWorksSub')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
                        {HOW_IT_WORKS.map((item) => (
                            <div
                                key={item.step}
                                className="rounded-[8px] border border-rule bg-paper p-6 transition-all hover:border-rule-strong"
                            >
                                <div className="font-display text-[36px] font-bold leading-none text-accent">
                                    0{item.step}
                                </div>
                                <h3 className="type-display-3 mt-4 text-ink">{item.title}</h3>
                                <p className="type-body mt-2.5 text-ink-muted leading-relaxed">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Interactive Widget: Team Impact Calculator */}
            <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
                {/* Core Concept: Method vs Run Card */}
                <div className="mb-8 rounded-[10px] border border-accent/40 bg-accent-sunk/20 p-5 md:p-6 shadow-xs">
                    <div className="flex items-start gap-3.5">
                        <span className="text-2xl mt-0.5 select-none">💡</span>
                        <div className="w-full">
                            <h3 className="type-label font-bold text-accent">
                                {isRTL
                                    ? 'المفهومان الأساسيان في منصة المكتبة (ما الفرق بين الأسلوب والتشغيل؟)'
                                    : 'Two Core Concepts in Al-Maktaba (Method vs. Run):'}
                            </h3>
                            <p className="type-meta text-ink-muted mt-1 mb-3 leading-relaxed">
                                {isRTL
                                    ? 'لكي تتضح حسابات الطاقة الاستيعابية والكتالوج بدقة، تفصل المكتبة بين "أسلوب العمل" و"مرات التشغيل":'
                                    : 'To accurately calculate capacity reclaimed, Al-Maktaba distinguishes between the "Method" and the "Run":'}
                            </p>
                            <div className="grid gap-3.5 sm:grid-cols-2">
                                <div className="rounded-[6px] border border-rule bg-surface p-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="h-2 w-2 rounded-full bg-accent" />
                                        <strong className="type-label font-bold text-ink">
                                            {isRTL ? '1. أسلوب العمل المعتمد (Method)' : '1. Vetted Method (The Recipe)'}
                                        </strong>
                                    </div>
                                    <p className="type-disclosure text-ink-muted leading-relaxed">
                                        {isRTL
                                            ? 'هو الوصفة والدليل الإجرائي المعتمد والموجهات (Prompt) لأداء مهمة متكررة (مثل صياغة خطاب وزاري، أو تقييم مذكرة ائتمان، أو تدقيق حادثة سلامة). يُكتب مرة واحدة ويستفيد منه الجميع.'
                                            : 'The vetted playbook, system instructions, and quality gates for a recurring task (e.g. drafting ministerial correspondence or credit memos). Built once, shared company-wide.'}
                                    </p>
                                </div>
                                <div className="rounded-[6px] border border-rule bg-surface p-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="h-2 w-2 rounded-full bg-measure" />
                                        <strong className="type-label font-bold text-ink">
                                            {isRTL ? '2. مرات التشغيل والتطبيق (Run / Reuse)' : '2. Workflow Run (The Execution)'}
                                        </strong>
                                    </div>
                                    <p className="type-disclosure text-ink-muted leading-relaxed">
                                        {isRTL
                                            ? 'كل مرة يرفع فيها موظف ملف معاملة ويطبق عليها أسلوب العمل لإنجاز عمله الفعلي في دقائق بدلاً من ساعات العمل اليدوي. هذا الرقم هو ما تقيسه المكتبة وتحسب وفوراته.'
                                            : 'Every time an employee uploads a document payload and runs the method to complete real work in minutes instead of hours. This execution count is what Al-Maktaba benchmarks.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[10px] border border-rule bg-surface p-6 md:p-10 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-6 mb-8">
                        <div>
                            <span className="type-disclosure font-mono text-accent uppercase font-bold tracking-wide">
                                {isRTL ? 'حاسبة الأثر المؤسسي وسلّم الاستيعاب' : 'Impact Simulation & Ladder Status'}
                            </span>
                            <h2 className="type-display-2 text-ink mt-1">
                                {isRTL
                                    ? 'كم ساعة عمل تستعيدها منظمتك عبر إعادة الاستخدام؟'
                                    : 'How many hours will your organisation reclaim?'}
                            </h2>
                            <p className="type-meta text-ink-muted mt-1">
                                {isRTL
                                    ? 'حساب تقديري يستند إلى متوسط التوفير المحقق (32 دقيقة لكل تشغيل أسلوب عمل معتمد).'
                                    : 'Estimated capacity based on benchmark saving of 32 minutes per verified method run.'}
                            </p>
                        </div>
                        <IllustrativeChip />
                    </div>

                    <div className="grid gap-10 lg:grid-cols-2 items-center">
                        {/* Interactive Sliders */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between type-meta mb-2">
                                    <span className="font-semibold text-ink">
                                        {isRTL ? 'حجم الفريق أو المنظمة:' : 'Team or entity size:'}
                                    </span>
                                    <span className="font-mono text-accent text-lg font-bold">
                                        {teamSize} {isRTL ? 'موظف' : 'people'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="250"
                                    step="5"
                                    value={teamSize}
                                    onChange={(e) => setTeamSize(Number(e.target.value))}
                                    className="w-full accent-accent cursor-pointer"
                                />
                                <div className="flex justify-between type-disclosure text-ink-faint mt-1">
                                    <span>5</span>
                                    <span>100</span>
                                    <span>250</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between type-meta mb-2">
                                    <span className="font-semibold text-ink">
                                        {isRTL
                                            ? 'المهام الأسبوعية للموظف:'
                                            : 'Weekly tasks per person:'}
                                    </span>
                                    <span className="font-mono text-accent text-lg font-bold">
                                        {runsPerWeek} {isRTL ? 'مهام / أسبوع' : 'tasks / wk'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={runsPerWeek}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setRunsPerWeek(val);
                                        const key =
                                            val <= 1
                                                ? 'activation'
                                                : val <= 3
                                                  ? 'habit'
                                                  : val <= 6
                                                    ? 'integration'
                                                    : 'impact';
                                        setActiveRungKey(key);
                                    }}
                                    className="w-full accent-accent cursor-pointer"
                                />
                                <div className="flex justify-between type-disclosure text-ink-faint mt-1">
                                    <span>1 {isRTL ? '(تفعيل)' : '(Trial)'}</span>
                                    <span>3 {isRTL ? '(عادة)' : '(Routine)'}</span>
                                    <span>5 {isRTL ? '(المكتبة 🎯)' : '(Target 🎯)'}</span>
                                    <span>10 {isRTL ? '(يومي)' : '(Daily)'}</span>
                                </div>
                            </div>

                            <p className="type-disclosure text-ink-muted leading-relaxed pt-1 border-t border-rule/50">
                                💡 {isRTL
                                    ? 'يقيس هذا المؤشر عدد المعاملات والتقارير المنجزة عبر أساليب المكتبة المعتمدة بدلاً من الصياغة اليدوية.'
                                    : 'Measures the volume of recurring memos, letters, or briefs completed using verified library methods instead of manual drafting.'}
                            </p>
                        </div>

                        {/* Visual Metrics Display */}
                        <div className="grid grid-cols-2 gap-4 rounded-[8px] border border-rule bg-surface-sunk/40 p-6">
                            <div className="col-span-2 text-center pb-2 border-b border-rule">
                                <div className="type-disclosure text-ink-faint">
                                    {isRTL ? 'إجمالي الساعات المستعادة سنوياً' : 'Total annual hours returned'}
                                </div>
                                <div className="type-display-1 mt-1 text-measure font-mono font-bold">
                                    {formatCount(annualHoursSaved)}{' '}
                                    <span className="text-xl font-normal text-ink-muted">
                                        {t('hours')}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-surface rounded-[6px] border border-rule">
                                <div className="type-disclosure text-ink-faint">
                                    {isRTL ? 'أيام عمل محررة' : 'Productive days'}
                                </div>
                                <div className="type-display-3 mt-0.5 text-accent font-mono font-bold">
                                    ~{productiveDays}
                                </div>
                            </div>
                            <div className="p-3 bg-surface rounded-[6px] border border-rule flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="type-disclosure text-ink-faint">
                                            {isRTL ? 'درجة النضج في السلّم' : 'Ladder status'}
                                        </span>
                                        <span
                                            className="chip border text-[10px] font-semibold"
                                            style={{
                                                borderColor: currentLadder.color,
                                                color: currentLadder.color,
                                            }}
                                        >
                                            {isRTL ? currentLadder.badgeAr : currentLadder.badgeEn}
                                        </span>
                                    </div>
                                    <div className="type-label mt-1 text-ink font-bold">
                                        {isRTL ? currentLadder.labelAr : currentLadder.labelEn}
                                    </div>
                                </div>
                                <p className="type-disclosure text-ink-muted mt-1.5 leading-snug">
                                    {isRTL ? currentLadder.descAr : currentLadder.descEn}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4 — Where this sits & Interactive Ladder */}
            <section className="border-t border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
                    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                        {/* Part A — the programme */}
                        <div className="max-w-[680px]">
                            <SectionHeading>{t('whereItSitsTitle')}</SectionHeading>
                            <p className="type-body mt-5 text-ink leading-relaxed">
                                {t('whereItSitsP1')}
                            </p>
                            <p className="type-body mt-4 text-ink leading-relaxed">
                                {t('whereItSitsP2')}
                            </p>
                            <p className="type-display-3 mt-5 text-ink">
                                {t('whereItSitsP3')}
                            </p>

                            {/* Interactive 5-Rung Ladder */}
                            <div className="mt-8">
                                <div className="flex items-end gap-2">
                                    {ADOPTION_LADDER.map((rung, index) => (
                                        <button
                                            key={rung.key}
                                            type="button"
                                            onClick={() => setActiveRungKey(rung.key)}
                                            className="flex-1 text-start group cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    'rounded-t-[4px] border border-b-0 transition-all duration-200',
                                                    activeRungKey === rung.key
                                                        ? 'border-accent bg-accent'
                                                        : rung.isMaktabaRung
                                                          ? 'border-accent bg-accent-sunk'
                                                          : 'border-rule bg-surface-sunk group-hover:border-rule-strong',
                                                )}
                                                style={{ height: `${32 + index * 12}px` }}
                                            />
                                            <div
                                                className={cn(
                                                    'border-t px-1.5 pt-2 type-disclosure transition-colors',
                                                    activeRungKey === rung.key
                                                        ? 'border-accent font-bold text-accent'
                                                        : rung.isMaktabaRung
                                                          ? 'border-accent font-semibold text-accent'
                                                          : 'border-rule-strong text-ink-faint',
                                                )}
                                            >
                                                {isRTL
                                                    ? [
                                                          t('ladderAccess'),
                                                          t('ladderActivation'),
                                                          t('ladderHabit'),
                                                          'التكامل',
                                                          t('ladderImpact'),
                                                      ][index]
                                                    : rung.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Active Rung Information Card */}
                                <div className="mt-4 rounded-[6px] border border-accent bg-accent-sunk/30 p-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="type-label font-bold text-accent">
                                            {isRTL
                                                ? `الدرجة المختارة: ${activeRung.label}`
                                                : `Selected Rung: ${activeRung.label}`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {calculatedRungKey === activeRung.key && (
                                                <span className="chip border border-accent/60 bg-surface text-accent text-[11px] font-semibold">
                                                    {isRTL ? 'المستوى المحسوب بالحاسبة' : 'Your simulated tier'}
                                                </span>
                                            )}
                                            {activeRung.isMaktabaRung && (
                                                <span className="chip border border-accent bg-surface text-accent text-[11px] font-semibold">
                                                    {isRTL ? 'نطاق تركيز المكتبة 🎯' : 'Al-Maktaba focus 🎯'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="type-meta text-ink leading-relaxed">
                                        {isRTL
                                            ? rungDescriptions[activeRung.key]?.ar
                                            : rungDescriptions[activeRung.key]?.en}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Part B — frameworks */}
                        <div>
                            <h3 className="type-label mb-4 text-ink-faint">
                                {isRTL ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                            </h3>
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

                            <h3 className="type-label mb-4 mt-8 text-ink-faint">
                                {isRTL ? 'الأطر والمعايير الدولية' : 'International'}
                            </h3>
                            <ul className="divide-y divide-rule border-y border-rule">
                                <li className="py-3">
                                    <div className="type-label text-ink">
                                        NIST AI Risk Management Framework
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="type-label text-ink">ISO/IEC 42001</div>
                                    <div className="type-meta text-ink-muted">
                                        {isRTL
                                            ? 'أنظمة إدارة الذكاء الاصطناعي المؤسسية'
                                            : 'AI management systems'}
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="type-label text-ink">
                                        Bass diffusion model (1969)
                                    </div>
                                    <div className="type-meta text-ink-muted">
                                        {isRTL
                                            ? 'النموذج الرياضي لمحاكاة وتوقع انتشار التقنيات'
                                            : 'the mathematics under the adoption simulation'}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5 — What makes this different & Comparison Table */}
            <section className="border-y border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div className="max-w-[540px]">
                            <SectionHeading>{t('diff1Title')}</SectionHeading>
                            <p className="type-body mt-4 text-ink-muted leading-relaxed">
                                {t('diff1Body')}
                            </p>
                        </div>
                        <div className="max-w-[540px]">
                            <SectionHeading>{t('diff2Title')}</SectionHeading>
                            <p className="type-body mt-4 text-ink-muted leading-relaxed">
                                {t('diff2Body')}
                            </p>
                        </div>
                    </div>

                    {/* Comparison table */}
                    <div className="mt-12 overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-start">
                            <thead>
                                <tr className="border-b border-rule-strong">
                                    <th className="type-label py-3 pe-4 font-medium text-ink-faint" />
                                    <th className="type-label py-3 pe-4 font-medium text-ink-muted">
                                        {t('comparisonColCreator')}
                                    </th>
                                    <th className="type-label py-3 font-semibold text-accent">
                                        {t('comparisonColMaktaba')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON.map((row) => (
                                    <tr key={row.dimension} className="border-b border-rule">
                                        <td className="type-meta py-3 pe-4 font-semibold text-ink">
                                            {row.dimension}
                                        </td>
                                        <td className="type-meta py-3 pe-4 text-ink-muted">
                                            {row.creator}
                                        </td>
                                        <td className="type-meta py-3 text-ink font-medium">
                                            {row.maktaba}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="type-display-3 mt-12 max-w-[680px] text-ink leading-relaxed">
                        {t('diffClosing')}
                    </p>
                </div>
            </section>

            {/* Section 6 — The catalogue at a glance (Interactive Sector Shelf) */}
            <section className="mx-auto max-w-[1180px] px-5 py-14 md:px-8 md:py-20">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SectionHeading>
                            {isRTL ? 'نظرة سريعة على رفوف المكتبة' : 'The catalogue at a glance'}
                        </SectionHeading>
                        <IllustrativeChip />
                    </div>
                    <Link href="/library" className="btn btn-secondary btn-sm">
                        {t('navBrowse')}
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    {/* Sector Bars List */}
                    <div className="divide-y divide-rule border-y border-rule">
                        {sectors.map((sector) => {
                            const isSelected = previewSectorId === sector.sectorId;
                            const name = isRTL ? sector.nameAr : sector.name;

                            return (
                                <button
                                    key={sector.sectorId}
                                    type="button"
                                    onClick={() => setPreviewSectorId(sector.sectorId)}
                                    className={cn(
                                        'flex w-full items-center gap-4 py-3 text-start transition-colors px-2 rounded-[4px]',
                                        isSelected ? 'bg-surface-sunk font-semibold' : 'hover:bg-surface-sunk/50',
                                    )}
                                >
                                    <span
                                        aria-hidden
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: sector.color }}
                                    />
                                    <span className="type-body w-52 shrink-0 truncate text-ink">
                                        {name}
                                    </span>
                                    <span className="type-meta w-24 shrink-0 tabular-nums text-ink-faint">
                                        {sector.count} {isRTL ? 'أسلوب' : 'methods'}
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
                                    <span className="type-meta w-28 shrink-0 text-end tabular-nums text-ink-muted">
                                        {sector.reusePerMethod} {t('perMethod')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sector Featured Preview Card */}
                    <div className="rounded-[8px] border border-rule bg-surface p-6 flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="type-disclosure text-ink-faint mb-2">
                                {isRTL ? 'أسلوب عمل مميز من هذا القطاع' : 'Featured sector workflow'}
                            </div>
                            <h3 className="type-display-3 text-ink font-bold leading-snug">
                                {topMethod.title}
                            </h3>
                            <p className="type-meta text-ink-muted mt-2 leading-relaxed">
                                {topMethod.description}
                            </p>
                            <div className="mt-4 flex items-center gap-4 type-disclosure">
                                <span className="font-bold text-accent">
                                    {topMethod.reuseCount} {isRTL ? 'استخدام موثق' : 'reuses'}
                                </span>
                                <span className="text-measure font-semibold">
                                    {isRTL
                                        ? `وفرت ${topMethod.timeBeforeMin - topMethod.timeAfterMin} دقيقة`
                                        : `saved ${topMethod.timeBeforeMin - topMethod.timeAfterMin}m`}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-rule">
                            <Link
                                href={`/library?sector=${previewSectorId}`}
                                className="btn btn-primary btn-sm w-full"
                            >
                                {isRTL ? 'تصفح أساليب هذا القطاع ←' : 'Browse this sector →'}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 7 — Close */}
            <section className="border-t border-rule bg-surface">
                <div className="mx-auto max-w-[1180px] px-5 py-16 text-center md:px-8 md:py-24">
                    <p className="type-display-2 text-ink">{t('closeTitle')}</p>
                    <div className="mt-7 flex justify-center gap-3">
                        <Link href="/library" className="btn btn-primary">
                            {t('closeBrowseBtn')}
                        </Link>
                        <Link href="/publish" className="btn btn-secondary">
                            {t('closePublishBtn')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
