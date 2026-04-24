import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import ProductCard from '../../components/customer/ProductCard'

export default function OffersPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffers() {
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_visible', true)
        .eq('is_sale', true)
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchOffers()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-accent">SPECIAL OFFERS</h1>
          <div className="accent-underline mx-auto"></div>
          <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">Discover exclusive discounts on premium pieces. Limited time only.</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-500 text-sm">No special offers right now.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => <ProductCard key={p.id} product={p} showSalePercent />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
