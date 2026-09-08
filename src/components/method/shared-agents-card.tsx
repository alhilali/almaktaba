'use client';

import type { IMethod } from '@/data/types';
import { getAgentsForMethod } from '@/data/agents';
import { useLanguage } from '@/context/language-context';

export function SharedAgentsCard({ method }: { method: IMethod }): React.ReactElement {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const agents = getAgentsForMethod(method);

    return (
        <div className="space-y-4">
            <div className="rounded-[8px] border border-accent/40 bg-accent-sunk/30 p-4">
                <div className="flex items-start gap-3">
                    <span className="text-xl">🤖</span>
                    <div>
                        <h3 className="type-label font-bold text-accent">
                            {isAr
                                ? 'هندسة الوكلاء المشتركين (Shared Agentic Subagents)'
                                : 'Shared Agentic Architecture'}
                        </h3>
                        <p className="type-meta text-ink-muted mt-1 leading-relaxed">
                            {isAr
                                ? 'بدلاً من حشو الأوامر والتعليمات (Prompts) بقوائم التحقق اللغوي والأمني، توظف المكتبة وكلاء فرعيين متخصصين لمعالجة الاهتمامات المشتركة كبوابات جودة مستقلة.'
                                : 'Rather than overloading prompt templates with monolithic instructions, Al-Maktaba decouples shared concerns (verification, Arabic formal register, NDMO privacy redaction) into reusable quality-gate subagents.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {agents.map((agent, index) => (
                    <div
                        key={agent.id}
                        className="rounded-[8px] border border-rule bg-surface p-4 flex flex-col justify-between hover:border-rule-strong transition-colors"
                    >
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="chip border border-rule bg-surface-sunk text-accent font-semibold text-[11px]">
                                    {isAr ? agent.badgeAr : agent.badge}
                                </span>
                                <span className="type-disclosure font-mono text-ink-faint">
                                    Gate 0{index + 1}
                                </span>
                            </div>

                            <h4 className="type-label font-bold text-ink">
                                {isAr ? agent.nameAr : agent.name}
                            </h4>
                            <p className="type-disclosure font-medium text-ink-muted mt-0.5">
                                {isAr ? agent.roleAr : agent.role}
                            </p>

                            <p className="type-meta text-ink-muted mt-2 leading-relaxed">
                                {isAr ? agent.descriptionAr : agent.description}
                            </p>
                        </div>

                        <div className="mt-4 border-t border-rule/60 pt-3">
                            <span className="type-disclosure text-ink-faint block mb-1.5">
                                {isAr ? 'الأدوات البرمجية المستدعاة (Tools):' : 'Agent Invoked Tools:'}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {(isAr && agent.toolsAr ? agent.toolsAr : agent.tools).map((tool) => (
                                    <span
                                        key={tool}
                                        className="chip bg-surface-sunk text-ink-muted text-[11px] font-mono border border-rule/50"
                                    >
                                        ⚙ {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
