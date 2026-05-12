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
