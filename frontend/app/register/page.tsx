'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      await register(email, password, name, referralCode);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to register');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-md space-y-6 rounded-[32px] border border-white/10 bg-black/80 p-8 shadow-glass">
        <div>
          <p className="text-brand uppercase tracking-[0.35em]">Register</p>
          <h1 className="mt-3 text-3xl font-semibold">Create your account and start booking.</h1>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2 text-sm">
            <span>Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand" />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand" />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand" />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Referral Code (optional)</span>
            <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand" />
          </label>
          <button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-black">Create Account</button>
        </form>
        <p className="text-sm text-white/70">Already registered? <Link href="/login" className="text-brand">Login now</Link></p>
      </div>
    </main>
  );
}
