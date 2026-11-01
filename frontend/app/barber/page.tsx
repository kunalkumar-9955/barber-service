'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

export default function BarberPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState<{ total: number } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [barber, setBarber] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [serviceName, setServiceName] = useState('Classic Cut');
  const [servicePrice, setServicePrice] = useState(499);
  const [serviceDuration, setServiceDuration] = useState(45);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadDashboard = async () => {
    try {
      setError('');
      const data = await apiRequest('/barbers/dashboard', token);
      setDashboard(data);
      setBookings(data.bookings || []);
      setBarber(data.barber || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard');
    }
  };

  useEffect(() => {
    if (!token) return;
    loadDashboard();
  }, [token]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      setMessage('');
      await apiRequest('/barbers/register', token, {
        method: 'POST',
        body: JSON.stringify({
          bio,
          services: [{ name: serviceName, price: servicePrice, duration: serviceDuration }]
        })
      });
      setMessage('Barber profile created. Reloading dashboard...');
      loadDashboard();
    } catch (err: any) {
      setError(err?.message || 'Failed to create profile');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">Barber Panel</h1>
          <p className="mt-3 text-white/70">Manage your bookings, services, and shop appointments from one place.</p>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-3xl bg-emerald-500/20 p-4 text-sm text-emerald-200">{message}</div>}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Upcoming bookings</p>
            <p className="mt-4 text-4xl font-semibold">{dashboard?.total ?? 0}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Bio</p>
            <p className="mt-4 text-white/70">{barber?.bio || 'No barber profile yet. Register below.'}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Active services</p>
            <p className="mt-4 text-white/70">{barber?.services?.length ?? 0} service(s)</p>
          </div>
        </div>
        {barber ? (
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Today's bookings</h2>
            <div className="mt-6 space-y-4">
              {bookings.length === 0 ? (
                <p className="text-white/70">No bookings have been scheduled yet.</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-brand uppercase tracking-[0.35em]">{booking.status}</p>
                    <h3 className="mt-2 text-lg font-semibold">{booking.service?.name}</h3>
                    <p className="mt-1 text-white/70">{new Date(booking.scheduledAt).toLocaleString()}</p>
                    <p className="mt-1 text-white/70">Customer: {booking.user?.name || 'Guest'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Register Barber Profile</h2>
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <label className="block text-sm text-white/75">
                Bio
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <label className="block text-sm text-white/75">
                Service name
                <input value={serviceName} onChange={(e) => setServiceName(e.target.value)} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <label className="block text-sm text-white/75">
                Price
                <input type="number" value={servicePrice} min={0} onChange={(e) => setServicePrice(Number(e.target.value))} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <label className="block text-sm text-white/75">
                Duration (minutes)
                <input type="number" value={serviceDuration} min={10} onChange={(e) => setServiceDuration(Number(e.target.value))} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <button type="submit" className="rounded-full bg-brand px-5 py-3 text-black">Create profile</button>
            </form>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
