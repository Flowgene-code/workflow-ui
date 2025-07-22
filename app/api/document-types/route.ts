// app/api/document-types/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const body = await req.json()

    const { name, description, schema } = body

    const { data, error } = await supabase
      .from('document_types')
      .insert([{ name, description, schema }])
      .select()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0], { status: 201 })
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
