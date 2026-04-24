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
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_visible', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="section-title">NEW ARRIVALS</h1>
          <p className="text-gray-500 text-sm mt-3">
            The latest additions to our collection.
          </p>
          <div className="w-full h-px bg-gray-200 mt-6"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No new arrivals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
