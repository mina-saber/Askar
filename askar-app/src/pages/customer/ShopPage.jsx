import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/customer/Navbar'
import Footer from '../../components/customer/Footer'
import ProductCard from '../../components/customer/ProductCard'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').eq('is_visible', true),
      supabase.from('categories').select('*'),
    ])

    if (productsRes.data) setProducts(productsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    setLoading(false)
  }

  const filteredProducts = products
    .filter(p => {
      if (selectedCategory !== 'ALL') {
        const catName = p.categories?.name?.toLowerCase()
        if (selectedCategory === 'MEN' && catName !== 'menswear') return false
        if (selectedCategory === 'WOMEN' && catName !== 'womenswear') return false
        if (selectedCategory === 'ACCESSORIES' && catName !== 'accessories') return false
        if (selectedCategory === 'UNISEX' && catName !== 'unisex') return false
      }
      if (selectedPriceRange) {
        const price = Number(p.sale_price || p.price)
        if (selectedPriceRange === 'under500' && price >= 500) return false
        if (selectedPriceRange === '500-1000' && (price < 500 || price > 1000)) return false
        if (selectedPriceRange === 'over1000' && price <= 1000) return false
      }
      if (selectedSize) {
        if (!p.sizes || !p.sizes.includes(selectedSize)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'price-low') return Number(a.sale_price || a.price) - Number(b.sale_price || b.price)
      if (sortBy === 'price-high') return Number(b.sale_price || b.price) - Number(a.sale_price || a.price)
      return 0
    })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h1 className="section-title">SHOP COLLECTION</h1>
            <p className="text-gray-500 text-sm mt-2">
              Showing {filteredProducts.length} Results
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-gray-500">SORT BY:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold tracking-wider bg-transparent border border-gray-200 px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value="newest">NEWEST</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0" id="shop-filters">
            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4">CATEGORIES</h3>
              <div className="space-y-2">
                {['ALL', 'MEN', 'WOMEN', 'ACCESSORIES', 'UNISEX'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat === selectedCategory && '✓ '}{cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4">PRICE RANGE</h3>
              <div className="space-y-2">
                {[
                  { key: 'under500', label: 'Under $500' },
                  { key: '500-1000', label: '$500 - $1000' },
                  { key: 'over1000', label: 'Over $1000' },
                ].map(range => (
                  <label key={range.key} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedPriceRange === range.key}
                      onChange={() => setSelectedPriceRange(selectedPriceRange === range.key ? null : range.key)}
                      className="w-4 h-4 accent-black"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4">SIZE</h3>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`py-2 text-xs font-semibold tracking-wider border transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-sm">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
