'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [rescheduleDates, setRescheduleDates] = useState<Record<string, string>>({});

  const loadBookings = async () => {
    try {
      setError('');
      const data = await apiRequest('/bookings', token);
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load bookings');
    }
  };

  useEffect(() => {
    if (!token) return;
    loadBookings();
  }, [token]);

  const cancelBooking = async (bookingId: string) => {
    try {
      await apiRequest(`/bookings/cancel/${bookingId}`, token, { method: 'PUT' });
      setStatusMessage('Booking cancelled successfully.');
      loadBookings();
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel booking');
    }
  };

  const rescheduleBooking = async (bookingId: string) => {
    const scheduledAt = rescheduleDates[bookingId];
    if (!scheduledAt) {
      setError('Please choose a new date and time.');
      return;
    }
    try {
      await apiRequest(`/bookings/reschedule/${bookingId}`, token, {
        method: 'PUT',
        body: JSON.stringify({ scheduledAt })
      });
      setStatusMessage('Booking rescheduled successfully.');
      setRescheduleDates((prev) => ({ ...prev, [bookingId]: '' }));
      loadBookings();
    } catch (err: any) {
      setError(err?.message || 'Failed to reschedule');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">My Bookings</h1>
          <p className="mt-3 text-white/70">Track upcoming appointments, cancel bookings, and reschedule if needed.</p>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        {statusMessage && <div className="rounded-3xl bg-emerald-500/20 p-4 text-sm text-emerald-200">{statusMessage}</div>}
        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <div className="glass-card p-8">No bookings found. Start by booking a shop or service.</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="glass-card p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-brand uppercase tracking-[0.35em]">{booking.status.toUpperCase()}</p>
                    <h2 className="mt-2 text-2xl font-semibold">{booking.shop?.name || 'Unknown shop'}</h2>
                    <p className="mt-2 text-white/70">Service: {booking.service?.name || 'n/a'} • ₹{booking.service?.price ?? 0}</p>
                    <p className="mt-2 text-white/70">Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
                    <p className="mt-2 text-white/70">Type: {booking.bookingType}</p>
                    {booking.bookingType === 'home' && <p className="mt-2 text-white/70">Address: {booking.address || 'Not provided'}</p>}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {booking.status !== 'cancelled' && (
                      <button onClick={() => cancelBooking(booking._id)} className="rounded-full bg-red-500/90 px-5 py-3 text-black transition hover:bg-red-400">Cancel</button>
                    )}
                    <button onClick={() => setRescheduleDates((prev) => ({ ...prev, [booking._id]: prev[booking._id] || '' }))} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white transition hover:border-brand">Reschedule</button>
                  </div>
                </div>
                {booking.status !== 'cancelled' && (
                  <div className="mt-6 space-y-4">
                    <label className="block space-y-2 text-sm">
                      <span>New date & time</span>
                      <input
                        type="datetime-local"
                        value={rescheduleDates[booking._id] || ''}
                        onChange={(e) => setRescheduleDates((prev) => ({ ...prev, [booking._id]: e.target.value }))}
                        className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand"
                      />
                    </label>
                    <button onClick={() => rescheduleBooking(booking._id)} className="rounded-full bg-brand px-5 py-3 text-black">Save new time</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
