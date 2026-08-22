import React, { useState, useEffect } from 'react';
import { fetchBookings, deleteBooking, markBookingCompleted } from '../api';

const ADMIN_EMAIL = 'admin@dooncares.in';
const ADMIN_PIN = '7310'; // Default admin PIN (can be changed anytime)

const AdminModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Confirmation Modal state for Delete safety
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadBookings();
    }
  }, [isAuthenticated, isOpen]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (email.trim().toLowerCase() === ADMIN_EMAIL && pin.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Email ID or PIN code!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPin('');
  };

  const promptDeleteConfirmation = (booking) => {
    setConfirmDeleteTarget(booking);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBooking(confirmDeleteTarget.id);
      setActionSuccess(`Booking ${confirmDeleteTarget.booking_id} deleted successfully.`);
      setBookings((prev) => prev.filter((b) => b.id !== confirmDeleteTarget.id));
      setConfirmDeleteTarget(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Failed to delete booking from database. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (booking) => {
    try {
      await markBookingCompleted(booking.id);
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: 'Completed' } : b))
      );
      setActionSuccess(`Booking ${booking.booking_id} marked as Completed!`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  if (!isOpen) return null;

  const filteredBookings = bookings.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.includes(searchQuery) ||
      b.booking_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service_details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#1A1A1A] border border-[#B88E2F]/40 text-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333] bg-[#111111]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                DoonCares Admin Portal
              </h2>
              <p className="text-xs text-[#B88E2F]">
                {isAuthenticated ? 'Live PostgreSQL Orders Database' : 'Authorized Access Only'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* --- LOGIN FORM --- */
            <div className="max-w-md mx-auto py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#B88E2F]/20 border border-[#B88E2F] rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  🛡️
                </div>
                <h3 className="text-xl font-bold">Admin Login Required</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Enter your Admin Email ID and Security PIN code to manage bookings.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Admin Email ID
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@dooncares.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Security PIN Code
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#B88E2F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#B88E2F] to-[#967123] hover:from-[#A27B27] hover:to-[#83621D] text-white font-bold rounded-xl shadow-lg transition"
                >
                  Unlock Admin Dashboard
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
                Default Credentials: Email: <span className="text-gray-300 font-mono">admin@dooncares.in</span> | PIN: <span className="text-gray-300 font-mono">7310</span>
              </div>
            </div>
          ) : (
            /* --- DASHBOARD UI TABLE --- */
            <div>
              {/* Action Banner */}
              {actionSuccess && (
                <div className="mb-4 p-3 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
                  <span>✅ {actionSuccess}</span>
                  <button onClick={() => setActionSuccess('')} className="text-xs text-gray-400">✕</button>
                </div>
              )}

              {/* Controls & Search Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search customer, phone, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#B88E2F]"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                  </div>

                  <button
                    onClick={loadBookings}
                    className="px-4 py-2 bg-[#252525] border border-gray-700 hover:bg-[#333] text-gray-300 hover:text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5"
                  >
                    <span>🔄</span> Refresh
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-400">
                    Total Orders: <strong className="text-white">{bookings.length}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-950/60 border border-red-800/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-semibold transition"
                  >
                    🔒 Logout
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#111111]">
                {loading ? (
                  <div className="py-12 text-center text-gray-400">
                    <div className="animate-spin text-3xl mb-2">⏳</div>
                    Fetching live orders from PostgreSQL...
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-lg">📭 No bookings found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {searchQuery ? 'Try changing your search query' : 'New customer bookings will appear here automatically.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#1A1A1A] border-b border-gray-800 text-gray-400 uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Booking ID</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Phone / Contact</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Service Details</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition">
                          {/* Booking ID */}
                          <td className="py-3 px-4 font-mono text-xs text-[#B88E2F] font-semibold whitespace-nowrap">
                            {b.booking_id || `DC-${b.id}`}
                          </td>

                          {/* Customer Name */}
                          <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                            {b.name}
                          </td>

                          {/* Phone */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-gray-300">{b.phone}</span>
                              <a
                                href={`tel:${b.phone}`}
                                title="Call Customer"
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-950 text-emerald-400 hover:bg-emerald-800 transition"
                              >
                                📞
                              </a>
                              <a
                                href={`https://wa.me/91${b.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                title="WhatsApp Customer"
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-green-950 text-green-400 hover:bg-green-800 transition"
                              >
                                💬
                              </a>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-gray-300 whitespace-nowrap">
                            {b.date}
                          </td>

                          {/* Service Details */}
                          <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                            {b.service_details || 'General Home Service'}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(b)}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                                b.status === 'Completed'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                              }`}
                            >
                              {b.status === 'Completed' ? '✓ Completed' : '⏳ Pending'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => promptDeleteConfirmation(b)}
                              className="px-3 py-1.5 bg-red-950/80 border border-red-800 hover:bg-red-900 text-red-300 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 ml-auto"
                            >
                              <span>🗑️</span> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- DELETE SAFETY CONFIRMATION MODAL --- */}
      {confirmDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#1C1C1C] border border-red-900/80 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-950 border border-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-red-400">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm Delete Order?</h3>
            <p className="text-sm text-gray-300 mb-4">
              Are you sure you want to permanently delete the booking for{' '}
              <strong className="text-white">{confirmDeleteTarget.name}</strong> (
              <span className="font-mono text-[#B88E2F]">{confirmDeleteTarget.booking_id}</span>)?
            </p>
            <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/60 mb-6">
              🛑 Warning: This action cannot be undone and will permanently remove this customer order from your PostgreSQL database.
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setConfirmDeleteTarget(null)}
                className="w-1/2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-sm transition"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModal;
