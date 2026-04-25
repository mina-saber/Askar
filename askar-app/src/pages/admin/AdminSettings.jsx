import React, { useEffect, useState, useRef } from 'react'
import { supabase, getImageUrl, uploadImage } from '../../lib/supabase'
import { Save, Upload, X } from 'lucide-react'

export default function AdminSettings() {
  const [form, setForm] = useState({
    logo_url: '', hero_video_url: '', phone: '', whatsapp_primary: '', whatsapp_backup: '',
    store_address: '', opening_hours: '', instagram_url: '', facebook_url: '', twitter_url: '',
  })
  const [settingsId, setSettingsId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const logoRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single()
      if (data) {
        setSettingsId(data.id)
        setForm({
          logo_url: data.logo_url || '', hero_video_url: data.hero_video_url || '',
          phone: data.phone || '', whatsapp_primary: data.whatsapp_primary || '',
          whatsapp_backup: data.whatsapp_backup || '', store_address: data.store_address || '',
          opening_hours: data.opening_hours || '', instagram_url: data.instagram_url || '',
          facebook_url: data.facebook_url || '', twitter_url: data.twitter_url || '',
        })
      }
      setLoading(false)
    }
    fetch()
  }, [])

  async function handleSave() {
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    if (settingsId) {
      await supabase.from('site_settings').update(payload).eq('id', settingsId)
    } else {
      const { data } = await supabase.from('site_settings').insert(payload).select().single()
      if (data) setSettingsId(data.id)
    }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const fileName = await uploadImage(file, 'brand')
    if (fileName) setForm(prev => ({ ...prev, logo_url: fileName }))
    setUploadingLogo(false)
    if (logoRef.current) logoRef.current.value = ''
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    const fileName = await uploadImage(file, 'brand')
    if (fileName) setForm(prev => ({ ...prev, hero_video_url: fileName }))
    setUploadingVideo(false)
    if (videoRef.current) videoRef.current.value = ''
  }

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-xs font-semibold tracking-wider mb-1">{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} className="admin-input" placeholder={placeholder} />
    </div>
  )

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider mb-8">SITE SETTINGS</h1>
      <div className="space-y-8">

        {/* Brand / Logo */}
        <div className="admin-card">
          <h2 className="text-sm font-bold tracking-wider mb-4">BRAND</h2>
          <label className="block text-xs font-semibold tracking-wider mb-2">LOGO IMAGE</label>
          {form.logo_url ? (
            <div className="relative w-40 h-40 bg-gray-100 rounded overflow-hidden mb-2">
              <img src={getImageUrl(form.logo_url)} alt="Logo" className="w-full h-full object-contain" />
              <button onClick={() => setForm({...form, logo_url: ''})} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={12} /></button>
            </div>
          ) : (
            <div onClick={() => logoRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-black transition-colors w-40 h-40 flex flex-col items-center justify-center">
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              {uploadingLogo ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Upload size={20} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-400">Upload Logo</span></>}
            </div>
          )}
        </div>

        {/* Hero Video */}
        <div className="admin-card">
          <h2 className="text-sm font-bold tracking-wider mb-4">HERO SECTION</h2>
          <label className="block text-xs font-semibold tracking-wider mb-2">HERO VIDEO</label>
          {form.hero_video_url ? (
            <div className="relative">
              <video src={getImageUrl(form.hero_video_url, '/gallary/6001344810424737532.mp4')} className="w-full max-w-md rounded" controls muted />
              <button onClick={() => setForm({...form, hero_video_url: ''})} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={14} /></button>
            </div>
          ) : (
            <div onClick={() => videoRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-black transition-colors max-w-md">
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              {uploadingVideo ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div> : <><Upload size={24} className="text-gray-400 mx-auto mb-2" /><span className="text-xs text-gray-500">Click to upload hero video</span></>}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="admin-card">
          <h2 className="text-sm font-bold tracking-wider mb-4">CONTACT INFO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="WHATSAPP PRIMARY" field="whatsapp_primary" placeholder="+20 xxx xxx xxxx" />
            <Field label="WHATSAPP BACKUP" field="whatsapp_backup" placeholder="+20 xxx xxx xxxx" />
            <Field label="PHONE NUMBER" field="phone" placeholder="+20 xxx xxx xxxx" />
            <Field label="STORE ADDRESS" field="store_address" placeholder="123 Fashion Ave..." />
          </div>
          <div className="mt-4"><Field label="OPENING HOURS" field="opening_hours" placeholder="Mon - Sat: 10AM - 10PM" /></div>
        </div>

        {/* Social */}
        <div className="admin-card">
          <h2 className="text-sm font-bold tracking-wider mb-4">SOCIAL MEDIA</h2>
          <div className="space-y-4">
            <Field label="INSTAGRAM URL" field="instagram_url" placeholder="https://instagram.com/askar" />
            <Field label="FACEBOOK URL" field="facebook_url" placeholder="https://facebook.com/askar" />
            <Field label="TWITTER URL" field="twitter_url" placeholder="https://twitter.com/askar" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full admin-btn py-3 flex items-center justify-center gap-2">
          <Save size={16} /> {saving ? 'SAVING...' : saved ? '✓ SAVED SUCCESSFULLY' : 'SAVE ALL SETTINGS'}
        </button>
      </div>
    </div>
  )
}
