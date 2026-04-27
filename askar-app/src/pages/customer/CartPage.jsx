import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (item, delta) => {
    if (item.quantity + delta > 0) {
      // addToCart with negative quantity or positive handles the logic in context, wait, 
      // Context uses: return prev.map(item => ... ? { ...item, quantity: item.quantity + quantity } : item)
      // So delta works perfectly!
      addToCart(item.product, item.size, item.color, delta);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * Number(item.product.sale_price || item.product.price)), 0);
  };

  const handleCheckout = () => {
    // Basic checkout function, you can implement a checkout page later.
    alert("Proceeding to checkout...");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <div className="h-20 w-full bg-white"></div>
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-widest mb-2">Shopping Bag</h1>
          <p className="text-zinc-500 text-sm font-medium">{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in your bag</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-zinc-100 shadow-sm">
            <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-900 mb-4">Your bag is empty</h2>
            <p className="text-zinc-500 text-sm mb-8">Looks like you haven't added anything to your bag yet.</p>
            <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 uppercase tracking-widest text-sm font-black hover:bg-rose-600 transition-colors rounded-full shadow-md">
              Start Shopping
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
                
                return (
                  <div key={`${product.id}-${item.size}-${item.color}-${index}`} className="flex flex-col sm:flex-row bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm relative">
                    <Link to={`/product/${product.id}`} className="w-full sm:w-32 h-40 flex-shrink-0 bg-zinc-100 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                      <img src={item.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </Link>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start pr-8">
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium mb-1">{categoryName}</p>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 hover:text-rose-600 transition-colors mb-2 line-clamp-1">{product.name}</h3>
                          </Link>
                          
                          <div className="flex flex-wrap gap-4 text-xs text-zinc-500 font-medium">
                            {item.size && <p>Size: <span className="text-zinc-900 font-bold">{item.size}</span></p>}
                            {item.color && (
                              <div className="flex items-center">
                                Color: <div className="w-4 h-4 rounded-full border border-zinc-300 ml-2" style={{ backgroundColor: item.color }}></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product.id, item.size, item.color)}
                          className="absolute top-6 right-6 text-zinc-400 hover:text-rose-600 transition-colors"
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
                        <span className="text-lg font-black text-zinc-900">${(price * item.quantity).toFixed(2)}</span>
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
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm sticky top-28">
                <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm font-medium text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 font-bold">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-zinc-100 pt-6 mb-8 flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black text-rose-600">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest hover:bg-rose-600 transition-colors rounded-full shadow-lg flex justify-center items-center"
                >
                  Checkout <ArrowRight size={16} className="ml-2" />
                </button>
                
                <div className="mt-6 text-center">
                  <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
