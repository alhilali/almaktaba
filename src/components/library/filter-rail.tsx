'use client';

import { useState } from 'react';

import type { Language, Maturity, Sensitivity } from '@/data/types';
import { SECTORS } from '@/data/sectors';
import { ROLE_FAMILIES } from '@/data/roles';
import { METHODS, getMethod } from '@/data/methods';

import { cn } from '@/lib/utils';

export interface IFilterState {
    sectors: string[];
    roles: string[];
    languages: Language[];
    sensitivities: Sensitivity[];
    maturities: Maturity[];
}

export const EMPTY_FILTERS: IFilterState = {
    sectors: [],
    roles: [],
    languages: [],
    sensitivities: [],
    maturities: [],
};

const LANGUAGES: Language[] = ['Arabic', 'English', 'Bilingual'];
const SENSITIVITIES: Sensitivity[] = ['Public', 'Internal', 'Confidential'];
const MATURITIES: Maturity[] = ['New', 'Proven', 'Established'];

function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

const SECTOR_COUNTS = new Map<string, number>(
    SECTORS.map((sector) => [
        sector.id,
        METHODS.filter((method) => method.sectorId === sector.id).length,
    ]),
);

function CheckRow({
    checked,
    onChange,
    label,
    meta,
    dot,
}: {
    checked: boolean;
    onChange: () => void;
    label: React.ReactNode;
    meta?: React.ReactNode;
    dot?: string;
}): React.ReactElement {
    return (
        <label
            className={cn(
                'flex cursor-pointer items-center gap-2.5 py-1.5 pr-1 type-meta transition-colors',
                checked ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />
            <span
                aria-hidden
                className={cn(
                    'grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border transition-colors',
                    checked ? 'border-accent bg-accent text-white' : 'border-rule-strong bg-surface',
                )}
            >
                {checked && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                            d="M1.5 5.2L4 7.5L8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>
            {dot && (
                <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: dot }}
                />
            )}
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {meta != null && <span className="shrink-0 text-ink-faint tabular-nums">{meta}</span>}
        </label>
    );
}

function Group({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <div className="border-t border-rule py-4 first:border-t-0 first:pt-0">
            <h3 className="type-label mb-2 text-ink-faint">{title}</h3>
            {children}
        </div>
    );
}

/** The persistent left index. Sector is the shelf; role/language/etc. below. */
export function FilterRail({
    filters,
    onChange,
}: {
    filters: IFilterState;
    onChange: (next: IFilterState) => void;
}): React.ReactElement {
    const [roleQuery, setRoleQuery] = useState('');

    const visibleRoles = ROLE_FAMILIES.filter((role) =>
        role.name.toLowerCase().includes(roleQuery.trim().toLowerCase()),
    );

    const hasActiveFilter =
        filters.sectors.length +
            filters.roles.length +
            filters.languages.length +
            filters.sensitivities.length +
            filters.maturities.length >
        0;

    return (
        <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="type-label text-ink">Filter</h2>
                {hasActiveFilter && (
                    <button
                        type="button"
                        onClick={() => onChange(EMPTY_FILTERS)}
                        className="type-meta font-medium text-accent hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <Group title="Sector">
                <div className="space-y-0">
                    {SECTORS.map((sector) => (
                        <CheckRow
                            key={sector.id}
                            checked={filters.sectors.includes(sector.id)}
                            onChange={() =>
                                onChange({ ...filters, sectors: toggle(filters.sectors, sector.id) })
                            }
                            label={sector.name}
                            meta={SECTOR_COUNTS.get(sector.id) ?? 0}
                            dot={sector.color}
                        />
                    ))}
                </div>
            </Group>

            <Group title="Role family">
                <input
                    type="text"
                    value={roleQuery}
                    onChange={(event) => setRoleQuery(event.target.value)}
                    placeholder="Search roles"
                    className="mb-2 w-full rounded-[4px] border border-rule bg-surface px-2.5 py-1.5 type-meta text-ink placeholder:text-ink-faint focus:border-accent"
                />
                <div className="max-h-64 space-y-0 overflow-y-auto pr-1">
                    {visibleRoles.map((role) => (
                        <CheckRow
                            key={role.id}
                            checked={filters.roles.includes(role.id)}
                            onChange={() =>
                                onChange({ ...filters, roles: toggle(filters.roles, role.id) })
                            }
                            label={role.name}
                            meta={
                                <span title="Share of this role's work AI can address">
                                    {role.aiAddressable}%
                                </span>
                            }
                        />
                    ))}
                    {visibleRoles.length === 0 && (
                        <p className="type-meta py-2 text-ink-faint">No roles match.</p>
                    )}
                </div>
                <p className="type-disclosure mt-1.5 text-ink-faint">
                    % is the share of that role&rsquo;s work AI can realistically address.
                </p>
            </Group>

            <Group title="Language">
                {LANGUAGES.map((language) => (
                    <CheckRow
                        key={language}
                        checked={filters.languages.includes(language)}
                        onChange={() =>
                            onChange({ ...filters, languages: toggle(filters.languages, language) })
                        }
                        label={language}
                    />
                ))}
            </Group>

            <Group title="Data sensitivity">
                {SENSITIVITIES.map((sensitivity) => (
                    <CheckRow
                        key={sensitivity}
                        checked={filters.sensitivities.includes(sensitivity)}
                        onChange={() =>
                            onChange({
                                ...filters,
                                sensitivities: toggle(filters.sensitivities, sensitivity),
                            })
                        }
                        label={sensitivity}
                    />
                ))}
                <p className="type-disclosure mt-1.5 text-ink-faint">
                    Confidential methods are exported and run inside your organisation&rsquo;s own
                    approved tool, never in Al-Maktaba.
                </p>
            </Group>

            <Group title="Maturity">
                {MATURITIES.map((maturity) => (
                    <CheckRow
                        key={maturity}
                        checked={filters.maturities.includes(maturity)}
                        onChange={() =>
                            onChange({
                                ...filters,
                                maturities: toggle(filters.maturities, maturity),
                            })
                        }
                        label={maturity}
                        meta={
                            maturity === 'Proven'
                                ? '5+'
                                : maturity === 'Established'
                                  ? '20+'
                                  : undefined
                        }
                    />
                ))}
            </Group>
        </div>
    );
}

// Re-exported so pages can resolve a method without another import line.
export { getMethod };
