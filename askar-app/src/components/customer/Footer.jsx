import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black tracking-[0.2em] uppercase mb-6 text-white">ASKAR</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Redefining modern luxury with impeccable craftsmanship and timeless design. Experience the pinnacle of elegance.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Shop</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/shop" className="hover:text-rose-500 transition-colors">All Products</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-rose-500 transition-colors">New Arrivals</Link></li>
              <li><Link to="/offers" className="hover:text-rose-500 transition-colors">Offers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">Size Guide</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Newsletter</h4>
            <p className="text-zinc-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form onSubmit={handleSubscribe} className="flex border-b border-zinc-700 pb-2 focus-within:border-rose-500 transition-colors">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-zinc-500 focus:ring-0 px-0"
              />
              <button type="submit" className="text-sm uppercase tracking-wider font-bold hover:text-rose-500 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} ASKAR OFFICIAL. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
