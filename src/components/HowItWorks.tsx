import React from 'react';
import { CheckCircle } from 'lucide-react';
import { steps } from '@/data/steps';

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-6 md:px-12 lg:px-24 bg-white"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div className="relative flex flex-col items-center lg:items-start">
          {/* Decorative stars */}
          <div className="absolute -top-6 -left-6 text-[#FFB800] text-3xl">
            ✨✨
          </div>

          {/* Top image */}
          <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1616628188473-3e6e4f7d3b49?auto=format&fit=crop&w=800&q=80"
              alt="Laundry staff smiling"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Bottom row (image + play video box) */}
          <div className="flex gap-6 w-full">
            <div className="flex-1 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1581579186988-c70d6f2a4c1b?auto=format&fit=crop&w=800&q=80"
                alt="Laundry process"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="bg-[#00A7A7] text-white rounded-xl p-6 flex flex-col items-center justify-center shadow-md flex-1">
              <button className="bg-white text-[#FF8A34] rounded-full w-14 h-14 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">
                  play_arrow
                </span>
              </button>
              <h3 className="font-semibold text-lg">Play Video</h3>
              <p className="text-sm text-white/80 mt-2 text-center">
                Lorem ipsum dolor sit amet consectetur adipiscing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <button className="bg-[#FFB800] text-white font-semibold text-sm px-4 py-2 rounded-md mb-4">
            How It Works
          </button>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Your Trusted Partner in <br /> Laundry Care.
          </h2>
          <p className="text-gray-600 mb-8">
            Proses laundry kami mudah, cepat, dan nyaman. Berikut
            langkah-langkahnya:
          </p>

          {/* Features (Dynamic from steps.ts) */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="text-[#FFB800] mt-1">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
