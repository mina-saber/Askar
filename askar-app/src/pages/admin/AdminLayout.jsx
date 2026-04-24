import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, Settings, LogOut } from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-admin-sidebar text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-black tracking-[0.2em]">ASKAR</h1>
          <p className="text-gray-500 text-[10px] tracking-wider mt-1">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
