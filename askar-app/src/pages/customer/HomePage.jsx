import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, getImageUrl } from '../../lib/supabase';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import ProductCard from '../../components/customer/ProductCard';

const defaultCategories = [
  { name: 'Menswear', image_url: '/gallary/images.jpg' },
  { name: 'Womenswear', image_url: '/gallary/images (1).jpg' },
  { name: 'Accessories', image_url: '/gallary/download.avif' },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchNewArrivals();
    fetchSettings();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .limit(3);

    if (data && data.length > 0) {
      setCategories(data);
    } else {
      setCategories(defaultCategories);
    }
  }

  async function fetchNewArrivals() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .limit(4);
    
    if (data) {
      setNewArrivals(data);
    }
  }

  async function fetchSettings() {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
    if (data) setSettings(data);
  }

  const heroVideo = settings?.hero_video_url
    ? getImageUrl(settings.hero_video_url, '/gallary/6001344810424737532.mp4')
    : '/gallary/6001344810424737532.mp4';

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full bg-black overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay: 60% opacity black to improve text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-start text-left px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
              Street Is<br />Your Runway
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl lg:text-2xl mb-10 font-light tracking-wide max-w-xl">
              Premium streetwear for the bold generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="bg-rose-600 text-white rounded-full px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-rose-700 hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)] transition-all duration-300 flex items-center justify-center text-center">
                Shop Now
              </Link>
              <Link to="/new-arrivals" className="bg-transparent border border-white text-white rounded-full px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center text-center">
                Explore Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-4">Shop by Category</h2>
            <div className="w-16 h-1 bg-rose-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayCategories.map((cat, i) => (
              <Link to={`/shop?category=${cat.name}`} key={cat.id || i} className="group relative h-[500px] overflow-hidden bg-zinc-100 block rounded-2xl">
                <img 
                  src={getImageUrl(cat.image_url, '/gallary/images.jpg')} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-2">{cat.name}</h3>
                  <span className="text-rose-500 text-sm uppercase tracking-[0.2em] font-bold group-hover:translate-x-2 transition-transform duration-300 flex items-center opacity-0 group-hover:opacity-100">
                    Discover <ArrowRight size={14} className="ml-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-4">New Arrivals</h2>
                <div className="w-16 h-1 bg-rose-600"></div>
              </div>
              <Link to="/new-arrivals" className="hidden sm:flex text-sm font-bold uppercase tracking-widest text-zinc-900 hover:text-rose-600 transition-colors items-center">
                View All <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
              <Link to="/new-arrivals" className="inline-block border border-black rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors">
                View All Arrivals
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Promo Banner */}
      <section className="py-24 bg-black text-white border-y border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white">
              The Askar Standard
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg mb-10 leading-relaxed font-light">
              We believe in quality without compromise. Every piece is crafted with meticulous attention to detail, using only the finest materials sourced globally. Join the exclusive circle.
            </p>
            <Link to="/shop" className="inline-block bg-white text-black rounded-full px-12 py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-colors duration-300">
              Read Our Story
            </Link>
          </div>
      </section>

      <Footer />
    </div>
  );
}
