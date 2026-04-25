import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase, getImageUrl } from '../../lib/supabase'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'

const defaultCategories = [
  { name: 'MENSWEAR', image_url: '/gallary/images.jpg' },
  { name: 'WOMENSWEAR', image_url: '/gallary/images (1).jpg' },
  { name: 'ACCESSORIES', image_url: '/gallary/download.avif' },
]

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetchCategories()
    fetchSettings()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .limit(3)

    if (data && data.length > 0) {
      setCategories(data)
    } else {
      setCategories(defaultCategories)
    }
  }

  async function fetchSettings() {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single()
    if (data) setSettings(data)
  }

  // Resolve hero video: Supabase Storage → local fallback
  const heroVideo = settings?.hero_video_url
    ? getImageUrl(settings.hero_video_url, '/gallary/6001344810424737532.mp4')
    : '/gallary/6001344810424737532.mp4'

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-black overflow-hidden" id="hero-section">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[0.3em] mb-4 animate-fade-in-up">
            ASKAR
          </h1>
          <p className="text-gray-300 text-sm md:text-base tracking-[0.3em] uppercase mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Premium Clothing Collection
          </p>
          <Link
            to="/shop"
            className="btn-outline animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="shop-by-category">
        <div className="text-center mb-12">
          <h2 className="section-title">SHOP BY CATEGORY</h2>
          <div className="accent-underline mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(categories.length > 0 ? categories : defaultCategories).map((cat, index) => {
            const catName = cat.name?.toUpperCase() || ''
            const catImage = getImageUrl(cat.image_url, '/gallary/images.jpg')
            return (
              <Link
                key={cat.id || index}
                to="/shop"
                className="group relative h-[500px] overflow-hidden bg-gray-100"
                id={`category-card-${index}`}
              >
                <img
                  src={catImage}
                  alt={catName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-white text-2xl font-bold tracking-wider">{catName}</h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm mt-2 group-hover:text-white transition-colors">
                    <span>SHOP NOW</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* The ASKAR Standard */}
      <section className="bg-black py-24" id="askar-standard">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wider mb-6">
            THE ASKAR STANDARD
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Every piece we create is a testament to our unwavering commitment to quality, craftsmanship,
            and timeless design. We believe clothing should not just be worn — it should be experienced.
            From carefully sourced fabrics to precision tailoring, every detail matters.
          </p>
          <button className="btn-outline">
            READ OUR STORY
          </button>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="featured-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[600px] overflow-hidden group">
            <img
              src="/gallary/download (1).avif"
              alt="New Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-10 left-10">
              <p className="text-white/70 text-xs tracking-[0.3em] mb-2">NEW SEASON</p>
              <h3 className="text-white text-3xl font-bold mb-4">SPRING COLLECTION</h3>
              <Link to="/new-arrivals" className="text-white text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity">
                DISCOVER MORE
              </Link>
            </div>
          </div>
          <div className="relative h-[600px] overflow-hidden group">
            <img
              src="/gallary/download (2).avif"
              alt="Sale"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-10 left-10">
              <p className="text-white/70 text-xs tracking-[0.3em] mb-2">LIMITED TIME</p>
              <h3 className="text-white text-3xl font-bold mb-4">EXCLUSIVE OFFERS</h3>
              <Link to="/offers" className="text-white text-sm tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity">
                SHOP SALE
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
