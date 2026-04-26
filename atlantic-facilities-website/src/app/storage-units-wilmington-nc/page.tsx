import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Storage Units Wilmington NC | Sizes & Pricing",
  description:
    "Browse storage unit sizes and pricing at Atlantic Facilities LLC in Wilmington, NC. Units from 300 sq ft ($225/mo) to 1,200 sq ft commercial warehouse space. Secure, clean, central location.",
  alternates: {
    canonical: "https://atlanticfacilitiesllc.com/storage-units-wilmington-nc",
  },
  openGraph: {
    title: "Storage Units Wilmington NC | Atlantic Facilities LLC",
    description:
      "Secure, clean commercial storage units in central Wilmington, NC. Sizes from 300–1,200 sq ft.",
    url: "https://atlanticfacilitiesllc.com/storage-units-wilmington-nc",
  },
};

const storageListingSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Storage Units at Atlantic Facilities LLC – Wilmington, NC",
  description:
    "Complete list of available storage unit sizes and pricing at Atlantic Facilities LLC in Wilmington, NC.",
  url: "https://atlanticfacilitiesllc.com/storage-units-wilmington-nc",
  numberOfItems: 4,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "300 sq ft Storage Unit (15x20)",
        description:
          "Secured 300 square foot storage unit measuring 15 feet by 20 feet. Ideal for small business inventory, personal overflow, or seasonal storage. Located in central Wilmington, NC.",
        offers: {
          "@type": "Offer",
          price: "225",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "225",
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Atlantic Facilities LLC",
          },
        },
        brand: { "@type": "Brand", name: "Atlantic Facilities LLC" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "500 sq ft Storage Unit (20x25)",
        description:
          "Secured 500 square foot storage unit measuring 20 feet by 25 feet. Great for mid-size business stock, equipment, or furniture.",
        offers: {
          "@type": "Offer",
          price: "350",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "350",
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Atlantic Facilities LLC",
          },
        },
        brand: { "@type": "Brand", name: "Atlantic Facilities LLC" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Product",
        name: "600 sq ft Storage Unit (20x30)",
        description:
          "Secured 600 square foot storage unit measuring 20 feet by 30 feet. Perfect for larger inventories, vehicles, or commercial supplies.",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Atlantic Facilities LLC",
          },
        },
        brand: { "@type": "Brand", name: "Atlantic Facilities LLC" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Product",
        name: "1,200 sq ft Warehouse Storage Unit (20x60)",
        description:
          "Secured 1,200 square foot commercial warehouse storage unit measuring 20 feet by 60 feet. Full warehouse space for commercial operations and bulk storage in Wilmington, NC.",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Atlantic Facilities LLC",
          },
        },
        brand: { "@type": "Brand", name: "Atlantic Facilities LLC" },
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://atlanticfacilitiesllc.com" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Storage Units Wilmington NC",
      item: "https://atlanticfacilitiesllc.com/storage-units-wilmington-nc",
    },
  ],
};

const units = [
  {
    size: "300 sq ft",
    dimensions: "15' × 20'",
    price: "$225/mo",
    highlight: true,
    tag: "BEST VALUE",
    tagColor: "bg-amber-400",
    uses: ["Small business inventory", "Seasonal items", "Personal overflow", "Office furniture"],
    note: "Fall Special: $225/month for secured 300 sq ft unit.",
  },
  {
    size: "500 sq ft",
    dimensions: "20' × 25'",
    price: "$350/mo",
    highlight: false,
    tag: null,
    uses: ["Mid-size business stock", "Equipment storage", "Large furniture sets", "Archive files"],
    note: null,
  },
  {
    size: "600 sq ft",
    dimensions: "20' × 30'",
    price: "Call for Pricing",
    highlight: false,
    tag: null,
    uses: ["Large inventories", "Vehicles & trailers", "Commercial supplies", "Multiple business units"],
    note: null,
  },
  {
    size: "1,200 sq ft",
    dimensions: "20' × 60'",
    price: "Call for Pricing",
    highlight: false,
    tag: "WAREHOUSE",
    tagColor: "bg-blue-700",
    uses: ["Full commercial operations", "Bulk storage", "Distribution staging", "Fleet vehicle storage"],
    note: "Our largest unit — ideal for full business use.",
  },
];

export default function StorageUnitsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storageListingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-gray-100 px-4 py-2 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Storage Units Wilmington NC</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Storage Units in Wilmington, NC
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Choose from four unit sizes — all clean, secure, and centrally located.
            Starting at $225/month. Call to reserve yours today.
          </p>
        </div>
      </section>

      {/* Units grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {units.map((unit) => (
              <article
                key={unit.size}
                className={`rounded-2xl border-2 p-8 shadow-sm ${
                  unit.highlight ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{unit.size}</h2>
                    <p className="text-gray-500">{unit.dimensions}</p>
                  </div>
                  {unit.tag && (
                    <span className={`${unit.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {unit.tag}
                    </span>
                  )}
                </div>

                <div className="text-2xl font-bold text-blue-800 mb-4">{unit.price}</div>

                {unit.note && (
                  <p className="text-sm bg-amber-100 text-amber-800 rounded-lg px-3 py-2 mb-4">
                    {unit.note}
                  </p>
                )}

                <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                  Perfect for:
                </h3>
                <ul className="space-y-1">
                  {unit.uses.map((use) => (
                    <li key={use} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414 4.293 9.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {use}
                    </li>
                  ))}
                </ul>

                <a
                  href="tel:+19106175073"
                  className="mt-6 block w-full text-center bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Call to Reserve — (910) 617-5073
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What Makes Our Wilmington Storage Facility Different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { title: "Security First", body: "Gated, monitored facility in a safe central Wilmington location." },
              { title: "Always Clean", body: "Regular cleaning and maintenance so your items stay in pristine condition." },
              { title: "Personal Service", body: "Talk directly to Clay — no call center, just real local service." },
            ].map((item) => (
              <div key={item.title} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-blue-200 mb-6">Call us and ask for Clay to check availability and reserve your unit.</p>
        <a
          href="tel:+19106175073"
          className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-10 py-4 rounded-lg text-xl transition-colors inline-block"
        >
          (910) 617-5073
        </a>
      </section>
    </>
  );
}
