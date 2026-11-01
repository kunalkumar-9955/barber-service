'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    apiRequest('/users/notifications', token)
      .then((data) => setNotifications(data.notifications || []))
      .catch((err: any) => setError(err?.message || 'Failed to load notifications'));
  }, [token]);

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">Notifications</h1>
          <p className="mt-3 text-white/70">Keep track of booking updates, confirmations, and service alerts.</p>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        <div className="grid gap-6">
          {notifications.length === 0 ? (
            <div className="glass-card p-8">No notifications yet. Your booking updates will appear here.</div>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className="glass-card p-6">
                <p className="text-brand uppercase tracking-[0.35em]">{notification.type || 'Update'}</p>
                <h2 className="mt-3 text-xl font-semibold">{notification.title}</h2>
                <p className="mt-3 text-white/70">{notification.message}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/50">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
