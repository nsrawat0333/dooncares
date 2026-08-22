import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageSquare } from 'lucide-react';
import { translations } from '../i18n';

const Footer = ({ lang }) => {
  const t = translations[lang] || translations.EN;

  return (
    <footer className="bg-[#3A3A3A] text-slate-300 text-sm border-t border-[#B88E2F]/30 pt-16 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-700">
        
        {/* Col 1: Brand & Logo (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-[#B88E2F] bg-white shadow-md flex-shrink-0">
              <img
                src="/logo.png"
                alt="DoonCares Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase font-sans">
                Doon<span className="text-[#B88E2F]">Cares</span>
              </h3>
              <span className="text-[10px] text-[#B88E2F] font-bold uppercase tracking-wider block -mt-1">
                DEHRADUN • Luxury House & Car Wash Solution
              </span>
            </div>
          </div>
          
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
            Elevating the standard of home services in Dehradun through dedication, trust, and unparalleled quality.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://www.instagram.com/dooncares.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold hover:bg-pink-700 transition-colors shadow-sm"
              title="Official Instagram @dooncares.in"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=100042846282350" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-colors shadow-sm"
              title="Official Facebook DoonCares"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/917310502324" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Contact Us (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-white font-extrabold text-base tracking-wide uppercase font-sans">
            <span className="text-[#B88E2F]">{t.contactUs}</span>
          </h4>
          
          <div className="space-y-3 text-xs sm:text-sm font-medium">
            
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#B88E2F] mt-1 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-1.5 font-bold text-white">
                <a href="tel:+917310502324" className="hover:text-[#B88E2F] transition-colors">+91 7310502324</a>
                <span>,</span>
                <a href="tel:+919873291147" className="hover:text-[#B88E2F] transition-colors">+91 9873291147</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#B88E2F] flex-shrink-0" />
              <a href="mailto:support@dooncares.in" className="hover:text-[#B88E2F] transition-colors text-slate-300">
                support@dooncares.in
              </a>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#B88E2F] mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed font-bold">
                822C+6C4, Dehrakhas, Patel Nagar, <br />
                <span className="text-white">Dehradun, Uttarakhand 248001</span>
              </p>
            </div>

          </div>
        </div>

        {/* Col 3: Service Area Map (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-white font-extrabold text-base tracking-wide uppercase font-sans">
            <span className="text-[#B88E2F]">{t.serviceArea}</span>
          </h4>
          
          {/* Embedded Google Map Frame */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-lg h-44 relative bg-slate-900">
            <iframe
              title="DoonCares Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.646549286438!2d78.01230007626922!3d30.30404390557451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929fae5e6e39f%3A0x6b97bf8f2e245a1!2sPatel%20Nagar%2C%20Dehradun%2C%20Uttarakhand%20248001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(60%) contrast(90%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 text-center text-xs text-slate-400 font-bold">
        <p>{t.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
