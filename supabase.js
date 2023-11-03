import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://yhpgtvnrcgqnqdkdbnqo.supabase.co";
const supabaseANON = process.env.NEXT_PUBLIC_SUPABASE_ANON;

const supabase = createClient(supabaseURL, supabaseANON);

export default supabase;
