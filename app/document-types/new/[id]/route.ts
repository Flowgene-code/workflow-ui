// app/api/document-type/[id]/route.ts
import { createClient } from '@/utils/supabase/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const body = await req.json()

  const { name, description, schema } = body

  const { data, error } = await supabase
    .from('document_types')
    .update({
      name,
      description,
      schema,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true, data }), { status: 200 })
}
