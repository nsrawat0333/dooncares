import React from 'react';
import { PhoneCall, MessageSquare, CalendarCheck } from 'lucide-react';
import { translations } from '../i18n';

const MobileBottomBar = ({ onBookClick, lang }) => {
  const t = translations[lang] || translations.EN;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#3A3A3A]/95 backdrop-blur-md border-t border-[#B88E2F]/40 p-2.5 shadow-2xl flex items-center justify-around gap-2">
      
      {/* Call Button */}
      <a
        href="tel:+917310502324"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-white text-[#333333] font-black text-xs border border-[#B88E2F]/40 active:scale-95 transition-all shadow-sm"
      >
        <PhoneCall className="w-4 h-4 text-[#B88E2F]" />
        <span>{t.callUs}</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/917310502324?text=Hello%20DoonCares!%20I%20want%20to%20book%20a%20car%20wash%20or%20cleaning%20service."
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-emerald-600 text-white font-black text-xs active:scale-95 transition-all shadow-sm"
      >
        <MessageSquare className="w-4 h-4 text-white" />
        <span>WhatsApp</span>
      </a>

      {/* Book Now Button */}
      <button
        onClick={onBookClick}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl gold-gradient-btn font-black text-xs active:scale-95 transition-all shadow-md"
      >
        <CalendarCheck className="w-4 h-4 text-white" />
        <span>{t.bookNow}</span>
      </button>

    </div>
  );
};

export default MobileBottomBar;
