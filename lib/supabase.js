import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null enquanto as credenciais não estiverem no .env.local — o site usa a lista estática
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
