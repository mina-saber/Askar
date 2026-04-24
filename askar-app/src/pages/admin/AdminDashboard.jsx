import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, ShoppingCart, Clock, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    const [prodRes, ordersRes, pendingRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ])
    const orders = ordersRes.data || []
    const revenue = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0)
    setStats({
      totalProducts: prodRes.count || 0,
      totalOrders: orders.length,
      pendingOrders: pendingRes.count || 0,
      totalRevenue: revenue,
    })
    setRecentOrders(orders.slice(0, 5))
    setLoading(false)
  }

  const statCards = [
    { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'bg-blue-500' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: 'bg-green-500' },
    { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-orange-500' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-purple-500' },
  ]

  const statusClass = (s) => `status-${s}`

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider mb-8">DASHBOARD</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Recent Orders */}
      <div className="admin-card">
        <h2 className="text-sm font-bold tracking-wider mb-4">LATEST ORDERS</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Customer</th><th>Status</th><th>Total</th><th>Date</th></tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="font-medium">{o.customer_name}</td>
                  <td><span className={statusClass(o.status)}>{o.status.toUpperCase()}</span></td>
                  <td>${Number(o.total_price || 0).toFixed(2)}</td>
                  <td className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
