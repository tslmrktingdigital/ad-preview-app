import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-blue-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white font-bold mb-2">Atlantic Facilities LLC</h2>
          <p className="text-sm leading-relaxed">
            Clean, safe, and secure commercial storage in the heart of Wilmington, NC.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/storage-units-wilmington-nc" className="hover:text-white transition-colors">Storage Units</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Contact</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="tel:+19106175073" className="hover:text-white transition-colors">
                (910) 617-5073
              </a>
            </li>
            <li>Ask for Clay</li>
            <li className="mt-2">Wilmington, NC</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-900 text-center text-xs py-4 text-blue-400">
        &copy; {year} Atlantic Facilities LLC. All rights reserved.
      </div>
    </footer>
  );
}
