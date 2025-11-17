import React from 'react';
import Image from 'next/image';
import Logo from '../../public/images/cnc-logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 border-t border-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 mb-2">
              <Image
                src={Logo}
                alt="CNC Laundry Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <h3 className="font-semibold text-lg">CNC Laundry</h3>
            </div>
            <p className="text-sm text-gray-600">Buka Setiap Hari: 8 AM - 8 PM</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Alamat</h3>
            <p className="text-sm text-gray-600">
              Laundry Agape Jl. Raya Manado-Bitung<br />
              Minahasa Utara, 95371
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Kontak</h3>
            <p className="text-sm text-gray-600">
              Email: cnc@laundry.com <br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CNC Laundry. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
