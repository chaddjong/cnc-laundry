'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '../../public/images/cnc-logo.png';
import { RxHamburgerMenu } from 'react-icons/rx';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F9FDFE] backdrop-blur-sm border-b border-gray-200">
      <div className="px-4 md:px-8 lg:px-16 flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image
              src={Logo}
              alt="CNC Laundry Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            CNC Laundry Service
          </h2>
        </div>

        {/* Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-primary">
              Home
            </a>
            <a href="#pricing" className="hover:text-primary">
              Price List
            </a>
            <a href="#how-it-works" className="hover:text-primary">
              How It Works
            </a>
            <a href="#track-order" className="hover:text-primary">
              Track Order
            </a>
          </nav>

          <a
            href="#order-form"
            className="rounded-full h-10 px-6 bg-green-300 hover:bg-green-400 text-gray-800 font-semibold flex items-center transition"
          >
            Laundry Now
          </a>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden p-2 rounded-full bg-gray-100 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <RxHamburgerMenu size={24} />
        </button>
      </div>

      {/* Mobile Menu (Overlay style) */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full bg-[#F9FDFE] border-b border-gray-200 py-4 px-6 flex flex-col items-center gap-4 text-gray-700 font-medium shadow-md md:hidden z-50">
          <a
            href="#"
            className="hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#pricing"
            className="hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Price List
          </a>
          <a
            href="#how-it-works"
            className="hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#track-order"
            className="hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Track Order
          </a>

          <a
            href="#order-form"
            className="rounded-full h-10 px-6 bg-green-300 hover:bg-green-400 text-gray-800 font-semibold flex items-center justify-center transition"
            onClick={() => setMenuOpen(false)}
          >
            Laundry Now
          </a>
        </div>
      )}
    </header>
  );
}
