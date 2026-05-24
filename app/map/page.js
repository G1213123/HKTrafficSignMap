'use client';

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useI18n } from '../components/I18nProvider';

function MapLoading() {
  const { t } = useI18n();
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {t('Loading Map...')}
    </div>
  );
}

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default function MapPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Traffic Aids Map',
    description:
      'Interactive Traffic Aids Map for Hong Kong. Includes vector tiles (MVT) and a manifest endpoint for integration with mapping clients.',
    url: 'https://roadsignfactory.hk/map',
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
      <Head>
        <title>Traffic Aids Map — Road Sign Factory</title>
        <meta name="description" content="Interactive Traffic Aids Map for Hong Kong — explore poles, traffic lights, and signs. Vector tiles (MVT) and manifest available for integration." />
        <meta name="keywords" content="traffic aids map, vector tiles, MVT, Hong Kong, traffic lights, poles, signs" />
        <meta property="og:title" content="Traffic Aids Map — Road Sign Factory" />
        <meta property="og:description" content="Explore an interactive map of traffic aids (poles, signs, traffic lights) for Hong Kong." />
        <meta property="og:url" content="https://roadsignfactory.hk/map" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Traffic Aids Map — Road Sign Factory" />
        <meta name="twitter:description" content="Explore an interactive map of traffic aids (poles, signs, traffic lights) for Hong Kong." />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Map />
      </div>
    </>
  );
}
