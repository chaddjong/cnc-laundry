import React from 'react';
import {timeline} from '@/data/timeline';

export default function TrackOrder() {
  return (
    <section id="track-order" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Track Order</h2>

        <div className="relative border-l-2 border-green-600 ml-4 space-y-10">
          {timeline.map((step, index) => (
            <div key={index} className="pl-6 relative">
              <div className="w-4 h-4 bg-green-600 rounded-full absolute -left-[9px] top-1"></div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
