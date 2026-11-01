'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 px-6 py-10 text-sm text-white/70 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="font-semibold text-white">BarberPro</p>
          <p>Premium barber booking experience with real-time scheduling, payments, and AI-powered recommendations.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href="#services" className="hover:text-brand">Services</Link>
          <Link href="#reviews" className="hover:text-brand">Reviews</Link>
          <Link href="/shops" className="hover:text-brand">Find Shops</Link>
          <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-white/50">© 2026 BarberPro. Designed for premium startup-ready barber booking.</div>
    </footer>
  );
}
