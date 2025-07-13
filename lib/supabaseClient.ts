'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase' // Optional: Your generated DB types

export const supabase = createClientComponentClient<Database>()
