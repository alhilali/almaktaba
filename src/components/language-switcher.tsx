'use client';

import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export function LanguageSwitcher(): React.ReactElement {
    const { language, setLanguage } = useLanguage();

    return (
        <div
            role="group"
            aria-label="Language selection"
            className="inline-flex items-center rounded-[5px] border border-rule bg-surface-sunk/60 p-0.5 text-xs font-medium"
        >
            <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={cn(
                    'rounded-[3px] px-2.5 py-1 transition-all duration-150',
                    language === 'ar'
                        ? 'bg-surface font-bold text-accent shadow-xs border border-rule/80'
                        : 'text-ink-muted hover:text-ink'
                )}
            >
                العربية
            </button>
            <span className="text-rule-strong mx-0.5 select-none" aria-hidden>
                |
            </span>
            <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                    'rounded-[3px] px-2.5 py-1 transition-all duration-150 font-sans',
                    language === 'en'
                        ? 'bg-surface font-bold text-accent shadow-xs border border-rule/80'
                        : 'text-ink-muted hover:text-ink'
                )}
            >
                English
            </button>
        </div>
    );
}

