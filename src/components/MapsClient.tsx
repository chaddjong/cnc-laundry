'use client';

import dynamic from 'next/dynamic';

const Maps = dynamic(() => import('./Maps'), {
  ssr: false,
});

export default function MapsClient() {
  return <Maps />;
}
