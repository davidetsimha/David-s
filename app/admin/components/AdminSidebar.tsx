'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  LogOut,
  X,
  FolderTree,
  Settings,
  Mail,
  Users,
  MapPin,
  UtensilsCrossed,
  Image,
  HelpCircle,
  type LucideIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
  end?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { href: '/admin/products', icon: Package, label: 'Produits' },
      { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
      { href: '/admin/formulas', icon: UtensilsCrossed, label: 'Formules' },
    ],
  },
  {
    label: 'Ventes',
    items: [
      { href: '/admin/orders', icon: ShoppingBag, label: 'Commandes' },
      { href: '/admin/quotes', icon: MessageSquare, label: 'Devis' },
    ],
  },
  {
    label: 'Relations',
    items: [
      { href: '/admin/messages', icon: Mail, label: 'Messages' },
      { href: '/admin/customers', icon: Users, label: 'Clients' },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { href: '/admin/media', icon: Image, label: 'Medias' },
      { href: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/admin/delivery-zones', icon: MapPin, label: 'Zones livraison' },
      { href: '/admin/settings', icon: Settings, label: 'Parametres' },
    ],
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const isActive = (href: string, end?: boolean) => {
    if (end) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 start-0 w-64 bg-white border-e border-gray-100
          flex flex-col z-50 shadow-sm
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
              <span className="font-serif text-white text-base font-semibold">D</span>
            </div>
            <div>
              <h1 className="font-serif text-gray-900 text-base leading-tight">David's</h1>
              <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase">Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex > 0 ? 'mt-6' : ''}>
              <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, icon: Icon, label, end }) => {
                  const active = isActive(href, end)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-150 group
                        ${active
                          ? 'bg-amber-50 text-amber-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-amber-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      <span className="text-sm">{label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setLogoutConfirm(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
              text-gray-500 hover:text-red-600 hover:bg-red-50
              transition-all duration-150 group"
          >
            <LogOut className="w-[18px] h-[18px] text-gray-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm">Deconnexion</span>
          </button>
        </div>
      </aside>

      {/* Inline logout confirmation modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Deconnexion</h2>
            <p className="text-sm text-gray-500 mb-4">
              Etes-vous sur de vouloir vous deconnecter ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg"
              >
                Deconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
