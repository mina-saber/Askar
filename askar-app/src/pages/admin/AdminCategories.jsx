import React, { useEffect, useState, useRef } from 'react'
import { supabase, getImageUrl, uploadImage } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', image_url: '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

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

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = await uploadImage(file, 'categories')
    if (fileName) setForm(prev => ({ ...prev, image_url: fileName }))
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
                <td>
                  <div className="w-12 h-12 bg-gray-100 overflow-hidden rounded">
                    <img src={getImageUrl(c.image_url)} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
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
              <div>
                <label className="block text-xs font-semibold tracking-wider mb-1">CATEGORY NAME</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold tracking-wider mb-2">CATEGORY IMAGE</label>

                {form.image_url ? (
                  <div className="relative w-full aspect-video bg-gray-100 rounded overflow-hidden mb-2">
                    <img src={getImageUrl(form.image_url)} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setForm({...form, image_url: ''})}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-black transition-colors"
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-gray-500">Uploading…</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-xs text-gray-500">Click to upload image</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={handleSave} disabled={saving || uploading} className="w-full admin-btn py-3">{saving ? 'SAVING...' : 'SAVE CATEGORY'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
