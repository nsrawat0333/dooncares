import React, { useState } from 'react';
import { Eye, CalendarCheck, ChevronLeft, ChevronRight, Play, Images, ArrowRight } from 'lucide-react';
import { translations } from '../i18n';

const getGalleryCategories = (lang) => {
  const isHi = lang === 'HI';
  return [
    {
      id: 'carwash',
      title: isHi ? 'डोरस्टेप कार वाशिंग एवं ऑटो डिटेलिंग' : 'Car Washing & Auto Detailing',
      category: isHi ? 'कार वाशिंग' : 'Doorstep Car Wash',
      coverImage: '/assets/akash_deep_clean.png',
      description: isHi ? 'प्रेशर फोम वाशिंग, इंटीरियर वैक्यूमिंग, डैशबोर्ड पॉलिश और टायर शाइनिंग आपके घर पर।' : 'Pressure foam washing, interior vacuuming, dashboard polish, and tire glossing at your doorstep.',
      video: '/assets/deep_video.mp4',
      photos: [
        { url: '/assets/akash_deep_clean.png', title: isHi ? 'प्रेशर फोम कार वाशिंग' : 'Pressure Foam Car Washing' },
        { url: '/assets/hero.jpg', title: isHi ? 'कार वैक्यूमिंग व पॉलिश' : 'Car Interior Vacuuming & Polish' },
        { url: '/assets/akash_carpet_clean.png', title: isHi ? 'डैशबोर्ड व सीट सफाई' : 'Dashboard & Upholstery Polish' },
        { url: '/assets/akash_sofa_clean.png', title: isHi ? 'फाइनल ग्लास व बॉडी शाइन' : 'Final Glass & Body Shine' }
      ]
    },
    {
      id: 'sofa',
      title: isHi ? 'सोफा व कुशन डीप क्लीनिंग' : 'Sofa & Upholstery Deep Cleaning',
      category: isHi ? 'सोफा सफाई' : 'Sofa Cleaning',
      coverImage: '/assets/sofa_1.png',
      description: isHi ? 'सोफा सेट, रिक्लाइनर और गद्दों की वाटर एक्सट्रैक्शन, शैम्पूइंग और दाग-धब्बे सफाई।' : 'Deep extraction, shampooing & stain removal for sofa sets, recliners, and mattresses.',
      video: '/assets/sofa_video.mp4',
      photos: [
        { url: '/assets/sofa_1.png', title: isHi ? 'सोफा क्लीनिंग उपकरण व सेटअप' : 'Sofa Cleaning Setup & Equipment' },
        { url: '/assets/sofa_2.png', title: isHi ? 'डीप एक्सट्रैक्शन प्रक्रिया' : 'Deep Extraction Process' },
        { url: '/assets/sofa_3.png', title: isHi ? 'दाग व बदबू निवारण' : 'Stain & Odor Removal' },
        { url: '/assets/sofa_4.png', title: isHi ? 'फाइनल सैनिटाइज्ड ड्राई फिनिश' : 'Final Sanitized & Dry Finish' },
        { url: '/assets/sofa_cleaning_real.jpg', title: isHi ? 'ग्राहक सोफा क्लीनिंग परिणाम' : 'Real Customer Sofa Clean Result' }
      ]
    },
    {
      id: 'plumbing_electrical',
      title: isHi ? 'प्लंबिंग एवं इलेक्ट्रिकल मरम्मत' : 'Plumbing & Electrical',
      category: isHi ? 'मेंटेनेंस व रिपेयर' : 'Maintenance & Repairs',
      coverImage: '/assets/akash_plumbing_clean.png',
      description: isHi ? 'सत्यापित प्लंबिंग मरम्मत, लीक फिक्सिंग, इलेक्ट्रिकल शॉर्ट-सर्किट रिपेयर और होम वायरिंग।' : 'Certified plumbing repairs, leak fixes, certified electrical troubleshooting, and appliance installations.',
      video: '/assets/electrical_video.mp4',
      photos: [
        { url: '/assets/akash_plumbing_clean.png', title: isHi ? 'प्लंबिंग लीकेज फिक्सिंग व नल रिपेयर' : 'Certified Plumbing Leak Repairs' },
        { url: '/assets/plumbing_real.jpg', title: isHi ? 'पाइपलाइन व सिंक इंस्टॉलेशन' : 'Pipeline & Tap Fitting Installation' },
        { url: '/assets/akash_electrical_clean.png', title: isHi ? 'इलेक्ट्रिकल शॉर्ट-सर्किट जांच' : 'Electrical Wiring & Circuit Inspection' },
        { url: '/assets/electrical_real.jpg', title: isHi ? 'स्वीचबोर्ड व होम वायरिंग रिपेयर' : 'Switchboard & Appliance Maintenance' }
      ]
    },
    {
      id: 'pest_fogging',
      title: isHi ? 'फॉगिंग एवं पेस्ट ट्रीटमेंट' : 'Fogging & Pest Treatment',
      category: isHi ? 'कीट नियंत्रण' : 'Pest Control & Sanitization',
      coverImage: '/assets/akash_pest_clean.png',
      description: isHi ? 'इको-फ्रेंडली कीटनाशक छिड़काव, कमर्शियल सैनिटाइजेशन और प्रोफेशनल थर्मल फॉगिंग सर्विस।' : 'Eco-friendly pest eradication, commercial sanitization, and professional thermal fogging services.',
      video: '/assets/fogging_video.mp4',
      photos: [
        { url: '/assets/akash_pest_clean.png', title: isHi ? 'थर्मल फॉगिंग व मच्छर नियंत्रण' : 'Professional Thermal Fogging' },
        { url: '/assets/fogging_1.jpeg', title: isHi ? 'इको-फ्रेंडली पेस्ट कंट्रोल स्प्रे' : 'Eco-Friendly Pest Spray' },
        { url: '/assets/fogging_2.jpeg', title: isHi ? 'दीमक व कॉकरोच निवारण' : 'Termite & Cockroach Eradication' },
        { url: '/assets/fogging_3.jpeg', title: isHi ? 'कमर्शियल परिसर सैनिटाइजेशन' : 'Commercial Facility Sanitization' }
      ]
    },
    {
      id: 'carpet',
      title: isHi ? 'कारपेट शैम्पूइंग व वैक्यूमिंग' : 'Carpet Shampooing & Vacuuming',
      category: isHi ? 'कारपेट शैम्पू' : 'Carpet Shampoo',
      coverImage: '/assets/carpet_1.png',
      description: isHi ? 'उच्च दबाव वैक्यूम एक्सट्रैक्शन, टेक्सचर रिस्टोरेशन और एंटी-बैक्टीरियल शैम्पूइंग।' : 'High-pressure vacuum extraction, texture restoration, and anti-bacterial shampooing.',
      video: '/assets/carpet_video.mp4',
      photos: [
        { url: '/assets/carpet_1.png', title: isHi ? 'कारपेट वैक्यूमिंग व धुलाई' : 'Carpet Vacuuming & Washing' },
        { url: '/assets/carpet_2.jpeg', title: isHi ? 'डीप डस्ट व धूल सफाई' : 'Deep Dirt & Grit Extraction' },
        { url: '/assets/carpet_work_real.jpg', title: isHi ? 'कारपेट शैम्पू फिनिश' : 'Completed Carpet Shampoo Result' },
        { url: '/assets/carpet_cleaning_1.png', title: isHi ? 'इको-फ्रेंडली शैम्पू प्रयोग' : 'Eco-Friendly Shampoo Application' }
      ]
    },
    {
      id: 'deep',
      title: isHi ? 'पूरे घर की डीप क्लीनिंग व सैनिटाइजेशन' : 'Full House Deep Cleaning & Sanitization',
      category: isHi ? 'डीप क्लीनिंग' : 'Deep Cleaning',
      coverImage: '/assets/deep_1.png',
      description: isHi ? 'संपूर्ण 360-डिग्री घर की सफाई, फर्श पॉलिशिंग, और खिड़की-बालकनी धुलाई।' : 'Complete 360-degree house deep cleaning, floor polishing, and window sanitization.',
      video: '/assets/deep_video.mp4',
      photos: [
        { url: '/assets/deep_1.png', title: isHi ? 'लिविंग रूम डीप क्लीनिंग' : 'Living Room Deep Cleaning' },
        { url: '/assets/deep_2.png', title: isHi ? 'बेडरूम व बालकनी धुलाई' : 'Bedroom & Balcony Washing' },
        { url: '/assets/deep_3.png', title: isHi ? 'फर्श स्क्रबिंग व पॉलिशिंग' : 'Floor Scrubbing & Polishing' },
        { url: '/assets/full_home_cleaning_real.jpg', title: isHi ? 'पूर्ण घर सफाई परिणाम' : 'Completed Home Clean Result' }
      ]
    },
    {
      id: 'kitchen',
      title: isHi ? 'किचन डीग्रीसिंग व ऑयल क्लीनिंग' : 'Kitchen Degreasing & Oil Clean',
      category: isHi ? 'किचन सफाई' : 'Kitchen Deep Clean',
      coverImage: '/assets/kitchen_deep_clean_1.png',
      description: isHi ? 'जिद्दी तेल व ग्रीस की सफाई, चिमनी क्लीनिंग, दीवार टाइल स्क्रबिंग और उपकरण पॉलिश।' : 'Tough oil grease removal, chimney cleaning, wall tile scrubbing, and appliance polish.',
      video: '/assets/kitchen_video.mp4',
      photos: [
        { url: '/assets/kitchen_deep_clean_1.png', title: isHi ? 'किचन स्लैब डीग्रीसिंग' : 'Kitchen Counter & Slab Degreasing' },
        { url: '/assets/kitchen_deep_clean_2.png', title: isHi ? 'टाइल व एग्जॉस्ट सफाई' : 'Tile & Exhaust Cleaning' },
        { url: '/assets/kitchen_1.jpeg', title: isHi ? 'चिमनी व केबिनेट सफाई' : 'Chimney & Cabinet Cleaning' },
        { url: '/assets/kitchen_2.jpeg', title: isHi ? 'सैनिटाइज्ड किचन' : 'Final Sanitized Kitchen' }
      ]
    },
    {
      id: 'tank',
      title: isHi ? 'वॉटर टैंक सफाई व कीटाणुशोधन' : 'Water Tank Cleaning & Disinfection',
      category: isHi ? 'टैंक सफाई' : 'Tank Cleaning',
      coverImage: '/assets/akash_tank_clean.png',
      description: isHi ? 'मैकेनाइज्ड हाई-प्रेशर जेट वाशिंग, कीचड़ निष्कासन और यूवी सैनिटाइजेशन।' : 'Mechanized high-pressure jet washing, sludge extraction, and UV disinfection.',
      video: '/assets/tank_video.mp4',
      photos: [
        { url: '/assets/akash_tank_clean.png', title: isHi ? 'हाई प्रेशर वॉटर टैंक धुलाई' : 'High Pressure Water Tank Washing' },
        { url: '/assets/tank_1.jpeg', title: isHi ? 'गाद व कीचड़ निष्कासन' : 'Sludge & Sediment Extraction' },
        { url: '/assets/tank_3.jpeg', title: isHi ? 'टैंक सैनिटाइजेशन प्रक्रिया' : 'Tank Disinfection Process' },
        { url: '/assets/tank_4.jpeg', title: isHi ? 'साफ वॉटर टैंक परिणाम' : 'Clean Water Tank Result' }
      ]
    },
    {
      id: 'drainage',
      title: isHi ? 'सीवर व ड्रेनेज पाइप सफाई' : 'Sewer & Drainage Cleaning',
      category: isHi ? 'ड्रैनेज क्लीयरेंस' : 'Drainage Clearing',
      coverImage: '/assets/akash_drainage_clean.png',
      description: isHi ? 'हेवी-ड्यूटी सीवर लाइन डी-ब्लॉकिंग, ड्रेनेज वाशिंग और गंदे पानी का निस्तारण।' : 'Heavy-duty sewer pipe unblocking, high-pressure linejetting, and sludge clearance.',
      video: '/assets/drainage_video.mp4',
      photos: [
        { url: '/assets/akash_drainage_clean.png', title: isHi ? 'सीवर लाइन हाई प्रेशर जेटिंग' : 'High Pressure Sewer Line Jetting' },
        { url: '/assets/drainage_1.jpeg', title: isHi ? 'ड्रेनेज पाइप ब्लॉक क्लीयरेंस' : 'Drainage Pipe Block Clearing' },
        { url: '/assets/drainage_2.jpeg', title: isHi ? 'सीवेज चैम्बर क्लीनिंग' : 'Sewage Chamber Flushing' },
        { url: '/assets/deep_drainage.jpg', title: isHi ? 'साफ ड्रैनेज फ्लो' : 'Clean Unblocked Drainage Flow' }
      ]
    }
  ];
};

const ServicesGallery = ({ onSelectService, lang }) => {
  const t = translations[lang] || translations.EN;
  const galleryCategories = getGalleryCategories(lang);

  const [activeModal, setActiveModal] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const openModal = (category) => {
    setActiveModal(category);
    setCurrentSlideIndex(0);
    setShowVideo(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setShowVideo(false);
  };

  const nextSlide = () => {
    if (!activeModal) return;
    setCurrentSlideIndex((prev) => (prev + 1) % activeModal.photos.length);
  };

  const prevSlide = () => {
    if (!activeModal) return;
    setCurrentSlideIndex((prev) => (prev - 1 + activeModal.photos.length) % activeModal.photos.length);
  };

  return (
    <div id="services" className="scroll-mt-24">
      <section id="gallery" className="py-20 px-4 max-w-7xl mx-auto bg-[#FCF8F3] scroll-mt-24">
      
      {/* Furniro Header */}
      <div className="text-center space-y-3 mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333333] tracking-tight font-sans">
          {t.servicesTitle}
        </h2>
        <p className="text-slate-600 text-base max-w-md mx-auto font-medium">
          {t.servicesSub}
        </p>
      </div>

      {/* Grid Cards (Furniro Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryCategories.map((item) => (
          <div
            key={item.id}
            onClick={() => openModal(item)}
            className="furniro-card overflow-hidden flex flex-col justify-between cursor-pointer group"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-[#F9F1E7]">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-white/90 text-[#B88E2F] text-xs font-bold shadow-md flex items-center gap-1 backdrop-blur-md border border-[#F9F1E7]">
                <Images className="w-3.5 h-3.5" />
                <span>{item.photos.length} {t.photosCount}</span>
              </div>

              {/* View Overlay Button */}
              <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#B88E2F] text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B88E2F] font-bold">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-[#333333] mt-1 group-hover:text-[#B88E2F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#F9F1E7]">
                <span className="text-xs text-[#B88E2F] font-bold flex items-center gap-1">
                  <span>{t.learnMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(item.title);
                  }}
                  className="py-2.5 px-4 rounded-xl gold-gradient-btn font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{t.bookNow}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Photo Carousel & Video Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="max-w-4xl w-full bg-[#FCF8F3] rounded-3xl overflow-hidden border border-[#F9F1E7] shadow-2xl space-y-4 p-4 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F9F1E7] pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B88E2F] font-bold">
                  {activeModal.category} Showcase
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] mt-0.5">
                  {activeModal.title}
                </h3>
              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-white text-[#333333] hover:text-white hover:bg-rose-600 border border-[#F9F1E7] transition-colors flex items-center justify-center font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Toggle Video vs Photo Gallery */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowVideo(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  !showVideo ? 'bg-[#B88E2F] text-white shadow-md' : 'bg-white text-[#333333] hover:bg-[#FFF3E3] border border-[#F9F1E7]'
                }`}
              >
                <Images className="w-4 h-4" />
                <span>Photo Slides ({activeModal.photos.length})</span>
              </button>

              {activeModal.video && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    showVideo ? 'bg-[#333333] text-white shadow-md' : 'bg-white text-[#333333] hover:bg-[#FFF3E3] border border-[#F9F1E7]'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Video</span>
                </button>
              )}
            </div>

            {/* Main Display Area */}
            <div className="relative bg-black rounded-2xl overflow-hidden h-[50vh] sm:h-[58vh] flex items-center justify-center border border-[#F9F1E7]">
              {showVideo ? (
                <video
                  src={activeModal.video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  <img
                    src={activeModal.photos[currentSlideIndex].url}
                    alt={activeModal.photos[currentSlideIndex].title}
                    className="w-full h-full object-contain transition-opacity duration-300"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all flex items-center justify-center shadow-lg font-bold"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all flex items-center justify-center shadow-lg font-bold"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Photo Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 text-[#333333] border border-[#F9F1E7] flex items-center justify-between text-xs backdrop-blur-md">
                    <span className="font-bold">
                      {activeModal.photos[currentSlideIndex].title}
                    </span>
                    <span className="bg-[#B88E2F] text-white font-bold px-2.5 py-0.5 rounded-lg">
                      {currentSlideIndex + 1} / {activeModal.photos.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Previews */}
            {!showVideo && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
                {activeModal.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === currentSlideIndex ? 'border-[#B88E2F] scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  closeModal();
                  onSelectService(activeModal.title);
                }}
                className="px-6 py-3 rounded-xl gold-gradient-btn font-extrabold text-xs shadow-md flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-white" />
                <span>{t.bookNow}</span>
              </button>

              <button
                onClick={closeModal}
                className="px-5 py-3 rounded-xl bg-white text-[#333333] border border-[#F9F1E7] text-xs font-bold hover:bg-[#FFF3E3]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
    </div>
  );
};

export default ServicesGallery;
