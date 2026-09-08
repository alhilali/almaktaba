import type { IMethod, Maturity } from '@/data/types';
import { METHODS } from '@/data/methods';
import { SECTORS } from '@/data/sectors';

/** Maturity is derived from reuse count (spec §4.3). */
export function maturityOf(method: IMethod): Maturity {
    if (method.reuseCount >= 20) {
        return 'Established';
    }
    if (method.reuseCount >= 5) {
        return 'Proven';
    }
    return 'New';
}

/** Minutes returned per run, for a method. */
export function timeSavedPerRun(method: IMethod): number {
    return Math.max(0, method.timeBeforeMin - method.timeAfterMin);
}

/** Total hours returned across all recorded reuses (illustrative). */
export function totalHoursReturned(methods: IMethod[] = METHODS): number {
    const minutes = methods.reduce(
        (sum, method) => sum + timeSavedPerRun(method) * method.reuseCount,
        0,
    );
    return Math.round(minutes / 60);
}

export interface ISummaryTiles {
    published: number;
    totalReuses: number;
    hoursReturned: number;
    avgReusePerMethod: number;
}

/** The four summary tiles shown above the catalogue. All illustrative. */
export function summaryTiles(methods: IMethod[] = METHODS): ISummaryTiles {
    const published = methods.length;
    const totalReuses = methods.reduce((sum, method) => sum + method.reuseCount, 0);
    return {
        published,
        totalReuses,
        hoursReturned: totalHoursReturned(methods),
        avgReusePerMethod: published === 0 ? 0 : Number((totalReuses / published).toFixed(1)),
    };
}

export interface ISectorCount {
    sectorId: string;
    name: string;
    color: string;
    count: number;
    totalReuse: number;
    reusePerMethod: number;
}

/** Method counts and reuse-per-method by sector, ordered by count desc. */
export function sectorCounts(methods: IMethod[] = METHODS): ISectorCount[] {
    return SECTORS.map((sector) => {
        const inSector = methods.filter((method) => method.sectorId === sector.id);
        const totalReuse = inSector.reduce((sum, method) => sum + method.reuseCount, 0);
        return {
            sectorId: sector.id,
            name: sector.name,
            color: sector.color,
            count: inSector.length,
            totalReuse,
            reusePerMethod: inSector.length === 0 ? 0 : Number((totalReuse / inSector.length).toFixed(1)),
        };
    }).sort((a, b) => b.count - a.count);
}

/** Count of methods per role id, for the filter list. */
export function methodCountByRole(methods: IMethod[] = METHODS): Map<string, number> {
    const counts = new Map<string, number>();
    for (const method of methods) {
        counts.set(method.roleId, (counts.get(method.roleId) ?? 0) + 1);
    }
    return counts;
}
