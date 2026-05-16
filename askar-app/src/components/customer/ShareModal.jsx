import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ShareModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();
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

  const handleSocialShare = async (platform) => {
    if (platform === 'messenger') {
      // User specifically requested the Share Menu to open for this icon
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'ASKAR',
            url: url
          });
        } catch (err) {
          console.error('Error sharing:', err);
        }
      } else {
        alert(lang === 'ar' ? 'قائمة المشاركة غير مدعومة في هذا المتصفح.' : 'Share menu is not supported in this browser.');
        window.open(`http://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`, '_blank');
      }
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedUrl}`, '_blank');
    } else if (platform === 'instagram') {
      handleCopy();
      alert(lang === 'ar' ? 'تم نسخ الرابط! سيتم فتح الانستجرام الآن لتتمكن من لصقه في رسائل أي شخص.' : 'Link copied! Instagram will now open so you can paste and send it.');
      window.location.href = 'instagram://direct';
      setTimeout(() => {
        window.open('https://www.instagram.com/direct/inbox/', '_blank');
      }, 1000);
    }
  };

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

        <div className="flex justify-center space-x-4 mb-10 rtl:space-x-reverse">
          <button onClick={() => handleSocialShare('messenger')} className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-[#00B2FF]/10 hover:text-[#00B2FF] transition-colors">
            {/* Messenger */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </button>
          
          <button onClick={() => handleSocialShare('instagram')} className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-[#E1306C]/10 hover:text-[#E1306C] transition-colors">
            {/* Instagram */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </button>
          
          <button onClick={() => handleSocialShare('whatsapp')} className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors">
            {/* WhatsApp */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </button>
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
