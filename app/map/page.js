import MapPageClient from './MapPageClient';

export const metadata = {
  title: '香港交通標誌地圖 | Hong Kong Traffic Aids Map',
  description:
    '香港交通標誌及道路設施地圖，搜尋路牌、交通燈、標誌柱及其他設施。Explore Hong Kong traffic signs and road facilities with searchable layers and vector map data.',
  keywords: [
    '路牌地圖',
    '馬路標誌',
    '馬路標誌地圖',
    '香港路牌地圖',
    '香港交通標誌地圖',
    '道路標誌地圖',
    '交通標誌地圖',
    '交通設施地圖',
    '香港交通標誌',
    '香港道路標誌',
    '交通燈地圖',
    '交通標誌柱',
    '香港交通設施地圖',
    '香港路牌位置',
    'traffic aids map',
    'Hong Kong traffic aids map',
    'Hong Kong traffic sign map',
    'Hong Kong road sign map',
    'traffic signs map',
    'road facilities map',
    'traffic sign locations',
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
    title: '香港交通標誌地圖 | Hong Kong Traffic Aids Map',
    description:
      '香港交通標誌及道路設施地圖，搜尋路牌、交通燈、標誌柱及其他設施。Explore Hong Kong traffic signs and road facilities with searchable layers and vector map data.',
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
    title: '香港交通標誌地圖 | Hong Kong Traffic Aids Map',
    description:
      '香港交通標誌及道路設施地圖，搜尋路牌、交通燈、標誌柱及其他設施。Explore Hong Kong traffic signs and road facilities with searchable layers and vector map data.',
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
    name: '香港交通標誌地圖 | Hong Kong Traffic Aids Map',
    description:
      '香港交通標誌及道路設施地圖，搜尋路牌、交通燈、標誌柱及其他設施。Explore Hong Kong traffic signs and road facilities with searchable layers and vector map data in MVT vector tiles.',
    url: 'https://roadsignfactory.hk/map',
    image: 'https://roadsignfactory.hk/images/preview-map.png',
    distribution: [
      {
        '@type': 'DataDownload',
        name: 'MVT Manifest',
        contentUrl: 'https://roadsignfactory.hk/api/mvt-manifest/route.js',
      },
    ],
    keywords: [
      '路牌地圖',
      '馬路標誌',
      '馬路標誌地圖',
      '香港路牌地圖',
      '香港交通標誌地圖',
      '道路標誌地圖',
      '交通標誌地圖',
      '交通設施地圖',
      '香港交通標誌',
      '香港道路標誌',
      '交通燈地圖',
      '香港交通設施地圖',
      '香港路牌位置',
      'traffic aids map',
      'Hong Kong traffic aids map',
      'Hong Kong traffic sign map',
      'Hong Kong road sign map',
      'traffic signs map',
      'road facilities map',
      'traffic sign locations',
      'vector tiles',
      'MVT',
      'Hong Kong traffic signs',
    ],
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
          香港路牌及馬路標誌地圖
        </h1>
        <MapPageClient />
      </main>
    </>
  );
}
