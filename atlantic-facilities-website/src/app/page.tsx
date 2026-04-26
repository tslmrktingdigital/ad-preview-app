import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Storage Units in Wilmington, NC | Atlantic Facilities LLC",
  description:
    "Atlantic Facilities LLC offers clean, safe, and secure commercial storage units in central Wilmington, NC. Sizes from 300 to 1,200 sq ft. Starting at $225/mo.",
  alternates: { canonical: "https://atlanticfacilitiesllc.com" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What storage unit sizes does Atlantic Facilities offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Atlantic Facilities offers four unit sizes: 300 sq ft (15×20), 500 sq ft (20×25), 600 sq ft (20×30), and 1,200 sq ft (20×60) commercial warehouse units.",
      },
    },
    {
      "@type": "Question",
      name: "How much does storage cost at Atlantic Facilities in Wilmington, NC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our 300 sq ft units start at $225/month and 500 sq ft units start at $350/month. Contact us for pricing on larger units.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Atlantic Facilities located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Atlantic Facilities is located in central Wilmington, North Carolina. Call (910) 617-5073 for the exact address and directions.",
      },
    },
    {
      "@type": "Question",
      name: "How do I rent a storage unit at Atlantic Facilities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Call us at (910) 617-5073 and ask for Clay to check availability and reserve your unit.",
      },
    },
  ],
};

const units = [
  {
    size: "300 sq ft",
    dimensions: "15' × 20'",
    price: "$225/mo",
    highlight: true,
    best: "Ideal for small business inventory, personal overflow, or seasonal storage.",
  },
  {
    size: "500 sq ft",
    dimensions: "20' × 25'",
    price: "$350/mo",
    highlight: false,
    best: "Great for mid-size business stock, equipment, or furniture.",
  },
  {
    size: "600 sq ft",
    dimensions: "20' × 30'",
    price: "Call for pricing",
    highlight: false,
    best: "Perfect for larger inventories, vehicles, or commercial supplies.",
  },
  {
    size: "1,200 sq ft",
    dimensions: "20' × 60'",
    price: "Call for pricing",
    highlight: false,
    best: "Full warehouse space for commercial operations and bulk storage.",
  },
];

const features = [
  { icon: "🔒", title: "Secure Facilities", desc: "Gated access and on-site security keep your belongings protected 24/7." },
  { icon: "✨", title: "Clean & Well-Maintained", desc: "Units are cleaned and inspected regularly so your items stay in top condition." },
  { icon: "📍", title: "Central Wilmington Location", desc: "Conveniently located in the heart of Wilmington for easy access any time." },
  { icon: "🏢", title: "Commercial-Ready", desc: "Units sized for business use — from small offices to full warehouse operations." },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Secure Storage Units in<br className="hidden md:block" /> Wilmington, NC
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Clean, safe, and affordable commercial storage in the heart of Wilmington.
            Units from 300 to 1,200 sq ft — starting at just $225/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+19106175073"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-lg text-lg transition-colors"
            >
              Call (910) 617-5073
            </a>
            <Link
              href="/storage-units-wilmington-nc"
              className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold px-8 py-3 rounded-lg text-lg transition-colors"
            >
              View All Units
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Why Choose Atlantic Facilities?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Units preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Storage Unit Sizes &amp; Pricing
          </h2>
          <p className="text-center text-gray-600 mb-10">
            All units are secured, clean, and available now. Call to confirm availability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {units.map((unit) => (
              <div
                key={unit.size}
                className={`rounded-xl p-6 border-2 ${
                  unit.highlight
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 bg-white"
                } shadow-sm`}
              >
                {unit.highlight && (
                  <span className="inline-block bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded mb-2">
                    BEST VALUE
                  </span>
                )}
                <div className="text-2xl font-bold text-gray-900">{unit.size}</div>
                <div className="text-gray-500 text-sm mb-3">{unit.dimensions}</div>
                <div className="text-blue-800 font-semibold text-lg mb-3">{unit.price}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{unit.best}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/storage-units-wilmington-nc"
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-lg transition-colors inline-block"
            >
              See Full Unit Details
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-3xl font-bold text-center text-gray-900 mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq) => (
              <details
                key={faq.name}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {faq.name}
                  <span className="text-blue-700 ml-4 flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Reserve Your Unit?</h2>
        <p className="text-blue-200 mb-8 max-w-xl mx-auto">
          Call us today to check availability and secure your storage space in Wilmington, NC.
          Ask for Clay.
        </p>
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
