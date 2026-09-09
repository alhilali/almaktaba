'use client';

import { useState } from 'react';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { useLanguage } from '@/context/language-context';

export default function SignInPage(): React.ReactElement {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const configured = isSupabaseConfigured();

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function sendMagicLink(): Promise<void> {
        if (!email.trim()) {
            return;
        }
        setStatus('sending');
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
            });
            if (error) {
                throw error;
            }
            setStatus('sent');
        } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'Sign-in failed.');
        }
    }

    async function signInWithGoogle(): Promise<void> {
        try {
            const supabase = createClient();
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/auth/callback` },
            });
        } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'Sign-in failed.');
        }
    }

    return (
        <div className="mx-auto max-w-[440px] px-5 py-20 md:px-8">
            <h1 className="type-display-2 text-ink">{isAr ? 'تسجيل الدخول' : 'Sign in'}</h1>
            <p className="type-meta mt-1 text-ink-muted">
                {isAr
                    ? 'سجّل الدخول لنشر الأساليب وتُنسب باسمك، ولتسجيل مرات إعادة الاستخدام.'
                    : 'Sign in to publish methods attributed to you and to record reuse.'}
            </p>

            {!configured ? (
                <div className="mt-6 rounded-[8px] border border-rule bg-surface p-5">
                    <p className="type-body text-ink">
                        {isAr ? 'المصادقة غير مُفعّلة بعد.' : 'Authentication isn’t configured yet.'}
                    </p>
                    <p className="type-meta mt-2 text-ink-muted">
                        {isAr
                            ? 'أضف مفاتيح Supabase إلى بيئة التشغيل لتفعيل تسجيل الدخول (راجع SETUP.md).'
                            : 'Add the Supabase environment keys to enable sign-in (see SETUP.md).'}
                    </p>
                    <Link href="/library" className="btn btn-secondary btn-sm mt-4">
                        {isAr ? 'تصفح المكتبة' : 'Browse the library'}
                    </Link>
                </div>
            ) : status === 'sent' ? (
                <div className="mt-6 rounded-[8px] border border-accent bg-accent-sunk/40 p-5">
                    <p className="type-body font-medium text-ink">
                        {isAr ? 'تحقق من بريدك' : 'Check your email'}
                    </p>
                    <p className="type-meta mt-1 text-ink-muted">
                        {isAr
                            ? `أرسلنا رابط دخول إلى ${email}.`
                            : `We sent a sign-in link to ${email}.`}
                    </p>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    <button type="button" onClick={signInWithGoogle} className="btn btn-secondary w-full">
                        {isAr ? 'المتابعة عبر Google' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-3 type-disclosure text-ink-faint">
                        <span className="h-px flex-1 bg-rule" />
                        {isAr ? 'أو' : 'or'}
                        <span className="h-px flex-1 bg-rule" />
                    </div>

                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder={isAr ? 'بريدك الإلكتروني' : 'you@example.com'}
                            className="w-full rounded-[4px] border border-rule bg-surface px-3 py-2 type-body text-ink placeholder:text-ink-faint focus:border-accent"
                        />
                        <button
                            type="button"
                            onClick={sendMagicLink}
                            disabled={status === 'sending' || !email.trim()}
                            className="btn btn-primary mt-3 w-full disabled:opacity-40"
                        >
                            {status === 'sending'
                                ? isAr ? 'جارٍ الإرسال…' : 'Sending…'
                                : isAr ? 'أرسل رابط الدخول' : 'Email me a sign-in link'}
                        </button>
                    </div>

                    {status === 'error' && <p className="type-meta text-measure">{message}</p>}
                </div>
            )}
        </div>
    );
}
