import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config';

/** Server Supabase client bound to the request cookies (App Router). */
export async function createClient(): Promise<ReturnType<typeof createServerClient>> {
    const cookieStore = await cookies();
    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    for (const { name, value, options } of cookiesToSet) {
                        cookieStore.set(name, value, options);
                    }
                } catch {
                    // Called from a Server Component — the middleware refreshes the session instead.
                }
            },
        },
    });
}
