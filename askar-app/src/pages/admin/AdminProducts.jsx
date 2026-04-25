import React, { useEffect, useState, useRef } from 'react'
import { supabase, getImageUrl, uploadImage, deleteImage } from '../../lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from 'lucide-react'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const emptyForm = { name: '', category_id: '', price: '', sale_price: '', description: '', sizes: [], stock_quantity: 0, is_new: false, is_sale: false, images: [] }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [p, c] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
    ])
    if (p.data) setProducts(p.data)
    if (c.data) setCategories(c.data)
    setLoading(false)
  }

  function openAdd() { setEditId(null); setForm({ ...emptyForm }); setShowModal(true) }

  function openEdit(product) {
    setEditId(product.id)
    setForm({
      name: product.name, category_id: product.category_id || '', price: product.price,
      sale_price: product.sale_price || '', description: product.description || '',
      sizes: product.sizes || [], stock_quantity: product.stock_quantity || 0,
      is_new: product.is_new, is_sale: product.is_sale, images: product.images || [],
    })
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      name: form.name, category_id: form.category_id || null, price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      description: form.description, sizes: form.sizes, stock_quantity: Number(form.stock_quantity),
      is_new: form.is_new, is_sale: form.is_sale, images: form.images,
    }
    if (editId) {
      await supabase.from('products').update(payload).eq('id', editId)
    } else {
      await supabase.from('products').insert(payload)
    }
    setShowModal(false)
    setSaving(false)
    fetchData()
  }

  async function handleDelete(id) {
    if (!confirm('This will hide the product and set stock to 0. Continue?')) return
    await supabase.from('products').update({ is_visible: false, stock_quantity: 0 }).eq('id', id)
    fetchData()
  }

  async function toggleField(id, field, value) {
    await supabase.from('products').update({ [field]: !value }).eq('id', id)
    fetchData()
  }

  // ── Image upload handler ──────────────────────────────────
  async function handleFileUpload(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedNames = []

    for (const file of files) {
      const fileName = await uploadImage(file, 'products')
      if (fileName) uploadedNames.push(fileName)
    }

    setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedNames] }))
    setUploading(false)
    // Reset file input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function removeImage(index) {
    const img = form.images[index]
    await deleteImage(img)                              // remove from bucket (no-op for URLs/local)
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  function toggleSize(size) {
    setForm(f => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size] }))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-wider">PRODUCTS</h1>
        <button onClick={openAdd} className="admin-btn flex items-center gap-2"><Plus size={16} /> ADD PRODUCT</button>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Sale</th><th>Stock</th><th>New</th><th>Sale?</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className={!p.is_visible ? 'opacity-50' : ''}>
                <td>
                  <div className="w-12 h-12 bg-gray-100 overflow-hidden rounded">
                    <img src={getImageUrl(p.images?.[0])} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="font-medium">{p.name}</td>
                <td className="text-gray-500">{p.categories?.name || '—'}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>{p.sale_price ? `$${Number(p.sale_price).toFixed(2)}` : '—'}</td>
                <td>{p.stock_quantity}</td>
                <td><button onClick={() => toggleField(p.id, 'is_new', p.is_new)} className={`w-8 h-5 rounded-full relative transition-colors ${p.is_new ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${p.is_new ? 'left-3.5' : 'left-0.5'}`}></span></button></td>
                <td><button onClick={() => toggleField(p.id, 'is_sale', p.is_sale)} className={`w-8 h-5 rounded-full relative transition-colors ${p.is_sale ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${p.is_sale ? 'left-3.5' : 'left-0.5'}`}></span></button></td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-gray-100 rounded"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold tracking-wider">{editId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold tracking-wider mb-1">PRODUCT NAME</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" /></div>
              <div><label className="block text-xs font-semibold tracking-wider mb-1">CATEGORY</label><select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="admin-select"><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold tracking-wider mb-1">PRICE</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="admin-input" /></div>
                <div><label className="block text-xs font-semibold tracking-wider mb-1">SALE PRICE</label><input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} className="admin-input" placeholder="Optional" /></div>
              </div>
              {form.sale_price && form.price && <p className="text-xs text-gray-500">Discount: {Math.round(((form.price - form.sale_price) / form.price) * 100)}%</p>}
              <div><label className="block text-xs font-semibold tracking-wider mb-1">DESCRIPTION</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="admin-input resize-none" /></div>
              <div><label className="block text-xs font-semibold tracking-wider mb-1">SIZES</label><div className="flex gap-2 flex-wrap">{SIZES.map(s => <button key={s} type="button" onClick={() => toggleSize(s)} className={`px-3 py-1.5 text-xs font-semibold border ${form.sizes.includes(s) ? 'bg-black text-white border-black' : 'border-gray-300'}`}>{s}</button>)}</div></div>
              <div><label className="block text-xs font-semibold tracking-wider mb-1">STOCK QUANTITY</label><input type="number" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} className="admin-input" /></div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_new} onChange={e => setForm({...form, is_new: e.target.checked})} className="accent-black" /> New Arrival</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_sale} onChange={e => setForm({...form, is_sale: e.target.checked})} className="accent-black" /> On Sale</label>
              </div>

              {/* ── Image Upload Section ── */}
              <div>
                <label className="block text-xs font-semibold tracking-wider mb-2">PRODUCT IMAGES</label>

                {/* Upload button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-black transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-gray-500">Uploading…</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-xs text-gray-500">Click to upload images</span>
                      <span className="text-[10px] text-gray-400">PNG, JPG, AVIF, WEBP — max 5 MB each</span>
                    </div>
                  )}
                </div>

                {/* Preview thumbnails */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group aspect-square bg-gray-100 rounded overflow-hidden">
                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleSave} disabled={saving || uploading} className="w-full admin-btn py-3">{saving ? 'SAVING...' : 'SAVE PRODUCT'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
