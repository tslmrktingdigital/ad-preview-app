import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Atlantic Facilities LLC – Wilmington, NC",
  description:
    "Contact Atlantic Facilities LLC to reserve a storage unit in Wilmington, NC. Call (910) 617-5073 and ask for Clay to check availability.",
  alternates: { canonical: "https://atlanticfacilitiesllc.com/contact" },
  openGraph: {
    title: "Contact Atlantic Facilities LLC | Wilmington, NC Storage",
    description: "Call (910) 617-5073 to reserve a storage unit in central Wilmington, NC. Ask for Clay.",
    url: "https://atlanticfacilitiesllc.com/contact",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://atlanticfacilitiesllc.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://atlanticfacilitiesllc.com/contact" },
  ],
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: "https://atlanticfacilitiesllc.com/contact",
  name: "Contact Atlantic Facilities LLC",
  description: "Contact page for Atlantic Facilities LLC, a storage facility in central Wilmington, NC.",
  mainEntity: {
    "@type": "LocalBusiness",
    "@id": "https://atlanticfacilitiesllc.com/#organization",
    name: "Atlantic Facilities LLC",
    telephone: "+19106175073",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+19106175073",
      contactType: "customer service",
      areaServed: "US-NC",
      availableLanguage: "English",
      contactOption: "TollFree",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wilmington",
      addressRegion: "NC",
      addressCountry: "US",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-gray-100 px-4 py-2 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-900 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Atlantic Facilities LLC</h1>
          <p className="text-blue-200 text-lg">
            Ready to reserve a storage unit in Wilmington, NC? Give us a call — we&apos;ll get you set up fast.
          </p>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Phone */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">📞</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Call Us</h2>
              <p className="text-gray-600 text-sm mb-4">The fastest way to check availability and reserve your unit.</p>
              <a
                href="tel:+19106175073"
                className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors block"
              >
                (910) 617-5073
              </a>
              <p className="text-gray-500 text-sm mt-2">Ask for Clay</p>
              <a
                href="tel:+19106175073"
                className="mt-6 block bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Call Now
              </a>
            </div>

            {/* Location */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">📍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Our Location</h2>
              <p className="text-gray-600 text-sm mb-4">
                Centrally located for easy access from anywhere in the Wilmington area.
              </p>
              <address className="not-italic text-gray-800 font-medium">
                Central Wilmington<br />
                Wilmington, NC
              </address>
              <p className="text-gray-500 text-sm mt-4">
                Call us for the exact address and directions.
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Business Hours</h2>
            <div className="max-w-xs mx-auto space-y-2 text-sm">
              {[
                { day: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
                { day: "Saturday", hours: "By appointment" },
                { day: "Sunday", hours: "Closed" },
              ].map((row) => (
                <div key={row.day} className="flex justify-between text-gray-700">
                  <span className="font-medium">{row.day}</span>
                  <span>{row.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Units link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Not sure which unit size is right for you?</p>
            <Link
              href="/storage-units-wilmington-nc"
              className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              View All Unit Sizes &amp; Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
