'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Map...</div>,
});

export default function MapPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Map />
    </div>
  );
}
