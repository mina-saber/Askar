import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, getImageUrl } from '../../lib/supabase';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import ProductCard from '../../components/customer/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [settings, setSettings] = useState(null);

  // Default categories to T-shirts and Pants
  const defaultCategories = [
    { name: t('tshirts'), pathName: 'T-Shirts', image_url: '/gallary/images.jpg' },
    { name: t('pants'), pathName: 'Pants', image_url: '/gallary/images (1).jpg' }
  ];

  useEffect(() => {
    fetchCategories();
    fetchNewArrivals();
    fetchSettings();
  }, [t]);

  async function fetchCategories() {
    // Only fetch if they want dynamic, but user requested 2 specific categories.
    // We will stick to the hardcoded ones matching their request if DB doesn't match perfectly.
    // Or we just display the default ones always to satisfy the "I have 2 categories" request.
    setCategories(defaultCategories);
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
    <div className="flex flex-col w-full min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full bg-black overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline={true}
          webkit-playsinline="true"
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
            <h1 className={`text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-white uppercase mb-6 whitespace-pre-line ${lang === 'ar' ? 'leading-[1.2] tracking-normal font-cairo' : 'leading-[0.9] tracking-tighter'}`}>
              {t('streetIsYourRunway')}
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl lg:text-2xl mb-10 font-light tracking-wide max-w-xl">
              {t('premiumStreetwear')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="bg-rose-600 text-white rounded-full px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-rose-700 hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)] transition-all duration-300 flex items-center justify-center text-center">
                {t('shopNow')}
              </Link>
              <Link to="/new-arrivals" className="bg-transparent border border-white text-white rounded-full px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center text-center">
                {t('exploreCollection')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-4">{t('shopByCategory')}</h2>
            <div className="w-16 h-1 bg-rose-600 mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {displayCategories.map((cat, i) => (
              <motion.div
                key={cat.pathName || i}
                initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              >
                <Link to={`/shop?category=${cat.pathName}`} className="group relative h-[500px] overflow-hidden bg-zinc-100 block rounded-2xl">
                  <img 
                    src={getImageUrl(cat.image_url, '/gallary/images.jpg')} 
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-2">{cat.name}</h3>
                    <span className={`text-rose-500 text-sm uppercase tracking-[0.2em] font-bold ${lang === 'ar' ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'} transition-transform duration-300 flex items-center opacity-0 group-hover:opacity-100`}>
                      {t('discover')} <ArrowRight size={14} className={lang === 'ar' ? 'mr-2 transform rotate-180' : 'ml-2'} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-zinc-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-between items-end mb-16"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-4">{t('newArrivals')}</h2>
                <div className="w-16 h-1 bg-rose-600"></div>
              </div>
              <Link to="/new-arrivals" className="hidden sm:flex text-sm font-bold uppercase tracking-widest text-zinc-900 hover:text-rose-600 transition-colors items-center">
                {t('viewAll')} <ArrowRight size={16} className={lang === 'ar' ? 'mr-2 transform rotate-180' : 'ml-2'} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
              <Link to="/new-arrivals" className="inline-block border border-black rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors">
                {t('viewAllArrivals')}
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Promo Banner */}
      <section className="py-24 bg-black text-white border-y border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white">
              {t('theAskarStandard')}
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg mb-10 leading-relaxed font-light">
              {t('askarStandardDesc')}
            </p>
            <Link to="/shop" className="inline-block bg-white text-black rounded-full px-12 py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-colors duration-300">
              {t('readOurStory')}
            </Link>
          </div>
      </section>

      <Footer />
    </div>
  );
}
