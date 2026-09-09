import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '@/lib/supabase/config';

/** Refresh the Supabase auth session on each request and pass cookies through. */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
    let response = NextResponse.next({ request });

    if (!isSupabaseConfigured()) {
        return response;
    }

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                for (const { name, value } of cookiesToSet) {
                    request.cookies.set(name, value);
                }
                response = NextResponse.next({ request });
                for (const { name, value, options } of cookiesToSet) {
                    response.cookies.set(name, value, options);
                }
            },
        },
    });

    // Touch the session so it refreshes; do not gate routing on it.
    await supabase.auth.getUser();
    return response;
}
