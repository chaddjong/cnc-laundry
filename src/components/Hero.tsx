import React from 'react';

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 md:px-12 lg:px-24">
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          Laundri Cepat, Bersih, dan Wangi
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl">
          Jadwalkan penjemputan cucian dalam 1 menit, tanpa repot
        </p>
        <button className="py-3 px-6 bg-[#66BB6A] hover:bg-[#57A05E] text-white font-semibold rounded-full shadow-md transition">
          Laundri Sekarang!
        </button>
      </div>
    </section>
  );
}
