import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [form, setForm] = useState({
    logo_url: '', hero_video_url: '', phone: '', whatsapp_primary: '', whatsapp_backup: '',
    store_address: '', opening_hours: '', instagram_url: '', facebook_url: '', twitter_url: '',
  })
  const [settingsId, setSettingsId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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
        <div className="admin-card">
          <h2 className="text-sm font-bold tracking-wider mb-4">BRAND</h2>
          <Field label="LOGO URL (gallery filename)" field="logo_url" placeholder="e.g. logo.png" />
        </div>
        <div className="admin-card">
          <h2 className="text-sm font-bold tracking-wider mb-4">HERO SECTION</h2>
          <Field label="HERO VIDEO (gallery filename)" field="hero_video_url" placeholder="e.g. 6001344810424737532.mp4" />
        </div>
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
