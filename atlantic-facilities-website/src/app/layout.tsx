import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = "https://atlanticfacilitiesllc.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Atlantic Facilities LLC | Storage Units in Wilmington, NC",
    template: "%s | Atlantic Facilities LLC",
  },
  description:
    "Clean, safe, and secure commercial storage units in central Wilmington, NC. Units from 300–1,200 sq ft. Call (910) 617-5073 for availability.",
  keywords: [
    "storage units Wilmington NC",
    "commercial storage Wilmington",
    "warehouse storage Wilmington NC",
    "self storage Wilmington",
    "secure storage units NC",
    "Atlantic Facilities LLC",
  ],
  authors: [{ name: "Atlantic Facilities LLC" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Atlantic Facilities LLC",
    title: "Atlantic Facilities LLC | Storage Units in Wilmington, NC",
    description:
      "Clean, safe, and secure commercial storage units in central Wilmington, NC. Units from 300–1,200 sq ft.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Atlantic Facilities LLC – Storage Units in Wilmington, NC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlantic Facilities LLC | Storage Units in Wilmington, NC",
    description:
      "Clean, safe, and secure commercial storage units in central Wilmington, NC.",
    images: ["/og-image.jpg"],
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
  alternates: {
    canonical: BASE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "SelfStorage"],
  "@id": `${BASE_URL}/#organization`,
  name: "Atlantic Facilities LLC",
  alternateName: "Atlantic Storage Facilities",
  url: BASE_URL,
  telephone: "+19106175073",
  description:
    "Clean, safe, and secure commercial storage units in central Wilmington, NC. Offering units from 300 to 1,200 square feet for personal and commercial use.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Wilmington",
    addressRegion: "NC",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    addressCountry: "US",
    addressRegion: "NC",
    addressLocality: "Wilmington",
  },
  areaServed: {
    "@type": "City",
    name: "Wilmington",
    sameAs: "https://en.wikipedia.org/wiki/Wilmington,_North_Carolina",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Storage Unit Options",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "300 sq ft Storage Unit (15x20)",
          description: "Secured 300 square foot storage unit, 15 feet by 20 feet",
        },
        price: "225",
        priceCurrency: "USD",
        unitText: "per month",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "500 sq ft Storage Unit (20x25)",
          description: "Secured 500 square foot storage unit, 20 feet by 25 feet",
        },
        price: "350",
        priceCurrency: "USD",
        unitText: "per month",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "600 sq ft Storage Unit (20x30)",
          description: "Secured 600 square foot storage unit, 20 feet by 30 feet",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "1,200 sq ft Storage Unit (20x60)",
          description: "Secured 1,200 square foot commercial warehouse storage unit, 20 feet by 60 feet",
        },
      },
    ],
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
