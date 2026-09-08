'use client';

import type { Language, Maturity, Sensitivity } from '@/data/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

const NEUTRAL_CHIP = 'chip bg-surface-sunk text-ink-muted';

const LANG_AR: Record<Language, string> = {
    Arabic: 'عربية',
    English: 'إنجليزية',
    Bilingual: 'ثنائي اللغة',
};

const SENSITIVITY_AR: Record<Sensitivity, string> = {
    Public: 'عام',
    Internal: 'داخلي',
    Confidential: 'سري',
};

const MATURITY_AR: Record<Maturity, string> = {
    New: 'جديد',
    Proven: 'معتمد',
    Established: 'راسخ',
};

export function LanguageChip({ language }: { language: Language }): React.ReactElement {
    const { lang } = useLanguage();
    const label = lang === 'ar' ? LANG_AR[language] || language : language;
    return <span className={NEUTRAL_CHIP}>{label}</span>;
}

export function SensitivityChip({ sensitivity }: { sensitivity: Sensitivity }): React.ReactElement {
    const { lang } = useLanguage();
    const label = lang === 'ar' ? SENSITIVITY_AR[sensitivity] || sensitivity : sensitivity;
    return (
        <span
            className={cn(
                NEUTRAL_CHIP,
                sensitivity === 'Confidential' && 'border border-rule-strong text-ink',
            )}
        >
            {label}
        </span>
    );
}

export function MaturityChip({ maturity }: { maturity: Maturity }): React.ReactElement {
    const { lang } = useLanguage();
    const label = lang === 'ar' ? MATURITY_AR[maturity] || maturity : maturity;
    return <span className={NEUTRAL_CHIP}>{label}</span>;
}
