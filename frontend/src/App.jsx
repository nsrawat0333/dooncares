import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import BookingForm from './components/BookingForm';
import ServicesGallery from './components/ServicesGallery';
import ReviewsSection from './components/ReviewsSection';
import WhatsAppButton from './components/WhatsAppButton';
import MobileBottomBar from './components/MobileBottomBar';
import SEOKeywords from './components/SEOKeywords';
import Footer from './components/Footer';

function App() {
  const [lang, setLang] = useState('EN');

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromGallery = (serviceTitle) => {
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-[#FCF8F3] text-[#333333] selection:bg-[#B88E2F] selection:text-white pb-16 md:pb-0">
      {/* Google SEO Crawler Keywords Container */}
      <SEOKeywords />

      {/* 1. Glass Navbar with Language Switcher & Social Links */}
      <Navbar onBookClick={scrollToBooking} lang={lang} setLang={setLang} />

      {/* 2. Hero Section with Video Loop showcase */}
      <Hero3D onBookClick={scrollToBooking} lang={lang} />

      {/* 3. Real Work Photos & Showcase Gallery */}
      <ServicesGallery onSelectService={handleSelectServiceFromGallery} lang={lang} />

      {/* 4. Simplified No-Login Booking Form */}
      <BookingForm lang={lang} />

      {/* 5. Customer Reviews & Feedback Section */}
      <ReviewsSection lang={lang} />

      {/* 6. Floating WhatsApp Action Button (Desktop & Tablet) */}
      <div className="hidden md:block">
        <WhatsAppButton lang={lang} />
      </div>

      {/* 7. Sticky Mobile Bottom Action Bar (Call, WhatsApp, Book Now) */}
      <MobileBottomBar onBookClick={scrollToBooking} lang={lang} />

      {/* 8. Footer */}
      <Footer lang={lang} />
    </div>
  );
}

export default App;
