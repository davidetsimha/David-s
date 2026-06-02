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

  const { data, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    return NextResponse.json({ error: listError.message, supabaseUrl: url.substring(0, 50) }, { status: 500 })
  }

  const users = data.users.map(u => ({ id: u.id, email: u.email, confirmed: !!u.email_confirmed_at }))
  return NextResponse.json({ users, supabaseUrl: url.substring(0, 50) })
}
