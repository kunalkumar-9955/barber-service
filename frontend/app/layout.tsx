import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BarberPro | Premium Booking',
  description: 'Book premium barber services with style, speed, and real backend integration.'
};

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayoutContent>{children}</RootLayoutContent>
  );
}
