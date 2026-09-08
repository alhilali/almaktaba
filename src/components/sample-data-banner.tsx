'use client';

import { useSyncExternalStore, useState } from 'react';
import { useLanguage } from '@/context/language-context';

const STORAGE_KEY = 'almaktaba.sample-banner.dismissed';

function subscribe(callback: () => void): () => void {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): boolean {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

function getServerSnapshot(): boolean {
    return false;
}

/**
 * Persistent, dismissible banner on the dashboard and insights pages.
 * Dismissal is a per-viewer convenience only; the footer disclosure and the
 * per-chart chips remain regardless (spec §2.1).
 */
export function SampleDataBanner(): React.ReactElement | null {
    const isStoredDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [isDismissedLocally, setIsDismissedLocally] = useState(false);
    const { t, isRTL } = useLanguage();

    if (isStoredDismissed || isDismissedLocally) {
        return null;
    }

    function dismiss(): void {
        setIsDismissedLocally(true);
        try {
            window.localStorage.setItem(STORAGE_KEY, '1');
        } catch {
            /* storage unavailable */
        }
    }

    return (
        <div className="border-b border-measure/25 bg-measure-sunk">
            <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-5 py-2.5 md:px-8">
                <p className="type-meta flex-1 text-measure">
                    <span className="font-semibold">
                        {isRTL ? 'بيانات توضيحية.' : 'Sample data.'}
                    </span>{' '}
                    {isRTL
                        ? 'الأرقام لتوضيح الواجهة وليست نتائج مقاسة.'
                        : 'Figures illustrate the interface, not measured results.'}
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    className="type-meta shrink-0 font-medium text-measure/80 hover:text-measure"
                    aria-label="Dismiss sample-data notice"
                >
                    {t('dismiss')}
                </button>
            </div>
        </div>
    );
}
