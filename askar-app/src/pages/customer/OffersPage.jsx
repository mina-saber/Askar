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
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_visible', true)
          .eq('is_sale', true)
          .order('created_at', { ascending: false })
          
        if (error) {
          console.error("Error fetching offers:", error)
        } else if (data) {
          setProducts(data)
        }
      } catch (err) {
        console.error("Exception fetching offers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="h-20 w-full"></div>
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-200 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest mb-2 text-rose-600">SPECIAL OFFERS</h1>
            <p className="text-zinc-500 text-sm font-medium">Discover exclusive discounts on premium pieces. Limited time only.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl">
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">No special offers right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(p => <ProductCard key={p.id} product={p} showSalePercent />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
