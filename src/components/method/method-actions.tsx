'use client';

import { useEffect, useMemo, useState } from 'react';
import type { IMethod, IMethodInput } from '@/data/types';
import { useLanguage } from '@/context/language-context';
import { getSampleInput, getSampleOutput, getCliExecution } from '@/data/samples';
import { getAgentsForMethod } from '@/data/agents';
import { MODELS, defaultModelFor, type IModelOption } from '@/data/models';
import { getMethodInputs, assemblePrompt, type IInputValue } from '@/lib/prompt';
import { cn } from '@/lib/utils';

interface ITranscriptLine {
    tone: 'cmd' | 'ok' | 'run' | 'done' | 'warn';
    text: string;
    textAr: string;
}

const TYPE_META: Record<IMethodInput['type'], { icon: string; en: string; ar: string; accept?: string }> = {
    text: { icon: '✎', en: 'Text', ar: 'نص' },
    file: { icon: '📄', en: 'File', ar: 'ملف', accept: '.txt,.md,.csv,.json,.sql,.log,.tsv,.docx,.xlsx' },
    pdf: { icon: '📕', en: 'PDF', ar: 'PDF', accept: '.pdf' },
    image: { icon: '🖼', en: 'Image', ar: 'صورة', accept: 'image/*' },
};

const TEXT_READABLE = /\.(txt|md|csv|json|sql|log|tsv|yaml|yml|xml|html)$/i;

export function MethodActions({ method }: { method: IMethod }): React.ReactElement {
    const { lang, isRTL } = useLanguage();
    const isAr = lang === 'ar';

    const [isRunOpen, setIsRunOpen] = useState(false);
    const [isSuggestOpen, setIsSuggestOpen] = useState(false);
    const [runTab, setRunTab] = useState<'run' | 'cli' | 'api'>('run');

    const inputs = useMemo(() => getMethodInputs(method), [method]);
    const sampleInput = getSampleInput(method);
    const outputSample = getSampleOutput(method);
    const agents = getAgentsForMethod(method);

    const [selectedModel, setSelectedModel] = useState<IModelOption>(() => defaultModelFor(method));
    const cliExecution = getCliExecution(method, selectedModel.slug);

    const [values, setValues] = useState<Record<string, IInputValue>>({});
    const [isExecuting, setIsExecuting] = useState(false);
    const [revealed, setRevealed] = useState(0);
    const [executionCompleted, setExecutionCompleted] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedCli, setCopiedCli] = useState(false);

    const [suggestion, setSuggestion] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const isConfidential = method.sensitivity === 'Confidential';
    const outName = `output-${method.id}.md`;
    const orgSlug = method.organisation
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 28);

    const assembledPrompt = useMemo(() => assemblePrompt(method, values), [method, values]);
    const missingRequired = inputs.filter(
        (input) => input.required && !values[input.name]?.text?.trim() && !values[input.name]?.filename,
    );
    const anyValue = inputs.some(
        (input) => values[input.name]?.text?.trim() || values[input.name]?.filename,
    );

    function setValue(name: string, next: IInputValue): void {
        setValues((prev) => ({ ...prev, [name]: { ...prev[name], ...next } }));
    }

    async function onPickFile(input: IMethodInput, file: File | undefined): Promise<void> {
        if (!file) {
            return;
        }
        if ((input.type === 'file' || input.type === 'text') && TEXT_READABLE.test(file.name)) {
            try {
                const text = await file.text();
                setValue(input.name, { text, filename: file.name });
                return;
            } catch {
                /* fall through to filename-only */
            }
        }
        setValue(input.name, { filename: file.name, text: undefined });
    }

    function loadSample(): void {
        // Fill the first text input with the curated sample; map files by filename.
        const next: Record<string, IInputValue> = {};
        let usedTextBlob = false;
        for (const input of inputs) {
            if (input.type === 'text') {
                next[input.name] = usedTextBlob
                    ? { text: '' }
                    : { text: sampleInput.content };
                usedTextBlob = true;
            } else {
                next[input.name] = { filename: sampleInput.filename || `sample-${input.name}` };
            }
        }
        // If there were no text inputs, still surface the sample content on the first input.
        if (!usedTextBlob && inputs[0]) {
            next[inputs[0].name] = { ...next[inputs[0].name], text: sampleInput.content };
        }
        setValues(next);
    }

    const transcript = useMemo<ITranscriptLine[]>(() => {
        const primaryFile =
            inputs.map((i) => values[i.name]?.filename).find(Boolean) || sampleInput.filename || 'input.txt';
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
                text: `Bound ${inputs.length} input${inputs.length === 1 ? '' : 's'} · primary: ${primaryFile}`,
                textAr: `تم ربط ${inputs.length} مدخلات · الأساسي: ${primaryFile}`,
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
    }, [method.id, selectedModel.slug, inputs.length, agents.length, values]);

    useEffect(() => {
        if (!isExecuting) {
            return;
        }
        if (revealed >= transcript.length) {
            setIsExecuting(false);
            setExecutionCompleted(true);
            return;
        }
        const id = window.setTimeout(() => setRevealed((count) => count + 1), 340);
        return () => window.clearTimeout(id);
    }, [isExecuting, revealed, transcript.length]);

    function handleSimulate(): void {
        setExecutionCompleted(false);
        setRevealed(0);
        setIsExecuting(true);
    }

    async function copyAssembled(): Promise<void> {
        try {
            await navigator.clipboard.writeText(assembledPrompt);
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
    const isPromptArabic = /[؀-ۿ]/.test(assembledPrompt);
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
                    className={cn('btn font-semibold', isRunOpen ? 'btn-primary ring-2 ring-accent/30' : 'btn-primary')}
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

            {isRunOpen && (
                <div className="mt-5 rounded-[8px] border-2 border-accent bg-surface p-6">
                    {isConfidential && (
                        <div className="type-meta mb-4 rounded-[6px] border border-measure/50 bg-measure-sunk/30 px-3.5 py-2.5 text-ink flex items-start gap-2">
                            <span className="text-measure font-bold">⚠️</span>
                            <div>
                                <span className="font-bold text-ink">
                                    {isAr ? 'تنبيه: أسلوب مصنف بدرجة سري' : 'Confidential Sensitivity Notice:'}
                                </span>{' '}
                                {isAr
                                    ? 'شغّل هذا الأسلوب داخل بيئتك المعتمدة عبر Al-Maktaba CLI باختيار نموذج (استضافة داخلية). لا ترفع مدخلات سرية لأدوات سحابية خارجية.'
                                    : 'Run this inside your approved tenancy via the Al-Maktaba CLI with the on-prem model selected. Do not paste classified inputs into external cloud tools.'}
                            </div>
                        </div>
                    )}

                    {/* Model selector */}
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
                                    const next = MODELS.find((m) => m.id === event.target.value);
                                    if (next) {
                                        setSelectedModel(next);
                                        setExecutionCompleted(false);
                                        setRevealed(0);
                                    }
                                }}
                                className="rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta font-medium text-ink focus:border-accent"
                            >
                                {MODELS.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {isAr ? m.labelAr : m.label} — {m.slug}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <span className="type-disclosure text-ink-faint">
                            {(isAr ? selectedModel.noteAr : selectedModel.note) ||
                                (isAr ? 'مشغّل محايد للنماذج' : 'Model-agnostic runner')}
                        </span>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3 mb-5">
                        <div className="flex items-center gap-2">
                            {(['run', 'cli', 'api'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setRunTab(tab)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-[4px] type-meta font-medium transition-colors',
                                        runTab === tab
                                            ? 'bg-accent text-white font-semibold'
                                            : 'bg-surface-sunk text-ink-muted hover:text-ink',
                                    )}
                                >
                                    {tab === 'run'
                                        ? isAr
                                            ? '⚡ جهّز المدخلات وانسخ'
                                            : '⚡ Supply inputs & copy'
                                        : tab === 'cli'
                                          ? 'Al-Maktaba CLI'
                                          : isAr
                                            ? '🔌 الربط البرمجي'
                                            : '🔌 API'}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRunOpen(false)}
                            className="type-disclosure text-ink-faint hover:text-ink"
                        >
                            {isAr ? 'إغلاق ✕' : 'Close ✕'}
                        </button>
                    </div>

                    {/* TAB: run — structured inputs → assembled prompt */}
                    {runTab === 'run' && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between gap-3">
                                <h4 className="type-label font-bold text-ink">
                                    {isAr ? 'مدخلات هذا الأسلوب' : 'Inputs for this method'}
                                </h4>
                                <button
                                    type="button"
                                    onClick={loadSample}
                                    className="type-disclosure font-medium text-accent hover:underline"
                                >
                                    {isAr ? '📥 تعبئة بمثال جاهز' : '📥 Load a sample'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {inputs.map((input) => {
                                    const meta = TYPE_META[input.type];
                                    const value = values[input.name];
                                    const inputArabic = /[؀-ۿ]/.test(input.label);
                                    return (
                                        <div key={input.id} className="rounded-[6px] border border-rule bg-paper/60 p-3.5">
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                                <span
                                                    className="type-label font-semibold text-ink"
                                                    dir={inputArabic ? 'rtl' : 'ltr'}
                                                >
                                                    {input.label}
                                                    {input.required && <span className="text-measure"> *</span>}
                                                </span>
                                                <span className="flex items-center gap-2 shrink-0">
                                                    <span className="chip bg-surface-sunk text-ink-muted text-[10px] font-mono">
                                                        {meta.icon} {isAr ? meta.ar : meta.en}
                                                    </span>
                                                    <code className="type-disclosure font-mono text-accent">{`{{${input.name}}}`}</code>
                                                </span>
                                            </div>
                                            {(isAr ? input.descriptionAr : input.description) && (
                                                <p className="type-disclosure text-ink-faint mb-2">
                                                    {isAr ? input.descriptionAr : input.description}
                                                </p>
                                            )}

                                            {input.type === 'text' ? (
                                                <textarea
                                                    value={value?.text ?? ''}
                                                    onChange={(event) => setValue(input.name, { text: event.target.value })}
                                                    rows={3}
                                                    placeholder={isAr ? 'اكتب أو الصق القيمة…' : 'Type or paste the value…'}
                                                    className="w-full rounded-[4px] border border-rule bg-surface p-2.5 type-meta text-ink placeholder:text-ink-faint focus:border-accent"
                                                />
                                            ) : (
                                                <div>
                                                    <label className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-dashed border-rule bg-surface px-3 py-2.5 hover:border-accent transition-colors">
                                                        <span className="text-lg">{meta.icon}</span>
                                                        <span className="type-meta text-ink-muted">
                                                            {value?.filename
                                                                ? value.filename
                                                                : isAr
                                                                  ? `اختر ${meta.ar}…`
                                                                  : `Choose ${meta.en.toLowerCase()}…`}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept={meta.accept}
                                                            className="sr-only"
                                                            onChange={(event) => onPickFile(input, event.target.files?.[0])}
                                                        />
                                                    </label>
                                                    {value?.filename && (
                                                        <div className="mt-1 flex items-center gap-3 type-disclosure text-ink-faint">
                                                            <span className="text-accent">
                                                                {value.text
                                                                    ? isAr
                                                                        ? 'تم استخراج النص ✓'
                                                                        : 'text extracted ✓'
                                                                    : isAr
                                                                      ? 'سيُرفق الملف في أداتك ✓'
                                                                      : 'will be attached in your tool ✓'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setValue(input.name, { text: undefined, filename: undefined })}
                                                                className="hover:text-ink"
                                                            >
                                                                {isAr ? 'إزالة' : 'Remove'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Assembled prompt */}
                            <div className="rounded-[8px] border-2 border-accent/50 bg-surface overflow-hidden">
                                <div className="flex items-center justify-between border-b border-rule bg-accent-sunk/30 px-4 py-2.5">
                                    <div>
                                        <h4 className="type-label font-bold text-accent">
                                            {isAr ? 'المُوجّه الجاهز للنسخ' : 'Ready-to-paste prompt'}
                                        </h4>
                                        <p className="type-disclosure text-ink-muted">
                                            {isAr
                                                ? 'انسخه والصقه في أداة الذكاء الاصطناعي التي تفضّلها.'
                                                : 'Copy it and paste into your preferred AI tool.'}
                                        </p>
                                    </div>
                                    <button type="button" onClick={copyAssembled} className="btn btn-primary btn-sm">
                                        {copiedPrompt ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : isAr ? 'نسخ المُوجّه' : 'Copy prompt'}
                                    </button>
                                </div>
                                {missingRequired.length > 0 && (
                                    <div className="border-b border-rule bg-measure-sunk/30 px-4 py-1.5 type-disclosure text-measure">
                                        {isAr
                                            ? `مدخلات مطلوبة ناقصة: ${missingRequired.map((i) => i.label).join('، ')}`
                                            : `Missing required inputs: ${missingRequired.map((i) => i.label).join(', ')}`}
                                    </div>
                                )}
                                <pre
                                    dir={isPromptArabic ? 'rtl' : 'ltr'}
                                    className={cn(
                                        'max-h-[320px] overflow-y-auto whitespace-pre-wrap p-4 type-meta leading-relaxed text-ink',
                                        isPromptArabic ? 'font-arabic' : 'font-sans',
                                    )}
                                >
                                    {assembledPrompt}
                                </pre>
                            </div>

                            {/* Simulate run */}
                            <div className="border-t border-rule pt-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="type-disclosure text-ink-faint">
                                            {isAr ? 'بوابات الجودة:' : 'Quality gates:'}
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
                                        disabled={!anyValue || isExecuting}
                                        onClick={handleSimulate}
                                        className="btn btn-secondary btn-sm disabled:opacity-40"
                                        title={isAr ? 'محاكاة تشغيل عبر المنصة' : 'Simulate a managed run'}
                                    >
                                        {isExecuting ? (isAr ? 'جارٍ التشغيل…' : 'Running…') : isAr ? '▶ محاكاة تشغيل مُدار' : '▶ Simulate managed run'}
                                    </button>
                                </div>

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
                                        <div dir="ltr" className="p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
                                            {transcript.slice(0, revealed).map((line, index) => (
                                                <div key={index} className={toneClass[line.tone]}>
                                                    {tonePrefix[line.tone]}
                                                    {isAr ? line.textAr : line.text}
                                                </div>
                                            ))}
                                            {isExecuting && <div className="text-slate-500 animate-pulse">▋</div>}
                                        </div>
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

                    {/* TAB: cli */}
                    {runTab === 'cli' && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="type-label font-bold text-ink mb-1">
                                    {isAr ? 'التشغيل عبر Al-Maktaba CLI' : 'Execute via the Al-Maktaba CLI'}
                                </h4>
                                <p className="type-meta text-ink-muted">{isAr ? cliExecution.notesAr : cliExecution.notes}</p>
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
                                    {isAr ? 'أي نموذج سحابي أو استضافة داخلية (محايد للنماذج)' : 'Any cloud model or on-prem (model-agnostic)'}
                                </p>
                                <p>
                                    <strong className="text-ink font-semibold">--agents:</strong>{' '}
                                    {isAr ? 'بوابات الجودة والخصوصية المشتركة' : 'The shared quality gates'}
                                </p>
                                <p>
                                    <strong className="text-ink font-semibold">--output:</strong>{' '}
                                    {isAr ? 'مسار المخرج المعتمد' : 'Where the verified output is streamed'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB: api */}
                    {runTab === 'api' && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="type-label font-bold text-ink mb-1">
                                    {isAr ? 'استدعاء عبر واجهة برمجة التطبيقات' : 'Invoke via HTTP REST API'}
                                </h4>
                                <p className="type-meta text-ink-muted">
                                    {isAr
                                        ? 'ادمج المنصة في أنظمتك الداخلية: ارفع المدخلات واختر النموذج واستلم المخرج المعتمد.'
                                        : 'Integrate into internal systems: upload inputs, pick the model, receive verified output.'}
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

            {/* Suggestion */}
            {isSuggestOpen && (
                <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                    {submitted ? (
                        <p className="type-meta text-ink font-medium">
                            {isRTL
                                ? 'شكراً لك — تم تسجيل اقتراحك بنجاح. التحسينات في المنصة تُنشئ إصداراً جديداً وتنسب الفضل للمؤلف دائماً.'
                                : 'Thanks — your suggestion is noted. Improvements create a new version and credit the original author.'}
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
                                placeholder={isRTL ? 'ما هي التعديلات التي تقترحها، وما سبب التحسين؟' : 'What would you change, and why?'}
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
