import Link from 'next/link';

import type { IMethod } from '@/data/types';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { maturityOf } from '@/data/derive';
import { formatMinutes } from '@/lib/utils';
import { MethodTitle, ReuseCount, RatingLine } from '@/components/method-bits';
import { LanguageChip, SensitivityChip, MaturityChip } from '@/components/chips';
import { IllustrativeChip } from '@/components/illustrative-chip';

function Stat({ label, children }: { label: string; children: React.ReactNode }): React.ReactElement {
    return (
        <div>
            <div className="type-disclosure text-ink-faint">{label}</div>
            <div className="type-body mt-0.5 font-medium text-ink">{children}</div>
        </div>
    );
}

/** The right-hand preview. On mobile the page renders this inside a sheet. */
export function MethodPreviewPanel({
    method,
    onClose,
}: {
    method: IMethod | null;
    onClose?: () => void;
}): React.ReactElement {
    if (!method) {
        return (
            <div className="hidden h-full flex-col items-center justify-center px-6 text-center lg:flex">
                <p className="type-meta max-w-[220px] text-ink-faint">
                    Select a method to see its summary here.
                </p>
            </div>
        );
    }

    const sector = getSector(method.sectorId);
    const role = getRole(method.roleId);

    return (
        <div className="flex h-full flex-col bg-surface">
            <div className="flex items-start justify-between gap-3 border-b border-rule p-5">
                <div className="min-w-0">
                    <div className="type-meta mb-1 flex items-center gap-1.5 text-ink-faint">
                        <span
                            aria-hidden
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: sector?.color }}
                        />
                        {sector?.name} · {role?.name}
                    </div>
                    <MethodTitle method={method} className="type-display-3 block text-ink" />
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="type-label shrink-0 rounded-[4px] px-2 py-1 text-ink-muted hover:bg-surface-sunk lg:hidden"
                    >
                        Close
                    </button>
                )}
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <p className="type-body text-ink-muted">{method.description}</p>

                <div className="flex flex-wrap gap-1.5">
                    <LanguageChip language={method.language} />
                    <SensitivityChip sensitivity={method.sensitivity} />
                    <MaturityChip maturity={maturityOf(method)} />
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-rule py-4">
                    <Stat label="Reuses">
                        <ReuseCount count={method.reuseCount} className="text-xl" />
                    </Stat>
                    <Stat label="Rating">
                        <RatingLine method={method} className="type-body" />
                    </Stat>
                    <Stat label="Typical time before">{formatMinutes(method.timeBeforeMin)}</Stat>
                    <Stat label="Typical time after">
                        <span className="text-measure">{formatMinutes(method.timeAfterMin)}</span>
                    </Stat>
                </div>

                <div>
                    <div className="type-disclosure text-ink-faint">What stays human</div>
                    <p className="type-meta mt-1 text-ink-muted">{method.whatStaysHuman}</p>
                </div>

                <div className="rounded-[8px] border border-rule bg-paper p-3">
                    <div className="type-disclosure mb-1 flex items-center gap-2 text-ink-faint">
                        Provenance <IllustrativeChip />
                    </div>
                    <p className="type-meta text-ink-muted">
                        <span className="font-medium text-ink">Built and tested on:</span>{' '}
                        {method.provenance.builtOn}
                        <br />
                        <span className="font-medium text-ink">Also reported working:</span>{' '}
                        {method.provenance.alsoReported.join(', ')}
                    </p>
                    <p className="type-disclosure mt-1.5 text-ink-faint">
                        Reported by the author and reusers. Not a benchmark.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-rule p-5">
                <Link href={`/library/${method.id}`} className="btn btn-primary w-full">
                    Open method
                </Link>
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href={`/library/${method.id}#run`}
                        className="btn btn-secondary btn-sm w-full"
                    >
                        Run this method
                    </Link>
                    <a
                        href={`/api/export/${method.id}`}
                        className="btn btn-secondary btn-sm w-full"
                    >
                        Export
                    </a>
                </div>
            </div>
        </div>
    );
}
