
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtpzidhagklgwyffzcxo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cHppZGhhZ2tsZ3d5ZmZ6Y3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTM0NDIsImV4cCI6MjA4NTY4OTQ0Mn0.eUx0kTIqkleD13roSsEyBwfWi22ULC-S7z5LuFBJ-cI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
