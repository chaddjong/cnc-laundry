import React from 'react';
import { Star, Clock, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-[#C8F3F2] w-full flex flex-col items-center justify-center">
      {/* Hero Main Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full px-6 md:px-12 lg:px-24 py-10">
        {/* Left Text Section */}
        <div className="flex-1 flex flex-col justify-center gap-6 text-center md:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Laundri Cepat, Bersih, dan Wangi
          </h1>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
            Tradisi pelayanan pelanggan terbaik dan komitmen terhadap kualitas
            tinggi dalam layanan dry cleaning dan laundry.
          </p>
          <button className="self-center md:self-start bg-[#FF8A34] hover:bg-[#e67725] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition">
            Daftar untuk Penjemputan & Pengantaran Gratis
          </button>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 flex justify-center md:justify-end mb-8 md:mb-0 relative">
          <div className="bg-[#A8E3E0] rounded-3xl p-4 md:p-6 lg:p-8 max-w-md shadow-md">
            <img
              src="https://images.unsplash.com/photo-1616628188473-3e6e4f7d3b49?auto=format&fit=crop&w=800&q=80"
              alt="Laundry Illustration"
              className="rounded-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Feature Bar Section (Smaller Size) */}
      <div className="w-fit bg-white shadow-md rounded-2xl mt-6 z-10 mb-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Feature 1 */}
          <div className="flex-1 flex flex-col items-center text-center p-4 md:p-5">
            <Star className="text-[#FFB800] w-7 h-7 mb-2" />
            <h3 className="text-base font-semibold text-gray-900">
              Unmatched Quality
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Hasil laundry sempurna dengan standar terbaik.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex-1 flex flex-col items-center text-center p-4 md:p-5">
            <Clock className="text-[#FFB800] w-7 h-7 mb-2" />
            <h3 className="text-base font-semibold text-gray-900">
              Timely Service
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Penjemputan dan pengantaran selalu tepat waktu.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex-1 flex flex-col items-center text-center p-4 md:p-5">
            <Users className="text-[#FFB800] w-7 h-7 mb-2" />
            <h3 className="text-base font-semibold text-gray-900">
              Customer Satisfaction
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Kepuasan pelanggan adalah prioritas utama kami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
