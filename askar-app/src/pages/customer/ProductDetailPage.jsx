import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Share2, Ruler, MessageCircle, PhoneCall, Check, ChevronLeft } from "lucide-react";
import { supabase, getImageUrl } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import ProductCard from '../../components/customer/ProductCard';
import ShareModal from '../../components/customer/ShareModal';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [settings, setSettings] = useState(null);
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    fetchProductAndSettings();
    window.scrollTo(0, 0);
  }, [id]);

  async function fetchProductAndSettings() {
    setLoading(true);
    
    // Fetch Settings
    const { data: settingsData } = await supabase.from('site_settings').select('*').limit(1).single();
    if (settingsData) setSettings(settingsData);

    // Fetch Product
    const { data: productData, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (productData) {
      setProduct(productData);
      
      const images = productData.images || [];
      const firstImage = images.length > 0 ? getImageUrl(images[0]) : '/gallary/images.jpg';
      setActiveImage(firstImage);
      
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }

      // Fetch similar products
      if (productData.category) {
        const { data: similarData } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', productData.id)
          .limit(4);
        
        if (similarData) setSimilarProducts(similarData);
      }
    } else {
      // Product not found
      navigate('/shop');
    }
    
    setLoading(false);
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes?.length > 0 && !selectedSize) {
      addToast(t('selectSizePrompt'), 'error');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    
    addToast(t('addedToCart'), 'success');
  };

  const handleWhatsApp = () => {
    const phone = settings?.whatsapp_primary || settings?.phone || "";
    if (!phone) {
      addToast('Contact number not available', 'error');
      return;
    }
    
    const message = `Hi ASKAR, I'm interested in ordering: ${product?.name} (Size: ${selectedSize || 'N/A'}${selectedColor ? `, Color: ${selectedColor}` : ''}).`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const categoryName = product.categories?.name || product.category || 'Product';
  const price = Number(product.price).toFixed(2);
  const salePrice = product.sale_price ? Number(product.sale_price).toFixed(2) : null;
  const imageList = product.images || [];

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="h-20 w-full"></div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-12 rtl:space-x-reverse">
          <Link to="/" className="hover:text-rose-600 transition-colors">{t('home')}</Link>
          {lang === 'ar' ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          <Link to="/shop" className="hover:text-rose-600 transition-colors">{t('shop')}</Link>
          {lang === 'ar' ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          <span className="text-zinc-900 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Images */}
          <div className="flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 bg-zinc-100 relative overflow-hidden aspect-[3/4] md:aspect-auto rounded-xl">
              <img 
                src={activeImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_new && (
                <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10`}>
                  {t('new')}
                </div>
              )}
            </div>
            
            {imageList.length > 0 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 flex-shrink-0">
                {imageList.map((img, idx) => {
                  const resolvedImg = getImageUrl(img);
                  return (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(resolvedImg)}
                      className={`w-20 md:w-full aspect-[3/4] flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${activeImage === resolvedImg ? 'border-rose-600' : 'border-transparent hover:border-zinc-300'}`}
                    >
                      <img src={resolvedImg} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mb-3">{categoryName}</p>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-zinc-900 mb-4 leading-tight">{product.name}</h1>
              </div>
              <button className="text-zinc-400 hover:text-rose-600 transition-colors">
                <Heart size={24} />
              </button>
            </div>
            
            <div className={`flex items-center space-x-4 mb-8 pb-8 border-b border-zinc-200 ${lang === 'ar' ? 'rtl:space-x-reverse' : ''}`}>
               {salePrice ? (
                 <>
                   <span className="text-3xl font-black text-rose-600">{salePrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                   <span className="text-xl font-bold text-zinc-400 line-through">{price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                   {product.discount_percentage && (
                     <span className={`bg-rose-50 text-rose-600 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>
                       -{Math.round(product.discount_percentage)}%
                     </span>
                   )}
                 </>
               ) : (
                 <span className="text-3xl font-black text-zinc-900">{price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
               )}
            </div>

            <p className="text-zinc-600 text-sm leading-relaxed mb-10 font-medium">
              {product.description || (lang === 'ar' ? "جرب المزيج المثالي بين أزياء الشارع العصرية والفخامة مع هذه القطعة الفاخرة من عسكر. مصنوعة باهتمام دقيق بالتفاصيل ومواد عالية الجودة لضمان الراحة والمتانة معاً." : "Experience the perfect blend of modern streetwear and luxury with this premium piece from ASKAR. Crafted with meticulous attention to detail and high-quality materials to ensure both comfort and durability.")}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">{t('color')}</h3>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color ? 'border-rose-600 ring-2 ring-rose-600/20' : 'border-transparent ring-1 ring-zinc-200 hover:ring-zinc-400'}`}
                      style={{ backgroundColor: color, border: ['#ffffff', 'white'].includes(color.toLowerCase()) ? '1px solid #e4e4e7' : 'none' }}
                      title={color}
                    >
                       {selectedColor === color && (
                         <Check size={16} className={['#ffffff', 'white', '#e5e4e2', 'silver', 'yellow', '#ffff00'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'} />
                       )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">{t('size')}</h3>
                  <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-600 transition-colors">
                    <Ruler size={14} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('sizeGuide')}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-black uppercase tracking-widest border rounded-md transition-all ${
                        selectedSize === size 
                          ? 'border-rose-600 bg-rose-50 text-rose-600' 
                          : 'border-zinc-200 text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col space-y-4 mb-10">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className={`w-full py-4 text-sm font-black uppercase tracking-[0.2em] rounded-full shadow-lg transition-colors duration-300 ${
                  product.stock_quantity === 0 
                    ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-rose-600'
                }`}
              >
                {product.stock_quantity === 0 ? t('outOfStock') : t('addToBag')}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-[#1DA851] transition-colors duration-300 flex items-center justify-center rounded-full"
                >
                  <MessageCircle size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('orderViaWhatsApp')}
                </button>
                <a 
                  href={`tel:${settings?.phone || ''}`}
                  className="w-full border-2 border-black text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors duration-300 flex items-center justify-center rounded-full"
                >
                  <PhoneCall size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('callNow')}
                </a>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-zinc-200 pt-8">
              <div className={`flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-zinc-500 ${lang === 'ar' ? 'rtl:space-x-reverse' : ''}`}>
                 <button className="flex items-center hover:text-rose-600 transition-colors">
                   <Heart size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('addToWishlist')}
                 </button>
                 <button onClick={() => setIsShareModalOpen(true)} className="flex items-center hover:text-rose-600 transition-colors">
                   <Share2 size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('share')}
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="pt-24 border-t border-zinc-200">
             <h2 className="text-3xl font-black uppercase tracking-widest text-center mb-16">{t('youMayAlsoLike')}</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
             </div>
          </section>
        )}
      </div>

      <Footer />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}
