import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ykclazwdkhlzufnczxev.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2xhendka2hsenVmbmN6eGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NDIxMTYsImV4cCI6MjA4NzExODExNn0.fp6xjTLJH4szfTHQX2-dibXIDCMbG0b9iEnQEfDE9Vs';

export const supabase = createClient(supabaseUrl, supabaseKey);
