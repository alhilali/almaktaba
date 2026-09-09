'use client';

import Link from 'next/link';
import { getMethod } from '@/data/methods';
import { getSector } from '@/data/sectors';
import { getSharedAgent } from '@/data/agents';
import { formatMinutes, cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export interface IDiagramStep {
    methodId: string;
    note?: string;
    noteAr?: string;
    isCurrent?: boolean;
}

function isArabicMethod(id: string): boolean {
    const method = getMethod(id);
    if (!method) return false;
    return (
        method.language === 'Arabic' ||
        method.titleLang === 'ar' ||
        /[؀-ۿ]/.test(method.title)
    );
}

/**
 * A horizontal chain of method nodes connected by flow arrows, with a rail of
 * shared-agent quality gates beneath. Reused on the landing page and on each
 * method's detail view to make composability legible.
 */
export function PipelineDiagram({
    steps,
    agentIds,
    outcome,
    outcomeAr,
}: {
    steps: IDiagramStep[];
    agentIds: string[];
    outcome?: string;
    outcomeAr?: string;
}): React.ReactElement {
    const { lang, isRTL } = useLanguage();
    const isAr = lang === 'ar';
    const arrow = isRTL ? '←' : '→';

    return (
        <div className="rounded-[8px] border border-rule bg-surface p-4 sm:p-5">
            {/* Flow of method nodes */}
            <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
                {steps.map((step, index) => {
                    const method = getMethod(step.methodId);
                    if (!method) return null;
                    const sector = getSector(method.sectorId);
                    const stepAr = isArabicMethod(step.methodId);
                    const note = isAr ? step.noteAr ?? step.note : step.note ?? step.noteAr;

                    return (
                        <div key={`${step.methodId}-${index}`} className="flex items-stretch gap-2 lg:flex-1">
                            <Link
                                href={`/library/${method.id}`}
                                className={cn(
                                    'group flex-1 rounded-[6px] border p-3',
                                    step.isCurrent
                                        ? 'border-accent bg-accent-sunk/40'
                                        : 'border-rule bg-paper tap-card',
                                )}
                            >
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                                            step.isCurrent
                                                ? 'bg-accent text-white'
                                                : 'bg-surface-sunk text-ink-muted',
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                    <span
                                        aria-hidden
                                        className="h-2 w-2 shrink-0 rounded-full"
                                        style={{ backgroundColor: sector?.color }}
                                    />
                                    {step.isCurrent && (
                                        <span className="chip bg-accent text-white text-[10px] font-semibold">
                                            {isAr ? 'هذا الأسلوب' : 'This method'}
                                        </span>
                                    )}
                                </div>
                                <div
                                    dir={stepAr ? 'rtl' : 'ltr'}
                                    lang={stepAr ? 'ar' : 'en'}
                                    className={cn(
                                        'type-label font-bold text-ink group-hover:text-accent leading-snug',
                                        stepAr && 'font-arabic',
                                    )}
                                >
                                    {method.title}
                                </div>
                                {note && (
                                    <p className="type-disclosure text-ink-muted mt-1 leading-relaxed">
                                        {note}
                                    </p>
                                )}
                                <div className="mt-2 type-disclosure font-mono text-ink-faint">
                                    {formatMinutes(method.timeBeforeMin)} → {formatMinutes(method.timeAfterMin)}
                                </div>
                            </Link>

                            {index < steps.length - 1 && (
                                <div className="flex items-center justify-center text-accent">
                                    <span className="hidden text-lg font-bold lg:inline">{arrow}</span>
                                    <span className="lg:hidden text-lg font-bold">↓</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Shared agent gates rail */}
            {agentIds.length > 0 && (
                <div className="mt-4 rounded-[6px] border border-dashed border-accent/40 bg-accent-sunk/20 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="type-disclosure font-semibold text-accent shrink-0">
                            🤖 {isAr ? 'بوابات مشتركة تفحص كل خطوة:' : 'Shared gates across every step:'}
                        </span>
                        {agentIds.map((id) => {
                            const agent = getSharedAgent(id);
                            if (!agent) return null;
                            return (
                                <span
                                    key={id}
                                    className="chip border border-accent/30 bg-surface text-accent text-[11px] font-semibold"
                                    title={isAr ? agent.descriptionAr : agent.description}
                                >
                                    ✓ {isAr ? agent.nameAr : agent.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Outcome */}
            {(outcome || outcomeAr) && (
                <div className="mt-3 flex items-center gap-2 type-meta">
                    <span className="text-ink-faint">{isAr ? 'الأثر الإجمالي:' : 'End-to-end impact:'}</span>
                    <span className="font-semibold text-measure tabular-nums">
                        {isAr ? outcomeAr ?? outcome : outcome ?? outcomeAr}
                    </span>
                    <span className="type-disclosure text-ink-faint">
                        ({isAr ? 'توضيحي' : 'illustrative'})
                    </span>
                </div>
            )}
        </div>
    );
}
