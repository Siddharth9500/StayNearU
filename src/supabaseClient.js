import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cooshjydckxrpnmzghbp.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RtgkLMyIgQ_i3T6Uh7g65s_o3lJ0-'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
