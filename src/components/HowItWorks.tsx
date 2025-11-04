import React from 'react';
import { steps } from '@/data/steps';

export default function HowItWorks() {
  return (
    <section className="py-20" id="how-it-works">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
          >
            {/* <div className="size-16 bg-primary/20 text-primary rounded-full mb-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                {s.icon}
              </span>
            </div> */}
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
