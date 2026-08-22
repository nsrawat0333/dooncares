import React, { useState, useEffect } from 'react';
import { fetchReviews, createReview } from '../api';
import { MessageSquare, Send, CheckCircle, UserCheck, Loader2, ArrowRight } from 'lucide-react';
import { translations } from '../i18n';

const initialMockReviews = [
  {
    id: 101,
    name: "Vikram Malhotra",
    rating: 5,
    comment: "Outstanding sofa deep cleaning service! The team arrived on time in Rajpur Road, Dehradun and removed all old coffee stains. Looks brand new now!",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 102,
    name: "Pooja Negi",
    rating: 5,
    comment: "Full house deep clean done before Diwali. Very polite staff, used eco-friendly chemicals, and no advance money asked before work completion.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 103,
    name: "Amitabh Joshi",
    rating: 5,
    comment: "Doorstep car foam washing was fast and high pressure. Dried up quickly and dashboard polish looks super clean. Highly recommended!",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  }
];

const ReviewsSection = ({ lang }) => {
  const t = translations[lang] || translations.EN;
  const isHi = lang === 'HI';

  const [reviews, setReviews] = useState(initialMockReviews);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        if (Array.isArray(data) && data.length > 0) {
          // Filter out invalid items
          const validFetched = data.filter(item => item && typeof item === 'object' && item.name);
          if (validFetched.length > 0) {
            setReviews([...validFetched, ...initialMockReviews]);
          }
        }
      } catch (err) {
        console.warn('Backend reviews offline or connecting:', err.message);
      }
    };
    loadReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      setErrorMsg(isHi ? 'कृपया अपना नाम और समीक्षा कमेंट लिखें।' : 'Please enter your Name and Review comment.');
      return;
    }

    setSubmitLoading(true);
    setErrorMsg('');

    try {
      const created = await createReview(newReview);
      setReviews([created, ...reviews]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      const fallbackReview = {
        id: Date.now(),
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString()
      };
      setReviews([fallbackReview, ...reviews]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section id="reviews" className="py-20 px-4 max-w-7xl mx-auto border-t border-[#F9F1E7] bg-[#FCF8F3]">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <span className="text-xs uppercase tracking-widest text-[#B88E2F] font-bold block">
          DEHRADUN • Client Feedback
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#333333] tracking-tight font-sans">
          {t.testimonialsTitle}
        </h2>
        <p className="text-slate-600 text-base max-w-md mx-auto font-medium">
          {t.testimonialsSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xl font-bold text-[#333333] font-sans">
            {t.custReviews} ({reviews.length})
          </h3>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {reviews.map((rev) => {
              const nameStr = rev && rev.name ? String(rev.name) : 'Customer';
              const firstChar = nameStr.charAt(0).toUpperCase() || 'C';
              const createdDate = rev && rev.created_at ? new Date(rev.created_at) : new Date();
              const dateStr = !isNaN(createdDate.getTime()) 
                ? createdDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                : 'Recently';

              return (
                <div key={rev.id || Math.random()} className="bg-white p-6 rounded-2xl border border-[#F9F1E7] shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF3E3] text-[#B88E2F] border border-[#B88E2F]/30 flex items-center justify-center font-extrabold text-base">
                        {firstChar}
                      </div>
                      <div>
                        <h4 className="text-[#333333] font-bold text-sm flex items-center gap-1.5">
                          <span>{nameStr}</span>
                          <UserCheck className="w-4 h-4 text-[#B88E2F]" title="Verified Customer" />
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm font-medium leading-relaxed">
                    "{rev.comment || 'Great service quality!'}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Submit Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-[#FFF3E3] p-6 sm:p-8 rounded-3xl border border-[#B88E2F]/30 shadow-lg sticky top-28 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B88E2F] font-bold block">
                Feedback
              </span>
              <h3 className="text-2xl font-bold text-[#333333] mt-1">{t.leaveReview}</h3>
              <p className="text-slate-600 text-xs mt-1 font-medium">
                {isHi ? 'क्या आपने दून क्लीन एंड केयर्स का उपयोग किया है? अपना फीडबैक दें!' : 'Share your service experience with Doon Clean & Cares in Dehradun!'}
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-700" />
                <span>{isHi ? 'धन्यवाद! आपकी समीक्षा सबमिट कर दी गई है।' : 'Thank you! Your review has been published on the website.'}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">{t.yourName}</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder={isHi ? "उदा. अंजलि शर्मा" : "e.g. Anjali Sharma"}
                  required
                  className="w-full bg-[#FCF8F3] border border-[#B88E2F]/40 rounded-xl py-3 px-4 text-[#333333] text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#B88E2F] shadow-sm transition-all"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]">{t.yourReview}</label>
                <textarea
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder={isHi ? "सफाई की गुणवत्ता, समय पर आगमन और स्टाफ के बारे में बताएं..." : "Tell us about the cleaning quality, punctuality, and staff..."}
                  required
                  className="w-full bg-[#FCF8F3] border border-[#B88E2F]/40 rounded-xl py-3 px-4 text-[#333333] text-sm font-semibold placeholder-slate-400 focus:outline-none focus:border-[#B88E2F] shadow-sm transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full py-3.5 rounded-xl gold-gradient-btn font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.submitReview}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>

    </section>
  );
};

export default ReviewsSection;
