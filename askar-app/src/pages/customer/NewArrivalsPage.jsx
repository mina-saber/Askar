import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import ProductCard from '../../components/customer/ProductCard'

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNewArrivals()
  }, [])

  async function fetchNewArrivals() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_visible', true)
        .eq('is_new', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error fetching new arrivals:", error)
      } else if (data) {
        setProducts(data)
      }
    } catch (err) {
      console.error("Exception fetching new arrivals:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="h-20 w-full"></div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-200 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest mb-2">NEW ARRIVALS</h1>
            <p className="text-zinc-500 text-sm font-medium">The latest additions to our collection.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl">
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">No new arrivals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
