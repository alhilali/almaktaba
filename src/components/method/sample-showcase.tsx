'use client';

import { useState } from 'react';
import type { IMethod } from '@/data/types';
import { getSampleInput, getSampleOutput } from '@/data/samples';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export function SampleShowcase({ method }: { method: IMethod }): React.ReactElement {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const inputSample = getSampleInput(method);
    const outputSample = getSampleOutput(method);

    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
    const [copied, setCopied] = useState<'input' | 'output' | null>(null);

    async function handleCopy(type: 'input' | 'output'): Promise<void> {
        const text = type === 'input' ? inputSample.content : outputSample.content;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            window.setTimeout(() => setCopied(null), 2000);
        } catch {
            setCopied(null);
        }
    }

    const isInputArabic = /[\u0600-\u06FF]/.test(inputSample.content);
    const isOutputArabic = /[\u0600-\u06FF]/.test(outputSample.content);

    return (
        <div className="rounded-[8px] border border-rule bg-surface overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-rule bg-surface-sunk/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('input')}
                        className={cn(
                            'rounded-[4px] px-3 py-1.5 type-meta font-medium transition-colors',
                            activeTab === 'input'
                                ? 'bg-surface text-ink font-semibold shadow-xs border border-rule'
                                : 'text-ink-muted hover:text-ink',
                        )}
                    >
                        <span className="me-1.5 inline-block h-2 w-2 rounded-full bg-measure" />
                        {isAr ? 'المدخلات النموذجية' : 'Sample Input'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('output')}
                        className={cn(
                            'rounded-[4px] px-3 py-1.5 type-meta font-medium transition-colors',
                            activeTab === 'output'
                                ? 'bg-surface text-ink font-semibold shadow-xs border border-rule'
                                : 'text-ink-muted hover:text-ink',
                        )}
                    >
                        <span className="me-1.5 inline-block h-2 w-2 rounded-full bg-accent" />
                        {isAr ? 'المخرجات المعتمدة' : 'Sample Output'}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="chip border border-rule bg-paper text-ink-faint text-[11px] font-mono">
                        {activeTab === 'input' ? inputSample.format : outputSample.format}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleCopy(activeTab)}
                        className="type-disclosure font-medium text-accent hover:underline flex items-center gap-1"
                    >
                        {copied === activeTab ? (
                            <span className="text-accent font-semibold">{isAr ? 'تم النسخ ✓' : 'Copied ✓'}</span>
                        ) : (
                            <span>{isAr ? 'نسخ المثال' : 'Copy sample'}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Document Details Strip */}
            <div className="flex items-center justify-between border-b border-rule/60 bg-surface px-4 py-2 type-disclosure text-ink-faint">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-ink-muted">
                        📄 {activeTab === 'input' ? inputSample.filename || 'input-file.txt' : outputSample.filename || 'generated-output.md'}
                    </span>
                </div>
                <div>
                    {activeTab === 'input' ? (
                        <span>{isAr ? 'مستند الإدخال المرفوع للمهمة' : 'Source uploaded document payload'}</span>
                    ) : (
                        <span>{isAr ? 'المخرج المولد والمفحوص' : 'Model output post-verification'}</span>
                    )}
                </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 bg-paper/60 overflow-x-auto max-h-[460px] overflow-y-auto">
                {activeTab === 'input' ? (
                    <pre
                        dir={isInputArabic ? 'rtl' : 'ltr'}
                        lang={isInputArabic ? 'ar' : 'en'}
                        className={cn(
                            'type-body text-ink whitespace-pre-wrap leading-relaxed select-text',
                            isInputArabic ? 'font-arabic' : 'font-sans',
                        )}
                    >
                        {inputSample.content}
                    </pre>
                ) : (
                    <pre
                        dir={isOutputArabic ? 'rtl' : 'ltr'}
                        lang={isOutputArabic ? 'ar' : 'en'}
                        className={cn(
                            'type-body text-ink whitespace-pre-wrap leading-relaxed select-text',
                            isOutputArabic ? 'font-arabic' : 'font-sans',
                        )}
                    >
                        {outputSample.content}
                    </pre>
                )}
            </div>

            {/* Bottom Footer Note */}
            <div className="border-t border-rule bg-surface p-3 type-disclosure text-ink-faint flex items-center justify-between">
                <span>
                    {isAr
                        ? 'مثال واقعي مطابق لمتطلبات التشغيل. يمكنك تنزيله أو نسخه لاختبار الأسلوب في بيئة عملك.'
                        : 'Realistic sample matching the method specification. Copy or upload to execute in your environment.'}
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                    {isAr
                        ? activeTab === 'input'
                            ? 'مستند إدخال'
                            : 'مخرج معتمد'
                        : activeTab === 'input'
                          ? 'INPUT PAYLOAD'
                          : 'VERIFIED OUTPUT'}
                </span>
            </div>
        </div>
    );
}
