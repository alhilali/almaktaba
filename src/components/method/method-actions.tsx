'use client';

import { useState } from 'react';

import type { IMethod } from '@/data/types';
import { useLanguage } from '@/context/language-context';

/**
 * The three method actions. Every one resolves to something real — no dead
 * links. Run reveals the method body with a copy control; Export hits the
 * download route; Suggest opens an inline form that acknowledges locally.
 */
export function MethodActions({ method }: { method: IMethod }): React.ReactElement {
    const { t, isRTL } = useLanguage();
    const [isRunOpen, setIsRunOpen] = useState(false);
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const isConfidential = method.sensitivity === 'Confidential';

    async function copyBody(): Promise<void> {
        try {
            await navigator.clipboard.writeText(method.methodBody);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    return (
        <div id="run" className="scroll-mt-20">
            <div className="flex flex-wrap gap-2.5">
                <button
                    type="button"
                    onClick={() => setIsRunOpen((open) => !open)}
                    className="btn btn-primary"
                >
                    {t('runMethod')}
                </button>
                <a href={`/api/export/${method.id}`} className="btn btn-secondary">
                    {t('exportMethod')}
                </a>
                <button
                    type="button"
                    onClick={() => setIsSuggestOpen((open) => !open)}
                    className="btn btn-secondary"
                >
                    {t('suggestImprovement')}
                </button>
            </div>

            {isRunOpen && (
                <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                    {isConfidential && (
                        <p className="type-meta mb-3 rounded-[4px] border border-rule-strong bg-surface-sunk px-3 py-2 text-ink">
                            {isRTL ? (
                                <>
                                    هذا الأسلوب مصنف بدرجة <strong>سري</strong>. يُرجى تشغيله داخل
                                    البيئة المعتمدة لمنظمتك، واستخدام ميزة التصدير بدلاً من لصق
                                    البيانات في خدمات خارجية.
                                </>
                            ) : (
                                <>
                                    This method is marked <strong>Confidential</strong>. Run it
                                    inside your organisation&rsquo;s approved AI environment. Export
                                    the file rather than pasting sensitive inputs into external tools.
                                </>
                            )}
                        </p>
                    )}
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="type-label font-bold text-ink">
                            {isRTL ? 'نص الأسلوب والموجهات:' : 'The method:'}
                        </h3>
                        <button
                            type="button"
                            onClick={copyBody}
                            className="type-meta font-medium text-accent hover:underline"
                        >
                            {copied ? (isRTL ? 'تم النسخ ✓' : 'Copied ✓') : isRTL ? 'نسخ النص' : 'Copy'}
                        </button>
                    </div>
                    <pre className="type-meta whitespace-pre-wrap rounded-[4px] bg-paper p-4 font-sans text-ink-muted leading-relaxed">
                        {method.methodBody}
                    </pre>
                </div>
            )}

            {isSuggestOpen && (
                <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                    {submitted ? (
                        <p className="type-meta text-ink font-medium">
                            {isRTL
                                ? 'شكراً لك — تم تسجيل اقتراحك بنجاح. التحسينات في المنصة تُنشئ إصداراً جديداً وتنسب الفضل للمؤلف دائماً.'
                                : 'Thanks — your suggestion is noted. In the demo this is recorded locally; improvements create a new version and credit the original author.'}
                        </p>
                    ) : (
                        <>
                            <h3 className="type-label mb-1.5 font-bold text-ink">
                                {isRTL ? 'اقتراح تحسين على الأسلوب' : 'Suggest an improvement'}
                            </h3>
                            <p className="type-meta mb-3 text-ink-muted">
                                {isRTL
                                    ? 'تُنشئ التحسينات إصداراً لاحقاً دون حذف النسخة السابقة، مع حفظ حق صاحب الفكرة الأصلي.'
                                    : 'Improvements create a new version without overwriting prior work. The original author is always credited.'}
                            </p>
                            <textarea
                                value={suggestion}
                                onChange={(event) => setSuggestion(event.target.value)}
                                rows={4}
                                placeholder={
                                    isRTL
                                        ? 'ما هي التعديلات التي تقترحها، وما سبب التحسين؟'
                                        : 'What would you change, and why?'
                                }
                                className="w-full rounded-[4px] border border-rule bg-surface p-3 type-meta text-ink placeholder:text-ink-faint focus:border-accent"
                            />
                            <button
                                type="button"
                                disabled={suggestion.trim().length === 0}
                                onClick={() => setSubmitted(true)}
                                className="btn btn-primary btn-sm mt-3 disabled:opacity-40"
                            >
                                {isRTL ? 'إرسال الاقتراح' : 'Submit suggestion'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
