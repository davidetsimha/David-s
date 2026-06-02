import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// DELETE THIS FILE AFTER USE
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'reset-davids-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Missing env vars', url: !!url, serviceKey: !!serviceKey }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.auth.admin.updateUserById(
    'd2901def-300f-4fc7-8d53-c9c14ec40bc0',
    { password: 'David$Simha2024!' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId: data.user.id, email: data.user.email })
}
