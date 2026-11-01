'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err?.message || 'Unable to send password reset email.');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-md space-y-6 rounded-[32px] border border-white/10 bg-black/80 p-8 shadow-glass">
        <div>
          <p className="text-brand uppercase tracking-[0.35em]">Forgot Password</p>
          <h1 className="mt-3 text-3xl font-semibold">Reset your BarberPro password.</h1>
        </div>
        {message && <div className="rounded-3xl bg-emerald-500/20 p-4 text-sm text-emerald-200">{message}</div>}
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2 text-sm">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand"
            />
          </label>
          <button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-black">Send reset link</button>
        </form>
        <p className="text-sm text-white/70">
          Remembered your password? <Link href="/login" className="text-brand">Login</Link>
        </p>
      </div>
    </main>
  );
}
