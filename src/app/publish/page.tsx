'use client';

import { useState } from 'react';
import Link from 'next/link';

import type { Language, Sensitivity, IMethodInput, MethodInputType } from '@/data/types';
import { SECTORS, getSector } from '@/data/sectors';
import { ROLE_FAMILIES, getRole } from '@/data/roles';
import { MODELS } from '@/data/models';
import { SHARED_AGENTS } from '@/data/agents';
import { tokenize } from '@/lib/prompt';
import { cn } from '@/lib/utils';

interface IDraft {
    title: string;
    titleLang: 'ar' | 'en';
    description: string;
    roleId: string;
    sectorId: string;
    language: Language;
    timeBand: string;
    methodBody: string;
    outputFormat: string;
    inputs: IMethodInput[];
    suggestedAgentIds: string[];
    modelId: string;
    sensitivity: Sensitivity;
}

const EMPTY_DRAFT: IDraft = {
    title: '',
    titleLang: 'en',
    description: '',
    roleId: '',
    sectorId: '',
    language: 'English',
    timeBand: '',
    methodBody: '',
    outputFormat: '',
    inputs: [],
    suggestedAgentIds: ['quality-auditor'],
    modelId: 'claude-sonnet-4-5',
    sensitivity: 'Internal',
};

const TIME_BANDS = ['Under 15 min', '15–30 min', '30–60 min', '1–2 hours', 'Over 2 hours'];
const LANGUAGES: Language[] = ['Arabic', 'English', 'Bilingual'];

const INPUT_TYPES: { value: MethodInputType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'file', label: 'File (.txt, .docx, .csv…)' },
    { value: 'pdf', label: 'PDF' },
    { value: 'image', label: 'Image' },
];

const SENSITIVITY_OPTIONS: { value: Sensitivity; description: string }[] = [
    { value: 'Public', description: 'Inputs contain no sensitive data — safe to run on any cloud model.' },
    {
        value: 'Internal',
        description: 'Inputs are internal but not classified — keep runs to approved tools.',
    },
    {
        value: 'Confidential',
        description:
            'Inputs are classified — the method is exported and run inside your organisation’s own approved tool (on-prem), never in external cloud tools.',
    },
];

const STEPS = ['What do you do repeatedly?', 'How long does it take you now?', 'The method & inputs', 'Review and publish'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }): React.ReactElement {
    return (
        <label className="block">
            <span className="type-label block text-ink">{label}</span>
            {hint && <span className="type-meta mb-1.5 block text-ink-faint">{hint}</span>}
            <span className={hint ? '' : 'mt-1.5 block'}>{children}</span>
        </label>
    );
}

const INPUT_CLASS =
    'w-full rounded-[4px] border border-rule bg-surface px-3 py-2 type-body text-ink placeholder:text-ink-faint focus:border-accent';

let inputCounter = 0;

export default function PublishPage(): React.ReactElement {
    const [step, setStep] = useState(0);
    const [draft, setDraft] = useState<IDraft>(EMPTY_DRAFT);
    const [example, setExample] = useState('');
    const [assistUsed, setAssistUsed] = useState(false);
    const [published, setPublished] = useState(false);

    function set<K extends keyof IDraft>(key: K, value: IDraft[K]): void {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }

    function draftFromExample(): void {
        if (example.trim().length === 0) {
            return;
        }
        setDraft((prev) => ({
            ...prev,
            title: prev.title || 'Sample: drafted from your example',
            description:
                prev.description ||
                '[Sample fill] A one-line description generated from the pasted example. Replace with your own.',
            methodBody:
                prev.methodBody ||
                `[Sample fill — no model was called] Based on the example you pasted, a method here would instruct the model to produce this kind of output from the inputs below. Replace this with your real instructions.\n\nExample provided:\n"${example.trim().slice(0, 240)}${example.trim().length > 240 ? '…' : ''}"`,
            outputFormat: prev.outputFormat || '[Sample fill] The output format inferred from your example.',
        }));
        setAssistUsed(true);
    }

    // ---- structured inputs ----
    function addInput(): void {
        inputCounter += 1;
        const next: IMethodInput = {
            id: `draft-in-${inputCounter}`,
            name: '',
            label: '',
            type: 'text',
            description: '',
            required: true,
        };
        set('inputs', [...draft.inputs, next]);
    }

    function updateInput(id: string, patch: Partial<IMethodInput>): void {
        set(
            'inputs',
            draft.inputs.map((input) => {
                if (input.id !== id) {
                    return input;
                }
                const merged = { ...input, ...patch };
                if (patch.label !== undefined) {
                    merged.name = tokenize(patch.label);
                }
                return merged;
            }),
        );
    }

    function removeInput(id: string): void {
        set('inputs', draft.inputs.filter((input) => input.id !== id));
    }

    function insertToken(token: string): void {
        if (!token) {
            return;
        }
        set('methodBody', `${draft.methodBody}${draft.methodBody.endsWith('\n') || draft.methodBody === '' ? '' : ' '}{{${token}}}`);
    }

    function toggleAgent(id: string): void {
        set(
            'suggestedAgentIds',
            draft.suggestedAgentIds.includes(id)
                ? draft.suggestedAgentIds.filter((a) => a !== id)
                : [...draft.suggestedAgentIds, id],
        );
    }

    const canAdvance =
        step === 0
            ? draft.title.trim() && draft.description.trim() && draft.roleId && draft.sectorId
            : step === 1
              ? draft.timeBand
              : step === 2
                ? draft.methodBody.trim()
                : true;

    if (published) {
        return (
            <div className="mx-auto max-w-[680px] px-5 py-24 text-center md:px-8">
                <h1 className="type-display-2 text-ink">Published — in the demo</h1>
                <p className="type-body-lg mt-4 text-ink-muted">
                    Once Supabase is connected, this saves {draft.title ? `“${draft.title}”` : 'your method'} as version 1
                    with its typed inputs, chosen model, and shared quality gates — crediting you as the author. In this
                    preview it isn’t persisted.
                </p>
                <div className="mt-7 flex justify-center gap-3">
                    <Link href="/library" className="btn btn-primary">
                        Back to the library
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            setDraft(EMPTY_DRAFT);
                            setStep(0);
                            setPublished(false);
                            setAssistUsed(false);
                            setExample('');
                        }}
                        className="btn btn-secondary"
                    >
                        Publish another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[720px] px-5 pb-24 pt-8 md:px-8 lg:pb-16">
            <h1 className="type-display-2 text-ink">Publish a method</h1>
            <p className="type-meta mt-1 text-ink-muted">Four steps. You can go back and edit any of them.</p>

            {/* Progress */}
            <ol className="mt-6 grid grid-cols-4 gap-2">
                {STEPS.map((label, index) => (
                    <li key={label}>
                        <button
                            type="button"
                            onClick={() => index < step && setStep(index)}
                            disabled={index > step}
                            className="w-full text-start"
                        >
                            <div className={cn('h-1 rounded-full', index <= step ? 'bg-accent' : 'bg-rule')} />
                            <div
                                className={cn(
                                    'type-disclosure mt-1.5',
                                    index === step
                                        ? 'font-semibold text-ink'
                                        : index < step
                                          ? 'text-ink-muted'
                                          : 'text-ink-faint',
                                )}
                            >
                                {index + 1}. {label}
                            </div>
                        </button>
                    </li>
                ))}
            </ol>

            <div className="mt-8 space-y-5">
                {step === 0 && (
                    <>
                        <details className="rounded-[8px] border border-rule bg-surface p-4">
                            <summary className="type-label cursor-pointer text-accent">Draft this from an example</summary>
                            <p className="type-meta mt-2 text-ink-muted">
                                Paste an example of the output you want. In this preview no model is called — the fields
                                are filled with a clearly-labelled sample you then edit.
                            </p>
                            <textarea
                                value={example}
                                onChange={(event) => setExample(event.target.value)}
                                rows={4}
                                placeholder="Paste an example output…"
                                className={cn(INPUT_CLASS, 'mt-2')}
                            />
                            <button
                                type="button"
                                onClick={draftFromExample}
                                disabled={example.trim().length === 0}
                                className="btn btn-secondary btn-sm mt-2 disabled:opacity-40"
                            >
                                {assistUsed ? 'Re-fill from example' : 'Fill the fields'}
                            </button>
                        </details>

                        <Field label="Title" hint="Arabic or English — write it in the language people search in.">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={draft.title}
                                    onChange={(event) => set('title', event.target.value)}
                                    dir={draft.titleLang === 'ar' ? 'rtl' : 'ltr'}
                                    className={INPUT_CLASS}
                                    placeholder="e.g. CV first draft from a brief"
                                />
                                <select
                                    value={draft.titleLang}
                                    onChange={(event) => set('titleLang', event.target.value as 'ar' | 'en')}
                                    className="rounded-[4px] border border-rule bg-surface px-2 type-meta text-ink focus:border-accent"
                                    aria-label="Title language"
                                >
                                    <option value="en">EN</option>
                                    <option value="ar">AR</option>
                                </select>
                            </div>
                        </Field>

                        <Field label="One-line description">
                            <input
                                type="text"
                                value={draft.description}
                                onChange={(event) => set('description', event.target.value)}
                                className={INPUT_CLASS}
                                placeholder="What the method produces, in one line."
                            />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Role family">
                                <select value={draft.roleId} onChange={(event) => set('roleId', event.target.value)} className={INPUT_CLASS}>
                                    <option value="">Select a role…</option>
                                    {ROLE_FAMILIES.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} · {role.aiAddressable}% AI-addressable
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Sector">
                                <select value={draft.sectorId} onChange={(event) => set('sectorId', event.target.value)} className={INPUT_CLASS}>
                                    <option value="">Select a sector…</option>
                                    {SECTORS.map((sector) => (
                                        <option key={sector.id} value={sector.id}>
                                            {sector.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Language">
                            <div className="flex gap-2">
                                {LANGUAGES.map((language) => (
                                    <button
                                        key={language}
                                        type="button"
                                        onClick={() => set('language', language)}
                                        className={cn(
                                            'chip border',
                                            draft.language === language
                                                ? 'border-accent bg-accent-sunk text-accent'
                                                : 'border-rule bg-surface text-ink-muted',
                                        )}
                                    >
                                        {language}
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </>
                )}

                {step === 1 && (
                    <>
                        <p className="type-body text-ink-muted">
                            This is what the reuse number is measured against — how long the task takes you today, before
                            the method.
                        </p>
                        <div className="space-y-2">
                            {TIME_BANDS.map((band) => (
                                <button
                                    key={band}
                                    type="button"
                                    onClick={() => set('timeBand', band)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-[4px] border px-4 py-3 text-start type-body transition-colors',
                                        draft.timeBand === band
                                            ? 'border-accent bg-accent-sunk/50 text-ink'
                                            : 'border-rule bg-surface text-ink-muted hover:border-rule-strong',
                                    )}
                                >
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'grid h-4 w-4 place-items-center rounded-full border',
                                            draft.timeBand === band ? 'border-accent' : 'border-rule-strong',
                                        )}
                                    >
                                        {draft.timeBand === band && <span className="h-2 w-2 rounded-full bg-accent" />}
                                    </span>
                                    {band}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Field label="The method" hint="The prompt or instructions someone would run. Reference inputs below with {{token}}.">
                            <textarea
                                value={draft.methodBody}
                                onChange={(event) => set('methodBody', event.target.value)}
                                rows={7}
                                className={cn(INPUT_CLASS, 'font-mono text-sm')}
                                placeholder="e.g. Write a one-page CV from {{cv_brief}} tailored to {{job_description}}…"
                            />
                        </Field>

                        {/* Structured inputs builder */}
                        <div>
                            <span className="type-label block text-ink">Inputs</span>
                            <span className="type-meta mb-2 block text-ink-faint">
                                Define what a runner supplies — text, a file, a PDF, or an image. Each gets a{' '}
                                <code className="font-mono text-accent">{'{{token}}'}</code> you can drop into the prompt.
                            </span>
                            <div className="space-y-3">
                                {draft.inputs.map((input) => (
                                    <div key={input.id} className="rounded-[6px] border border-rule bg-surface p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <input
                                                type="text"
                                                value={input.label}
                                                onChange={(event) => updateInput(input.id, { label: event.target.value })}
                                                placeholder="Input name, e.g. CV brief"
                                                className="flex-1 min-w-[160px] rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink placeholder:text-ink-faint focus:border-accent"
                                            />
                                            <select
                                                value={input.type}
                                                onChange={(event) => updateInput(input.id, { type: event.target.value as MethodInputType })}
                                                className="rounded-[4px] border border-rule bg-surface px-2 py-1.5 type-meta text-ink focus:border-accent"
                                            >
                                                {INPUT_TYPES.map((t) => (
                                                    <option key={t.value} value={t.value}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <label className="flex items-center gap-1.5 type-meta text-ink-muted">
                                                <input
                                                    type="checkbox"
                                                    checked={input.required}
                                                    onChange={(event) => updateInput(input.id, { required: event.target.checked })}
                                                />
                                                Required
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={input.description}
                                            onChange={(event) => updateInput(input.id, { description: event.target.value })}
                                            placeholder="Short guidance for the runner (optional)"
                                            className="mt-2 w-full rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink placeholder:text-ink-faint focus:border-accent"
                                        />
                                        <div className="mt-2 flex items-center justify-between">
                                            <code className="type-disclosure font-mono text-accent">
                                                {input.name ? `{{${input.name}}}` : '{{…}}'}
                                            </code>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={!input.name}
                                                    onClick={() => insertToken(input.name)}
                                                    className="type-disclosure font-medium text-accent hover:underline disabled:opacity-40"
                                                >
                                                    Insert into prompt
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeInput(input.id)}
                                                    className="type-disclosure text-ink-faint hover:text-ink"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addInput}
                                className="type-meta mt-2 font-medium text-accent hover:underline"
                            >
                                + Add an input
                            </button>
                        </div>

                        <Field label="Output format">
                            <input
                                type="text"
                                value={draft.outputFormat}
                                onChange={(event) => set('outputFormat', event.target.value)}
                                className={INPUT_CLASS}
                                placeholder="e.g. A one-page CV in reverse-chronological order."
                            />
                        </Field>

                        {/* Shared-agent quality gates */}
                        <div>
                            <span className="type-label block text-ink">Quality gates</span>
                            <span className="type-meta mb-2 block text-ink-faint">
                                Attach shared agents that check every run — instead of writing a manual checklist.
                            </span>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {SHARED_AGENTS.map((agent) => {
                                    const on = draft.suggestedAgentIds.includes(agent.id);
                                    return (
                                        <label
                                            key={agent.id}
                                            className={cn(
                                                'flex cursor-pointer items-start gap-2.5 rounded-[6px] border p-3 transition-colors',
                                                on ? 'border-accent bg-accent-sunk/40' : 'border-rule bg-surface hover:border-rule-strong',
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={on}
                                                onChange={() => toggleAgent(agent.id)}
                                                className="mt-0.5"
                                            />
                                            <span>
                                                <span className="type-label font-semibold text-ink block">{agent.name}</span>
                                                <span className="type-disclosure text-ink-muted block leading-relaxed">
                                                    {agent.role}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Built on" hint="Author-reported provenance, not a benchmark.">
                                <select value={draft.modelId} onChange={(event) => set('modelId', event.target.value)} className={INPUT_CLASS}>
                                    {MODELS.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.label} — {model.vendor}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Data sensitivity of inputs">
                                <select
                                    value={draft.sensitivity}
                                    onChange={(event) => set('sensitivity', event.target.value as Sensitivity)}
                                    className={INPUT_CLASS}
                                >
                                    {SENSITIVITY_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                        <p
                            className={cn(
                                'type-meta rounded-[4px] border px-3 py-2',
                                draft.sensitivity === 'Confidential'
                                    ? 'border-measure/50 bg-measure-sunk/40 text-ink'
                                    : 'border-rule bg-surface-sunk text-ink-muted',
                            )}
                        >
                            {SENSITIVITY_OPTIONS.find((o) => o.value === draft.sensitivity)?.description}
                        </p>
                    </>
                )}

                {step === 3 && <ReviewStep draft={draft} onEdit={setStep} />}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-rule pt-5">
                <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="btn btn-secondary disabled:opacity-30"
                >
                    Back
                </button>
                {step < 3 ? (
                    <button
                        type="button"
                        onClick={() => canAdvance && setStep((s) => s + 1)}
                        disabled={!canAdvance}
                        className="btn btn-primary disabled:opacity-40"
                    >
                        Continue
                    </button>
                ) : (
                    <button type="button" onClick={() => setPublished(true)} className="btn btn-primary">
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}

function ReviewLine({ label, value, lang }: { label: string; value: string; lang?: 'ar' | 'en' }): React.ReactElement {
    return (
        <div className="border-b border-rule py-2.5">
            <div className="type-disclosure text-ink-faint">{label}</div>
            <div className="type-body text-ink" lang={lang} dir={lang === 'ar' ? 'rtl' : undefined}>
                {value || <span className="text-ink-faint">—</span>}
            </div>
        </div>
    );
}

function ReviewStep({ draft, onEdit }: { draft: IDraft; onEdit: (step: number) => void }): React.ReactElement {
    const role = getRole(draft.roleId);
    const sector = getSector(draft.sectorId);
    const model = MODELS.find((m) => m.id === draft.modelId);
    const agents = SHARED_AGENTS.filter((a) => draft.suggestedAgentIds.includes(a.id));
    return (
        <div>
            <p className="type-body text-ink-muted">This is how the method will read. Edit any section before publishing.</p>

            <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="type-label text-ink-faint">Basics</h3>
                    <button type="button" onClick={() => onEdit(0)} className="type-meta font-medium text-accent hover:underline">
                        Edit
                    </button>
                </div>
                <ReviewLine label="Title" value={draft.title} lang={draft.titleLang} />
                <ReviewLine label="Description" value={draft.description} />
                <ReviewLine label="Role · sector" value={`${role?.name ?? '—'} · ${sector?.name ?? '—'}`} />
                <ReviewLine label="Language" value={draft.language} />
            </div>

            <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="type-label text-ink-faint">The method & inputs</h3>
                    <button type="button" onClick={() => onEdit(2)} className="type-meta font-medium text-accent hover:underline">
                        Edit
                    </button>
                </div>
                <ReviewLine label="Method body" value={draft.methodBody} />
                <div className="border-b border-rule py-2.5">
                    <div className="type-disclosure text-ink-faint">Inputs</div>
                    <ul className="mt-1 space-y-1">
                        {draft.inputs.length > 0 ? (
                            draft.inputs.map((input) => (
                                <li key={input.id} className="type-meta text-ink">
                                    <code className="font-mono text-accent">{`{{${input.name || '…'}}}`}</code> · {input.label || '—'} ·{' '}
                                    <span className="text-ink-muted">{input.type}</span>
                                    {input.required && <span className="text-measure"> · required</span>}
                                </li>
                            ))
                        ) : (
                            <li className="type-body text-ink-faint">—</li>
                        )}
                    </ul>
                </div>
                <ReviewLine label="Output format" value={draft.outputFormat} />
                <div className="border-b border-rule py-2.5">
                    <div className="type-disclosure text-ink-faint">Quality gates</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {agents.length > 0 ? (
                            agents.map((agent) => (
                                <span key={agent.id} className="chip bg-accent-sunk text-accent text-[11px] font-semibold">
                                    ✓ {agent.name}
                                </span>
                            ))
                        ) : (
                            <span className="type-body text-ink-faint">—</span>
                        )}
                    </div>
                </div>
                <ReviewLine label="Built on" value={model ? `${model.label} — ${model.vendor}` : '—'} />
                <ReviewLine label="Data sensitivity" value={draft.sensitivity} />
            </div>
        </div>
    );
}
