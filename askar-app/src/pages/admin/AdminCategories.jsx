import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', image_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('category_id'),
    ])
    if (catRes.data) setCategories(catRes.data)
    if (prodRes.data) {
      const counts = {}
      prodRes.data.forEach(p => { if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1 })
      setProductCounts(counts)
    }
    setLoading(false)
  }

  function openAdd() { setEditId(null); setForm({ name: '', image_url: '' }); setShowModal(true) }
  function openEdit(cat) { setEditId(cat.id); setForm({ name: cat.name, image_url: cat.image_url || '' }); setShowModal(true) }

  async function handleSave() {
    setSaving(true)
    if (editId) {
      await supabase.from('categories').update({ name: form.name, image_url: form.image_url || null }).eq('id', editId)
    } else {
      await supabase.from('categories').insert({ name: form.name, image_url: form.image_url || null })
    }
    setSaving(false); setShowModal(false); fetchData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchData()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-wider">CATEGORIES</h1>
        <button onClick={openAdd} className="admin-btn flex items-center gap-2"><Plus size={16} /> ADD CATEGORY</button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Products</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td><div className="w-12 h-12 bg-gray-100 overflow-hidden rounded"><img src={c.image_url ? (c.image_url.startsWith('http') ? c.image_url : `/gallary/${c.image_url}`) : '/gallary/images.jpg'} alt="" className="w-full h-full object-cover" /></div></td>
                <td className="font-medium">{c.name}</td>
                <td>{productCounts[c.id] || 0}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 rounded"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-wider">{editId ? 'EDIT CATEGORY' : 'ADD CATEGORY'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold tracking-wider mb-1">CATEGORY NAME</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" /></div>
              <div><label className="block text-xs font-semibold tracking-wider mb-1">IMAGE (gallery filename or URL)</label><input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="admin-input" placeholder="e.g. images.jpg" /></div>
              <button onClick={handleSave} disabled={saving} className="w-full admin-btn py-3">{saving ? 'SAVING...' : 'SAVE CATEGORY'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
