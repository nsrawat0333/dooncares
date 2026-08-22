import React, { useState } from 'react';
import { createBooking } from '../api';
import { Calendar, User, Phone, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Car, ArrowRight } from 'lucide-react';
import { translations } from '../i18n';

const BookingForm = ({ lang }) => {
  const t = translations[lang] || translations.EN;
  const isHi = lang === 'HI';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    service_details: ''
  });

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const selectQuickService = (serviceName) => {
    setFormData((prev) => ({
      ...prev,
      service_details: prev.service_details ? `${prev.service_details}, ${serviceName}` : serviceName
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.date) {
      setErrorMsg(isHi ? 'कृपया नाम, फोन नंबर और तारीख भरें।' : 'Please fill in your Name, Phone Number, and Date.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await createBooking(formData);
      setSuccessBooking(result);
      setFormData({ name: '', phone: '', date: '', service_details: '' });
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg(err.response?.data?.detail || (isHi ? 'बुकिंग सबमिट करने में विफलता। कृपया फोन द्वारा कॉल करें।' : 'Failed to submit booking. Please check your connection or call us directly.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-16 px-4 relative z-10 max-w-4xl mx-auto bg-[#FCF8F3]">
      <div className="bg-[#FFF3E3] rounded-3xl p-6 sm:p-10 border border-[#B88E2F]/30 shadow-xl relative overflow-hidden">
        
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#B88E2F] font-bold block">
            {t.fastBooking}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#333333] font-sans">
            {t.formTitle}
          </h2>
          <p className="text-slate-700 text-sm sm:text-base max-w-lg mx-auto font-medium">
            {t.formDesc}
          </p>

          {/* Quick Service Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => selectQuickService('Doorstep Car Washing')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#B88E2F] hover:text-white text-[#333333] text-xs font-bold transition-all flex items-center gap-1 border border-[#B88E2F]/30 shadow-sm"
            >
              <Car className="w-3.5 h-3.5 text-[#B88E2F]" />
              <span>+ {t.carWashBadge}</span>
            </button>
            <button
              type="button"
              onClick={() => selectQuickService('Sofa Deep Cleaning')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#B88E2F] hover:text-white text-[#333333] text-xs font-bold transition-all border border-[#B88E2F]/30 shadow-sm"
            >
              + {t.sofaCarpetBadge}
            </button>
            <button
              type="button"
              onClick={() => selectQuickService('Full House Deep Clean')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#B88E2F] hover:text-white text-[#333333] text-xs font-bold transition-all border border-[#B88E2F]/30 shadow-sm"
            >
              + {t.houseCleanBadge}
            </button>
            <button
              type="button"
              onClick={() => selectQuickService('Water Tank Clean')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#B88E2F] hover:text-white text-[#333333] text-xs font-bold transition-all border border-[#B88E2F]/30 shadow-sm"
            >
              + {t.tankBadge}
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {successBooking ? (
          <div className="bg-white border border-[#B88E2F]/40 rounded-2xl p-6 text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 bg-[#FFF3E3] text-[#B88E2F] rounded-full flex items-center justify-center mx-auto border border-[#B88E2F]/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#B88E2F]">{t.bookingReceived}</h3>
            <p className="text-[#333333] text-sm max-w-md mx-auto font-medium">
              {t.refId} <strong className="font-bold">{successBooking.name}</strong>!
            </p>
            <div className="inline-block bg-[#B88E2F] text-white border border-[#B88E2F] px-6 py-2.5 rounded-xl font-mono text-xl font-bold tracking-wider shadow-md">
              {successBooking.booking_id}
            </div>
            <p className="text-xs text-slate-600 font-bold">
              {t.confirmationNotice} (<span className="underline text-[#333333]">{successBooking.phone}</span>).
            </p>

            <button
              onClick={() => setSuccessBooking(null)}
              className="mt-4 px-6 py-3 rounded-xl gold-gradient-btn text-xs font-bold shadow-md transition-all uppercase tracking-wider"
            >
              {t.bookAnother}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMsg && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-100 border border-rose-400 text-rose-900 text-sm font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">
                  {t.nameLabel} <span className="text-[#B88E2F]">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-3.5 text-[#B88E2F]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isHi ? "उदा. राहुल शर्मा" : "e.g. Rahul Sharma"}
                    required
                    className="w-full bg-white border border-[#B88E2F]/40 rounded-xl py-3 pl-11 pr-4 text-[#333333] text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#B88E2F] shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">
                  {t.phoneLabel} <span className="text-[#B88E2F]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-[#B88E2F]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={isHi ? "उदा. 9876543210" : "e.g. 9876543210"}
                    required
                    className="w-full bg-white border border-[#B88E2F]/40 rounded-xl py-3 pl-11 pr-4 text-[#333333] text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#B88E2F] shadow-sm transition-all"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Preferred Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">
                  {t.dateLabel} <span className="text-[#B88E2F]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3.5 top-3.5 text-[#B88E2F]" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#B88E2F]/40 rounded-xl py-3 pl-11 pr-4 text-[#333333] text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#B88E2F] shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Service Selection / Details */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">
                  {t.notesLabel}
                </label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-3.5 top-3.5 text-[#B88E2F]" />
                  <input
                    type="text"
                    name="service_details"
                    value={formData.service_details}
                    onChange={handleChange}
                    placeholder={isHi ? "उदा. डोरस्टेप कार वॉश, सोफा सफाई" : "e.g. Doorstep Car Wash, Sofa Shampooing"}
                    className="w-full bg-white border border-[#B88E2F]/40 rounded-xl py-3 pl-11 pr-4 text-[#333333] text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#B88E2F] shadow-sm transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl gold-gradient-btn font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>{t.submitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-600 font-semibold">
              🔒 {isHi ? 'आपका नंबर हमारे पास सुरक्षित है। हम केवल सर्विस कन्फर्म करने के लिए कॉल करते हैं।' : 'Your phone number is safe with us. We only call to confirm your service.'}
            </p>

          </form>
        )}

      </div>
    </section>
  );
};

export default BookingForm;
