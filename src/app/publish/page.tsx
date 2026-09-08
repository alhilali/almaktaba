'use client';

import { useState } from 'react';
import Link from 'next/link';

import type { Language, Sensitivity } from '@/data/types';
import { SECTORS } from '@/data/sectors';
import { ROLE_FAMILIES, getRole } from '@/data/roles';
import { getSector } from '@/data/sectors';
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
    inputDefinition: string;
    outputFormat: string;
    qualityChecklist: string[];
    model: string;
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
    inputDefinition: '',
    outputFormat: '',
    qualityChecklist: [''],
    model: 'Claude Sonnet 4.5',
    sensitivity: 'Internal',
};

const TIME_BANDS = ['Under 15 min', '15–30 min', '30–60 min', '1–2 hours', 'Over 2 hours'];
const LANGUAGES: Language[] = ['Arabic', 'English', 'Bilingual'];
const SENSITIVITIES: Sensitivity[] = ['Public', 'Internal', 'Confidential'];

const STEPS = [
    'What do you do repeatedly?',
    'How long does it take you now?',
    'The method',
    'Review and publish',
];

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}): React.ReactElement {
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

export default function PublishPage(): React.ReactElement {
    const [step, setStep] = useState(0);
    const [draft, setDraft] = useState<IDraft>(EMPTY_DRAFT);
    const [example, setExample] = useState('');
    const [assistUsed, setAssistUsed] = useState(false);
    const [published, setPublished] = useState(false);

    function set<K extends keyof IDraft>(key: K, value: IDraft[K]): void {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }

    /**
     * Assist affordance. No Anthropic key is configured in this demo, so this
     * fills the fields with a clearly-labelled sample rather than calling a
     * model. It never pretends to have generated real content.
     */
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
                `[Sample fill — no model was called] Based on the example you pasted, a method here would instruct the model to reproduce this kind of output from structured inputs. Replace this with your real instructions.\n\nExample provided:\n"${example.trim().slice(0, 240)}${example.trim().length > 240 ? '…' : ''}"`,
            outputFormat: prev.outputFormat || '[Sample fill] The output format inferred from your example.',
            qualityChecklist:
                prev.qualityChecklist.filter(Boolean).length > 0
                    ? prev.qualityChecklist
                    : ['[Sample] Output matches the example structure', '[Sample] No invented facts'],
        }));
        setAssistUsed(true);
    }

    function updateChecklist(index: number, value: string): void {
        setDraft((prev) => {
            const next = [...prev.qualityChecklist];
            next[index] = value;
            return { ...prev, qualityChecklist: next };
        });
    }

    function addChecklistRow(): void {
        set('qualityChecklist', [...draft.qualityChecklist, '']);
    }

    function removeChecklistRow(index: number): void {
        set(
            'qualityChecklist',
            draft.qualityChecklist.filter((_, i) => i !== index),
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
                    In this demo the method is not saved to a database, so it won&rsquo;t appear in
                    the catalogue. In the real product it would publish as {draft.title ? `“${draft.title}”` : 'a new method'} at
                    version 1, crediting you as the author.
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
            <p className="type-meta mt-1 text-ink-muted">
                Four steps. You can go back and edit any of them.
            </p>

            {/* Progress */}
            <ol className="mt-6 grid grid-cols-4 gap-2">
                {STEPS.map((label, index) => (
                    <li key={label}>
                        <button
                            type="button"
                            onClick={() => index < step && setStep(index)}
                            disabled={index > step}
                            className="w-full text-left"
                        >
                            <div
                                className={cn(
                                    'h-1 rounded-full',
                                    index <= step ? 'bg-accent' : 'bg-rule',
                                )}
                            />
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
                        {/* Assist affordance */}
                        <details className="rounded-[8px] border border-rule bg-surface p-4">
                            <summary className="type-label cursor-pointer text-accent">
                                Draft this from an example
                            </summary>
                            <p className="type-meta mt-2 text-ink-muted">
                                Paste an example of the output you want. In this demo no model is
                                called — the fields are filled with a clearly-labelled sample you
                                then edit.
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
                                    placeholder="e.g. Credit memo first draft"
                                />
                                <select
                                    value={draft.titleLang}
                                    onChange={(event) =>
                                        set('titleLang', event.target.value as 'ar' | 'en')
                                    }
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
                                <select
                                    value={draft.roleId}
                                    onChange={(event) => set('roleId', event.target.value)}
                                    className={INPUT_CLASS}
                                >
                                    <option value="">Select a role…</option>
                                    {ROLE_FAMILIES.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} · {role.aiAddressable}% AI-addressable
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Sector">
                                <select
                                    value={draft.sectorId}
                                    onChange={(event) => set('sectorId', event.target.value)}
                                    className={INPUT_CLASS}
                                >
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
                            This is what the reuse number is measured against — how long the task
                            takes you today, before the method.
                        </p>
                        <div className="space-y-2">
                            {TIME_BANDS.map((band) => (
                                <button
                                    key={band}
                                    type="button"
                                    onClick={() => set('timeBand', band)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-[4px] border px-4 py-3 text-left type-body transition-colors',
                                        draft.timeBand === band
                                            ? 'border-accent bg-accent-sunk/50 text-ink'
                                            : 'border-rule bg-surface text-ink-muted hover:border-rule-strong',
                                    )}
                                >
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'grid h-4 w-4 place-items-center rounded-full border',
                                            draft.timeBand === band
                                                ? 'border-accent'
                                                : 'border-rule-strong',
                                        )}
                                    >
                                        {draft.timeBand === band && (
                                            <span className="h-2 w-2 rounded-full bg-accent" />
                                        )}
                                    </span>
                                    {band}
                                </button>
                            ))}
                        </div>
                        <Field label="Or enter a precise figure" hint="Optional — minutes per run.">
                            <input
                                type="text"
                                value={draft.timeBand.startsWith('Exactly') ? draft.timeBand.replace('Exactly ', '') : ''}
                                onChange={(event) =>
                                    set('timeBand', event.target.value ? `Exactly ${event.target.value}` : '')
                                }
                                className={INPUT_CLASS}
                                placeholder="e.g. 45 minutes"
                            />
                        </Field>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Field label="The method" hint="The prompt or instructions someone would run.">
                            <textarea
                                value={draft.methodBody}
                                onChange={(event) => set('methodBody', event.target.value)}
                                rows={8}
                                className={INPUT_CLASS}
                                placeholder="Write the instructions the model should follow…"
                            />
                        </Field>
                        <Field label="Inputs required" hint="What the person needs to supply.">
                            <textarea
                                value={draft.inputDefinition}
                                onChange={(event) => set('inputDefinition', event.target.value)}
                                rows={3}
                                className={INPUT_CLASS}
                                placeholder="e.g. The deal facts, the financial spreads, the facility requested."
                            />
                        </Field>
                        <Field label="Output format">
                            <input
                                type="text"
                                value={draft.outputFormat}
                                onChange={(event) => set('outputFormat', event.target.value)}
                                className={INPUT_CLASS}
                                placeholder="e.g. Three labelled sections as editable prose."
                            />
                        </Field>

                        <div>
                            <span className="type-label block text-ink">Quality checklist</span>
                            <span className="type-meta mb-2 block text-ink-faint">
                                What a good output must satisfy.
                            </span>
                            <div className="space-y-2">
                                {draft.qualityChecklist.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(event) =>
                                                updateChecklist(index, event.target.value)
                                            }
                                            className={INPUT_CLASS}
                                            placeholder="A quality criterion…"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeChecklistRow(index)}
                                            disabled={draft.qualityChecklist.length === 1}
                                            className="btn btn-secondary btn-sm shrink-0 disabled:opacity-30"
                                            aria-label="Remove criterion"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addChecklistRow}
                                className="type-meta mt-2 font-medium text-accent hover:underline"
                            >
                                + Add a criterion
                            </button>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Built on" hint="Author-reported provenance, not a benchmark.">
                                <input
                                    type="text"
                                    value={draft.model}
                                    onChange={(event) => set('model', event.target.value)}
                                    className={INPUT_CLASS}
                                />
                            </Field>
                            <Field label="Data sensitivity of inputs">
                                <select
                                    value={draft.sensitivity}
                                    onChange={(event) =>
                                        set('sensitivity', event.target.value as Sensitivity)
                                    }
                                    className={INPUT_CLASS}
                                >
                                    {SENSITIVITIES.map((sensitivity) => (
                                        <option key={sensitivity} value={sensitivity}>
                                            {sensitivity}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                        {draft.sensitivity === 'Confidential' && (
                            <p className="type-meta rounded-[4px] border border-rule-strong bg-surface-sunk px-3 py-2 text-ink">
                                Confidential methods are exported and run inside your
                                organisation&rsquo;s own approved tool, never in Al-Maktaba.
                            </p>
                        )}
                    </>
                )}

                {step === 3 && (
                    <ReviewStep draft={draft} onEdit={setStep} />
                )}
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
                    <button
                        type="button"
                        onClick={() => setPublished(true)}
                        className="btn btn-primary"
                    >
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}

function ReviewLine({
    label,
    value,
    lang,
}: {
    label: string;
    value: string;
    lang?: 'ar' | 'en';
}): React.ReactElement {
    return (
        <div className="border-b border-rule py-2.5">
            <div className="type-disclosure text-ink-faint">{label}</div>
            <div
                className="type-body text-ink"
                lang={lang}
                dir={lang === 'ar' ? 'rtl' : undefined}
            >
                {value || <span className="text-ink-faint">—</span>}
            </div>
        </div>
    );
}

function ReviewStep({
    draft,
    onEdit,
}: {
    draft: IDraft;
    onEdit: (step: number) => void;
}): React.ReactElement {
    const role = getRole(draft.roleId);
    const sector = getSector(draft.sectorId);
    return (
        <div>
            <p className="type-body text-ink-muted">
                This is how the method will read. Edit any section before publishing.
            </p>

            <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="type-label text-ink-faint">Basics</h3>
                    <button
                        type="button"
                        onClick={() => onEdit(0)}
                        className="type-meta font-medium text-accent hover:underline"
                    >
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
                    <h3 className="type-label text-ink-faint">Effort today</h3>
                    <button
                        type="button"
                        onClick={() => onEdit(1)}
                        className="type-meta font-medium text-accent hover:underline"
                    >
                        Edit
                    </button>
                </div>
                <ReviewLine label="Typical time before" value={draft.timeBand} />
            </div>

            <div className="mt-4 rounded-[8px] border border-rule bg-surface p-5">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="type-label text-ink-faint">The method</h3>
                    <button
                        type="button"
                        onClick={() => onEdit(2)}
                        className="type-meta font-medium text-accent hover:underline"
                    >
                        Edit
                    </button>
                </div>
                <ReviewLine label="Method body" value={draft.methodBody} />
                <ReviewLine label="Inputs required" value={draft.inputDefinition} />
                <ReviewLine label="Output format" value={draft.outputFormat} />
                <div className="border-b border-rule py-2.5">
                    <div className="type-disclosure text-ink-faint">Quality checklist</div>
                    <ul className="mt-1 space-y-1">
                        {draft.qualityChecklist.filter(Boolean).map((item, index) => (
                            <li key={index} className="type-body text-ink">
                                ☐ {item}
                            </li>
                        ))}
                        {draft.qualityChecklist.filter(Boolean).length === 0 && (
                            <li className="type-body text-ink-faint">—</li>
                        )}
                    </ul>
                </div>
                <ReviewLine label="Built on" value={draft.model} />
                <ReviewLine label="Data sensitivity" value={draft.sensitivity} />
            </div>
        </div>
    );
}
