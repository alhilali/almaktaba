/** Supabase connection details, read from the environment. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Whether Supabase is configured. When false the app runs in demo mode against
 * the static seed catalogue, so it works with no backend and switches to the
 * database automatically once the env vars are present.
 */
export function isSupabaseConfigured(): boolean {
    return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
