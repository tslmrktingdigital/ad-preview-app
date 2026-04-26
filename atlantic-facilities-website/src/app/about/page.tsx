import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Atlantic Facilities LLC – Wilmington, NC Storage",
  description:
    "Atlantic Facilities LLC is a locally owned commercial storage facility in central Wilmington, NC. Learn about our commitment to clean, safe, and secure storage.",
  alternates: { canonical: "https://atlanticfacilitiesllc.com/about" },
  openGraph: {
    title: "About Atlantic Facilities LLC | Wilmington, NC",
    description: "Locally owned commercial storage in central Wilmington, NC. Clean, safe, and secure units from 300 to 1,200 sq ft.",
    url: "https://atlanticfacilitiesllc.com/about",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://atlanticfacilitiesllc.com" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://atlanticfacilitiesllc.com/about" },
  ],
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://atlanticfacilitiesllc.com/about",
  name: "About Atlantic Facilities LLC",
  description:
    "Atlantic Facilities LLC is a locally owned commercial storage company based in central Wilmington, NC, offering clean, secure, and affordable storage solutions for businesses and individuals.",
  mainEntity: {
    "@type": "LocalBusiness",
    "@id": "https://atlanticfacilitiesllc.com/#organization",
    name: "Atlantic Facilities LLC",
    foundingLocation: {
      "@type": "City",
      name: "Wilmington",
      containedInPlace: { "@type": "State", name: "North Carolina" },
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-gray-100 px-4 py-2 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">About</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-900 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About Atlantic Facilities LLC</h1>
          <p className="text-blue-200 text-lg">
            A locally owned storage facility committed to clean, safe, and secure storage in Wilmington, NC.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg prose-blue">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Atlantic Facilities LLC (also known as Atlantic Storage Facilities) is a locally owned and operated
            commercial storage facility located in central Wilmington, North Carolina. We provide clean, safe,
            and secure storage solutions for both individuals and businesses throughout the Wilmington area.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We believe storage should be simple, affordable, and stress-free. Every unit at Atlantic Facilities
            is well-maintained, secure, and ready when you need it. We pride ourselves on personal service —
            when you call, you speak directly with someone who can help, not a call center.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Location</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Centrally located in Wilmington, NC, our facility is easy to reach from anywhere in the greater
            Wilmington area. Whether you&apos;re a local business needing warehouse space or a resident who
            needs extra room, we&apos;re conveniently close.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Get in Touch</h3>
            <p className="text-blue-800 mb-4">
              Ready to learn more or reserve a unit? Call us and ask for Clay.
            </p>
            <a
              href="tel:+19106175073"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              (910) 617-5073
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
