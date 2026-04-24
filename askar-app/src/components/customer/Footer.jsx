import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    alert('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black tracking-[0.2em] mb-4">ASKAR</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium clothing brand delivering exceptional quality and timeless style. 
              Elevate your wardrobe with our curated collections.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] mb-6">SHOP</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-gray-400 text-sm hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-400 text-sm hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] mb-6">SUPPORT</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <span className="text-gray-400 text-sm cursor-default">Shipping & Returns</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm cursor-default">Size Guide</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm cursor-default">FAQ</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] mb-6">NEWSLETTER</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive updates and offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-4 py-3 bg-white/10 text-white text-sm placeholder-gray-500 border border-white/20 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs tracking-wider">
            © {new Date().getFullYear()} ASKAR. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs tracking-[0.15em]">
              INSTAGRAM
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs tracking-[0.15em]">
              FACEBOOK
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs tracking-[0.15em]">
              TWITTER
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
