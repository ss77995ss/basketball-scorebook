import { createClient } from '@supabase/supabase-js';

// ponytail: single browser client, anon key + RLS. Swap in @supabase/ssr only
// when auth cookies or server-side queries are actually needed.
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
