import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const bookingsTableBody = document.getElementById('bookingsTableBody');
const toast = document.getElementById('toast');

// Admin Email defined in requirements
const ADMIN_EMAIL = "admin@gmail.com";

function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user && user.email === ADMIN_EMAIL) {
        adminLoginView.classList.add('hidden');
        adminDashboardView.classList.remove('hidden');
        fetchBookings();
    } else {
        if(user) signOut(auth); // If logged in but not admin, sign out
        adminLoginView.classList.remove('hidden');
        adminDashboardView.classList.add('hidden');
    }
});

// Admin Login
adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email !== ADMIN_EMAIL) {
        showToast("Access Denied. Admins only.", "error");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Welcome Admin");
    } catch (error) {
        showToast(error.message, "error");
    }
});

// Admin Logout
adminLogoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showToast("Logged out");
    } catch (error) {
        showToast(error.message, "error");
    }
});

// Fetch Bookings Real-time
function fetchBookings() {
    // Only attempt if Firebase is configured
    if(firebaseConfig.apiKey === "YOUR_API_KEY") {
        bookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Firebase config missing. Mock Data: No bookings yet.</td></tr>`;
        return;
    }

    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (querySnapshot) => {
        bookingsTableBody.innerHTML = '';
        if(querySnapshot.empty) {
            bookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No bookings found.</td></tr>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            // Format Date safely
            let displayDate = data.date;
            if(data.createdAt) {
               // optional: show created date instead or along with preferred date
            }

            tr.innerHTML = `
                <td>${data.date}</td>
                <td><strong>${data.name}</strong></td>
                <td><a href="tel:${data.phone}">${data.phone}</a></td>
                <td>${data.service}</td>
                <td>${data.address}</td>
                <td><span class="status-badge">${data.status || 'Pending'}</span></td>
            `;
            bookingsTableBody.appendChild(tr);
        });
    }, (error) => {
        console.error("Error fetching bookings: ", error);
        showToast("Failed to fetch bookings.", "error");
    });
}
