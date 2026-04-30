import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ShareModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors bg-zinc-100 hover:bg-zinc-200 p-2 rounded-full"
        >
          <X size={18} />
        </button>

        <h3 className="text-2xl font-black uppercase tracking-widest text-center mb-8">{t('share')}</h3>

        <div className="flex justify-center space-x-6 mb-10 rtl:space-x-reverse">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors">
            {/* Facebook */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors">
            {/* Twitter */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a href={`https://wa.me/?text=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors">
            {/* WhatsApp instead of Instagram */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
        </div>

        <button 
          onClick={handleCopy}
          className={`w-full py-5 rounded-full flex items-center justify-center text-sm font-black uppercase tracking-widest transition-all duration-300 ${
            copied ? 'bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)]' : 'bg-black text-white hover:bg-rose-600 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)]'
          }`}
        >
          {copied ? (
            <>
              <Check size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> {t('copied')}
            </>
          ) : (
            <>
              <Copy size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> {t('copyLink')}
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
