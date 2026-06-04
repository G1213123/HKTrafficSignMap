import MapPageClient from './MapPageClient';

export const metadata = {
  title: 'Traffic Aids Map',
  description:
    'Interactive Traffic Aids Map for Hong Kong. Explore poles, traffic lights, signs, and vector tiles with a searchable map interface.',
  keywords: [
    'traffic aids map',
    'vector tiles',
    'MVT',
    'Hong Kong',
    'traffic lights',
    'poles',
    'signs',
    'road sign map',
  ],
  alternates: {
    canonical: '/map',
  },
  openGraph: {
    title: 'Traffic Aids Map | Road Sign Factory',
    description:
      'Explore an interactive map of traffic aids in Hong Kong, including poles, traffic lights, signs, and vector tile data.',
    url: '/map',
    siteName: 'Road Sign Factory',
    type: 'website',
    images: [
      {
        url: '/images/preview-map.png',
        width: 1280,
        height: 720,
        alt: 'Traffic Aids Map preview showing Hong Kong road signs and map annotations.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traffic Aids Map | Road Sign Factory',
    description:
      'Explore an interactive map of traffic aids in Hong Kong, including poles, traffic lights, signs, and vector tile data.',
    images: ['/images/preview-map.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function MapPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Traffic Aids Map',
    description:
      'Interactive Traffic Aids Map for Hong Kong. Includes vector tiles (MVT) and a manifest endpoint for integration with mapping clients.',
    url: 'https://roadsignfactory.hk/map',
    image: 'https://roadsignfactory.hk/images/preview-map.png',
    distribution: [
      {
        '@type': 'DataDownload',
        name: 'MVT Manifest',
        contentUrl: 'https://roadsignfactory.hk/api/mvt-manifest/route.js',
      },
    ],
    keywords: ['traffic aids map', 'vector tiles', 'MVT', 'Hong Kong', 'traffic lights', 'poles', 'signs'],
    provider: {
      '@type': 'Organization',
      name: 'Road Sign Factory',
      url: 'https://roadsignfactory.hk',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
        <h1
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          Traffic Aids Map
        </h1>
        <MapPageClient />
      </main>
    </>
  );
}
