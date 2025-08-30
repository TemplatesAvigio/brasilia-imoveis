import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amysmknaafwzguvhwitg.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXNta25hYWZ3emd1dmh3aXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA3NjksImV4cCI6MjA3MjA4Njc2OX0.GAV8MlySgVpNo7l57tZ-jDTaLwlYonQucybCahMbWKk'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cliente para operações do lado do servidor (usando service_role)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXNta25hYWZ3emd1dmh3aXRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjUxMDc2OSwiZXhwIjoyMDcyMDg2NzY5fQ.gjlBiDODoEw3Ls_FZmxDfweFvfxa6Z7F5VkJnEpKcpM'

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)
