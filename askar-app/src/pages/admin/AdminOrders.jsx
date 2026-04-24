import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUSES = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*, products(name)').order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  async function changeStatus(id, newStatus) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const statusClass = (s) => `status-${s}`

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider mb-8">ORDERS</h1>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${filter === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Product</th><th>Size</th><th>Color</th><th>Qty</th><th>Notes</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="text-center text-gray-400 py-8">No orders found.</td></tr>
            ) : filtered.map(o => (
              <tr key={o.id}>
                <td className="text-xs text-gray-400 font-mono">{o.id.slice(0, 8)}...</td>
                <td className="font-medium">{o.customer_name}</td>
                <td>{o.phone}</td>
                <td>{o.products?.name || '—'}</td>
                <td>{o.size || '—'}</td>
                <td>{o.color || '—'}</td>
                <td>{o.quantity}</td>
                <td className="text-gray-500 max-w-32 truncate">{o.notes || '—'}</td>
                <td><span className={statusClass(o.status)}>{o.status.toUpperCase()}</span></td>
                <td className="text-gray-500 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <select value={o.status} onChange={e => changeStatus(o.id, e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
