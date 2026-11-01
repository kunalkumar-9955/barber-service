'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to login');
    }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      await googleLogin();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to login with Google');
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-md space-y-6 rounded-[32px] border border-white/10 bg-black/80 p-8 shadow-glass">
        <div>
          <p className="text-brand uppercase tracking-[0.35em]">Login</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back. Book your next trim.</h1>
        </div>
        {error && <div className="rounded-3xl bg-red-500/20 p-4 text-sm text-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2 text-sm">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand" />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-brand" />
          </label>
          <button type="submit" className="w-full rounded-full bg-brand px-5 py-3 text-black">Continue</button>
        </form>
        <button onClick={handleGoogle} className="w-full rounded-full border border-white/10 px-5 py-3 text-white transition hover:border-brand">Continue with Google</button>
        <p className="text-sm text-white/70">New user? <Link href="/register" className="text-brand">Create an account</Link></p>
        <p className="text-sm text-white/70">Forgot password? <Link href="/forgot-password" className="text-brand">Reset here</Link></p>
      </div>
    </main>
  );
}
