import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function ContactPage() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single()
      if (data) setSettings(data)
    }
    fetch()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => { alert('Message sent successfully!'); setForm({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' }); setSubmitting(false) }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="section-title">CONTACT US</h1>
          <div className="accent-underline-orange mx-auto"></div>
          <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">We'd love to hear from you. Get in touch with our team for any inquiries.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-lg font-bold tracking-wider mb-6">SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider mb-2">FIRST NAME</label>
                  <input type="text" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider mb-2">LAST NAME</label>
                  <input type="text" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider mb-2">EMAIL ADDRESS</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider mb-2">SUBJECT</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors bg-white">
                  <option>General Inquiry</option>
                  <option>Order Issue</option>
                  <option>Returns & Exchanges</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider mb-2">MESSAGE</label>
                <textarea rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-black transition-colors resize-none"></textarea>
              </div>
              <button type="submit" disabled={submitting} className="w-full btn-primary">{submitting ? 'SENDING...' : 'SEND MESSAGE'}</button>
            </form>
          </div>
          {/* Store Info */}
          <div>
            <h2 className="text-lg font-bold tracking-wider mb-6">STORE INFORMATION</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0"><MapPin size={20} className="text-white" /></div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider mb-1">FLAGSHIP STORE</h3>
                  <p className="text-gray-500 text-sm">{settings?.store_address || '123 Fashion Avenue, Downtown District, City 10001'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0"><Phone size={20} className="text-white" /></div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider mb-1">CALL & WHATSAPP</h3>
                  <p className="text-gray-500 text-sm">{settings?.phone || '+20 123 456 7890'}</p>
                  {settings?.whatsapp_primary && <p className="text-gray-500 text-sm">WhatsApp: {settings.whatsapp_primary}</p>}
                  {settings?.whatsapp_backup && <p className="text-gray-500 text-sm">Backup: {settings.whatsapp_backup}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0"><Clock size={20} className="text-white" /></div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider mb-1">OPENING HOURS</h3>
                  <p className="text-gray-500 text-sm">{settings?.opening_hours || 'Mon - Sat: 10:00 AM - 10:00 PM'}</p>
                  <p className="text-gray-500 text-sm">Sunday: 12:00 PM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
