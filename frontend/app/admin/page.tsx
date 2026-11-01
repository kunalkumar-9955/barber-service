'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<{ totalUsers: number; totalShops: number; coupons: any[] } | null>(null);
  const [users, setUsers] = useState<Array<{ _id: string; name: string; email: string; role: string }>>([]);
  const [coupon, setCoupon] = useState({ code: '', discount: 10, minimumAmount: 0, validUntil: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadStats = async () => {
    try {
      setError('');
      const data = await apiRequest('/admin/stats', token);
      setStats(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load stats');
    }
  };

  const loadUsers = async () => {
    try {
      setError('');
      const data = await apiRequest('/admin/users', token);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    if (!token) return;
    loadStats();
    loadUsers();
  }, [token]);

  const handleCouponSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      setMessage('');
      await apiRequest('/admin/coupon', token, { method: 'POST', body: JSON.stringify({ ...coupon, validUntil: new Date(coupon.validUntil) }) });
      setMessage('Coupon created successfully.');
      setCoupon({ code: '', discount: 10, minimumAmount: 0, validUntil: '' });
      loadStats();
    } catch (err: any) {
      setError(err?.message || 'Failed to create coupon');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">Admin Panel</h1>
          <p className="mt-3 text-white/70">Manage users, coupons, and platform analytics from one secure place.</p>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-3xl bg-emerald-500/20 p-4 text-sm text-emerald-200">{message}</div>}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Total users</p>
            <p className="mt-4 text-4xl font-semibold">{stats?.totalUsers ?? '—'}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Total shops</p>
            <p className="mt-4 text-4xl font-semibold">{stats?.totalShops ?? '—'}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-white/60">Active coupons</p>
            <p className="mt-4 text-4xl font-semibold">{stats?.coupons?.length ?? '—'}</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Create Coupon</h2>
            <form onSubmit={handleCouponSubmit} className="mt-6 space-y-4">
              <label className="block text-sm text-white/75">
                Code
                <input value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <label className="block text-sm text-white/75">
                Discount (%)
                <input type="number" value={coupon.discount} min={0} onChange={(e) => setCoupon({ ...coupon, discount: Number(e.target.value) })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <label className="block text-sm text-white/75">
                Minimum order amount
                <input type="number" value={coupon.minimumAmount} min={0} onChange={(e) => setCoupon({ ...coupon, minimumAmount: Number(e.target.value) })} className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <label className="block text-sm text-white/75">
                Valid until
                <input type="date" value={coupon.validUntil} onChange={(e) => setCoupon({ ...coupon, validUntil: e.target.value })} required className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand" />
              </label>
              <button type="submit" className="rounded-full bg-brand px-5 py-3 text-black">Create coupon</button>
            </form>
          </div>
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Recent users</h2>
            <div className="mt-6 space-y-3">
              {users.length === 0 ? (
                <p className="text-white/70">No users available yet.</p>
              ) : (
                users.map((user) => (
                  <div key={user._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-white/70">{user.email}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/80">{user.role}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
