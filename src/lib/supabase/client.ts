'use client';

import { createBrowserClient } from '@supabase/ssr';

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config';

/** Browser Supabase client for use in client components. */
export function createClient(): ReturnType<typeof createBrowserClient> {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
