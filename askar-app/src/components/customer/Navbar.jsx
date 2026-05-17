import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { User, ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { cartCount } = useCart();
  const { t, lang, toggleLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), path: "/" },
    { name: t('shop'), path: "/shop" },
    { name: t('newArrivals'), path: "/new-arrivals" },
    { name: t('offers'), path: "/offers" },
    { name: t('contact'), path: "/contact" },
  ];

  const isTransparent = isHome && !scrolled;
  const navBg = isTransparent ? "bg-transparent" : "bg-white/90 backdrop-blur-lg border-b border-zinc-100 shadow-sm";
  const textColor = isTransparent ? "text-white" : "text-zinc-900";
  const linkColor = isTransparent ? "text-zinc-200 hover:text-white" : "text-zinc-500 hover:text-rose-600";
  const activeLinkColor = isTransparent ? "text-white font-bold" : "text-rose-600 font-bold";

  return (
    <>
      {/* Top Banner - hidden on home page to allow full-screen hero visibility */}
      {!isHome && (
        <div className="bg-black text-white text-xs text-center py-2 uppercase tracking-widest font-medium">
          {t('freeShipping')}
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ease-in-out ${navBg} ${isHome && !scrolled ? 'py-4' : 'py-0'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`${textColor} p-2 transition-colors`}
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none rtl:md:ml-10">
              <Link to="/" className={`text-3xl font-black tracking-[0.2em] uppercase ${textColor} transition-colors`}>
                ASKAR
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex md:space-x-8 lg:space-x-12 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => 
                    `text-sm uppercase tracking-wider transition-colors ${
                      isActive ? activeLinkColor : linkColor
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Icons */}
            <div className={`flex items-center space-x-4 md:space-x-6 rtl:space-x-reverse ${textColor} transition-colors`}>
              <button onClick={toggleLanguage} className="hover:text-rose-500 transition-colors flex items-center" title={lang === 'en' ? 'عربي' : 'English'}>
                <Globe size={20} className="rtl:ml-1 ltr:mr-1" />
                <span className="text-xs font-bold uppercase">{lang === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <Link to="/admin" className="hover:text-rose-500 transition-colors hidden sm:block">
                <User size={20} />
              </Link>
              <Link to="/cart" className="hover:text-rose-500 transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={lang === 'ar' ? { x: "100%" } : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={lang === 'ar' ? { x: "100%" } : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-4/5 max-w-sm bg-white z-[70] p-6 shadow-2xl flex flex-col md:hidden`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-black tracking-[0.2em] uppercase text-zinc-900">ASKAR</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-rose-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `text-lg uppercase tracking-wider font-bold transition-colors ${
                        isActive ? 'text-rose-600' : 'text-zinc-900 hover:text-rose-600'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
              <div className="mt-auto border-t border-zinc-100 pt-6 space-y-6">
                 <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="flex items-center space-x-3 text-zinc-600 hover:text-rose-600 transition-colors uppercase text-sm tracking-wider font-bold rtl:space-x-reverse">
                    <Globe size={18} />
                    <span>{lang === 'en' ? 'عربي' : 'English'}</span>
                 </button>
                 <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 text-zinc-600 hover:text-rose-600 transition-colors uppercase text-sm tracking-wider font-bold rtl:space-x-reverse">
                    <User size={18} />
                    <span>{t('adminLogin')}</span>
                 </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
