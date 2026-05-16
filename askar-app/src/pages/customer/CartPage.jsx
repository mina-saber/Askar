import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { supabase, getImageUrl } from '../../lib/supabase';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import { useLanguage } from '../../context/LanguageContext';

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, clearCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (item, delta) => {
    if (item.quantity + delta > 0) {
      addToCart(item.product, item.size, item.color, delta);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * Number(item.product.sale_price || item.product.price)), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Open the modal instead of going directly to WhatsApp
    setIsModalOpen(true);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Prepare orders data for insertion
      const ordersToInsert = cartItems.map(item => ({
        customer_name: customer.name,
        phone: customer.phone,
        product_id: item.product.id,
        size: item.size || null,
        color: item.color || null,
        quantity: item.quantity,
        notes: customer.address || null,
        status: 'pending'
      }));

      // 2. Insert into Supabase
      const { error } = await supabase.from('orders').insert(ordersToInsert);
      
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      // 3. Prepare WhatsApp message
      const itemsText = cartItems.map(item => `- ${item.product.name} (الكمية: ${item.quantity}) المقاس: ${item.size || 'غير محدد'}، اللون: ${item.color || 'غير محدد'}`).join('\n');
      const total = calculateSubtotal().toFixed(2);
      const message = `مرحباً عسكر،\nأنا ${customer.name}\nأود تأكيد طلبي التالي:\n\n${itemsText}\n\nالعنوان/ملاحظات: ${customer.address}\nرقم الهاتف: ${customer.phone}\nالإجمالي: ${total} ج.م`;
      
      // 4. Open WhatsApp
      window.open(`https://wa.me/201070425411?text=${encodeURIComponent(message)}`, '_blank');
      
      // 5. Cleanup
      setIsModalOpen(false);
      clearCart();
      navigate('/shop'); // Redirect to shop or success page
      
    } catch (err) {
      console.error("Error submitting order:", err);
      alert(lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.' : 'Error submitting order, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="h-20 w-full bg-white"></div>
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-widest mb-2">{t('shoppingBag')}</h1>
          <p className="text-zinc-500 text-sm font-medium">{cartItems.length} {t('itemsInBag')}</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-zinc-100 shadow-sm">
            <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 mb-4">{t('bagEmpty')}</h2>
            <p className="text-zinc-500 text-sm mb-8">{lang === 'ar' ? 'يبدو أنك لم تضف أي منتج إلى حقيبتك بعد.' : 'Looks like you haven\'t added anything to your bag yet.'}</p>
            <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 uppercase tracking-widest text-sm font-black hover:bg-rose-600 transition-colors rounded-full shadow-md">
              {t('startShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => {
                const product = item.product;
                const price = Number(product.sale_price || product.price);
                const categoryName = product.categories?.name || product.category || '';
                const image = getImageUrl(product.images?.[0]);
                
                return (
                  <div key={`${product.id}-${item.size}-${item.color}-${index}`} className="flex flex-col sm:flex-row bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative">
                    <Link to={`/product/${product.id}`} className={`w-full sm:w-32 h-40 flex-shrink-0 bg-zinc-100 rounded-lg overflow-hidden mb-4 sm:mb-0 ${lang === 'ar' ? 'sm:ml-6' : 'sm:mr-6'}`}>
                      <img src={image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </Link>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div className={`flex justify-between items-start ${lang === 'ar' ? 'pl-8' : 'pr-8'}`}>
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium mb-1">{categoryName}</p>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 hover:text-rose-600 transition-colors mb-2 line-clamp-1">{product.name}</h3>
                          </Link>
                          
                          <div className={`flex flex-wrap gap-4 text-xs text-zinc-500 font-medium ${lang === 'ar' ? 'space-x-reverse' : ''}`}>
                            {item.size && <p>{t('size')}: <span className="text-zinc-900 font-bold">{item.size}</span></p>}
                            {item.color && (
                              <div className="flex items-center">
                                {t('color')}: <div className={`w-4 h-4 rounded-full border border-zinc-300 ${lang === 'ar' ? 'mr-2' : 'ml-2'}`} style={{ backgroundColor: item.color }}></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product.id, item.size, item.color)}
                          className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} text-zinc-400 hover:text-rose-600 transition-colors`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center border border-zinc-200 rounded-full overflow-hidden">
                          <button onClick={() => handleQuantityChange(item, -1)} className="px-4 py-2 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="px-4 text-sm font-bold text-zinc-900">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item, 1)} className="px-4 py-2 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-lg font-black text-zinc-900">{(price * item.quantity).toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-end">
                <button 
                  onClick={clearCart}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-600 transition-colors border-b border-transparent hover:border-rose-600 pb-1"
                >
                  {t('clearBag')}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm sticky top-28">
                <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">{t('orderSummary')}</h2>
                
                <div className="space-y-4 mb-6 text-sm font-medium text-zinc-600">
                  <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span className="text-zinc-900 font-bold">{calculateSubtotal().toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('shipping')}</span>
                    <span>{t('calculatedAtCheckout')}</span>
                  </div>
                </div>
                
                <div className="border-t border-zinc-100 pt-6 mb-8 flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">{t('total')}</span>
                  <span className="text-2xl font-black text-rose-600">{calculateSubtotal().toFixed(2)} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest hover:bg-rose-600 transition-colors rounded-full shadow-lg flex justify-center items-center"
                >
                  {t('checkout')} <ArrowRight size={16} className={lang === 'ar' ? 'mr-2 transform rotate-180' : 'ml-2'} />
                </button>
                
                <div className="mt-6 text-center">
                  <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
                    {t('continueShopping')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-widest">{lang === 'ar' ? 'تفاصيل التوصيل' : 'Delivery Details'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-rose-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <p className="text-sm text-zinc-500 mb-6 font-medium leading-relaxed">
                  {lang === 'ar' 
                    ? 'يرجى إدخال بياناتك حتى نتمكن من تسجيل طلبك في النظام قبل تحويلك لتأكيده عبر الواتساب.' 
                    : 'Please enter your details so we can register your order before confirming via WhatsApp.'}
                </p>
                
                <form onSubmit={submitOrder} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-900">{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={customer.name} 
                      onChange={e => setCustomer({...customer, name: e.target.value})} 
                      className="w-full px-5 py-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-zinc-50" 
                      placeholder={lang === 'ar' ? 'اكتب اسمك' : 'Enter your name'} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-900">{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input 
                      type="tel" 
                      required 
                      value={customer.phone} 
                      onChange={e => setCustomer({...customer, phone: e.target.value})} 
                      className="w-full px-5 py-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-zinc-50" 
                      placeholder="010XXXXXXXX" 
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-900">{lang === 'ar' ? 'العنوان والملاحظات' : 'Address & Notes'}</label>
                    <textarea 
                      required
                      rows={3}
                      value={customer.address} 
                      onChange={e => setCustomer({...customer, address: e.target.value})} 
                      className="w-full px-5 py-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors bg-zinc-50 resize-none" 
                      placeholder={lang === 'ar' ? 'المحافظة، المنطقة، الشارع، رقم العمارة...' : 'City, Area, Street...'} 
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full mt-8 bg-black text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:hover:bg-black"
                  >
                    {isSubmitting 
                      ? (lang === 'ar' ? 'جاري التسجيل...' : 'Processing...') 
                      : (lang === 'ar' ? 'تأكيد الطلب' : 'Confirm Order')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
