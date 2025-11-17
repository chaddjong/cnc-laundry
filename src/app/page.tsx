import React from 'react';
import HowItWorks from '@/components/HowItWorks';
// import OrderForm from '@/components/OrderForm';
import Pricing from '@/components/Pricing';
import TrackOrder from '@/components/TrackOrder';
import Hero from '@/components/Hero';
import MapsClient from '@/components/MapsClient';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <Hero />
      <HowItWorks />
      <Pricing />
      <TrackOrder />
      <MapsClient />
    </div>
  );
}
