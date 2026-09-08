'use client';

import {
    createContext,
    useContext,
    useEffect,
    useSyncExternalStore,
    useState,
    type ReactNode,
} from 'react';
import { useMemo } from 'react';
import { TRANSLATIONS, type SupportedLanguage } from '@/lib/translations';

export type TranslationKey = keyof typeof TRANSLATIONS['en'];

export type TranslationHelper = ((key: TranslationKey) => string) & typeof TRANSLATIONS['en'];

export interface ILanguageContext {
    language: SupportedLanguage;
    lang: SupportedLanguage;
    dir: 'rtl' | 'ltr';
    isRTL: boolean;
    setLanguage: (lang: SupportedLanguage) => void;
    toggleLanguage: () => void;
    t: TranslationHelper;
}

const LanguageContext = createContext<ILanguageContext | null>(null);

const STORAGE_KEY = 'almaktaba_lang_pref';
const COOKIE_KEY = 'almaktaba_lang';

function subscribe(callback: () => void): () => void {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): SupportedLanguage {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
        if (saved === 'en' || saved === 'ar') return saved;
        const match = document.cookie.match(new RegExp('(^| )' + COOKIE_KEY + '=([^;]+)'));
        if (match && (match[2] === 'en' || match[2] === 'ar')) {
            return match[2] as SupportedLanguage;
        }
        return 'ar';
    } catch {
        return 'ar';
    }
}

export function LanguageProvider({
    children,
    initialLanguage = 'ar',
}: {
    children: ReactNode;
    initialLanguage?: SupportedLanguage;
}): React.ReactElement {
    const getServerSnapshot = (): SupportedLanguage => initialLanguage;
    const storedLang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [overrideLang, setOverrideLang] = useState<SupportedLanguage | null>(null);

    const language: SupportedLanguage = overrideLang ?? storedLang ?? initialLanguage;

    // Synchronize document attributes to external system (DOM)
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    function setLanguage(lang: SupportedLanguage): void {
        setOverrideLang(lang);
        try {
            window.localStorage.setItem(STORAGE_KEY, lang);
            document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            window.dispatchEvent(new Event('storage'));
        } catch {
            // storage error
        }
    }

    function toggleLanguage(): void {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    }

    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;

    const t = useMemo(() => {
        const fn = (key: TranslationKey): string => {
            return dict[key] || TRANSLATIONS.en[key] || (key as string);
        };
        return Object.assign(fn, dict) as TranslationHelper;
    }, [dict]);

    const isRTL = language === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider
            value={{
                language,
                lang: language,
                dir,
                isRTL,
                setLanguage,
                toggleLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): ILanguageContext {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
