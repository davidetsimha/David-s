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
    'b58344c1-1b8b-4016-9606-91f4031624fe',
    { password: 'Davids2026' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId: data.user.id, email: data.user.email })
}
