'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import Link from 'next/link';

export default function ShopDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${id}`)
      .then((res) => res.json())
      .then((data) => setShop(data.shop))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!token) return;
    apiRequest('/users/me', token)
      .then((data) => setFavorites(data.user?.favorites?.map((item: any) => item._id) || []))
      .catch((err: any) => setFavorites([]));
  }, [token]);

  const bookService = (service: any) => {
    if (!token) {
      router.push('/login');
      return;
    }
    localStorage.setItem('booking_shop', JSON.stringify({ shopId: shop._id, service, shopName: shop.name }));
    router.push('/booking');
  };

  const toggleFavorite = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const data = await apiRequest(`/users/favorite/${shop._id}`, token, { method: 'POST' });
      setFavorites(data.favorites || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to save favorite');
    }
  };

  const isFavorite = shop && favorites.includes(shop._id);

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-brand uppercase tracking-[0.35em]">Barber Shop</p>
              <h1 className="text-3xl font-semibold">{shop?.name || 'Loading...'}</h1>
              <p className="mt-3 text-white/70">{shop?.address}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={toggleFavorite} className={`rounded-full px-4 py-2 text-sm transition ${isFavorite ? 'bg-brand text-black' : 'border border-white/10 text-white/80 hover:border-brand'}`}>
                {isFavorite ? 'Saved' : 'Save shop'}
              </button>
              <div className="rounded-full border border-brand/30 bg-white/5 px-5 py-3 text-brand">{shop?.openNow ? 'Open Now' : 'Closed'}</div>
            </div>
          </div>
        </div>

        {shop ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card p-8 md:col-span-2">
              <h2 className="text-xl font-semibold">Service Menu</h2>
              <div className="mt-6 space-y-4">
                {shop.services?.map((service: any) => (
                  <div key={service.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <p className="mt-1 text-white/70">{service.duration} mins</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold">₹{service.price}</p>
                        <button onClick={() => bookService(service)} className="mt-3 rounded-full bg-brand px-4 py-2 text-black">Book</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">About</h2>
                <p className="mt-4 text-white/70">{shop.description || 'A premium barber shop offering modern cuts, home service, and professional styling.'}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">Contact</p>
                <p className="mt-3 text-white/80">{shop.phone || 'Not available'}</p>
                <p className="mt-2 text-white/80">{shop.city}</p>
              </div>
              <Link href="/booking" className="inline-flex rounded-full border border-brand px-6 py-3 text-brand transition hover:bg-brand/10">Start Booking</Link>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8">Loading shop details...</div>
        )}

        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
      </section>
      <Footer />
    </main>
  );
}
