'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const services = [
  { title: 'Haircut & Styling', subtitle: 'Precision cuts with modern finishes.' },
  { title: 'Beard Sculpting', subtitle: 'Sharp edges, polished bristles, premium grooming.' },
  { title: 'Home Service', subtitle: 'Barber arrives at your doorstep with full kit.' }
];

const shops = [
  { name: 'Gold Fade Studio', city: 'Mumbai', price: '₹499', rating: 4.9 },
  { name: 'Urban Cut Lounge', city: 'Delhi', price: '₹399', rating: 4.8 },
  { name: 'TrimNow Club', city: 'Bengaluru', price: '₹449', rating: 4.7 }
];

const reviews = [
  { author: 'Aarav', review: 'Incredible styling and seamless booking experience.' },
  { author: 'Sneha', review: 'Loved the home service add-on and premium vibe.' },
  { author: 'Rohan', review: 'Professional barbers, fast payments, gorgeous UI.' }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-white">
      <Navbar />
      <section className="relative min-h-screen overflow-hidden px-6 pt-28 pb-16 sm:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <span className="rounded-full border border-brand/40 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand">Luxury barber booking</span>
            <h1 className="section-title mt-6 max-w-3xl text-5xl leading-tight sm:text-6xl">Book premium barber services in minutes with sleek modern UI.</h1>
            <p className="mt-6 max-w-2xl text-white/70">From curated shop listings to home service, payment, and AI hairstyle recommendations—BarberPro delivers startup-quality booking from landing page to checkout.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/booking" className="rounded-full bg-brand px-7 py-3 text-black transition hover:scale-[1.02]">Book Now</Link>
              <Link href="/shops" className="rounded-full border border-white/20 px-7 py-3 text-white transition hover:border-brand">Explore Shops</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="bg-black/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-brand uppercase tracking-[0.35em]">Services</p>
            <h2 className="section-title mt-4">Barbershop services built for style, speed, and reliability.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((item) => (
              <motion.div key={item.title} className="glass-card p-8" whileHover={{ y: -6 }}>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-white/70">{item.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-brand uppercase tracking-[0.35em]">Popular shops</p>
              <h2 className="section-title mt-3">Trusted barbershops near you.</h2>
            </div>
            <Link href="/shops" className="text-brand hover:text-white">View all shops →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {shops.map((shop) => (
              <motion.div key={shop.name} className="glass-card p-7" whileHover={{ scale: 1.02 }}>
                <div className="mb-4 h-48 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(252,190,50,0.22),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.6))]" />
                <h3 className="text-2xl font-semibold">{shop.name}</h3>
                <p className="mt-2 text-white/70">{shop.city} • Starts at {shop.price}</p>
                <div className="mt-5 flex items-center gap-3 text-sm text-brand">
                  <span>★ {shop.rating}</span>
                  <span>Open Now</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-black/70 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-brand uppercase tracking-[0.35em]">Testimonials</p>
            <h2 className="section-title mt-4">What customers love about BarberPro.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((item) => (
              <motion.div key={item.author} className="glass-card p-8" whileHover={{ y: -4 }}>
                <p className="text-white/75">“{item.review}”</p>
                <p className="mt-6 font-semibold text-brand">{item.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[36px] border border-white/10 bg-[#15151d] p-10 shadow-glass md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-brand uppercase tracking-[0.35em]">Start today</p>
            <h2 className="section-title mt-3">Download the BarberPro mobile experience.</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-brand px-6 py-3 text-black">App Store</button>
            <button className="rounded-full border border-white/10 px-6 py-3 text-white">Play Store</button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
