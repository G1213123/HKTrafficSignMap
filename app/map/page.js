import MapPageClient from './MapPageClient';

export const metadata = {
  title: 'Traffic Aids Map',
  description:
    '香港路牌及馬路標誌地圖，查閱交通標誌、道路標誌、交通燈、標誌柱及其他交通設施位置。支援搜尋、圖層及向量地圖資料。',
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
    title: '香港路牌及馬路標誌地圖 | Road Sign Factory',
    description:
      '探索香港路牌及馬路標誌地圖，查閱交通標誌、交通燈、標誌柱和其他交通設施。',
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
    title: '香港路牌及馬路標誌地圖 | Road Sign Factory',
    description:
      '探索香港路牌及馬路標誌地圖，查閱交通標誌、交通燈、標誌柱和其他交通設施。',
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
      '香港路牌及馬路標誌地圖，展示交通標誌、道路標誌、交通燈、標誌柱及其他交通設施，並提供向量圖磚（MVT）資料。',
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
      'traffic aids map',
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
