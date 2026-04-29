import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-24 right-4 md:right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-100 flex items-center gap-3 pointer-events-auto"
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <XCircle className="text-rose-600" size={20} />
              )}
              <span className="text-sm font-bold tracking-wide text-zinc-900">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
