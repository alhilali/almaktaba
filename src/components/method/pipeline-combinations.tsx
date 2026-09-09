'use client';

import Link from 'next/link';
import type { IMethod } from '@/data/types';
import { getMethod } from '@/data/methods';
import { getPipelineCombinations } from '@/data/samples';
import { getAgentsForMethod } from '@/data/agents';
import { useLanguage } from '@/context/language-context';
import { PipelineDiagram, type IDiagramStep } from '@/components/pipeline-diagram';
import { cn } from '@/lib/utils';

export function PipelineCombinations({ method }: { method: IMethod }): React.ReactElement {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const pipelines = getPipelineCombinations(method);

    const precedes = pipelines.filter((p) => p.relationship === 'precedes');
    const follows = pipelines.filter((p) => p.relationship === 'follows');
    const complements = pipelines.filter((p) => p.relationship === 'complements');

    // Build the chain: upstream → this method → downstream.
    const steps: IDiagramStep[] = [
        ...precedes.map((p) => ({ methodId: p.methodId, note: p.role, noteAr: p.roleAr })),
        {
            methodId: method.id,
            note: method.whatItDoes,
            noteAr: isAr ? 'الخطوة الحالية في السلسلة.' : 'The current step in the chain.',
            isCurrent: true,
        },
        ...follows.map((p) => ({ methodId: p.methodId, note: p.role, noteAr: p.roleAr })),
    ];

    const agentIds = getAgentsForMethod(method).map((agent) => agent.id);

    return (
        <div className="space-y-4">
            <p className="type-meta text-ink-muted leading-relaxed">
                {isAr
                    ? 'لا تعمل أساليب الذكاء الاصطناعي الناجحة في معزل. توضح السلسلة أدناه كيف يتصل هذا الأسلوب بأساليب أخرى في المكتبة ليكوّنا خط إنتاج رقمياً متكاملاً من طرف إلى طرف، مع بوابات جودة مشتركة تفحص كل خطوة.'
                    : 'High-impact methods compose rather than operate in silos. The chain below shows how this method connects to others in the library to form one end-to-end agentic pipeline — with shared quality gates checking every step.'}
            </p>

            <PipelineDiagram steps={steps} agentIds={agentIds} />

            {complements.length > 0 && (
                <div>
                    <h4 className="type-label font-bold text-ink mb-2">
                        {isAr ? 'أساليب مرافقة (تعمل بالتوازي)' : 'Companion methods (run in parallel)'}
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {complements.map((comb) => {
                            const linked = getMethod(comb.methodId);
                            if (!linked) return null;
                            const linkedAr =
                                linked.language === 'Arabic' ||
                                linked.titleLang === 'ar' ||
                                /[؀-ۿ]/.test(linked.title);
                            return (
                                <Link
                                    key={comb.methodId}
                                    href={`/library/${linked.id}`}
                                    className="tap-card rounded-[6px] border border-rule bg-surface p-3"
                                >
                                    <span
                                        dir={linkedAr ? 'rtl' : 'ltr'}
                                        lang={linkedAr ? 'ar' : 'en'}
                                        className={cn(
                                            'type-label font-bold text-ink hover:text-accent block',
                                            linkedAr && 'font-arabic',
                                        )}
                                    >
                                        {linked.title}
                                    </span>
                                    <span className="type-disclosure text-ink-muted mt-1 block leading-relaxed">
                                        {isAr ? comb.roleAr : comb.role}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="rounded-[6px] border border-rule bg-surface-sunk/40 p-3 flex items-center justify-between gap-3">
                <p className="type-meta text-ink-muted">
                    {isAr
                        ? 'اطّلع على أمثلة كاملة لخطوط الإنتاج الرقمية من طرف إلى طرف.'
                        : 'See full, worked examples of end-to-end pipelines.'}
                </p>
                <Link href="/#pipelines" className="btn btn-secondary btn-sm shrink-0">
                    {isAr ? 'أمثلة خطوط الإنتاج ←' : 'Pipeline examples →'}
                </Link>
            </div>
        </div>
    );
}
