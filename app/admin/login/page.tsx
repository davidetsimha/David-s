'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

export default function AdminLoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(201,169,98,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(201,169,98,0.05)_0%,_transparent_40%)]" />

      <div className="w-full max-w-sm relative">
        <div className="bg-white rounded-xl shadow-elevated border border-gray-100 p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-card">
              <span className="font-display text-white text-xl font-semibold">D</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">David's Patisserie</h1>
            <p className="text-sm text-gray-500 mt-1">Espace Administration</p>
          </div>

          <LoginForm onSuccess={handleSuccess} />

          <p className="text-center text-xs text-gray-400 mt-6">
            Acces reserve aux administrateurs
          </p>
        </div>
      </div>
    </div>
  )
}
