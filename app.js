// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

let isLoginMode = true;

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
    } else {
        modalTitle.textContent = 'Create Account';
        modalSubtitle.textContent = 'Sign up for exclusive offers';
        authSubmitBtn.textContent = 'Sign Up';
        toggleAuthText.textContent = "Already have an account? ";
        toggleAuthBtn.textContent = 'Sign In';
    }
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        authBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
    } else {
        authBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
});

// Auth Form Submit (Login / Signup)
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    showLoader();
    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
            showToast('Logged in successfully!');
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
            showToast('Account created successfully!');
        }
        authModal.classList.remove('active');
        authForm.reset();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    showLoader();
    try {
        await signOut(auth);
        showToast('Logged out successfully');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoader();
    }
});

// Booking Submit
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const businessPhone = "917310502324"; 

    const user = auth.currentUser;
    const userEmail = user ? user.email : 'Guest';

    const bookingData = {
        name, phone, address, service, date, userEmail,
        status: 'Pending',
        createdAt: serverTimestamp()
    };

    showLoader();
    try {
        if(firebaseConfig.apiKey !== "YOUR_API_KEY") {
            await addDoc(collection(db, "bookings"), bookingData);
        }
        
        showToast('Booking Confirmed!', 'success');
        bookingForm.reset();

        // Generate WhatsApp Link exactly as requested
        const waMessage = `New Booking:%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0ADate: ${date}`;
        const waUrl = `https://wa.me/${businessPhone}?text=${waMessage}`;
        
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1500);

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
            name, phone, skill,
            status: 'New Applicant',
            createdAt: serverTimestamp()
        };

        showLoader();
        try {
            if(firebaseConfig.apiKey !== "YOUR_API_KEY") {
                await addDoc(collection(db, "worker_applications"), partnerData);
            }
            
            showToast('Application Submitted! We will contact you soon.', 'success');
            partnerForm.reset();

            // Optional: send a WhatsApp message to HR
            const waMessage = `New Partner Application:%0AName: ${name}%0APhone: ${phone}%0ASkill: ${skill}`;
            const waUrl = `https://wa.me/${businessPhone}?text=${waMessage}`;
            
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1500);

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
