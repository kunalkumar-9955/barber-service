'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BookingPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [bookingState, setBookingState] = useState<{ shopName: string; shopId?: string; service?: { name?: string; price?: number } | null }>({ shopName: '', service: null });
  const [address, setAddress] = useState('');
  const [bookingType, setBookingType] = useState('shop');
  const [datetime, setDatetime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storage = localStorage.getItem('booking_shop');
    if (storage) {
      setBookingState(JSON.parse(storage));
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setError('');
      const bookingData = {
        shop: bookingState.shopId,
        service: bookingState.service,
        bookingType,
        address: bookingType === 'home' ? address : undefined,
        scheduledAt: datetime
      };
      const data = await apiRequest('/bookings', token, {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
      setSuccess('Booking created. Redirecting to payment...');
      localStorage.setItem('bookingId', data.booking._id);
      setTimeout(() => router.push('/payment'), 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to create booking');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-5xl space-y-10">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">Book a service</h1>
          <p className="mt-3 text-white/70">Confirm your booking details and schedule your appointment instantly.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Booking details</h2>
            <div className="mt-6 space-y-4 text-white/80">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/50">Shop</p>
                <p className="mt-2 text-lg font-semibold">{bookingState.shopName || 'Select a shop'}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/50">Service</p>
                <p className="mt-2 text-lg font-semibold">{bookingState.service?.name || 'Choose a service first'}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/50">Price</p>
                <p className="mt-2 text-lg font-semibold">₹{bookingState.service?.price ?? 0}</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/50">Booking type</p>
              <div className="mt-4 flex gap-4">
                {['shop', 'home'].map((type) => (
                  <button type="button" key={type} onClick={() => setBookingType(type)} className={`rounded-full px-4 py-2 transition ${bookingType === type ? 'bg-brand text-black' : 'bg-white/5 text-white'}`}>
                    {type === 'shop' ? 'In-Shop' : 'Home Service'}
                  </button>
                ))}
              </div>
            </div>
            {bookingType === 'home' && (
              <label className="block space-y-2 text-sm">
                <span>Home address</span>
                <input value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
            )}
            <label className="block space-y-2 text-sm">
              <span>Select date & time</span>
              <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
            </label>
            {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
            {success && <div className="rounded-3xl bg-emerald-500/20 p-4 text-sm text-emerald-200">{success}</div>}
            <button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-black">Confirm booking</button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
