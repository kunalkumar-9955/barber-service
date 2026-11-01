'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function ShopsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [rating, setRating] = useState('4');

  const loadShops = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops?city=${city}&rating=${rating}`)
      .then((res) => res.json())
      .then((data) => setShops(data.shops || []))
      .catch(console.error);
  };

  const loadProfile = async () => {
    if (!token) return;
    try {
      const data = await apiRequest('/users/me', token);
      setFavorites(data.user?.favorites?.map((shop: any) => shop._id) || []);
    } catch (err: any) {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadShops();
  }, [city, rating]);

  useEffect(() => {
    loadProfile();
  }, [token]);

  const toggleFavorite = async (shopId: string) => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const data = await apiRequest(`/users/favorite/${shopId}`, token, { method: 'POST' });
      setFavorites(data.favorites || []);
    } catch (err: any) {
      console.error(err?.message || 'Failed to save favorite');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">Barber Shops</h1>
          <p className="mt-3 text-white/70">Search by city and rating to find the perfect grooming destination.</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Search city" className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <option value="0">Any rating</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {shops.map((shop) => (
            <div key={shop._id} className="glass-card overflow-hidden rounded-[32px]">
              <div className="h-64 bg-[radial-gradient(circle_at_top,_rgba(252,190,50,0.22),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.6))]" />
              <div className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{shop.name}</h2>
                    <p className="mt-3 text-white/70">{shop.city} • {shop.address}</p>
                  </div>
                  <button onClick={() => toggleFavorite(shop._id)} className={`rounded-full px-4 py-2 text-sm transition ${favorites.includes(shop._id) ? 'bg-brand text-black' : 'border border-white/10 text-white/80 hover:border-brand'}`}>
                    {favorites.includes(shop._id) ? 'Saved' : 'Save'}
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-brand">
                  <span>★ {shop.rating}</span>
                  <span>{shop.services?.length ?? 0} services</span>
                </div>
                <Link href={`/shop/${shop._id}`} className="mt-6 inline-flex rounded-full border border-brand px-5 py-3 text-brand transition hover:bg-brand/10">View Shop</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
