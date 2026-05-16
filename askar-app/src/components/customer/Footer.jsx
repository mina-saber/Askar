import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { t, lang } = useLanguage();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black tracking-[0.2em] uppercase mb-6 text-white">ASKAR</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {t('askarStandardDesc')}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">{t('shop')}</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/shop" className="hover:text-rose-500 transition-colors">{t('shop')}</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-rose-500 transition-colors">{t('newArrivals')}</Link></li>
              <li><Link to="/offers" className="hover:text-rose-500 transition-colors">{t('offers')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">{t('support')}</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">{t('contactUs')}</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">{t('shippingReturns')}</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">{t('sizeGuide')}</Link></li>
              <li><Link to="/contact" className="hover:text-rose-500 transition-colors">{t('faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">{t('newsletter')}</h4>
            <p className="text-zinc-400 text-sm mb-4">{t('subscribeDesc')}</p>
            <form onSubmit={handleSubscribe} className="flex border-b border-zinc-700 pb-2 focus-within:border-rose-500 transition-colors">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enterEmail')} 
                required
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-zinc-500 focus:ring-0 px-0"
              />
              <button type="submit" className={`text-sm uppercase tracking-wider font-bold hover:text-rose-500 transition-colors ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}>
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} ASKAR OFFICIAL. {t('allRightsReserved')}.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 rtl:space-x-reverse">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
