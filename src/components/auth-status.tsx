'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useLanguage } from '@/context/language-context';

/** Header auth state: sign-in link, or the signed-in user + sign-out. */
export function AuthStatus(): React.ReactElement | null {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [email, setEmail] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setReady(true);
            return;
        }
        const supabase = createClient();
        let active = true;
        void (async () => {
            const { data } = await supabase.auth.getUser();
            if (active) {
                setEmail(data.user?.email ?? null);
                setReady(true);
            }
        })();
        const { data: sub } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setEmail(session?.user?.email ?? null);
            },
        );
        return () => {
            active = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    if (!isSupabaseConfigured() || !ready) {
        return null;
    }

    if (!email) {
        return (
            <Link href="/signin" className="type-label text-ink-muted hover:text-ink transition-colors">
                {isAr ? 'دخول' : 'Sign in'}
            </Link>
        );
    }

    async function signOut(): Promise<void> {
        const supabase = createClient();
        await supabase.auth.signOut();
        setEmail(null);
    }

    return (
        <div className="flex items-center gap-2">
            <span className="type-disclosure text-ink-faint hidden md:inline max-w-[140px] truncate">{email}</span>
            <button
                type="button"
                onClick={signOut}
                className="type-label text-ink-muted hover:text-ink transition-colors"
            >
                {isAr ? 'خروج' : 'Sign out'}
            </button>
        </div>
    );
}
