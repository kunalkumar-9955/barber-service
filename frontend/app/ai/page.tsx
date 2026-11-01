'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

export default function AiPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/recommend`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations || []))
        .catch((err: any) => setError(err?.message || 'Failed to load recommendations'));
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!photo) {
      setError('Please upload a photo first.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/suggest`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate suggestions.');
      }
      setSuggestions(data.suggestions || []);
      setMessage(data.message || 'Hairstyle suggestions generated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">AI Hairstyles</h1>
          <p className="mt-3 text-white/70">Upload a photo and get hairstyle suggestions plus trending barber recommendations.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleUpload} className="glass-card p-8 space-y-6">
            <label className="block space-y-3 text-sm">
              <span>Upload your photo</span>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="w-full text-white" />
            </label>
            <button type="submit" className="rounded-full bg-brand px-5 py-3 text-black disabled:opacity-50" disabled={loading}>
              {loading ? 'Analyzing…' : 'Generate suggestions'}
            </button>
            {message && <div className="rounded-3xl bg-emerald-500/20 p-4 text-sm text-emerald-200">{message}</div>}
            {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
          </form>
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Trending Barber Picks</h2>
            <div className="mt-6 space-y-4">
              {recommendations.length === 0 ? (
                <p className="text-white/70">View the latest trending barbers once you log in.</p>
              ) : (
                recommendations.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-2 text-white/70">Rating: {item.rating} • {item.city}</p>
                    <p className="mt-1 text-brand">Starting at ₹{item.price}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold">Suggested Hairstyles</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {suggestions.map((item, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-3 text-white/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
