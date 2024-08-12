import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://bgyxiulwkbytzfqiphww.supabase.co';
const supabaseKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneXhpdWx3a2J5dHpmcWlwaHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNzI3MTgsImV4cCI6MjAzMzc0ODcxOH0.Ow1rJzvIH8oPdT4yz8OBMvFUD3vZF4nvuo8hzexXA48';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
