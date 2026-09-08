'use client';

import { useLanguage } from '@/context/language-context';

export function LanguageSwitcher(): React.ReactElement {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-[4px] border border-rule px-2.5 py-1 text-xs font-semibold text-ink-muted transition-colors hover:border-accent hover:text-accent"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
        >
            <span className="text-[13px]">🌐</span>
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
    );
}
