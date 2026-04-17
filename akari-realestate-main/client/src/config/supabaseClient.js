import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم بالقيم الخاصة بك من لوحة تحكم Supabase
const supabaseUrl = 'https://pngumoydgkdpurzbcxqv.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_YAdSiCennqPgMOdeeDO42g_ZRr9hYTz'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);