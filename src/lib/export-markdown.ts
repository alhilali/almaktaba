import type { IMethod } from '@/data/types';
import { getSector } from '@/data/sectors';
import { getRole } from '@/data/roles';
import { formatMinutes } from '@/lib/utils';

/**
 * Renders a method as a self-contained markdown file to run inside an
 * organisation's own approved AI tool (spec §6.1). No network dependency —
 * everything needed to run the method travels with the file.
 */
export function methodToMarkdown(method: IMethod): string {
    const sector = getSector(method.sectorId)?.name ?? method.sectorId;
    const role = getRole(method.roleId)?.name ?? method.roleId;

    return `# ${method.title}

> Exported from Al-Maktaba for internal use.
> ${method.language} · ${role} · ${sector} · ${method.sensitivity}
> Built and tested on: ${method.provenance.builtOn}. Also reported working: ${method.provenance.alsoReported.join(', ')}.
> Author-reported provenance, not a benchmark. Sample data throughout.

## What it does
${method.whatItDoes}

## Inputs required
${method.inputsRequired.map((input) => `- ${input}`).join('\n')}

## What stays human
${method.whatStaysHuman}

## The method
${method.methodBody}

## Output format
${method.outputFormat}

## Quality checklist
${method.qualityChecklist.map((item) => `- [ ] ${item}`).join('\n')}

---
Typical time before: ${formatMinutes(method.timeBeforeMin)} · after: ${formatMinutes(
        method.timeAfterMin,
    )} (illustrative).
Confidential methods must be run inside your organisation's own approved tool, never pasted into an external service.
`;
}
