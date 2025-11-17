import './globals.css';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CNC Laundry Service',
  description: 'Fast, clean and transparent laundry service',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 bg-[#E0F7FA] flex flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
