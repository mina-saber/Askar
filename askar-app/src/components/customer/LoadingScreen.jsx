import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hold the loading screen for 1.8 seconds for a premium feel
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Give time for the exit animation before unmounting
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-[0.3em] uppercase mb-8">
              ASKAR
            </h1>
            
            {/* Elegant Progress Line */}
            <div className="w-48 h-[1px] bg-zinc-800 overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-y-0 left-0 w-1/2 bg-white"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
