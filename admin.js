const API_URL = 'http://localhost:3000/api';

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
function checkAdminAuthState() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        adminLoginView.classList.add('hidden');
        adminDashboardView.classList.remove('hidden');
        fetchBookings();
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
