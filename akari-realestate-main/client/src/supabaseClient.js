import { createClient } from '@supabase/supabase-js'

// ⬇️ الصق رابط مشروعك هنا
const supabaseUrl = 'https://ccckyycyotfikywqqzsc.supabase.co' 

// ⬇️ الصق مفتاح الـ anon هنا
const supabaseAnonKey = 'sb_publishable_dyIYThTqM_g_oNN69-a6tQ_UVMPjCHt' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)