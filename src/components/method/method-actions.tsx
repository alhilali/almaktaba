'use client';

import { useEffect, useMemo, useState } from 'react';
import type { IMethod } from '@/data/types';
import { useLanguage } from '@/context/language-context';
import { getSampleInput, getSampleOutput, getUploadGuide, getCliExecution } from '@/data/samples';
import { getAgentsForMethod } from '@/data/agents';
import { MODELS, defaultModelFor, type IModelOption } from '@/data/models';
import { cn } from '@/lib/utils';

interface ITranscriptLine {
    tone: 'cmd' | 'ok' | 'run' | 'done' | 'warn';
    text: string;
    textAr: string;
}

export function MethodActions({ method }: { method: IMethod }): React.ReactElement {
    const { lang, isRTL } = useLanguage();
    const isAr = lang === 'ar';

    const [isRunOpen, setIsRunOpen] = useState(false);
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const [runTab, setRunTab] = useState<'upload' | 'cli' | 'api'>('upload');

    // Runner state
    const sampleInput = getSampleInput(method);
    const uploadGuide = getUploadGuide(method);
    const outputSample = getSampleOutput(method);
    const agents = getAgentsForMethod(method);

    const [selectedModel, setSelectedModel] = useState<IModelOption>(() => defaultModelFor(method));
    const cliExecution = getCliExecution(method, selectedModel.slug);

    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [revealed, setRevealed] = useState(0);
    const [executionCompleted, setExecutionCompleted] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedCli, setCopiedCli] = useState(false);

    // Suggestion state
    const [suggestion, setSuggestion] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const isConfidential = method.sensitivity === 'Confidential';
    const inputFile = uploadedFile || sampleInput.filename || 'input.txt';
    const outName = `output-${method.id}.md`;
    const orgSlug = method.organisation.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);

    // Build the interactive CLI transcript for the selected model + inputs.
    const transcript = useMemo<ITranscriptLine[]>(() => {
        const lines: ITranscriptLine[] = [
            {
                tone: 'cmd',
                text: `$ maktaba run --method "${method.id}" --model "${selectedModel.slug}"`,
                textAr: `$ maktaba run --method "${method.id}" --model "${selectedModel.slug}"`,
            },
            {
                tone: 'run',
                text: `Al-Maktaba CLI v1.4 · workspace: ${orgSlug || 'demo'}`,
                textAr: `Al-Maktaba CLI v1.4 · مساحة العمل: ${orgSlug || 'demo'}`,
            },
            {
                tone: 'ok',
                text: `Loaded method "${method.id}" (${method.version})`,
                textAr: `تم تحميل الأسلوب "${method.id}" (${method.version})`,
            },
            {
                tone: 'ok',
                text: `Ingested ${inputFile} · ${method.inputsRequired.length} input fields detected`,
                textAr: `تمت قراءة ${inputFile} · رصد ${method.inputsRequired.length} حقول إدخال`,
            },
            {
                tone: 'run',
                text: `Invoking model → ${selectedModel.slug}${selectedModel.isLocal ? ' (on-prem · no external egress)' : ''}`,
                textAr: `استدعاء النموذج → ${selectedModel.slug}${selectedModel.isLocal ? ' (استضافة داخلية · بلا تصدير خارجي)' : ''}`,
            },
        ];
        agents.forEach((agent, index) => {
            lines.push({
                tone: 'ok',
                text: `Gate 0${index + 1} · ${agent.name} — passed`,
                textAr: `بوابة 0${index + 1} · ${agent.nameAr} — اجتازت`,
            });
        });
        lines.push({
            tone: 'done',
            text: `Verified output → ${outName} · ${method.timeAfterMin} min (was ${method.timeBeforeMin} min)`,
            textAr: `المخرج المعتمد ← ${outName} · ${method.timeAfterMin} دقيقة (بدلاً من ${method.timeBeforeMin})`,
        });
        return lines;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [method.id, selectedModel.slug, inputFile, agents.length]);

    // Stream the transcript line-by-line while executing, then reveal output.
    useEffect(() => {
        if (!isExecuting) {
            return;
        }
        if (revealed >= transcript.length) {
            setIsExecuting(false);
            setExecutionCompleted(true);
            return;
        }
        const id = window.setTimeout(() => setRevealed((count) => count + 1), 360);
        return () => window.clearTimeout(id);
    }, [isExecuting, revealed, transcript.length]);

    function handleRun(): void {
        setExecutionCompleted(false);
        setRevealed(0);
        setIsExecuting(true);
    }

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

    const isOutputArabic = /[؀-ۿ]/.test(outputSample.content);
    const toneClass: Record<ITranscriptLine['tone'], string> = {
        cmd: 'text-slate-300',
        ok: 'text-emerald-400',
        run: 'text-sky-400',
        done: 'text-amber-300 font-semibold',
        warn: 'text-amber-400',
    };
    const tonePrefix: Record<ITranscriptLine['tone'], string> = {
        cmd: '',
        ok: '✔ ',
        run: '➤ ',
        done: '✔ ',
        warn: '⚠ ',
    };

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
                    ⚡ {isAr ? 'تشغيل وتطبيق هذا الأسلوب' : 'Run this method'}
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
                                    {isAr ? 'تنبيه: أسلوب مصنف بدرجة سري' : 'Confidential Sensitivity Notice:'}
                                </span>{' '}
                                {isAr
                                    ? 'يجب تشغيل هذا الأسلوب داخل البيئة المحلية المعتمدة لمنظمتك عبر Al-Maktaba CLI باختيار نموذج (استضافة داخلية) دون إرسال البيانات لنماذج سحابية خارجية.'
                                    : 'Run this method inside your approved tenancy via the Al-Maktaba CLI with the on-prem model selected. Do not send classified inputs to external cloud models.'}
                            </div>
                        </div>
                    )}

                    {/* Model selector — applies to all run modes */}
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-rule bg-surface-sunk/50 px-3.5 py-2.5">
                        <div className="flex items-center gap-2">
                            <span className="text-base">🧠</span>
                            <label htmlFor="model-select" className="type-meta font-semibold text-ink">
                                {isAr ? 'النموذج المستدعى:' : 'Model to invoke:'}
                            </label>
                            <select
                                id="model-select"
                                value={selectedModel.id}
                                onChange={(event) => {
                                    const next = MODELS.find((model) => model.id === event.target.value);
                                    if (next) {
                                        setSelectedModel(next);
                                        setExecutionCompleted(false);
                                        setRevealed(0);
                                    }
                                }}
                                className="rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta font-medium text-ink focus:border-accent"
                            >
                                {MODELS.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {isAr ? model.labelAr : model.label} — {model.slug}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <span className="type-disclosure text-ink-faint">
                            {(isAr ? selectedModel.noteAr : selectedModel.note) ||
                                (isAr ? 'مشغّل محايد للنماذج' : 'Model-agnostic runner')}
                        </span>
                    </div>

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
                                ⚡ {isAr ? 'تشغيل تفاعلي' : 'Interactive run'}
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
                                💻 {isAr ? 'Al-Maktaba CLI' : 'Al-Maktaba CLI'}
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
                                🔌 {isAr ? 'الربط البرمجي' : 'API / Integration'}
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
                                        {isAr ? 'الخطوة 1: إرفاق ملف المدخلات' : 'Step 1: Upload Input File'}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => setUploadedFile(sampleInput.filename || 'sample-input.docx')}
                                        className="type-disclosure font-medium text-accent hover:underline"
                                    >
                                        {isAr ? '📥 تحميل ملف مدخلات نموذجي جاهز' : '📥 Load sample input file'}
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
                                                    {isAr ? 'تم إرفاق الملف بنجاح ✓' : 'File attached & verified for ingestion ✓'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUploadedFile(null);
                                                    setExecutionCompleted(false);
                                                    setRevealed(0);
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
                                        {isAr ? 'الخطوة 2: تعليمات وتوجيهات الأسلوب' : 'Step 2: Method System Instructions'}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={copyPrompt}
                                        className="type-disclosure font-medium text-accent hover:underline"
                                    >
                                        {copiedPrompt ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : isAr ? 'نسخ التعليمات' : 'Copy prompt'}
                                    </button>
                                </div>
                                <pre
                                    dir={/[؀-ۿ]/.test(method.methodBody) ? 'rtl' : 'ltr'}
                                    className={cn(
                                        'type-meta whitespace-pre-wrap rounded-[4px] bg-paper p-3 text-ink-muted leading-relaxed max-h-36 overflow-y-auto border border-rule',
                                        /[؀-ۿ]/.test(method.methodBody) ? 'font-arabic' : 'font-sans',
                                    )}
                                >
                                    {method.methodBody}
                                </pre>
                            </div>

                            {/* Step 3: Run & Interactive CLI */}
                            <div className="border-t border-rule pt-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="type-disclosure text-ink-faint">
                                            {isAr ? 'بوابات الجودة المفعّلة:' : 'Active quality gates:'}
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
                                        onClick={handleRun}
                                        className="btn btn-primary disabled:opacity-40"
                                    >
                                        {isExecuting
                                            ? isAr ? 'جارٍ التشغيل…' : 'Running…'
                                            : isAr ? '▶ تشغيل عبر Al-Maktaba CLI' : '▶ Run on Al-Maktaba CLI'}
                                    </button>
                                </div>

                                {/* Interactive CLI terminal */}
                                {(isExecuting || executionCompleted) && (
                                    <div className="mt-4 overflow-hidden rounded-[8px] border border-slate-700 bg-slate-950">
                                        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                                            <span className="ms-2 type-disclosure font-mono text-slate-400">
                                                maktaba — {method.id}
                                            </span>
                                        </div>
                                        <div
                                            dir="ltr"
                                            className="p-4 font-mono text-[12px] leading-relaxed overflow-x-auto"
                                        >
                                            {transcript.slice(0, revealed).map((line, index) => (
                                                <div key={index} className={toneClass[line.tone]}>
                                                    {tonePrefix[line.tone]}
                                                    {isAr ? line.textAr : line.text}
                                                </div>
                                            ))}
                                            {isExecuting && (
                                                <div className="text-slate-500 animate-pulse">▋</div>
                                            )}
                                        </div>

                                        {/* Verified output stream */}
                                        {executionCompleted && (
                                            <div className="border-t border-slate-800 bg-slate-900/60">
                                                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                                                    <span className="type-disclosure font-mono font-semibold text-emerald-400">
                                                        {isAr ? `── المخرج المعتمد · ${outName} ──` : `── VERIFIED OUTPUT · ${outName} ──`}
                                                    </span>
                                                    <span className="type-disclosure font-mono text-slate-400">
                                                        {outputSample.format}
                                                    </span>
                                                </div>
                                                <pre
                                                    dir={isOutputArabic ? 'rtl' : 'ltr'}
                                                    lang={isOutputArabic ? 'ar' : 'en'}
                                                    className={cn(
                                                        'max-h-[360px] overflow-y-auto whitespace-pre-wrap p-4 text-[13px] leading-relaxed text-slate-100',
                                                        isOutputArabic ? 'font-arabic text-right' : 'font-sans',
                                                    )}
                                                >
                                                    {outputSample.content}
                                                </pre>
                                                <div className="border-t border-slate-800 px-4 py-2 type-disclosure text-slate-400">
                                                    {isAr
                                                        ? 'مخرج نموذجي توضيحي اجتاز بوابات الجودة. راجعه بشرياً قبل الاعتماد.'
                                                        : 'Illustrative sample output that passed the quality gates. Review before relying on it.'}
                                                </div>
                                            </div>
                                        )}
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
                                    {isAr ? 'التشغيل عبر Al-Maktaba CLI' : 'Execute via the Al-Maktaba CLI'}
                                </h4>
                                <p className="type-meta text-ink-muted">
                                    {isAr ? cliExecution.notesAr : cliExecution.notes}
                                </p>
                            </div>

                            <div className="relative rounded-[6px] bg-slate-950 p-4 font-mono text-xs border border-slate-700 overflow-x-auto">
                                <button
                                    type="button"
                                    onClick={copyCli}
                                    className="absolute top-3 end-3 chip border border-slate-600 bg-slate-800 text-emerald-400 hover:border-emerald-500"
                                >
                                    {copiedCli ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : isAr ? 'نسخ الأمر' : 'Copy command'}
                                </button>
                                <pre dir="ltr" className="text-slate-100 leading-relaxed whitespace-pre select-all">
                                    {cliExecution.command}
                                </pre>
                            </div>

                            <div className="rounded-[4px] border border-rule bg-surface-sunk p-3 type-disclosure text-ink-muted space-y-1">
                                <p>
                                    <strong className="text-ink font-semibold">--model:</strong>{' '}
                                    {isAr ? 'النموذج المستدعى (محايد: أي نموذج سحابي أو استضافة داخلية)' : 'Model to invoke — any cloud model or on-prem (model-agnostic)'}
                                </p>
                                <p>
                                    <strong className="text-ink font-semibold">--input:</strong>{' '}
                                    {isAr ? 'المسار إلى ملف المدخلات المرفوع' : 'Path to the input document payload'}
                                </p>
                                <p>
                                    <strong className="text-ink font-semibold">--agents:</strong>{' '}
                                    {isAr ? 'استدعاء بوابات الجودة والخصوصية المشتركة' : 'Attaches the shared quality gates (Quality Auditor, Privacy Sentinel, …)'}
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
                                        ? 'استدعاء الأسلوب عبر واجهة برمجة التطبيقات'
                                        : 'Invoke method via HTTP REST API'}
                                </h4>
                                <p className="type-meta text-ink-muted">
                                    {isAr
                                        ? 'يمكن لأي نظام داخلي رفع ملف الإدخال واختيار النموذج واستلام المخرج المفحوص مباشرة.'
                                        : 'Integrate into internal systems (ERP, CRM, archiving): upload the input, pick the model, receive verified output.'}
                                </p>
                            </div>

                            <div className="rounded-[6px] bg-slate-950 p-4 font-mono text-xs border border-slate-700 overflow-x-auto">
                                <pre dir="ltr" className="text-slate-100 leading-relaxed whitespace-pre select-all">
{`curl -X POST https://api.almaktaba.sa/v1/workflows/${method.id}/run \\
  -H "Authorization: Bearer $ALMAKTABA_API_TOKEN" \\
  -F "model=${selectedModel.slug}" \\
  -F "input_file=@./${sampleInput.filename || 'input-file.docx'}" \\
  -F "quality_gates=${agents.map((a) => a.id).join(',')}" \\
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
