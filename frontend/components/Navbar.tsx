'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full fixed top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm sm:px-8">
        <Link href="/" className="font-black tracking-[0.18em] text-brand">BARBERPRO</Link>
        <nav className="flex flex-wrap items-center gap-4 text-white/80">
          <Link href="/shops">Shops</Link>
          <Link href="/bookings">Bookings</Link>
          <Link href="/notifications">Notifications</Link>
          <Link href="/ai">AI</Link>
          <Link href="/dashboard">Dashboard</Link>
          {user?.role === 'barber' && <Link href="/barber">Barber</Link>}
          {user?.role === 'admin' && <Link href="/admin">Admin</Link>}
          <Link href="/booking" className="rounded-full border border-brand px-4 py-2 text-brand transition hover:bg-brand/10">Book Now</Link>
          {user ? (
            <button onClick={logout} className="rounded-full border border-white/20 px-4 py-2 text-white/90 transition hover:border-brand hover:text-brand">Logout</button>
          ) : (
            <Link href="/login" className="rounded-full border border-white/20 px-4 py-2 text-white/90 transition hover:border-brand hover:text-brand">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
