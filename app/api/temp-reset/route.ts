import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// DELETE THIS FILE AFTER USE
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== 'reset-davids-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: users } = await supabase.auth.admin.listUsers()
  const adminUser = users?.users?.find(u => u.email === 'admin@davids-patisserie.com')

  if (!adminUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { error } = await supabase.auth.admin.updateUserById(adminUser.id, {
    password: 'dadou1826',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Password updated. Delete this file now.' })
}
