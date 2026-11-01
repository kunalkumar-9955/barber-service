'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard'
      }
    });
    if (error) {
      setMessage(error.message || 'Payment failed');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glass">
      <PaymentElement />
      <button disabled={!stripe || isLoading} className="w-full rounded-full bg-brand px-5 py-3 text-black disabled:cursor-not-allowed disabled:opacity-60">
        {isLoading ? 'Processing…' : 'Complete Payment'}
      </button>
      {message && <p className="text-sm text-red-300">{message}</p>}
    </form>
  );
}
