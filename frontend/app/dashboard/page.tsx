'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    apiRequest('/users/me', token)
      .then((data) => setProfile(data.user))
      .catch((err: any) => setError(err?.message || 'Failed to load profile'));
  }, [token]);

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-brand uppercase tracking-[0.35em]">Dashboard</p>
              <h1 className="text-3xl font-semibold">Welcome, {user?.name || 'BarberPro User'}</h1>
            </div>
            <div className="rounded-full border border-brand/30 bg-white/5 px-5 py-3 text-brand">Role: {user?.role || 'user'}</div>
          </div>
          <p className="mt-5 max-w-2xl text-white/70">Manage your bookings, wallet, favorites, and notifications in one premium hub.</p>
        </div>

        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Wallet</p>
            <p className="mt-4 text-4xl font-semibold">₹{profile?.wallet?.balance ?? 0}</p>
            <p className="mt-3 text-white/70">Rewards: {profile?.wallet?.rewards ?? 0} pts</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Favorites</p>
            <p className="mt-4 text-4xl font-semibold">{profile?.favorites?.length ?? 0}</p>
            <p className="mt-3 text-white/70">Saved barber shops for fast booking.</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Referral</p>
            <p className="mt-4 text-4xl font-semibold">{profile?.referralCode || 'XXXX'}</p>
            <p className="mt-3 text-white/70">Share the code to earn wallet credits.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Profile</h2>
            <div className="mt-6 space-y-3 text-white/70">
              <div>Name: {profile?.name}</div>
              <div>Email: {profile?.email}</div>
              <div>Phone: {profile?.phone || 'Not set'}</div>
              <div>Joined: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</div>
            </div>
          </div>
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <div className="mt-6 flex flex-col gap-3 text-white/80">
              <button className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-left transition hover:border-brand">View upcoming appointments</button>
              <button className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-left transition hover:border-brand">Manage favorites</button>
              <button className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-left transition hover:border-brand">Apply promo coupon</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
