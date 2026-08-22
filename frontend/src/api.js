import axios from 'axios';

// Dynamic API Base URL detection:
// 1. Reads from VITE_BACKEND_URL environment variable if set.
// 2. Uses window.location.origin + '/api' or relative '/api' for proxy / rewrite compatibility.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const fetchBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const fetchReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export default api;
