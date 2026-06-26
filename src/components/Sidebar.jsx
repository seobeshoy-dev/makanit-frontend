import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, Package, LogOut, Users, Tag } from 'lucide-react'
import { ROLE_LABELS } from './StatusBadge'

const NAV = [
  { to: '/',           label: 'الرئيسية',    icon: LayoutDashboard, roles: ['*'] },
  { to: '/packages',   label: 'الباكيجات',   icon: Package,         roles: ['*'] },
  { to: '/categories', label: 'الكاتيجريز',  icon: Tag,             roles: ['admin'] },
  { to: '/users',      label: 'المستخدمين',  icon: Users,           roles: ['admin'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visible = NAV.filter(n => n.roles.includes('*') || n.roles.includes(user?.role))

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0" dir="rtl">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-blue-600">Makanit CMS</h1>
        <p className="text-xs text-gray-400 mt-0.5">نظام إدارة الباكيجات</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visible.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-400">{ROLE_LABELS[user?.role]}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
