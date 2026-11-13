import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf } from 'lucide-react';

export function Preloader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return false;
    return !sessionStorage.getItem('mei_preloaded');
  });

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('mei_preloaded', '1');
    }, 650);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          aria-hidden="true"
          className="fixed inset-0 z-[100] bg-[#0F3D2E] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E0A526]/15 border border-[#E0A526]/40 flex items-center justify-center text-[#E0A526]">
              <Leaf className="w-7 h-7" />
            </div>
            <span className="font-display text-lg text-[#FAF7F0] tracking-tight">
              Mondal Export Import
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
