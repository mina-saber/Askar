import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Ruler } from 'lucide-react'
import { getImageUrl } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/LanguageContext'
import { useToast } from '../../context/ToastContext'

export default function ProductCard({ product, showSalePercent = false }) {
  const { addToCart } = useCart()
  const { t, lang } = useLanguage()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  
  const categoryName = product.categories?.name || product.category || ''
  const mainImage = getImageUrl(product.images?.[0])
  const price = Number(product.price).toFixed(2)
  const salePrice = product.sale_price ? Number(product.sale_price).toFixed(2) : null

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  const closeQuickView = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsQuickViewOpen(false)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.sizes?.length > 0 && !selectedSize) {
      addToast(t('selectSizePrompt'), 'error')
      return
    }
    
    addToCart(product, selectedSize, selectedColor)
    
    addToast(t('addedToCart'), 'success')
    setIsQuickViewOpen(false)
  }
  
  const handleNavigate = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <>
      <div className="group flex flex-col cursor-pointer hover:-translate-y-2 transition-transform duration-500 ease-out" id={`product-${product.id}`}>
        <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-zinc-100 rounded-xl" onClick={handleNavigate}>
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Badges */}
          {showSalePercent && product.is_sale && product.discount_percentage ? (
            <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full pointer-events-none`}>
              {t('sale')} -{Math.round(product.discount_percentage)}%
            </div>
          ) : (
            <>
              {product.is_new && (
                <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full pointer-events-none`}>
                  {t('new')}
                </div>
              )}
              {product.is_sale && (
                <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full pointer-events-none`}>
                  {t('sale')}
                </div>
              )}
            </>
          )}

          {/* Out of Stock Overlay */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
              <span className="text-white text-sm font-bold tracking-wider uppercase">{t('outOfStock')}</span>
            </div>
          )}
          
          {/* Hover Quick Add */}
          <div 
            className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <button 
              onClick={handleQuickView}
              className="w-full bg-white text-black py-3 text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-colors rounded-full shadow-lg"
            >
              {t('quickView')}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 text-center" onClick={handleNavigate}>
          {categoryName && (
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-medium">{categoryName}</p>
          )}
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">{product.name}</h3>
          <div className={`mt-auto flex justify-center items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            {product.is_sale && product.sale_price ? (
              <>
                <span className="text-rose-600 font-bold">{salePrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                <span className="text-zinc-400 line-through text-sm">{price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
              </>
            ) : (
              <span className="text-zinc-900 font-bold">{price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeQuickView}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button 
              onClick={closeQuickView}
              className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm transition-colors`}
            >
              <X size={18} />
            </button>

            {/* Image side */}
            <div className="md:w-1/2 bg-zinc-100">
              <img 
                src={mainImage} 
                alt={product.name}
                className="w-full h-[300px] md:h-full object-cover"
              />
            </div>

            {/* Content side */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mb-2">{categoryName}</p>
              <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-900 mb-4">{product.name}</h2>
              
              <div className={`flex items-center mb-6 pb-6 border-b border-zinc-100 ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                {product.is_sale && product.sale_price ? (
                  <>
                    <span className="text-2xl font-black text-rose-600">{salePrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    <span className="text-lg font-bold text-zinc-400 line-through">{price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-zinc-900">{price} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                )}
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">{t('selectSize')}</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={(e) => { e.preventDefault(); setSelectedSize(size); }}
                        className={`py-2 text-xs font-black uppercase tracking-widest border rounded transition-all ${
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

              <div className="mt-auto space-y-3 pt-6">
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
                <Link 
                  to={`/product/${product.id}`}
                  className="w-full block text-center py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
