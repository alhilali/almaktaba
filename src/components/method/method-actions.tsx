'use client';

import { useState } from 'react';

import type { IMethod } from '@/data/types';

/**
 * The three method actions. Every one resolves to something real — no dead
 * links. Run reveals the method body with a copy control; Export hits the
 * download route; Suggest opens an inline form that acknowledges locally.
 */
export function MethodActions({ method }: { method: IMethod }): React.ReactElement {
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
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setIsRunOpen((open) => !open)}
                    className="btn btn-primary"
                >
                    Run this method
                </button>
                <a href={`/api/export/${method.id}`} className="btn btn-secondary">
                    Export for internal use
                </a>
                <button
                    type="button"
                    onClick={() => setIsSuggestOpen((open) => !open)}
                    className="btn btn-secondary"
                >
                    Suggest an improvement
                </button>
            </div>

            {isRunOpen && (
                <div className="mt-4 rounded-[8px] border border-rule bg-surface p-4">
                    {isConfidential && (
                        <p className="type-meta mb-3 rounded-[4px] border border-rule-strong bg-surface-sunk px-3 py-2 text-ink">
                            This method is marked <strong>Confidential</strong>. Run it inside your
                            organisation&rsquo;s own approved AI tool. Export the file rather than
                            pasting sensitive inputs into an external service.
                        </p>
                    )}
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="type-label text-ink">The method</h3>
                        <button
                            type="button"
                            onClick={copyBody}
                            className="type-meta font-medium text-accent hover:underline"
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <pre className="type-meta whitespace-pre-wrap rounded-[4px] bg-paper p-3 font-sans text-ink-muted">
                        {method.methodBody}
                    </pre>
                </div>
            )}

            {isSuggestOpen && (
                <div className="mt-4 rounded-[8px] border border-rule bg-surface p-4">
                    {submitted ? (
                        <p className="type-meta text-ink">
                            Thanks — your suggestion is noted. In the demo this is recorded locally;
                            improvements create a new version and never overwrite the original.
                        </p>
                    ) : (
                        <>
                            <h3 className="type-label mb-2 text-ink">Suggest an improvement</h3>
                            <p className="type-meta mb-2 text-ink-muted">
                                Improvements create a new version. The original author is always
                                credited.
                            </p>
                            <textarea
                                value={suggestion}
                                onChange={(event) => setSuggestion(event.target.value)}
                                rows={4}
                                placeholder="What would you change, and why?"
                                className="w-full rounded-[4px] border border-rule bg-surface p-3 type-meta text-ink placeholder:text-ink-faint focus:border-accent"
                            />
                            <button
                                type="button"
                                disabled={suggestion.trim().length === 0}
                                onClick={() => setSubmitted(true)}
                                className="btn btn-primary btn-sm mt-2 disabled:opacity-40"
                            >
                                Submit suggestion
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
