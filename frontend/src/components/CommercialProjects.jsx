import React, { useState } from 'react';
import { Building2, ShieldCheck, Award, Images, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../i18n';

const commercialProjects = [
  {
    id: 'dit',
    client: 'DIT University Dehradun',
    badge: 'Educational Campus Façade Cleaning',
    location: 'Mussoorie Diversion Road, Dehradun',
    coverImage: '/assets/image1.jpg',
    description: 'Complete high-pressure exterior building washing, glass curtain wall degreasing, and campus auditorium sanitization.',
    photos: [
      { url: '/assets/image1.jpg', title: 'DIT University Exterior Façade Washing' },
      { url: '/assets/deep_4.png', title: 'Campus Building High Pressure Jet Wash' },
      { url: '/assets/standard_collage.jpg', title: 'DIT Auditorium & Glass Surface Cleaning' },
      { url: '/assets/deep_10.jpeg', title: 'Completed Clean DIT University Campus' }
    ]
  },
  {
    id: 'axis',
    client: 'Axis Bank Dehradun Branch',
    badge: 'Commercial Bank Deep Wash & Sanitization',
    location: 'Rajpur Road & Patel Nagar, Dehradun',
    coverImage: '/assets/image2.jpg',
    description: 'Commercial branch façade washing, interior carpet shampooing, ATM kiosk sanitization, and marble floor polishing.',
    photos: [
      { url: '/assets/image2.jpg', title: 'Axis Bank Commercial Branch Exterior Washing' },
      { url: '/assets/deep_5.png', title: 'Axis Bank Interior Glass & Carpet Shampoo' },
      { url: '/assets/carpet_cleaning_real.jpg', title: 'Bank Office Carpet Deep Extraction' },
      { url: '/assets/full_home_cleaning_real.jpg', title: 'Final Sanitized Axis Bank Branch' }
    ]
  },
  {
    id: 'corporate',
    client: 'Dehradun Commercial Complexes',
    badge: 'Corporate Towers & Plaza Maintenance',
    location: 'IT Park & Sahastradhara Road, Dehradun',
    coverImage: '/assets/standard_collage.jpg',
    description: 'Commercial facility maintenance, heavy-duty drainage unblocking, overhead water tank disinfection, and glass cleaning.',
    photos: [
      { url: '/assets/standard_collage.jpg', title: 'Dehradun Commercial Hub Maintenance' },
      { url: '/assets/akash_drainage_clean.png', title: 'Commercial Plaza Drainage Jetting' },
      { url: '/assets/akash_tank_clean.png', title: 'Commercial Overhead Water Tank UV Clean' },
      { url: '/assets/deep_cleaning.jpg', title: 'Corporate Office Deep Sanitization' }
    ]
  }
];

const CommercialProjects = ({ lang }) => {
  const t = translations[lang] || translations.EN;
  const isHi = lang === 'HI';

  const [activeModal, setActiveModal] = useState(null);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const openModal = (proj) => {
    setActiveModal(proj);
    setCurrentPhotoIdx(0);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <section id="our-work" className="py-16 px-4 max-w-7xl mx-auto bg-[#FFF3E3]/60 rounded-3xl border border-[#B88E2F]/20 my-12">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B88E2F]/40 text-xs font-black shadow-sm">
          <Award className="w-4 h-4 text-[#B88E2F]" />
          <span>{isHi ? 'हमारे प्रमुख काम (DIT यूनिवर्सिटी व एक्सिस बैंक)' : 'Our Work Showcase • Commercial Clients'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333333] tracking-tight font-sans">
          {t.commercialTitle}
        </h2>
        <p className="text-slate-700 text-sm sm:text-base max-w-xl mx-auto font-medium">
          {t.commercialSub}
        </p>
      </div>

      {/* Commercial Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {commercialProjects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => openModal(proj)}
            className="bg-white rounded-2xl overflow-hidden border-2 border-[#B88E2F]/30 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img
                src={proj.coverImage}
                alt={proj.client}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#B88E2F] text-white text-[11px] font-black shadow-md uppercase tracking-wider">
                {proj.badge}
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-[#FFF3E3] text-xs font-bold flex items-center gap-1 backdrop-blur-sm border border-white/20">
                <Images className="w-3.5 h-3.5 text-[#B88E2F]" />
                <span>{proj.photos.length} {t.photosCount}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#B88E2F] font-black uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>{proj.location}</span>
                </div>
                
                <h3 className="text-xl font-extrabold text-[#333333] mt-1 group-hover:text-[#B88E2F] transition-colors">
                  {proj.client}
                </h3>
                
                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                  {proj.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F9F1E7] flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'प्रोजेक्ट पूर्ण' : 'Completed Project'}</span>
                </span>
                
                <span className="text-xs font-black text-[#B88E2F] flex items-center gap-1">
                  <span>{isHi ? 'फोटो देखें' : 'View Photos'}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commercial Project Photo Showcase Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="max-w-4xl w-full bg-[#FCF8F3] rounded-3xl overflow-hidden border-2 border-[#B88E2F]/40 shadow-2xl space-y-4 p-4 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F9F1E7] pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B88E2F] font-black">
                  {activeModal.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] mt-0.5">
                  {activeModal.client}
                </h3>
              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-white text-[#333333] hover:bg-rose-600 hover:text-white border border-[#F9F1E7] transition-colors flex items-center justify-center font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Photo Showcase Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden h-[50vh] sm:h-[58vh] flex items-center justify-center border border-[#F9F1E7]">
              <img
                src={activeModal.photos[currentPhotoIdx].url}
                alt={activeModal.photos[currentPhotoIdx].title}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={() => setCurrentPhotoIdx((prev) => (prev - 1 + activeModal.photos.length) % activeModal.photos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all flex items-center justify-center shadow-lg font-bold"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setCurrentPhotoIdx((prev) => (prev + 1) % activeModal.photos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-[#333333] hover:bg-[#B88E2F] hover:text-white transition-all flex items-center justify-center shadow-lg font-bold"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Photo Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 text-[#333333] border border-[#F9F1E7] flex items-center justify-between text-xs backdrop-blur-md font-bold">
                <span>{activeModal.photos[currentPhotoIdx].title}</span>
                <span className="bg-[#B88E2F] text-white px-2.5 py-0.5 rounded-lg">
                  {currentPhotoIdx + 1} / {activeModal.photos.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {activeModal.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIdx(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    idx === currentPhotoIdx ? 'border-[#B88E2F] scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default CommercialProjects;
