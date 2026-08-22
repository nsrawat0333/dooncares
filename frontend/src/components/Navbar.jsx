import React from 'react';
import { PhoneCall, Menu, X, CalendarCheck, ShieldCheck, Globe, Instagram, Facebook } from 'lucide-react';
import { translations } from '../i18n';

const Navbar = ({ onBookClick, lang, setLang }) => {
  const t = translations[lang] || translations.EN;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FCF8F3]/95 backdrop-blur-md border-b border-[#F9F1E7] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with 3D Shield Emblem */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform border-2 border-[#B88E2F]/40 bg-white flex-shrink-0">
              <img
                src="/logo.png"
                alt="DoonCares Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#333333] uppercase font-sans">
                Doon<span className="text-[#B88E2F]">Cares</span>
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-widest text-[#B88E2F] font-bold -mt-1 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-[#B88E2F]" />
                <span>DEHRADUN • House & Car Wash</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 text-sm font-semibold text-[#333333]">
            <a href="#hero" className="hover:text-[#B88E2F] transition-colors">{t.home}</a>
            <a href="#services" className="hover:text-[#B88E2F] transition-colors">{t.services}</a>
            <a href="#gallery" className="hover:text-[#B88E2F] transition-colors">{t.gallery}</a>
            <a href="#reviews" className="hover:text-[#B88E2F] transition-colors">{t.reviews}</a>
            <a href="#booking" className="hover:text-[#B88E2F] transition-colors">{t.bookService}</a>

            {/* Instagram Link */}
            <a 
              href="https://www.instagram.com/dooncares.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1 font-bold ml-1"
              title="Follow DoonCares on Instagram"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-xs">Instagram</span>
            </a>

            {/* Facebook Link */}
            <a 
              href="https://www.facebook.com/profile.php?id=100042846282350"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold"
              title="Follow DoonCares on Facebook"
            >
              <Facebook className="w-4 h-4" />
              <span className="text-xs">Facebook</span>
            </a>
          </div>

          {/* Actions: Call & Book Button + Language Switcher Toggle */}
          <div className="hidden md:flex items-center gap-3 sm:gap-3.5 ml-auto">
            {/* Language Switcher Desktop */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF3E3] text-[#B88E2F] font-black text-xs border border-[#B88E2F]/40 flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap ml-4 sm:ml-6"
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'EN' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Call Us Button */}
            <a
              href="tel:+917310502324"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E3] text-[#333333] text-sm font-extrabold border border-[#B88E2F]/40 shadow-sm transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 text-[#B88E2F]" />
              <span>{t.callUs}</span>
            </a>

            {/* Book Now Button */}
            <button
              onClick={onBookClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient-btn font-extrabold text-sm shadow-md transition-all hover:scale-105 whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t.bookNow}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Toggle Mobile */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-2.5 py-1 rounded-xl bg-white text-[#B88E2F] font-black text-xs border border-[#B88E2F]/40 flex items-center gap-1 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'EN' ? 'हिंदी' : 'EN'}</span>
            </button>

            <button
              onClick={onBookClick}
              className="px-3 py-1.5 rounded-xl gold-gradient-btn font-extrabold text-xs shadow-md"
            >
              {t.bookNow}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-white text-[#333333] border border-[#F9F1E7]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#FCF8F3] border-b border-[#F9F1E7] px-4 pt-2 pb-6 space-y-3 text-[#333333] text-sm font-bold">
          <a href="#hero" onClick={() => setIsOpen(false)} className="block py-2 hover:text-[#B88E2F]">{t.home}</a>
          <a href="#services" onClick={() => setIsOpen(false)} className="block py-2 hover:text-[#B88E2F]">{t.services}</a>
          <a href="#gallery" onClick={() => setIsOpen(false)} className="block py-2 hover:text-[#B88E2F]">{t.gallery}</a>
          <a href="#reviews" onClick={() => setIsOpen(false)} className="block py-2 hover:text-[#B88E2F]">{t.reviews}</a>
          <a href="#booking" onClick={() => setIsOpen(false)} className="block py-2 hover:text-[#B88E2F]">{t.bookService}</a>
          
          <div className="pt-2 flex flex-col gap-2 border-t border-[#F9F1E7]">
            <a 
              href="https://www.instagram.com/dooncares.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-pink-600 font-extrabold text-xs"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram (@dooncares.in)</span>
            </a>

            <a 
              href="https://www.facebook.com/profile.php?id=100042846282350"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 font-extrabold text-xs"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook (DoonCares)</span>
            </a>
          </div>

          <div className="pt-3 border-t border-[#F9F1E7] flex flex-col gap-2">
            <a
              href="tel:+917310502324"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FFF3E3] text-[#B88E2F] font-bold border border-[#B88E2F]/30"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +91 7310502324</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
