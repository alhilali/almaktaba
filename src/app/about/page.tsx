'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/language-context';
import { TEAM_MEMBERS, PROGRAM_PARTNERS } from '@/data/team';
import { SampleDataBanner } from '@/components/sample-data-banner';

export default function AboutPage(): React.ReactElement {
    const { t, isRTL } = useLanguage();

    return (
        <>
            <SampleDataBanner />

            <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-8 lg:pb-20">
                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="type-meta inline-flex items-center gap-1.5 text-ink-muted hover:text-accent transition-colors"
                    >
                        <span>{isRTL ? '← العودة إلى الرئيسية' : '← Back to home'}</span>
                    </Link>
                </div>

                {/* Hero Header */}
                <div className="max-w-[840px]">
                    <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-sunk/30 px-3 py-1 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="type-disclosure font-medium text-accent">
                            {isRTL
                                ? 'البرنامج القيادي التنفيذي · SDA × NUS'
                                : 'Executive Leadership Programme · SDA × NUS'}
                        </span>
                    </div>

                    <h1 className="type-display-1 text-ink">{t('aboutTitle')}</h1>

                    <p className="type-body mt-3 text-ink-muted leading-relaxed text-base md:text-lg">
                        {t('aboutSubtitle')}
                    </p>
                </div>

                {/* Featured Team Image */}
                <div className="mt-8 overflow-hidden rounded-[12px] border border-rule bg-surface shadow-sm">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden bg-surface-sunk">
                        <Image
                            src="/team.jpeg"
                            alt={
                                isRTL
                                    ? 'فريق عمل مشروع المكتبة - البرنامج القيادي المشترك SDA و NUS'
                                    : 'Al-Maktaba Project Team - SDA x NUS Leadership Programme'
                            }
                            fill
                            priority
                            sizes="(max-width: 1180px) 100vw, 1180px"
                            className="object-cover object-center"
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule bg-surface p-4 text-ink-muted type-disclosure">
                        <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-accent select-none" />
                            <span className="font-medium text-ink leading-normal">
                                {t('teamPhotoCaption')}
                            </span>
                        </div>
                        <span className="font-mono text-ink-faint text-[11px] uppercase tracking-wider">
                            SDA × NUS Executive Leadership
                        </span>
                    </div>
                </div>

                {/* Mission & Strategic Context */}
                <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2">
                            <span className="type-disclosure font-mono text-accent uppercase font-bold tracking-wide">
                                {isRTL ? 'سياق المبادرة' : 'Strategic Context'}
                            </span>
                        </div>
                        <h2 className="type-display-2 text-ink">{t('missionTitle')}</h2>
                        <p className="type-body text-ink leading-relaxed">
                            {t('missionP1')}
                        </p>
                        <p className="type-body text-ink leading-relaxed">
                            {t('missionP2')}
                        </p>
                    </div>

                    {/* Value Pillars */}
                    <div className="space-y-3.5 rounded-[10px] border border-rule bg-surface p-6">
                        <h3 className="type-label font-bold text-ink uppercase tracking-wide text-xs text-ink-faint mb-2">
                            {isRTL ? 'الركائز الجوهرية للمشروع' : 'Core Initiative Pillars'}
                        </h3>

                        <div className="rounded-[6px] border border-rule/60 bg-surface-sunk/40 p-3.5">
                            <div className="flex items-center gap-2 font-bold text-ink type-meta mb-1">
                                <span className="text-accent text-sm">⏱️</span>
                                <span>{t('pillar1Title')}</span>
                            </div>
                            <p className="type-disclosure text-ink-muted leading-relaxed">
                                {t('pillar1Desc')}
                            </p>
                        </div>

                        <div className="rounded-[6px] border border-rule/60 bg-surface-sunk/40 p-3.5">
                            <div className="flex items-center gap-2 font-bold text-ink type-meta mb-1">
                                <span className="text-measure text-sm">🔄</span>
                                <span>{t('pillar2Title')}</span>
                            </div>
                            <p className="type-disclosure text-ink-muted leading-relaxed">
                                {t('pillar2Desc')}
                            </p>
                        </div>

                        <div className="rounded-[6px] border border-rule/60 bg-surface-sunk/40 p-3.5">
                            <div className="flex items-center gap-2 font-bold text-ink type-meta mb-1">
                                <span className="text-accent text-sm">🛡️</span>
                                <span>{t('pillar3Title')}</span>
                            </div>
                            <p className="type-disclosure text-ink-muted leading-relaxed">
                                {t('pillar3Desc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Members Section */}
                <div className="mt-16 border-t border-rule pt-12">
                    <div className="max-w-[720px] mb-8">
                        <span className="type-disclosure font-mono text-accent uppercase font-bold tracking-wide">
                            {isRTL ? 'فريق المبادرة' : 'Initiative Team'}
                        </span>
                        <h2 className="type-display-2 text-ink mt-1">{t('teamTitle')}</h2>
                        <p className="type-meta text-ink-muted mt-1.5">
                            {t('teamSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {TEAM_MEMBERS.map((member) => (
                            <div
                                key={member.id}
                                className="group rounded-[8px] border border-rule bg-surface p-5 transition-all duration-200 hover:border-accent/50 hover:shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3.5 mb-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rule bg-surface-sunk font-mono text-sm font-bold text-accent group-hover:border-accent group-hover:bg-accent-sunk/50 transition-colors">
                                            {member.initials}
                                        </div>
                                        <div>
                                            <h3 className="type-label font-bold text-ink text-base group-hover:text-accent transition-colors">
                                                {isRTL ? member.nameAr : member.nameEn}
                                            </h3>
                                            <p className="type-disclosure text-ink-faint font-sans">
                                                {isRTL ? member.nameEn : member.nameAr}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-rule/50 flex items-center justify-between text-xs">
                                    <span className="chip border border-rule bg-surface-sunk/60 text-ink-muted text-[11px] font-medium">
                                        {isRTL ? member.roleAr : member.roleEn}
                                    </span>
                                    <span className="font-mono text-[10px] text-ink-faint">
                                        SDA × NUS
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Programme Co-Organisers Section */}
                <div className="mt-16 border-t border-rule pt-12">
                    <div className="max-w-[720px] mb-8">
                        <span className="type-disclosure font-mono text-accent uppercase font-bold tracking-wide">
                            {isRTL ? 'البرنامج والشراكة' : 'Programme Partnership'}
                        </span>
                        <h2 className="type-display-2 text-ink mt-1">{t('organizersTitle')}</h2>
                        <p className="type-meta text-ink-muted mt-1.5">
                            {isRTL
                                ? 'نُفذ هذا العمل كأحد مخرجات البرنامج القيادي المشترك بين الجهتين لتمكين القيادات الرقمية الوطنية.'
                                : 'Conducted as part of the strategic leadership executive programme co-organised by both institutions.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROGRAM_PARTNERS.map((partner) => (
                            <div
                                key={partner.key}
                                className="rounded-[10px] border border-rule bg-surface p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-mono font-bold text-lg text-accent">
                                                {partner.acronym}
                                            </span>
                                            <span className="h-1.5 w-1.5 rounded-full bg-rule-strong" />
                                            <span className="type-label font-bold text-ink">
                                                {isRTL ? partner.nameAr : partner.nameEn}
                                            </span>
                                        </div>
                                        <span className="chip border border-rule bg-surface-sunk text-[10px] text-ink-faint">
                                            {isRTL ? partner.badgeAr : partner.badgeEn}
                                        </span>
                                    </div>
                                    <p className="type-disclosure text-ink-muted leading-relaxed">
                                        {isRTL ? partner.descAr : partner.descEn}
                                    </p>
                                </div>

                                <div className="mt-5 pt-3 border-t border-rule/50">
                                    <a
                                        href={partner.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="type-disclosure inline-flex items-center gap-1 text-accent hover:underline font-medium"
                                    >
                                        <span>
                                            {isRTL
                                                ? `زيارة موقع ${partner.acronym}`
                                                : `Visit ${partner.acronym} portal`}
                                        </span>
                                        <span className="text-xs">{isRTL ? '←' : '→'}</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Navigation CTA */}
                <div className="mt-16 rounded-[10px] border border-accent/40 bg-accent-sunk/20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="type-display-3 text-ink">
                            {isRTL
                                ? 'استكشف أساليب العمل المفهرسة في المنصة'
                                : 'Explore catalogued methods across Al-Maktaba'}
                        </h3>
                        <p className="type-meta text-ink-muted mt-1 max-w-[600px]">
                            {isRTL
                                ? 'تصفح أساليب العمل الموثقة بحسب القطاع وعائلة الأدوار مع قياس الساعات المستعادة.'
                                : 'Browse verified operational methods catalogued by sector and role family with empirical time savings.'}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <Link href="/library" className="btn btn-primary">
                            {t('navBrowse')}
                        </Link>
                        <Link href="/insights" className="btn btn-secondary">
                            {t('navInsights')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
