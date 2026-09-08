'use client';

import Link from 'next/link';
import type { IMethod } from '@/data/types';
import { getMethod } from '@/data/methods';
import { getPipelineCombinations } from '@/data/samples';
import { useLanguage } from '@/context/language-context';

export function PipelineCombinations({ method }: { method: IMethod }): React.ReactElement {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const pipelines = getPipelineCombinations(method);

    return (
        <div className="space-y-4">
            <p className="type-meta text-ink-muted leading-relaxed">
                {isAr
                    ? 'لا تعمل أساليب الذكاء الاصطناعي الناجحة في معزل. توضح السلسلة أدناه كيفية ربط هذا الأسلوب بأساليب أخرى في المكتبة لبناء خط إنتاج رقمي متكامل (Multi-Agent Pipeline).'
                    : 'High-impact AI work methods operate in composite pipelines rather than silos. The workflow chains below illustrate how to connect this method with other library assets for end-to-end task execution.'}
            </p>

            <div className="space-y-3">
                {pipelines.map((comb) => {
                    const linked = getMethod(comb.methodId);
                    if (!linked) return null;

                    const isLinkedAr =
                        linked.language === 'Arabic' ||
                        linked.titleLang === 'ar' ||
                        /[\u0600-\u06FF]/.test(linked.title);

                    const relationshipLabel =
                        comb.relationship === 'precedes'
                            ? isAr ? 'خطوة سابقة مُمهدة (Input Provider)' : 'Upstream Step (Input Source)'
                            : comb.relationship === 'follows'
                              ? isAr ? 'خطوة لاحقة مكملة (Downstream Consumer)' : 'Downstream Step (Next Action)'
                              : isAr ? 'أسلوب تكاملي مرافق (Parallel Companion)' : 'Companion Method';

                    return (
                        <div
                            key={comb.methodId}
                            className="rounded-[8px] border border-rule bg-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-rule-strong transition-colors"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="chip border border-rule bg-surface-sunk text-ink-muted text-[11px] font-semibold">
                                        🔗 {relationshipLabel}
                                    </span>
                                </div>

                                <Link
                                    href={`/library/${linked.id}`}
                                    className="type-label font-bold text-ink hover:text-accent hover:underline block"
                                >
                                    <span
                                        dir={isLinkedAr ? 'rtl' : 'ltr'}
                                        lang={isLinkedAr ? 'ar' : 'en'}
                                        className={isLinkedAr ? 'font-arabic' : 'font-sans'}
                                    >
                                        {linked.title}
                                    </span>
                                </Link>

                                <p className="type-meta text-ink-muted mt-1 leading-relaxed">
                                    {isAr ? comb.roleAr : comb.role}
                                </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                                <Link
                                    href={`/library/${linked.id}`}
                                    className="btn btn-secondary btn-sm"
                                >
                                    {isAr ? 'عرض الأسلوب المكمل ←' : 'Inspect method →'}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
