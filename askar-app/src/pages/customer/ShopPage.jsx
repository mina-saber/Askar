import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import ProductCard from '../../components/customer/ProductCard';
import { Filter, ChevronDown, Check } from "lucide-react";

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  
  // Sort dropdown open state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').eq('is_visible', true),
      supabase.from('categories').select('*'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  }

  const filteredProducts = products
    .filter(p => {
      if (selectedCategory !== 'ALL') {
        const catName = p.categories?.name?.toUpperCase();
        if (catName !== selectedCategory) return false;
      }
      if (selectedPriceRange) {
        const price = Number(p.sale_price || p.price);
        if (selectedPriceRange === 'under500' && price >= 500) return false;
        if (selectedPriceRange === '500-1000' && (price < 500 || price > 1000)) return false;
        if (selectedPriceRange === 'over1000' && price <= 1000) return false;
      }
      if (selectedSize) {
        if (!p.sizes || !p.sizes.includes(selectedSize)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'price-low') return Number(a.sale_price || a.price) - Number(b.sale_price || b.price);
      if (sortBy === 'price-high') return Number(b.sale_price || b.price) - Number(a.sale_price || a.price);
      return 0;
    });

  const categoryNames = ['ALL', ...categories.map(c => c.name.toUpperCase())];
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Spacer for fixed Navbar */}
      <div className="h-20 w-full"></div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-200 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest mb-2">Shop Collection</h1>
            <p className="text-zinc-500 text-sm font-medium">Showing {filteredProducts.length} Results</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <div className="relative group" onMouseEnter={() => setIsSortOpen(true)} onMouseLeave={() => setIsSortOpen(false)}>
              <button className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-zinc-900 border border-zinc-200 px-4 py-2 hover:border-rose-600 transition-colors">
                <span>Sort By: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown size={16} />
              </button>
              <div className={`absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 shadow-xl transition-all z-10 ${isSortOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                {sortOptions.map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${sortBy === opt.value ? 'bg-rose-50 text-rose-600' : 'hover:bg-zinc-50 hover:text-rose-600 text-zinc-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-zinc-900 border border-zinc-200 px-4 py-2 hover:border-rose-600 transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className={`w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
            <div className="sticky top-28">
              <div className="mb-10">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">Categories</h3>
                <ul className="space-y-4">
                  {categoryNames.map(cat => (
                    <li key={cat}>
                      <button 
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-sm font-medium uppercase tracking-wider flex items-center transition-colors ${selectedCategory === cat ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-900'}`}
                      >
                        {selectedCategory === cat && <Check size={14} className="mr-2" />}
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-10">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">Price Range</h3>
                <div className="space-y-4">
                  {[
                    { key: 'under500', label: 'Under $500' },
                    { key: '500-1000', label: '$500 - $1000' },
                    { key: 'over1000', label: 'Over $1000' }
                  ].map(range => (
                    <label key={range.key} className="flex items-center space-x-3 cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedPriceRange === range.key ? 'border-rose-600 bg-rose-600' : 'border-zinc-300 group-hover:border-rose-600'}`}>
                         {selectedPriceRange === range.key && <Check size={10} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedPriceRange === range.key} 
                        onChange={() => setSelectedPriceRange(selectedPriceRange === range.key ? null : range.key)} 
                      />
                      <span className={`text-sm ${selectedPriceRange === range.key ? 'text-zinc-900 font-bold' : 'text-zinc-600 group-hover:text-zinc-900'}`}>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`border py-2 text-xs font-bold transition-colors ${selectedSize === size ? 'border-rose-600 text-rose-600 bg-rose-50' : 'border-zinc-200 hover:border-rose-600 hover:text-rose-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                 <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-50 rounded-2xl">
                 <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
  );
}
