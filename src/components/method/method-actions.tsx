'use client';

import { useState } from 'react';
import type { IMethod } from '@/data/types';
import { useLanguage } from '@/context/language-context';
import { getSampleInput, getUploadGuide, getCliExecution } from '@/data/samples';
import { getAgentsForMethod } from '@/data/agents';
import { cn } from '@/lib/utils';

export function MethodActions({ method }: { method: IMethod }): React.ReactElement {
    const { lang, isRTL } = useLanguage();
    const isAr = lang === 'ar';

    const [isRunOpen, setIsRunOpen] = useState(false);
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const [runTab, setRunTab] = useState<'upload' | 'cli' | 'api'>('upload');

    // Runner state
    const sampleInput = getSampleInput(method);
    const uploadGuide = getUploadGuide(method);
    const cliExecution = getCliExecution(method);
    const agents = getAgentsForMethod(method);

    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionCompleted, setExecutionCompleted] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedCli, setCopiedCli] = useState(false);

    // Suggestion state
    const [suggestion, setSuggestion] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const isConfidential = method.sensitivity === 'Confidential';

    async function copyPrompt(): Promise<void> {
        try {
            await navigator.clipboard.writeText(method.methodBody);
            setCopiedPrompt(true);
            window.setTimeout(() => setCopiedPrompt(false), 2000);
        } catch {
            setCopiedPrompt(false);
        }
    }

    async function copyCli(): Promise<void> {
        try {
            await navigator.clipboard.writeText(cliExecution.command);
            setCopiedCli(true);
            window.setTimeout(() => setCopiedCli(false), 2000);
        } catch {
            setCopiedCli(false);
        }
    }

    function handleSimulatedRun(): void {
        setIsExecuting(true);
        window.setTimeout(() => {
            setIsExecuting(false);
            setExecutionCompleted(true);
        }, 1200);
    }

    return (
        <div id="run" className="scroll-mt-20">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
                <button
                    type="button"
                    onClick={() => {
                        setIsRunOpen((open) => !open);
                        setIsSuggestOpen(false);
                    }}
                    className={cn(
                        'btn font-semibold',
                        isRunOpen ? 'btn-primary ring-2 ring-accent/30' : 'btn-primary',
                    )}
                >
                    ⚡ {isAr ? 'تشغيل هذا الأسلوب (Run & Execute)' : 'Run this method (Upload & CLI)'}
                </button>
                <a href={`/api/export/${method.id}`} className="btn btn-secondary">
                    📥 {isAr ? 'تصدير للاستخدام الداخلي' : 'Export for internal use'}
                </a>
                <button
                    type="button"
                    onClick={() => {
                        setIsSuggestOpen((open) => !open);
                        setIsRunOpen(false);
                    }}
                    className="btn btn-secondary"
                >
                    💡 {isAr ? 'اقتراح تحسين' : 'Suggest an improvement'}
                </button>
            </div>

            {/* Run Method Drawer / Panel */}
            {isRunOpen && (
                <div className="mt-5 rounded-[8px] border-2 border-accent bg-surface p-6 shadow-sm">
                    {/* Confidential Warning */}
                    {isConfidential && (
                        <div className="type-meta mb-4 rounded-[6px] border border-measure/50 bg-measure-sunk/30 px-3.5 py-2.5 text-ink flex items-start gap-2">
                            <span className="text-measure font-bold">⚠️</span>
                            <div>
                                <span className="font-bold text-ink">
                                    {isAr ? 'أسلوب مصنف بدرجة سري (Confidential):' : 'Confidential Sensitivity Notice:'}
                                </span>{' '}
                                {isAr
                                    ? 'يجب تشغيل هذا الأسلوب داخل البيئة المحلية المعتمدة لمنظمتك أو عبر سطر أوامر AGY الداخلي دون إرسال البيانات لنماذج سحابية خارجية.'
                                    : 'Run this method inside your approved internal enterprise infrastructure or via local AGY CLI. Do not paste classified inputs into external web tools.'}
                            </div>
                        </div>
                    )}

                    {/* Mode Navigation Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3 mb-5">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setRunTab('upload')}
                                className={cn(
                                    'px-3 py-1.5 rounded-[4px] type-meta font-medium transition-colors',
                                    runTab === 'upload'
                                        ? 'bg-accent text-white font-semibold'
                                        : 'bg-surface-sunk text-ink-muted hover:text-ink',
                                )}
                            >
                                📤 {isAr ? 'رفع ملف وتشغيل تفاعلي (Upload & Run)' : 'Upload & Interactive Run'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRunTab('cli')}
                                className={cn(
                                    'px-3 py-1.5 rounded-[4px] type-meta font-medium transition-colors',
                                    runTab === 'cli'
                                        ? 'bg-accent text-white font-semibold'
                                        : 'bg-surface-sunk text-ink-muted hover:text-ink',
                                )}
                            >
                                💻 {isAr ? 'أمر التشغيل (CLI Command)' : 'CLI Terminal Command'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRunTab('api')}
                                className={cn(
                                    'px-3 py-1.5 rounded-[4px] type-meta font-medium transition-colors',
                                    runTab === 'api'
                                        ? 'bg-accent text-white font-semibold'
                                        : 'bg-surface-sunk text-ink-muted hover:text-ink',
                                )}
                            >
                                🔌 {isAr ? 'استدعاء برمجياً (API / Script)' : 'API / Integration'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsRunOpen(false)}
                            className="type-disclosure text-ink-faint hover:text-ink"
                        >
                            {isAr ? 'إغلاق ✕' : 'Close ✕'}
                        </button>
                    </div>

                    {/* TAB 1: Upload & Interactive Workbench */}
                    {runTab === 'upload' && (
                        <div className="space-y-5">
                            {/* Step 1: Upload Input */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <h4 className="type-label font-bold text-ink flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">1</span>
                                        {isAr ? 'إرفاق ملف المدخلات (Upload Source File)' : 'Step 1: Upload Input File'}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => setUploadedFile(sampleInput.filename || 'sample-input.docx')}
                                        className="type-disclosure font-medium text-accent hover:underline"
                                    >
                                        {isAr ? '📥 تحميل النموذج التجريبي الجاهز' : '📥 Load sample input file'}
                                    </button>
                                </div>
                                <p className="type-meta text-ink-muted mb-3">
                                    {isAr ? uploadGuide.labelAr : uploadGuide.label}
                                </p>

                                {/* Dropzone Simulation */}
                                <div
                                    onClick={() => setUploadedFile(sampleInput.filename || 'sample-input.docx')}
                                    className={cn(
                                        'cursor-pointer rounded-[6px] border-2 border-dashed p-4 text-center transition-colors',
                                        uploadedFile
                                            ? 'border-accent bg-accent-sunk/30'
                                            : 'border-rule hover:border-accent hover:bg-surface-sunk/50',
                                    )}
                                >
                                    {uploadedFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-xl">📄</span>
                                            <div className="text-start">
                                                <p className="type-meta font-semibold text-ink">
                                                    {uploadedFile}
                                                </p>
                                                <p className="type-disclosure text-accent font-medium">
                                                    {isAr ? 'تم إرفاق الملف بنجاح ✓ (جاهز للتمرير للوكلاء)' : 'File attached & verified for ingestion ✓'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUploadedFile(null);
                                                    setExecutionCompleted(false);
                                                }}
                                                className="type-disclosure text-ink-faint hover:text-ink ms-4"
                                            >
                                                {isAr ? 'إزالة' : 'Remove'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <span className="text-2xl block mb-1">📂</span>
                                            <p className="type-meta font-medium text-ink">
                                                {isAr
                                                    ? 'انقر هنا لإرفاق ملف المدخلات أو اسحب الملف وأفلته'
                                                    : 'Click to upload source document or drag and drop'}
                                            </p>
                                            <p className="type-disclosure text-ink-faint mt-1">
                                                {uploadGuide.allowedFormats.join(', ')} · Max 25 MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: System Prompt & Agentic Instructions */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <h4 className="type-label font-bold text-ink flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">2</span>
                                        {isAr ? 'تعليمات الأسلوب والموجهات (System Instructions)' : 'Step 2: Method System Instructions'}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={copyPrompt}
                                        className="type-disclosure font-medium text-accent hover:underline"
                                    >
                                        {copiedPrompt ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : isAr ? 'نسخ التعليمات' : 'Copy prompt'}
                                    </button>
                                </div>
                                <pre className="type-meta whitespace-pre-wrap rounded-[4px] bg-paper p-3 font-sans text-ink-muted leading-relaxed max-h-36 overflow-y-auto border border-rule">
                                    {method.methodBody}
                                </pre>
                            </div>

                            {/* Step 3: Run & Verification */}
                            <div className="border-t border-rule pt-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="type-disclosure text-ink-faint">
                                            {isAr ? 'بوابات فحص الجودة المفعّلة:' : 'Active Quality Gates:'}
                                        </span>
                                        {agents.map((agent) => (
                                            <span
                                                key={agent.id}
                                                className="chip border border-rule bg-surface-sunk text-accent text-[10px] font-semibold"
                                            >
                                                ✓ {isAr ? agent.badgeAr : agent.badge}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!uploadedFile || isExecuting}
                                        onClick={handleSimulatedRun}
                                        className="btn btn-primary disabled:opacity-40"
                                    >
                                        {isExecuting
                                            ? isAr ? 'جارٍ التشغيل وفحص المخرجات…' : 'Running & validating…'
                                            : isAr ? 'إطلاق تشغيل الأسلوب' : 'Execute workflow'}
                                    </button>
                                </div>

                                {/* Execution Result Box */}
                                {executionCompleted && (
                                    <div className="mt-4 rounded-[6px] border border-accent bg-accent-sunk/20 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="type-label font-bold text-accent">
                                                {isAr ? '✓ اكتمل التشغيل واجتاز بوابات التدقيق بنجاح' : '✓ Execution Complete & Verified'}
                                            </span>
                                            <span className="type-disclosure font-mono text-ink-muted">
                                                {method.timeAfterMin} {isAr ? 'دقيقة مستغرقة' : 'min duration'}
                                            </span>
                                        </div>
                                        <p className="type-meta text-ink-muted leading-relaxed">
                                            {isAr
                                                ? 'تمت مطابقة المسودة بواسطة وكيل فحص الحقائق، والتأكد من توافق الصياغة مع المعايير المعتمدة. يمكنك الاطلاع على المخرج الكامل في قسم (أمثلة المدخلات والمخرجات) أدناه.'
                                                : 'Draft output generated from uploaded source facts and audited by Quality & Fact Auditor. Full verified output is available in the Sample Showcase section below.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CLI Command */}
                    {runTab === 'cli' && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="type-label font-bold text-ink mb-1">
                                    {isAr
                                        ? 'تشغيل الأسلوب عبر واجهة سطر الأوامر (Antigravity AGY CLI)'
                                        : 'Execute via Antigravity AGY Agent CLI'}
                                </h4>
                                <p className="type-meta text-ink-muted">
                                    {isAr ? cliExecution.notesAr : cliExecution.notes}
                                </p>
                            </div>

                            <div className="relative rounded-[6px] bg-paper p-4 font-mono text-xs border border-rule overflow-x-auto">
                                <button
                                    type="button"
                                    onClick={copyCli}
                                    className="absolute top-3 end-3 chip border border-rule bg-surface text-accent hover:border-accent"
                                >
                                    {copiedCli ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : isAr ? 'نسخ الأمر' : 'Copy command'}
                                </button>
                                <pre className="text-ink leading-relaxed whitespace-pre select-all">
                                    {cliExecution.command}
                                </pre>
                            </div>

                            <div className="rounded-[4px] border border-rule bg-surface-sunk p-3 type-disclosure text-ink-muted space-y-1">
                                <p>
                                    <strong className="text-ink font-semibold">--input:</strong>{' '}
                                    {isAr ? 'المسار إلى ملف المدخلات المرفوع (Word, PDF, TXT)' : 'Path to the input document payload'}
                                </p>
                                <p>
                                    <strong className="text-ink font-semibold">--agents:</strong>{' '}
                                    {isAr ? 'استدعاء وكلاء فحص الجودة والخصوصية المشتركين كبوابات مستقلة' : 'Attaches shared quality gates (Quality Auditor, Privacy Sentinel)'}
                                </p>
                                <p>
                                    <strong className="text-ink font-semibold">--output:</strong>{' '}
                                    {isAr ? 'حفظ المسودة المفحوصة في مستند المخرجات' : 'Target file where verified output is streamed'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: API Integration */}
                    {runTab === 'api' && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="type-label font-bold text-ink mb-1">
                                    {isAr
                                        ? 'استدعاء الأسلوب عبر واجهة برمجة التطبيقات (HTTP REST API)'
                                        : 'Invoke method via HTTP REST API'}
                                </h4>
                                <p className="type-meta text-ink-muted">
                                    {isAr
                                        ? 'يمكن لأي نظام داخلي (ERP, CRM, Archiving) رفع ملف الإدخال واستلام المخرج المفحوص مباشرة.'
                                        : 'Integrate directly into internal enterprise systems (ERP, CRM, Archiving) via multipart document upload.'}
                                </p>
                            </div>

                            <div className="rounded-[6px] bg-paper p-4 font-mono text-xs border border-rule overflow-x-auto">
                                <pre className="text-ink leading-relaxed whitespace-pre select-all">
{`curl -X POST https://api.almaktaba.internal/v1/workflows/${method.id}/run \\
  -H "Authorization: Bearer $ALMAKTABA_API_TOKEN" \\
  -F "input_file=@./${sampleInput.filename || 'input-file.docx'}" \\
  -F "quality_gates=quality-auditor,arabic-stylist" \\
  -F "output_format=docx"`}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Suggestion Inline Modal */}
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
