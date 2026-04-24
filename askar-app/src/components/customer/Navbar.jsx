import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { cartCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/shop', label: 'SHOP' },
    { to: '/new-arrivals', label: 'NEW ARRIVALS' },
    { to: '/offers', label: 'OFFERS' },
    { to: '/contact', label: 'CONTACT' },
  ]

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-[0.2em] text-black">
            ASKAR
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-xs font-semibold tracking-[0.15em] transition-colors duration-200 ${
                    isActive ? 'text-accent' : 'text-black hover:text-accent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              id="search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button id="account-icon" className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
              <User size={18} strokeWidth={1.5} />
            </button>
            <button id="cart-icon" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 md:hidden hover:bg-gray-50 rounded-full transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-black transition-colors"
                autoFocus
              />
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 animate-fade-in-up">
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-xs font-semibold tracking-[0.15em] transition-colors ${
                      isActive ? 'text-accent bg-red-50' : 'text-black hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
