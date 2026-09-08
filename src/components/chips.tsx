import type { Language, Maturity, Sensitivity } from '@/data/types';
import { cn } from '@/lib/utils';

const NEUTRAL_CHIP = 'chip bg-surface-sunk text-ink-muted';

export function LanguageChip({ language }: { language: Language }): React.ReactElement {
    return <span className={NEUTRAL_CHIP}>{language}</span>;
}

export function SensitivityChip({ sensitivity }: { sensitivity: Sensitivity }): React.ReactElement {
    // Confidential is emphasised with a hairline, not a new colour (spec §4.2).
    return (
        <span
            className={cn(
                NEUTRAL_CHIP,
                sensitivity === 'Confidential' && 'border border-rule-strong text-ink',
            )}
        >
            {sensitivity}
        </span>
    );
}

export function MaturityChip({ maturity }: { maturity: Maturity }): React.ReactElement {
    return <span className={NEUTRAL_CHIP}>{maturity}</span>;
}
