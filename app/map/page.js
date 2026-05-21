'use client';

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
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Map />
    </div>
  );
}
