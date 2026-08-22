import React from 'react';
import { MessageSquare } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "917310502324";
  const defaultText = encodeURIComponent("Hello DoonCares! I want to inquire about your home cleaning services in Dehradun.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultText}`;

  return (
    <div className="fixed bottom-20 right-6 sm:bottom-24 z-50 group">
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with us on WhatsApp 💬
      </span>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 relative"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none" />
        <MessageSquare className="w-7 h-7 fill-white stroke-none" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
