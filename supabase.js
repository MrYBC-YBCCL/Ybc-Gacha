
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fselbwilstujrholgdld.supabase.co";
const SUPABASE_KEY = "sb_publishable_gDKRrp8nRXw5RGQY2rbhpA_lWKR1QD0";

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_KEY = SUPABASE_KEY;
