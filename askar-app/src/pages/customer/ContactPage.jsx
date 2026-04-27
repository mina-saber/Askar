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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="h-20 w-full"></div>
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4">CONTACT US</h1>
          <div className="w-16 h-1 bg-rose-600 mx-auto"></div>
          <p className="text-zinc-500 text-sm mt-6 max-w-xl mx-auto">We'd love to hear from you. Get in touch with our team for any inquiries.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-zinc-50 p-8 sm:p-10 rounded-2xl border border-zinc-100">
            <h2 className="text-lg font-black uppercase tracking-widest mb-8">SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-900">FIRST NAME</label>
                  <input type="text" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-4 py-3 border border-zinc-200 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-white rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-900">LAST NAME</label>
                  <input type="text" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-4 py-3 border border-zinc-200 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-white rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-900">EMAIL ADDRESS</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-zinc-200 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-white rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-900">SUBJECT</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 border border-zinc-200 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-white rounded-lg appearance-none">
                  <option>General Inquiry</option>
                  <option>Order Issue</option>
                  <option>Returns & Exchanges</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-900">MESSAGE</label>
                <textarea rows={5} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-zinc-200 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-white rounded-lg resize-none"></textarea>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-black text-white px-8 py-4 uppercase tracking-widest text-sm font-black hover:bg-rose-600 transition-colors rounded-full shadow-md">
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>
          
          {/* Store Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-black uppercase tracking-widest mb-10">STORE INFORMATION</h2>
            <div className="space-y-10">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-100 group-hover:bg-rose-600 group-hover:text-white transition-colors rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-zinc-900 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2">FLAGSHIP STORE</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">{settings?.store_address || '123 Fashion Avenue, Downtown District, City 10001'}</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-100 group-hover:bg-rose-600 group-hover:text-white transition-colors rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-zinc-900 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2">CALL & WHATSAPP</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-1">{settings?.phone || '+20 123 456 7890'}</p>
                  {settings?.whatsapp_primary && <p className="text-zinc-500 text-sm leading-relaxed mb-1">WhatsApp: {settings.whatsapp_primary}</p>}
                  {settings?.whatsapp_backup && <p className="text-zinc-500 text-sm leading-relaxed">Backup: {settings.whatsapp_backup}</p>}
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-100 group-hover:bg-rose-600 group-hover:text-white transition-colors rounded-full flex items-center justify-center shrink-0">
                  <Clock size={24} className="text-zinc-900 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2">OPENING HOURS</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-1">{settings?.opening_hours || 'Mon - Sat: 10:00 AM - 10:00 PM'}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">Sunday: 12:00 PM - 8:00 PM</p>
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
