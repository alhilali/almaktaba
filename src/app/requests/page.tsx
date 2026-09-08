'use client';

import { useState } from 'react';
import Link from 'next/link';

import type { Language, IMethodRequest } from '@/data/types';
import { METHOD_REQUESTS } from '@/data/requests';
import { SECTORS, getSector } from '@/data/sectors';
import { ROLE_FAMILIES, getRole } from '@/data/roles';
import { cn } from '@/lib/utils';
import { SampleDataBanner } from '@/components/sample-data-banner';
import { IllustrativeChip } from '@/components/illustrative-chip';
import { LanguageChip } from '@/components/chips';

type StatusFilter = 'All' | 'Open' | 'Claimed';

export default function RequestsPage(): React.ReactElement {
    const [requests, setRequests] = useState<IMethodRequest[]>(METHOD_REQUESTS);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [sectorFilter, setSectorFilter] = useState<string>('');
    const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

    // New request form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [newSector, setNewSector] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newLang, setNewLang] = useState<Language>('Arabic');

    // Claim modal state
    const [claimRequestId, setClaimRequestId] = useState<string | null>(null);
    const [claimOrg, setClaimOrg] = useState('');

    function handleVote(id: string): void {
        const hasVoted = !!userVotes[id];
        setUserVotes((prev) => ({ ...prev, [id]: !hasVoted }));
        setRequests((prev) =>
            prev.map((req) => {
                if (req.id !== id) return req;
                return {
                    ...req,
                    votes: hasVoted ? req.votes - 1 : req.votes + 1,
                };
            }),
        );
    }

    function handleClaimSubmit(event: React.FormEvent): void {
        event.preventDefault();
        if (!claimRequestId || !claimOrg.trim()) return;

        setRequests((prev) =>
            prev.map((req) => {
                if (req.id !== claimRequestId) return req;
                return {
                    ...req,
                    status: 'Claimed',
                    claimedByOrg: claimOrg.trim(),
                };
            }),
        );
        setClaimRequestId(null);
        setClaimOrg('');
    }

    function handleCreateRequest(event: React.FormEvent): void {
        event.preventDefault();
        if (!newTask.trim() || !newSector || !newRole) return;

        const created: IMethodRequest = {
            id: `req-${Date.now()}`,
            task: newTask.trim(),
            sectorId: newSector,
            roleId: newRole,
            language: newLang,
            votes: 1,
            status: 'Open',
        };

        setRequests((prev) => [created, ...prev]);
        setUserVotes((prev) => ({ ...prev, [created.id]: true }));
        setNewTask('');
        setIsFormOpen(false);
    }

    const filtered = requests.filter((req) => {
        if (statusFilter !== 'All' && req.status !== statusFilter) return false;
        if (sectorFilter && req.sectorId !== sectorFilter) return false;
        return true;
    });

    const openCount = requests.filter((r) => r.status === 'Open').length;
    const claimedCount = requests.filter((r) => r.status === 'Claimed').length;
    const totalVotes = requests.reduce((acc, r) => acc + r.votes, 0);

    return (
        <>
            <SampleDataBanner />

            <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-8 md:px-8 lg:pb-16">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="type-display-2 text-ink">Request a method</h1>
                        <p className="type-meta mt-1 max-w-[720px] text-ink-muted">
                            Colleagues and organisations post tasks they wish existed as methods.
                            Vote for priorities or claim a request to author it.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <IllustrativeChip />
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="btn btn-primary btn-sm"
                        >
                            {isFormOpen ? 'Close form' : '+ Post a request'}
                        </button>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-rule bg-rule lg:grid-cols-4">
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Open requests</div>
                        <div className="type-display-3 mt-1 tabular-nums text-ink">{openCount}</div>
                        <p className="type-disclosure mt-1 text-ink-muted">Awaiting authors</p>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Claimed in progress</div>
                        <div className="type-display-3 mt-1 tabular-nums text-accent">
                            {claimedCount}
                        </div>
                        <p className="type-disclosure mt-1 text-ink-muted">By participating entities</p>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Total community votes</div>
                        <div className="type-display-3 mt-1 tabular-nums text-measure">
                            {totalVotes}
                        </div>
                        <p className="type-disclosure mt-1 text-ink-muted">Priority signals</p>
                    </div>
                    <div className="bg-surface p-4">
                        <div className="type-disclosure text-ink-faint">Cold-start solution</div>
                        <div className="type-label mt-2 font-medium text-ink">
                            Demand-led authoring
                        </div>
                        <p className="type-disclosure mt-1 text-ink-muted">Focus on real needs</p>
                    </div>
                </div>

                {/* Expandable New Request Form */}
                {isFormOpen && (
                    <form
                        onSubmit={handleCreateRequest}
                        className="mb-8 rounded-[8px] border border-accent bg-surface p-6"
                    >
                        <h2 className="type-label text-ink font-semibold mb-1">
                            Post a new task request
                        </h2>
                        <p className="type-meta text-ink-muted mb-4">
                            Describe a recurring workflow you want an approved method for.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="type-disclosure block text-ink-faint mb-1">
                                    Task description (Arabic or English)
                                </label>
                                <textarea
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="e.g. صياغة مذكرة موافقة ميزانية داخلية أو A structured shift-handover summary"
                                    className="w-full rounded-[4px] border border-rule bg-paper px-3 py-2 type-body text-ink placeholder:text-ink-faint focus:border-accent"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="type-disclosure block text-ink-faint mb-1">
                                        Sector
                                    </label>
                                    <select
                                        value={newSector}
                                        onChange={(e) => setNewSector(e.target.value)}
                                        required
                                        className="w-full rounded-[4px] border border-rule bg-paper px-3 py-2 type-meta text-ink focus:border-accent"
                                    >
                                        <option value="">Select sector…</option>
                                        {SECTORS.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="type-disclosure block text-ink-faint mb-1">
                                        Role family
                                    </label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        required
                                        className="w-full rounded-[4px] border border-rule bg-paper px-3 py-2 type-meta text-ink focus:border-accent"
                                    >
                                        <option value="">Select role…</option>
                                        {ROLE_FAMILIES.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="type-disclosure block text-ink-faint mb-1">
                                        Language
                                    </label>
                                    <select
                                        value={newLang}
                                        onChange={(e) => setNewLang(e.target.value as Language)}
                                        className="w-full rounded-[4px] border border-rule bg-paper px-3 py-2 type-meta text-ink focus:border-accent"
                                    >
                                        <option value="Arabic">Arabic</option>
                                        <option value="English">English</option>
                                        <option value="Bilingual">Bilingual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary btn-sm">
                                    Publish request
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
                    <div className="flex items-center gap-2">
                        {(['All', 'Open', 'Claimed'] as StatusFilter[]).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setStatusFilter(tab)}
                                className={cn(
                                    'chip border transition-colors',
                                    statusFilter === tab
                                        ? 'border-accent bg-accent-sunk text-accent font-semibold'
                                        : 'border-rule bg-surface text-ink-muted hover:border-rule-strong',
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 type-meta text-ink-muted">
                        <span>Sector:</span>
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="rounded-[4px] border border-rule bg-surface px-2 py-1 type-meta text-ink focus:border-accent"
                        >
                            <option value="">All sectors</option>
                            {SECTORS.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Request List */}
                <div className="space-y-3">
                    {filtered.map((req) => {
                        const sector = getSector(req.sectorId);
                        const role = getRole(req.roleId);
                        const hasVoted = !!userVotes[req.id];
                        const isArabic = /[\u0600-\u06FF]/.test(req.task);

                        return (
                            <div
                                key={req.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[8px] border border-rule bg-surface p-4 transition-colors hover:border-rule-strong"
                            >
                                {/* Left: Vote button + details */}
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <button
                                        type="button"
                                        onClick={() => handleVote(req.id)}
                                        className={cn(
                                            'flex flex-col items-center justify-center w-12 h-14 rounded-[4px] border shrink-0 transition-colors',
                                            hasVoted
                                                ? 'border-accent bg-accent-sunk text-accent font-semibold'
                                                : 'border-rule bg-surface-sunk/50 text-ink-muted hover:border-accent hover:text-accent',
                                        )}
                                        title={hasVoted ? 'Remove vote' : 'Upvote this request'}
                                    >
                                        <span className="text-xs">▲</span>
                                        <span className="type-meta tabular-nums">{req.votes}</span>
                                    </button>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span
                                                aria-hidden
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: sector?.color }}
                                            />
                                            <span className="type-disclosure text-ink-muted">
                                                {sector?.name}
                                            </span>
                                            <span className="type-disclosure text-ink-faint">·</span>
                                            <span className="type-disclosure text-ink-muted">
                                                {role?.name}
                                            </span>
                                            <LanguageChip language={req.language} />
                                        </div>

                                        <p
                                            dir={isArabic ? 'rtl' : 'ltr'}
                                            lang={isArabic ? 'ar' : 'en'}
                                            className={cn(
                                                'type-body font-medium text-ink',
                                                isArabic && 'font-arabic',
                                            )}
                                        >
                                            {req.task}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Status + Claim / Author action */}
                                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                    {req.status === 'Claimed' ? (
                                        <div className="text-right">
                                            <span className="chip border border-accent bg-accent-sunk text-accent font-semibold text-[11px]">
                                                Claimed
                                            </span>
                                            {req.claimedByOrg && (
                                                <p className="type-disclosure text-ink-faint mt-1">
                                                    by {req.claimedByOrg}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setClaimRequestId(req.id)}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Claim
                                            </button>
                                            <Link
                                                href="/publish"
                                                className="btn btn-primary btn-sm"
                                            >
                                                Author this
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="rounded-[8px] border border-dashed border-rule-strong bg-surface p-12 text-center">
                            <p className="type-display-3 text-ink">No requests match this filter.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter('All');
                                    setSectorFilter('');
                                }}
                                className="btn btn-secondary mt-4"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Claim Modal Dialog */}
                {claimRequestId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
                        <div className="w-full max-w-md rounded-[8px] border border-rule bg-surface p-6">
                            <h3 className="type-display-3 text-ink mb-2">Claim this request</h3>
                            <p className="type-meta text-ink-muted mb-4">
                                State your organisation or department so colleagues know this method is being drafted.
                            </p>
                            <form onSubmit={handleClaimSubmit}>
                                <input
                                    type="text"
                                    value={claimOrg}
                                    onChange={(e) => setClaimOrg(e.target.value)}
                                    placeholder="e.g. Ministry programme office or Bank compliance"
                                    required
                                    autoFocus
                                    className="w-full rounded-[4px] border border-rule bg-paper px-3 py-2 type-body text-ink mb-4 focus:border-accent"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setClaimRequestId(null);
                                            setClaimOrg('');
                                        }}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-sm">
                                        Confirm claim
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
