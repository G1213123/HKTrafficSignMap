import SignIndexContent from './SignIndexContent';

export const metadata = {
  title: 'Traffic Sign & Road Marking Index Plan (CT174/51) - Road Sign Factory',
  description: 'Browse the comprehensive index plan for Hong Kong traffic signs and road markings, including CT174/51 and TPDM standards. Explore the full catalog of street signs.',
  keywords: 'traffic signs, road markings, index plan, CT174/51, traffic sign index, road marking index, Hong Kong traffic signs, TPDM standards, traffic sign catalog, CT174/52, CT174/53, CT174/54, CT174/55, CT174/56, CT174/57, CT174/58, CT174/59, CT174/60, CT174/61, CT174/62, CT174/63, CT174/64, CT174/65, CT174/66, CT174/67, CT174/68, CT174/69, CT174/70',
  alternates: {
    canonical: '/sign-index',
  },
  openGraph: {
    title: 'Traffic Sign & Road Marking Index Plan | Road Sign Factory',
    description: 'Browse the comprehensive index plan for Hong Kong traffic signs and road markings, including CT174/51 and TPDM standards.',
    url: '/sign-index',
    siteName: 'Road Sign Factory',
    type: 'website',
    images: [
      {
        url: '/images/preview-sign-index.png',
        width: 1280,
        height: 720,
        alt: 'Preview of the traffic sign and road marking index plan.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traffic Sign & Road Marking Index Plan | Road Sign Factory',
    description: 'Browse the comprehensive index plan for Hong Kong traffic signs and road markings, including CT174/51 and TPDM standards.',
    images: ['/images/preview-sign-index.png'],
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

export default function SignIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Traffic Sign & Road Marking Index Plan',
    description:
      'Browse the comprehensive index plan for Hong Kong traffic signs and road markings, including CT174/51 and TPDM standards.',
    url: 'https://roadsignfactory.hk/sign-index',
    image: 'https://roadsignfactory.hk/images/preview-sign-index.png',
    keywords: [
      'traffic signs',
      'road markings',
      'index plan',
      'CT174/51',
      'Hong Kong traffic signs',
      'TPDM standards',
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
      <SignIndexContent />
    </>
  );
}
