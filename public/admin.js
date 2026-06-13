const API_URL = '/api';

// DOM Elements
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const bookingsTableBody = document.getElementById('bookingsTableBody');
const partnersTableBody = document.getElementById('partnersTableBody');
const toast = document.getElementById('toast');

// Admin Email defined in requirements
const ADMIN_EMAIL = "admin@gmail.com";

function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Auth State Listener
function checkAdminAuthState() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        adminLoginView.classList.add('hidden');
        adminDashboardView.classList.remove('hidden');
        fetchBookings();
        fetchPartnerApplications();
        fetchFeedback();
    } else {
        adminLoginView.classList.remove('hidden');
        adminDashboardView.classList.add('hidden');
    }
}

// Run on load
checkAdminAuthState();

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
        const response = await fetch(`${API_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            showToast("Welcome Admin");
            checkAdminAuthState();
        } else {
            showToast(data.error || "Login failed", "error");
        }
    } catch (error) {
        showToast(error.message, "error");
    }
});

// Admin Logout
adminLogoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    showToast("Logged out");
    checkAdminAuthState();
});

// Fetch Bookings
async function fetchBookings() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error("Failed to fetch bookings");
        
        const bookings = await response.json();
        
        bookingsTableBody.innerHTML = '';
        if(bookings.length === 0) {
            bookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No bookings found.</td></tr>`;
            return;
        }

        bookings.forEach((data) => {
            const tr = document.createElement('tr');
            
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
    } catch (error) {
        console.error("Error fetching bookings: ", error);
        showToast("Failed to fetch bookings.", "error");
    }
}

// Fetch Feedback
async function fetchFeedback() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/feedback`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error("Failed to fetch feedback");
        
        const feedbacks = await response.json();
        const feedbackTableBody = document.getElementById('feedbackTableBody');
        
        feedbackTableBody.innerHTML = '';
        if(feedbacks.length === 0) {
            feedbackTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No feedback received yet.</td></tr>`;
            return;
        }

        feedbacks.forEach((data) => {
            const tr = document.createElement('tr');
            
            // Build stars
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= data.rating) {
                    stars += '<i class="fa-solid fa-star" style="color: #f6ad55; margin-right: 2px;"></i>';
                } else {
                    stars += '<i class="fa-regular fa-star" style="color: #cbd5e0; margin-right: 2px;"></i>';
                }
            }
            
            const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A';
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${stars} (${data.rating}/5)</td>
                <td>${data.comment || 'N/A'}</td>
            `;
            feedbackTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching feedback: ", error);
    }
}

// Fetch Partner Applications
async function fetchPartnerApplications() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/partner`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error("Failed to fetch partner applications");
        
        const applications = await response.json();
        
        partnersTableBody.innerHTML = '';
        if(applications.length === 0) {
            partnersTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No applications found.</td></tr>`;
            return;
        }

        applications.forEach((data) => {
            const tr = document.createElement('tr');
            const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A';
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${data.name}</strong></td>
                <td><a href="tel:${data.phone}">${data.phone}</a></td>
                <td>${data.skill}</td>
                <td><span class="status-badge" style="background-color: #28a745; color: white;">${data.status || 'New Applicant'}</span></td>
            `;
            partnersTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching partner applications: ", error);
        showToast("Failed to fetch partner applications.", "error");
    }
}
