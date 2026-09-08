'use client';

import Link from 'next/link';

import type { IMethod } from '@/data/types';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { maturityOf } from '@/data/derive';
import { formatMinutes } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import {
    MethodTitle,
    MethodDescription,
    ReuseCount,
    RatingLine,
} from '@/components/method-bits';
import { LanguageChip, SensitivityChip, MaturityChip } from '@/components/chips';
import { IllustrativeChip } from '@/components/illustrative-chip';

function Stat({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <div>
            <div className="type-disclosure text-ink-faint">{label}</div>
            <div className="type-body mt-0.5 font-medium text-ink">{children}</div>
        </div>
    );
}

/**
 * Slide-over / inspector preview panel.
 * Only activated when a method is selected, freeing up screen real-estate.
 */
export function MethodPreviewPanel({
    method,
    onClose,
}: {
    method: IMethod;
    onClose: () => void;
}): React.ReactElement {
    const { isRTL } = useLanguage();
    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);

    const sectorName = isRTL ? sector?.nameAr || sector?.name : sector?.name;
    const roleName = isRTL ? role?.nameAr || role?.name : role?.name;

    return (
        <div className="flex h-full flex-col bg-surface shadow-2xl lg:shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-rule p-5 sm:p-6 bg-surface-sunk/30">
                <div className="min-w-0 flex-1">
                    <div className="type-meta mb-1.5 flex items-center gap-2 text-ink-faint">
                        <span
                            aria-hidden
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sector?.color }}
                        />
                        <span className="font-medium text-ink-muted">{sectorName}</span>
                        <span>·</span>
                        <span>{roleName}</span>
                    </div>
                    <MethodTitle
                        method={method}
                        className="type-display-3 block text-ink leading-snug"
                    />
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={isRTL ? 'إغلاق المعاينة' : 'Close preview'}
                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-rule bg-surface text-ink-muted transition-colors hover:bg-surface-sunk hover:text-ink"
                >
                    ✕
                </button>
            </div>

            {/* Scrollable details body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
                <div>
                    <MethodDescription
                        method={method}
                        className="type-body text-ink-muted leading-relaxed"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <LanguageChip language={method.language} />
                    <SensitivityChip sensitivity={method.sensitivity} />
                    <MaturityChip maturity={maturityOf(method)} />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 rounded-[6px] border border-rule bg-surface-sunk/40 p-4">
                    <Stat label={isRTL ? 'مرات الاستخدام' : 'Reuses'}>
                        <ReuseCount count={method.reuseCount} className="text-xl" />
                    </Stat>
                    <Stat label={isRTL ? 'التقييم' : 'Rating'}>
                        <RatingLine method={method} className="type-body" />
                    </Stat>
                    <Stat label={isRTL ? 'الوقت قبل' : 'Typical time before'}>
                        {formatMinutes(method.timeBeforeMin)}
                    </Stat>
                    <Stat label={isRTL ? 'الوقت بعد' : 'Typical time after'}>
                        <span className="text-measure font-semibold">
                            {formatMinutes(method.timeAfterMin)}
                        </span>
                    </Stat>
                </div>

                {/* What stays human */}
                <div>
                    <div className="type-label font-semibold text-ink mb-1">
                        {isRTL ? 'ما يبقى بيد الإنسان' : 'What stays human'}
                    </div>
                    <p className="type-meta text-ink-muted leading-relaxed">
                        {method.whatStaysHuman}
                    </p>
                </div>

                {/* Inputs required */}
                <div>
                    <div className="type-label font-semibold text-ink mb-1.5">
                        {isRTL ? 'المدخلات المطلوبة' : 'Inputs required'}
                    </div>
                    <ul className="space-y-1.5">
                        {method.inputsRequired.map((input, idx) => (
                            <li key={idx} className="type-meta flex items-start gap-2 text-ink-muted">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                <span>{input}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Provenance Block */}
                <div className="rounded-[6px] border border-rule bg-surface-sunk/30 p-4">
                    <div className="type-disclosure mb-2 flex items-center justify-between text-ink-faint">
                        <span>{isRTL ? 'توثيق النموذج والمصدر' : 'Provenance'}</span>
                        <IllustrativeChip />
                    </div>
                    <p className="type-meta text-ink-muted">
                        <span className="font-semibold text-ink">
                            {isRTL ? 'بُني واختُبر على:' : 'Built and tested on:'}
                        </span>{' '}
                        {method.provenance.builtOn}
                        <br />
                        <span className="font-semibold text-ink">
                            {isRTL ? 'أفاد المستخدمون بنجاحه على:' : 'Also reported working:'}
                        </span>{' '}
                        {method.provenance.alsoReported.join(', ')}
                    </p>
                    <p className="type-disclosure mt-2 text-ink-faint">
                        {isRTL
                            ? 'معلومات مقدمة من المؤلف والمستخدمين. لا تعد مقارنة معيارية.'
                            : 'Reported by author and reusers. Not a benchmark.'}
                    </p>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-col gap-2.5 border-t border-rule bg-surface p-5 sm:p-6">
                <Link href={`/library/${method.id}`} className="btn btn-primary w-full">
                    {isRTL ? 'فتح صفحة الأسلوب كاملة ←' : 'Open full method page →'}
                </Link>
                <div className="grid grid-cols-2 gap-2.5">
                    <Link
                        href={`/library/${method.id}#run`}
                        className="btn btn-secondary btn-sm w-full"
                    >
                        {isRTL ? 'تشغيل الأسلوب' : 'Run this method'}
                    </Link>
                    <a
                        href={`/api/export/${method.id}`}
                        className="btn btn-secondary btn-sm w-full"
                    >
                        {isRTL ? 'تصدير الملف' : 'Export (.md)'}
                    </a>
                </div>
            </div>
        </div>
    );
}
