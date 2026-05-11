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
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const confirmPasswordInput = document.getElementById('confirmPassword');
const otpGroup = document.getElementById('otpGroup');
const otpInput = document.getElementById('otp');

let isLoginMode = true;
let isSignupStep1 = true;

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
authBtn.addEventListener('click', () => { authModal.classList.add('active'); });
closeModal.addEventListener('click', () => { authModal.classList.remove('active'); });
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('active');
});

toggleAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        modalTitle.textContent = 'Welcome Back';
        modalSubtitle.textContent = 'Sign in to track your service history';
        authSubmitBtn.textContent = 'Sign In';
        toggleAuthText.textContent = "New here? ";
        toggleAuthBtn.textContent = 'Create an Account';
        confirmPasswordGroup.style.display = 'none';
        confirmPasswordInput.required = false;
        otpGroup.style.display = 'none';
        otpInput.required = false;
    } else {
        isSignupStep1 = true;
        modalTitle.textContent = 'Create Account';
        modalSubtitle.textContent = 'Sign up for exclusive offers';
        authSubmitBtn.textContent = 'Send OTP';
        toggleAuthText.textContent = "Already have an account? ";
        toggleAuthBtn.textContent = 'Sign In';
        confirmPasswordGroup.style.display = 'block';
        confirmPasswordInput.required = true;
        otpGroup.style.display = 'none';
        otpInput.required = false;
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
        
        const bookingEmailInput = document.getElementById('bookingEmail');
        if(bookingEmailInput) bookingEmailInput.value = userEmail;
    } else {
        authBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
        
        const bookingEmailInput = document.getElementById('bookingEmail');
        if(bookingEmailInput) bookingEmailInput.value = '';
    }
}
// Run on load
checkAuthState();

// Auth Form Submit (Login / Signup)
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!isLoginMode) {
        if (isSignupStep1) {
            const confirmPassword = confirmPasswordInput.value;
            if (password !== confirmPassword) {
                showToast('Passwords do not match!', 'error');
                return;
            }
            
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
                    authSubmitBtn.textContent = 'Verify & Sign Up';
                    isSignupStep1 = false;
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
        } else {
            // Step 2: Verify OTP and Sign Up
            const otp = otpInput.value;
            showLoader();
            try {
                const res = await fetch(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, otp })
                });
                if (res.ok) {
                    showToast('Account created successfully! Please sign in.');
                    toggleAuthBtn.click(); // Switch to login mode
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
            return;
        }
    }
    
    // Login Flow
    showLoader();
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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
    const bookingEmail = document.getElementById('bookingEmail').value;
    const address = document.getElementById('address').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;

    const userEmail = bookingEmail || localStorage.getItem('userEmail') || 'Guest';

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
