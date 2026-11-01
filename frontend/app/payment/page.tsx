'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/CheckoutForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PaymentPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('bookingId');
    if (!id) {
      router.push('/booking');
      return;
    }
    setBookingId(id);
  }, [router]);

  useEffect(() => {
    if (!bookingId || !token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId, paymentMethodType: 'card' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setError(data.error || 'Unable to create payment');
      })
      .catch((err) => setError(err.message));
  }, [bookingId, token]);

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white sm:px-8">
      <Navbar />
      <section className="mx-auto max-w-3xl space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-semibold">Secure Payment</h1>
          <p className="mt-3 text-white/70">Complete your booking with Stripe. Card payments and UPI support are ready.</p>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        {clientSecret ? (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        ) : (
          <div className="glass-card p-8">Preparing secure checkout…</div>
        )}
      </section>
    </main>
  );
}
