import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowUp, Phone, Send } from 'lucide-react';
import { COMPANY, getWhatsAppLink } from '../data/siteContent';
import { trackEvent } from '../utils/analytics';

export function FloatingActions() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setShowTop(current > 360);
      setScrollProgress(total > 0 ? Math.min(1, Math.max(0, current / total)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - scrollProgress);

  return (
    <>
      {/* Desktop floating WhatsApp + Back to Top */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3">
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="relative w-11 h-11 rounded-full bg-[#FAF7F0] text-[#0F3D2E] shadow-lg border border-[#0F3D2E]/15 flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg className="absolute inset-0 w-11 h-11 -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="rgba(15,61,46,0.12)"
                strokeWidth="2.5"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="#E0A526"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-4 h-4 relative z-10" />
          </button>
        )}

        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'floating_button' })}
          aria-label="Enquire on WhatsApp"
          className="group relative inline-flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full bg-[#2E8B57] hover:bg-[#0F3D2E] text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold whitespace-nowrap">WhatsApp Desk</span>
        </a>
      </div>

      {/* Mobile Bottom Sticky CTA Bar (compact <= 56px, well under 15% mobile height cap) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#09271D]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 flex items-center justify-between gap-2">
        <a
          href={COMPANY.phoneHref}
          className="flex-1 h-10 rounded-full border border-white/20 text-[#FAF7F0] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#E0A526]" />
          <span>Call</span>
        </a>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'mobile_sticky_bar' })}
          className="flex-[1.35] h-10 rounded-full bg-[#2E8B57] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
        <Link
          to="/contact"
          className="flex-1 h-10 rounded-full bg-[#E0A526] text-[#09271D] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enquire</span>
        </Link>
      </div>
    </>
  );
}
