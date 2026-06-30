import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://usbvuyjvbfaphgyoqbuq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYnZ1eWp2YmZhcGhneW9xYnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTU5NzIsImV4cCI6MjA5Nzg5MTk3Mn0.KJFbz0kMY_Zun4uNX-50wo8uUroYvODqmbqlC0Qy7_4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
