import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, LogOut, X } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { supabase } from '../../services/supabase';
import { ConfirmModal } from './ConfirmModal';

const navItems = [
  { to: ROUTES.ADMIN, icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: ROUTES.ADMIN_PRODUCTS, icon: Package, label: 'Products' },
  { to: ROUTES.ADMIN_ORDERS, icon: ShoppingBag, label: 'Orders' },
  { to: ROUTES.ADMIN_QUOTES, icon: MessageSquare, label: 'Quotes' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 start-0 w-64 bg-gray-900 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="font-display text-white text-lg font-semibold">D</span>
            </div>
            <div>
              <h1 className="font-display text-white text-lg">David's</h1>
              <p className="text-xs text-gray-400 tracking-wide">PATISSERIE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-gold-500/10 text-gold-400 border-s-2 border-gold-500 -ms-px'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setLogoutConfirm(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg
              text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmModal
        open={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        variant="danger"
      />
    </>
  );
}
