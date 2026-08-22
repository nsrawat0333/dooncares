import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Calendar, MessageSquare, CheckCircle, ShieldCheck, Car, ArrowRight, Home, Droplets, ChevronLeft, ChevronRight, Phone, Copy, Check, MapPin } from 'lucide-react';
import { translations } from '../i18n';

const heroVideos = [
  { id: 1, src: '/assets/deep_video.mp4', title: 'Full House Deep Cleaning' },
  { id: 2, src: '/assets/sofa_video.mp4', title: 'Sofa & Upholstery Cleaning' },
  { id: 3, src: '/assets/carpet_video.mp4', title: 'Carpet Shampooing' },
  { id: 4, src: '/assets/kitchen_video.mp4', title: 'Kitchen Degreasing' },
  { id: 5, src: '/assets/tank_video.mp4', title: 'Water Tank Cleaning' }
];

const Hero3D = ({ onBookClick, lang }) => {
  const t = translations[lang] || translations.EN;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + heroVideos.length) % heroVideos.length);
  };

  const copyPhone = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  return (
    <section id="hero" className="relative py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-[#FCF8F3] overflow-hidden">
      
      {/* Hero Content Container (Furniro Split Layout) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Side: Video Loop Showcase */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full h-[260px] xs:h-[320px] sm:h-[420px] lg:h-full min-h-[260px] sm:min-h-[440px] rounded-3xl overflow-hidden border-2 border-[#B88E2F]/30 shadow-xl bg-black group">
            
            <video
              ref={videoRef}
              src={heroVideos[currentVideoIndex].src}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover rounded-3xl"
            />

            {/* Navigation Controls */}
            <button
              onClick={prevVideo}
              aria-label="Previous Video"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all flex items-center justify-center shadow-lg font-bold backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextVideo}
              aria-label="Next Video"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all flex items-center justify-center shadow-lg font-bold backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Video Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
              {heroVideos.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentVideoIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentVideoIndex ? 'w-6 sm:w-8 bg-[#B88E2F]' : 'w-2 bg-white/60'
                  }`}
                  aria-label={`Go to video ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Right Side: Furniro Floating Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-[#FFF3E3] p-5 sm:p-8 md:p-10 lg:p-12 rounded-3xl border-2 border-[#B88E2F]/30 shadow-xl space-y-5 sm:space-y-6 text-left">
            
            {/* Location Highlight Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#B88E2F]/40 text-xs font-black shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#B88E2F]" />
              <span className="bg-[#B88E2F] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase text-[10px] sm:text-xs">
                DEHRADUN
              </span>
              <span className="text-[#333333] text-[11px] sm:text-xs">{t.newArrival}</span>
            </div>

            {/* Headline with Relaxed Line-Height and Block Spacing to prevent Hindi text overlap */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal leading-normal sm:leading-snug font-sans">
              <span className="block text-[#B88E2F] mb-1 sm:mb-2">{t.heroTitle1}</span>
              <span className="block text-[#333333] leading-snug">{t.heroTitle2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              {t.heroDesc}
              <strong className="block text-[#333333] font-extrabold mt-1"> {t.noLoginNotice}</strong>
            </p>

            {/* BIG CALLABLE & COPYABLE PHONE NUMBERS DISPLAY */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#B88E2F]/40 shadow-md space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#B88E2F] font-black block">
                📞 CALL US DIRECTLY (DEHRADUN HELPLINE)
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                
                {/* Phone 1 */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <a
                    href="tel:+917310502324"
                    className="text-lg xs:text-xl sm:text-2xl font-black text-[#333333] hover:text-[#B88E2F] transition-colors tracking-wide flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#B88E2F]" />
                    <span>+91 7310502324</span>
                  </a>
                  <button
                    onClick={() => copyPhone('+917310502324')}
                    className="px-2.5 py-1 rounded-lg bg-[#FCF8F3] hover:bg-[#FFF3E3] text-[#333333] border border-[#B88E2F]/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                  >
                    {copiedNumber === '+917310502324' ? (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.copiedPhone}</span>
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#B88E2F]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Phone 2 */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <a
                    href="tel:+919873291147"
                    className="text-base sm:text-lg font-extrabold text-[#333333] hover:text-[#B88E2F] transition-colors tracking-wide flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B88E2F]" />
                    <span>+91 9873291147</span>
                  </a>
                  <button
                    onClick={() => copyPhone('+919873291147')}
                    className="px-2.5 py-1 rounded-lg bg-[#FCF8F3] hover:bg-[#FFF3E3] text-[#333333] border border-[#B88E2F]/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                  >
                    {copiedNumber === '+919873291147' ? (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.copiedPhone}</span>
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#B88E2F]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Category Badges */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              <span className="bg-white text-[#333333] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#B88E2F]/30 text-[11px] sm:text-xs font-bold shadow-sm flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{t.carWashBadge}</span>
              </span>
              <span className="bg-white text-[#333333] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#B88E2F]/30 text-[11px] sm:text-xs font-bold shadow-sm flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{t.houseCleanBadge}</span>
              </span>
              <span className="bg-white text-[#333333] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#B88E2F]/30 text-[11px] sm:text-xs font-bold shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{t.sofaCarpetBadge}</span>
              </span>
              <span className="bg-white text-[#333333] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#B88E2F]/30 text-[11px] sm:text-xs font-bold shadow-sm flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{t.tankBadge}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl gold-gradient-btn font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md active:scale-95 transition-all"
              >
                <span>{t.btnBookNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/917310502324?text=Hello%20DoonCares!%20I%20want%20to%20book%20a%20car%20wash%20or%20cleaning%20service%20in%20Dehradun."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-[#F9F1E7] text-[#333333] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-[#B88E2F]/40 shadow-sm active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#B88E2F]" />
                <span>{t.btnWhatsapp}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-[#B88E2F]/20">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#333333]">
                <CheckCircle className="w-3.5 h-3.5 text-[#B88E2F] flex-shrink-0" />
                <span>{t.noAdvanceMoney}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#333333]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B88E2F] flex-shrink-0" />
                <span>{t.verifiedExperts}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#333333]">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E2F] flex-shrink-0" />
                <span>{t.ecoFriendly}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero3D;
