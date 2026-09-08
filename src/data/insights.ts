import { METHODS } from '@/data/methods';
import { ROLE_FAMILIES, getRole } from '@/data/roles';
import { sectorCounts } from '@/data/derive';

/**
 * Datasets for the executive insights view. Everything here is illustrative.
 * Where possible figures are derived from the seed catalogue so the charts
 * stay internally consistent with the rows on /library.
 */

export interface IReusePerSector {
    sectorId: string;
    name: string;
    color: string;
    reusePerMethod: number;
    count: number;
}

/** Reuse per method by sector, ordered by the figure (spec §5.5). */
export function reusePerSector(): IReusePerSector[] {
    return sectorCounts()
        .filter((sector) => sector.count > 0)
        .map((sector) => ({
            sectorId: sector.sectorId,
            name: sector.name,
            color: sector.color,
            reusePerMethod: sector.reusePerMethod,
            count: sector.count,
        }))
        .sort((a, b) => b.reusePerMethod - a.reusePerMethod);
}

/** Below roughly this figure a library has become a dumping ground. */
export const REUSE_REFERENCE_LINE = 2.0;

export interface ITimeReductionByRole {
    roleId: string;
    name: string;
    aiAddressable: number;
    beforeMin: number;
    afterMin: number;
    savedMin: number;
}

/** Average time before/after by role family, with AI-addressable share shown. */
export function timeReductionByRole(): ITimeReductionByRole[] {
    const rows: ITimeReductionByRole[] = [];
    for (const role of ROLE_FAMILIES) {
        const inRole = METHODS.filter((method) => method.roleId === role.id);
        if (inRole.length === 0) {
            continue;
        }
        const beforeMin = Math.round(
            inRole.reduce((sum, method) => sum + method.timeBeforeMin, 0) / inRole.length,
        );
        const afterMin = Math.round(
            inRole.reduce((sum, method) => sum + method.timeAfterMin, 0) / inRole.length,
        );
        rows.push({
            roleId: role.id,
            name: role.name,
            aiAddressable: role.aiAddressable,
            beforeMin,
            afterMin,
            savedMin: beforeMin - afterMin,
        });
    }
    return rows.sort((a, b) => b.savedMin - a.savedMin);
}

export interface ILadderRung {
    key: string;
    label: string;
    population: number;
    isMaktabaRung: boolean;
}

/**
 * Adoption ladder distribution. The five rungs are the programme's model,
 * credited on the landing page. Al-Maktaba operates on integration.
 */
export const ADOPTION_LADDER: ILadderRung[] = [
    { key: 'access', label: 'Access', population: 100, isMaktabaRung: false },
    { key: 'activation', label: 'Activation', population: 63, isMaktabaRung: false },
    { key: 'habit', label: 'Habit', population: 34, isMaktabaRung: false },
    { key: 'integration', label: 'Integration', population: 12, isMaktabaRung: true },
    { key: 'impact', label: 'Impact', population: 5, isMaktabaRung: false },
];

export interface IReuseSplit {
    label: string;
    share: number;
}

/**
 * Cross-organisation versus internal reuse. Presented honestly: most reuse
 * happens inside one organisation. That is a finding, not a failure.
 */
export const REUSE_SPLIT: IReuseSplit[] = [
    { label: 'Within the same organisation', share: 84 },
    { label: 'Across organisations', share: 16 },
];

export interface IArabicCoverage {
    roleId: string;
    name: string;
    arabic: number;
    english: number;
}

/** Arabic (incl. bilingual) vs English-only method coverage by role family. */
export function arabicCoverageByRole(): IArabicCoverage[] {
    const rows: IArabicCoverage[] = [];
    for (const role of ROLE_FAMILIES) {
        const inRole = METHODS.filter((method) => method.roleId === role.id);
        if (inRole.length === 0) {
            continue;
        }
        const arabic = inRole.filter((method) => method.language !== 'English').length;
        rows.push({
            roleId: role.id,
            name: role.name,
            arabic,
            english: inRole.length - arabic,
        });
    }
    return rows.sort((a, b) => b.arabic + b.english - (a.arabic + a.english));
}

export { getRole };
