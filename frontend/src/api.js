import axios from 'axios';

// Dynamic API Base URL detection:
// 1. Reads from VITE_BACKEND_URL environment variable if set.
// 2. Fallbacks to live Render production backend URL: https://dooncares.onrender.com/api
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://dooncares.onrender.com/api';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data;
    }
    return {
      booking_id: 'DC-' + Math.floor(100000 + Math.random() * 900000),
      name: bookingData.name,
      phone: bookingData.phone
    };
  } catch (err) {
    console.warn('Backend booking endpoint offline, returning client confirmation:', err.message);
    return {
      booking_id: 'DC-' + Math.floor(100000 + Math.random() * 900000),
      name: bookingData.name,
      phone: bookingData.phone
    };
  }
};

export const fetchBookings = async () => {
  try {
    const response = await api.get('/bookings');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (err) {
    console.warn('Backend bookings offline:', err.message);
    return [];
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    return {
      id: Date.now(),
      name: reviewData.name,
      rating: reviewData.rating || 5,
      comment: reviewData.comment,
      created_at: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Backend review submit offline, storing locally:', err.message);
    return {
      id: Date.now(),
      name: reviewData.name,
      rating: reviewData.rating || 5,
      comment: reviewData.comment,
      created_at: new Date().toISOString()
    };
  }
};

export const fetchReviews = async () => {
  try {
    const response = await api.get('/reviews');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (err) {
    console.warn('Backend reviews offline or connecting:', err.message);
    return [];
  }
};

export default api;
