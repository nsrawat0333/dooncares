// Base URL for API
const API_URL = '/api';

// DOM Elements
const authBtn = document.getElementById('authBtn');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.querySelector('.close-modal');
const authForm = document.getElementById('authForm');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleAuthBtn = document.getElementById('toggleAuthBtn');
const toggleAuthText = document.getElementById('toggleAuthText');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.querySelector('.toast-icon i');
const bookingForm = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('service');
const partnerForm = document.getElementById('partnerForm');
const usernameGroup = document.getElementById('usernameGroup');
const usernameInput = document.getElementById('username');
const otpGroup = document.getElementById('otpGroup');
const otpInput = document.getElementById('otp');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

// Mobile Menu Toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars-staggered";
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.querySelector('i').className = "fa-solid fa-bars-staggered";
        }
    });
});

let isLoginMode = true;
let isStep1 = true;

// UI Helpers
function showLoader() { loader.classList.remove('hidden'); }
function hideLoader() { loader.classList.add('hidden'); }
function showToast(msg, type = 'success') {
    toastMessage.textContent = msg;
    toast.className = `toast show ${type}`;
    if(type === 'success') {
        toastIcon.className = "fa-solid fa-circle-check";
    } else {
        toastIcon.className = "fa-solid fa-circle-exclamation";
    }
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Global function to pre-select service from cards
window.selectService = (serviceName) => {
    serviceSelect.value = serviceName;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    showToast(`Selected: ${serviceName}`, 'success');
};

// ==========================================
// Clickable Service Gallery & Lightbox Logic
// ==========================================

// Gallery Data containing high-quality, realistic images for each section
const galleryData = {
    'Carpet Cleaning': {
        title: 'Carpet Cleaning Gallery',
        subtitle: 'Deep vacuuming, sanitization, and shampooing to restore the texture and color of your carpets.',
        bookingValue: 'Carpet Cleaning',
        images: [
            'assets/carpet_1.png',
            'assets/carpet_2.jpeg'
        ]
    },
    'Sofa & Mattress Cleaning': {
        title: 'Sofa & Mattress Cleaning Gallery',
        subtitle: 'Professional deep cleaning, sanitizing, and allergen extraction for sofa sets, chairs, and mattresses.',
        bookingValue: 'Sofa & Mattress Cleaning',
        images: [
            'assets/sofa_1.png',
            'assets/sofa_2.png',
            'assets/sofa_3.png',
            'assets/sofa_4.png',
            'assets/sofa_5.png',
            'assets/sofa_6.png',
            'assets/sofa_7.png',
            'assets/sofa_8.jpeg',
            'assets/sofa_9.jpeg',
            'assets/sofa_10.jpeg',
            'assets/sofa_11.jpeg',
            'assets/sofa_12.jpeg',
            'assets/sofa_13.jpeg'
        ]
    },
    'Full Home Deep Clean': {
        title: 'Full Home Deep Clean Gallery',
        subtitle: 'Comprehensive top-to-bottom dusting, floor polishing, balcony washing, and detailing.',
        bookingValue: 'Deep Cleaning',
        images: [
            'assets/deep_1.png',
            'assets/deep_2.png',
            'assets/deep_3.png',
            'assets/deep_4.png',
            'assets/deep_5.png',
            'assets/deep_6.jpeg',
            'assets/deep_7.jpeg',
            'assets/deep_8.jpeg',
            'assets/deep_9.jpeg',
            'assets/deep_10.jpeg'
        ]
    },
    'Washroom Detail': {
        title: 'Washroom Detail Gallery',
        subtitle: 'Acid-free cleaning of tiles, deep scale removal from fittings, and total sanitation.',
        bookingValue: 'Washroom Cleaning',
        images: [
            'assets/bathroom_1.png',
            'assets/bathroom_2.jpeg',
            'assets/bathroom_3.jpeg',
            'assets/bathroom_4.jpeg',
            'assets/bathroom_5.jpeg',
            'assets/bathroom_6.jpeg',
            'assets/bathroom_7.jpeg'
        ]
    },
    'Kitchen Deep Cleaning': {
        title: 'Kitchen Deep Cleaning Gallery',
        subtitle: 'Intensive degreasing of tiles, scrubbing chimneys, cleaning platforms, and polishing cabinets.',
        bookingValue: 'Kitchen Cleaning',
        images: [
            'assets/kitchen_1.jpeg',
            'assets/kitchen_2.jpeg',
            'assets/kitchen_3.jpeg',
            'assets/kitchen_4.jpeg',
            'assets/kitchen_5.jpeg',
            'assets/kitchen_6.jpeg',
            'assets/kitchen_7.jpeg',
            'assets/kitchen_8.jpeg',
            'assets/kitchen_9.jpeg',
            'assets/kitchen_10.jpeg',
            'assets/kitchen_11.jpeg'
        ]
    },
    'Drainage & Sewer': {
        title: 'Drainage & Sewer Cleaning Gallery',
        subtitle: 'Professional high-pressure unclogging, sewer camera inspection, and deep line cleaning.',
        bookingValue: 'Drainage & Sewer',
        images: [
            'assets/drainage_1.jpeg',
            'assets/drainage_2.jpeg',
            'assets/drainage_3.jpeg',
            'assets/drainage_4.jpeg',
            'assets/drainage_5.jpeg',
            'assets/drainage_6.jpeg',
            'assets/drainage_7.jpeg'
        ]
    },
    'Plumbing & Electrical': {
        title: 'Plumbing & Electrical Gallery',
        subtitle: 'Certified plumbing repairs, leak fixes, certified electrical troubleshooting, and appliance installations.',
        bookingValue: 'Plumbing & Electrical',
        images: [
            'assets/electrical_1.jpeg',
            'assets/electrical_2.jpeg',
            'assets/electrical_3.jpeg',
            'assets/electrical_4.jpeg',
            'assets/electrical_5.jpeg',
            'assets/electrical_6.jpeg',
            'assets/electrical_7.jpeg',
            'assets/electrical_8.jpeg',
            'assets/electrical_9.jpeg',
            'assets/electrical_10.jpeg'
        ]
    },
    'Tank Sanitization': {
        title: 'Water Tank Sanitization Gallery',
        subtitle: 'Thorough anti-bacterial chemical washing, wall scrubbing, vacuum dewatering, and UV treatment.',
        bookingValue: 'Water Tank Cleaning',
        images: [
            'assets/tank_1.jpeg',
            'assets/tank_2.jpeg',
            'assets/tank_3.jpeg',
            'assets/tank_4.jpeg',
            'assets/tank_5.jpeg',
            'assets/tank_6.jpeg',
            'assets/tank_7.jpeg',
            'assets/tank_8.jpeg',
            'assets/tank_9.jpeg'
        ]
    },
    'Fogging & Pest Treatment': {
        title: 'Fogging & Pest Treatment Gallery',
        subtitle: 'Eco-friendly pest eradication, commercial sanitization, and professional thermal fogging services.',
        bookingValue: 'Fogging & Pest Treatment',
        images: [
            'assets/fogging_1.jpeg',
            'assets/fogging_2.jpeg',
            'assets/fogging_3.jpeg',
            'assets/fogging_4.jpeg'
        ]
    }
};

let currentGalleryService = '';
let currentImageIndex = 0;

// Gallery Modal Elements
const galleryModal = document.getElementById('galleryModal');
const galleryTitle = document.getElementById('galleryTitle');
const gallerySubtitle = document.getElementById('gallerySubtitle');
const galleryGrid = document.getElementById('galleryGrid');
const galleryBookBtn = document.getElementById('galleryBookBtn');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

window.openGallery = (serviceName) => {
    const data = galleryData[serviceName];
    if (!data) return;

    currentGalleryService = serviceName;
    galleryTitle.textContent = data.title;
    gallerySubtitle.textContent = data.subtitle;
    
    // Clear and build the grid
    galleryGrid.innerHTML = '';
    data.images.forEach((imgUrl, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-grid-item';
        item.innerHTML = `
            <img src="${imgUrl}" alt="${serviceName} Image ${index + 1}" loading="lazy">
            <div class="gallery-item-overlay">
                <i class="fa-solid fa-expand"></i>
            </div>
        `;
        item.addEventListener('click', () => openLightbox(index));
        galleryGrid.appendChild(item);
    });

    // Configure the Booking button
    galleryBookBtn.onclick = () => {
        closeGallery();
        serviceSelect.value = data.bookingValue;
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        showToast(`Selected: ${data.bookingValue}`, 'success');
    };

    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scroll when modal is active
};

window.closeGallery = () => {
    galleryModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore page scroll
};

window.openLightbox = (index) => {
    const data = galleryData[currentGalleryService];
    if (!data || index < 0 || index >= data.images.length) return;

    currentImageIndex = index;
    lightboxImg.src = data.images[currentImageIndex];
    lightbox.classList.add('active');
};

window.closeLightbox = () => {
    lightbox.classList.remove('active');
};

window.prevLightboxImage = () => {
    const data = galleryData[currentGalleryService];
    if (!data) return;
    currentImageIndex = (currentImageIndex - 1 + data.images.length) % data.images.length;
    lightboxImg.src = data.images[currentImageIndex];
};

window.nextLightboxImage = () => {
    const data = galleryData[currentGalleryService];
    if (!data) return;
    currentImageIndex = (currentImageIndex + 1) % data.images.length;
    lightboxImg.src = data.images[currentImageIndex];
};

// Keyboard accessibility for lightbox & modal
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'ArrowRight') nextLightboxImage();
    } else if (galleryModal.classList.contains('active')) {
        if (e.key === 'Escape') closeGallery();
    }
});

// Close lightbox on click outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close gallery modal on click outside the content
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        closeGallery();
    }
});

// Auth Modal Toggling
authBtn.addEventListener('click', () => { 
    isLoginMode = true;
    isStep1 = true;
    otpGroup.style.display = 'none';
    otpInput.required = false;
    usernameGroup.style.display = 'none';
    usernameInput.required = false;
    authSubmitBtn.textContent = 'Send OTP';
    authForm.reset();
    authModal.classList.add('active'); 
});
closeModal.addEventListener('click', () => { authModal.classList.remove('active'); });
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('active');
});

toggleAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    isStep1 = true;
    otpGroup.style.display = 'none';
    otpInput.required = false;
    if (isLoginMode) {
        modalTitle.textContent = 'Welcome Back';
        modalSubtitle.textContent = 'Sign in to track your service history';
        authSubmitBtn.textContent = 'Send OTP';
        toggleAuthText.textContent = "New here? ";
        toggleAuthBtn.textContent = 'Create an Account';
        usernameGroup.style.display = 'none';
        usernameInput.required = false;
    } else {
        modalTitle.textContent = 'Create Account';
        modalSubtitle.textContent = 'Sign up for exclusive offers';
        authSubmitBtn.textContent = 'Send OTP';
        toggleAuthText.textContent = "Already have an account? ";
        toggleAuthBtn.textContent = 'Sign In';
        usernameGroup.style.display = 'block';
        usernameInput.required = true;
    }
});

// Check Auth State
function checkAuthState() {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail) {
        authBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userInfo.querySelector('.avatar').setAttribute('title', userEmail);
    } else {
        authBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}
// Run on load
checkAuthState();

// Auth Form Submit (Login / Signup)
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    if (isStep1) {
        showLoader();
        try {
            const res = await fetch(`${API_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                showToast('OTP sent to email!');
                otpGroup.style.display = 'block';
                otpInput.required = true;
                authSubmitBtn.textContent = isLoginMode ? 'Verify & Sign In' : 'Verify & Sign Up';
                isStep1 = false;
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send OTP');
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            hideLoader();
        }
        return;
    }
    
    const otp = otpInput.value;
    
    if (!isLoginMode) {
        // Signup
        const username = usernameInput.value;
        showLoader();
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, otp })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.email);
                showToast('Account created and logged in successfully!', 'success');
                checkAuthState();
                authModal.classList.remove('active');
                authForm.reset();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Authentication failed');
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            hideLoader();
        }
    } else {
        // Login Flow
        showLoader();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.email);
                showToast('Logged in successfully!');
                checkAuthState();
                authModal.classList.remove('active');
                authForm.reset();
            } else {
                throw new Error(data.error || 'Authentication failed');
            }
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            hideLoader();
        }
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    showToast('Logged out successfully');
    checkAuthState();
});

// Booking Submit
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
        showToast('Please sign in to book a service.', 'error');
        authModal.classList.add('active');
        return;
    }

    const address = document.getElementById('address').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;

    const bookingData = {
        name, phone, address, service, date, userEmail
    };

    showLoader();
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error('Failed to save booking');
        }
        
        showToast('Booking Confirmed! You will receive an email shortly.', 'success');
        bookingForm.reset();

    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('Failed to save booking. Please try again.', 'error');
    } finally {
        hideLoader();
    }
});

// Partner Form Submit (Worker Joining)
if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('partnerName').value;
        const phone = document.getElementById('partnerPhone').value;
        const skill = document.getElementById('partnerSkill').value;
        const businessPhone = "917310502324"; 

        const partnerData = {
            name, phone, skill
        };

        showLoader();
        try {
            const response = await fetch(`${API_URL}/partner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partnerData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }
            
            showToast('Application Submitted! We will contact you soon.', 'success');
            partnerForm.reset();

        } catch (error) {
            console.error("Error adding document: ", error);
            showToast('Failed to submit application.', 'error');
        } finally {
            hideLoader();
        }
    });
}

// Stats Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the slower

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
};

// Use Intersection Observer to start animation when visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}


// --- Interactive Feedback Form Logic ---
const starRatingContainer = document.getElementById('starRating');
const ratingValueInput = document.getElementById('ratingValue');
const feedbackForm = document.getElementById('feedbackForm');

if (starRatingContainer) {
    const stars = starRatingContainer.querySelectorAll('i');

    stars.forEach(star => {
        // Hover effects
        star.addEventListener('mouseover', () => {
            const currentVal = parseInt(star.getAttribute('data-value'));
            stars.forEach((s, idx) => {
                if (idx < currentVal) {
                    s.classList.add('hovered');
                } else {
                    s.classList.remove('hovered');
                }
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });

        // Click selection
        star.addEventListener('click', () => {
            const selectedVal = parseInt(star.getAttribute('data-value'));
            ratingValueInput.value = selectedVal;
            
            stars.forEach((s, idx) => {
                if (idx < selectedVal) {
                    s.classList.add('selected');
                    s.className = "fa-solid fa-star selected"; // Change to solid star
                } else {
                    s.classList.remove('selected');
                    s.className = "fa-regular fa-star"; // Keep regular star
                }
            });
        });
    });
}

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const rating = parseInt(ratingValueInput.value);
        const comment = document.getElementById('feedbackComment').value;

        if (!rating || rating === 0) {
            showToast('Please select a star rating first.', 'error');
            return;
        }

        showLoader();
        try {
            const response = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit feedback');
            }

            showToast('Thank you! Your feedback has been shared.', 'success');
            
            // Reset form
            feedbackForm.reset();
            ratingValueInput.value = '0';
            if (starRatingContainer) {
                const stars = starRatingContainer.querySelectorAll('i');
                stars.forEach(s => {
                    s.classList.remove('selected');
                    s.className = "fa-regular fa-star";
                });
            }

        } catch (err) {
            console.error('Error submitting feedback:', err);
            showToast(err.message, 'error');
        } finally {
            hideLoader();
        }
    });
}

// --- Live Navbar Search Logic ---
const navSearchInput = document.getElementById('navSearchInput');
const searchClearBtn = document.getElementById('searchClearBtn');

if (navSearchInput) {
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceCategories = document.querySelectorAll('.service-category');
    const servicesSection = document.getElementById('services');
    
    // Create 'No Results' element dynamically if it doesn't exist
    let noResultsEl = document.getElementById('noSearchResults');
    if (!noResultsEl && servicesSection) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'noSearchResults';
        noResultsEl.className = 'no-search-results hidden';
        noResultsEl.innerHTML = `
            <i class="fa-solid fa-magnifying-glass-blur" style="font-size: 3rem; color: var(--light-text); margin-bottom: 1rem; display: block;"></i>
            <h3>No Services Found</h3>
            <p>We couldn't find any services matching your search. Please check the spelling or try searching for something else like "Sofa" or "Plumbing".</p>
        `;
        servicesSection.appendChild(noResultsEl);
    }

    const performSearch = () => {
        const query = navSearchInput.value.toLowerCase().trim();
        let totalMatches = 0;

        if (query === '') {
            if (searchClearBtn) searchClearBtn.classList.add('hidden');
            
            // Show everything
            serviceCards.forEach(card => card.style.display = '');
            serviceCategories.forEach(cat => cat.style.display = '');
            if (noResultsEl) noResultsEl.classList.add('hidden');
            return;
        }

        if (searchClearBtn) searchClearBtn.classList.remove('hidden');

        serviceCategories.forEach(category => {
            const cards = category.querySelectorAll('.service-card');
            let categoryMatches = 0;

            cards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(query) || description.includes(query)) {
                    card.style.display = '';
                    categoryMatches++;
                    totalMatches++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (categoryMatches > 0) {
                category.style.display = '';
            } else {
                category.style.display = 'none';
            }
        });

        if (totalMatches === 0) {
            if (noResultsEl) noResultsEl.classList.remove('hidden');
        } else {
            if (noResultsEl) noResultsEl.classList.add('hidden');
        }
    };

    navSearchInput.addEventListener('input', performSearch);

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            navSearchInput.value = '';
            performSearch();
            navSearchInput.focus();
        });
    }
}
