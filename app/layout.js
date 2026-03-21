import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./homepage.css";
import ScrollAnimation from "./components/ScrollAnimation";
import { I18nProvider } from "./components/I18nProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#222222",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://roadsignfactory.hk"),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "Road Sign Factory - Professional Traffic Sign Designer",
    template: "%s | Road Sign Factory",
  },
  description:
    "Professional online traffic sign designer and creator. Design custom road signs with Hong Kong TPDM standards. Export to SVG, DXF, and PDF formats.",
  keywords: [
    "road sign creator",
    "traffic sign designer",
    "Hong Kong TPDM",
    "online sign maker",
    "professional sign design",
    "vector sign export",
    "SVG DXF PDF",
  ],
  authors: [{ name: "Road Sign Factory" }],
  applicationName: "Road Sign Factory",
  appleWebApp: {
    title: "Road Sign Factory",
  },
  manifest: "/images/site.webmanifest",
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Road Sign Factory - Professional Traffic Sign Designer",
    description:
      "Create professional traffic signs online with our advanced design tool. Based on Hong Kong TPDM standards.",
    url: "https://roadsignfactory.hk/",
    siteName: "Road Sign Factory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-preview.png",
        width: 1200,
        height: 630,
        alt: "Road Sign Factory – Design professional traffic signs online.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Road Sign Factory - Professional Traffic Sign Designer",
    description:
      "Create professional traffic signs online with our advanced design tool.",
    images: ["/images/hero-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-adsense-account": process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID,
    "msapplication-TileColor": "#222222",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Road Sign Factory",
    description:
      "Professional online directional sign designer and creator based on Hong Kong TPDM standards",
    url: "https://roadsignfactory.hk/",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Road Sign Factory",
    },
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1W8GWKLVSK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1W8GWKLVSK');
          `}
        </Script>
        {/* Google ads */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
            process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID || ""
          }`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased font-sans`}>
        <I18nProvider>
          <ScrollAnimation />
          <Script src="https://cdn.jsdelivr.net/npm/fabric@6.4.3/dist/index.js"></Script>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
