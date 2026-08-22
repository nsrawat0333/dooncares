import React, { useState } from 'react';
import { Phone, MapPin, ShieldCheck, Mail, Copy, Check, Globe, Instagram, Facebook } from 'lucide-react';
import { translations } from '../i18n';

const TopHeader = ({ lang, setLang }) => {
  const t = translations[lang] || translations.EN;
  const [copiedNumber, setCopiedNumber] = useState(null);

  const copyToClipboard = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <div className="bg-[#B88E2F] text-white text-xs py-2.5 px-4 font-medium shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5">
        
        {/* Left: Phone numbers & Social Links */}
        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
          
          {/* Phone 1 */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
            <Phone className="w-3.5 h-3.5 text-[#FFF3E3]" />
            <a 
              href="tel:+917310502324" 
              className="text-sm font-extrabold hover:text-[#FFF3E3] transition-colors tracking-wide"
            >
              +91 7310502324
            </a>
            <button
              onClick={() => copyToClipboard('+917310502324')}
              title="Copy phone number"
              className="p-1 hover:bg-white/20 rounded transition-colors text-[#FFF3E3]"
            >
              {copiedNumber === '+917310502324' ? (
                <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded font-bold">{t.copiedPhone}</span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Phone 2 */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
            <a 
              href="tel:+919873291147" 
              className="text-sm font-extrabold hover:text-[#FFF3E3] transition-colors tracking-wide"
            >
              +91 9873291147
            </a>
            <button
              onClick={() => copyToClipboard('+919873291147')}
              title="Copy phone number"
              className="p-1 hover:bg-white/20 rounded transition-colors text-[#FFF3E3]"
            >
              {copiedNumber === '+919873291147' ? (
                <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded font-bold">{t.copiedPhone}</span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/dooncares.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 font-bold hover:bg-white/30 transition-all text-xs"
            title="Follow DoonCares on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-200" />
            <span>Instagram</span>
          </a>

          {/* Facebook Link */}
          <a
            href="https://www.facebook.com/profile.php?id=100042846282350"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 font-bold hover:bg-white/30 transition-all text-xs"
            title="Follow DoonCares on Facebook"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-200" />
            <span>Facebook</span>
          </a>

        </div>

        {/* Right: Location & Language Switcher */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-200" />
            <span className="font-extrabold text-white">{t.location}</span>
          </div>

          <span className="text-amber-200/60 hidden sm:inline">|</span>

          {/* Language Switcher Toggle */}
          <div className="flex items-center gap-1 bg-white text-[#333333] px-2 py-0.5 rounded-lg border border-white font-bold text-xs">
            <Globe className="w-3.5 h-3.5 text-[#B88E2F]" />
            <button
              onClick={() => setLang('EN')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                lang === 'EN' ? 'bg-[#B88E2F] text-white font-black' : 'hover:text-[#B88E2F]'
              }`}
            >
              English
            </button>
            <span>/</span>
            <button
              onClick={() => setLang('HI')}
              className={`px-1.5 py-0.5 rounded transition-all ${
                lang === 'HI' ? 'bg-[#B88E2F] text-white font-black' : 'hover:text-[#B88E2F]'
              }`}
            >
              हिंदी
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TopHeader;
