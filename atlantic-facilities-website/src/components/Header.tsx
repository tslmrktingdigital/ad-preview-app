"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/storage-units-wilmington-nc", label: "Storage Units" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-tight">Atlantic Facilities LLC</span>
          <span className="text-blue-300 text-sm">Storage Units · Wilmington, NC</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-blue-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+19106175073"
            className="ml-4 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors"
          >
            (910) 617-5073
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile navigation" className="md:hidden bg-blue-800 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium hover:text-blue-300"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+19106175073"
            className="block mt-2 bg-amber-500 text-white font-semibold px-4 py-2 rounded-md text-sm text-center"
          >
            Call (910) 617-5073
          </a>
        </nav>
      )}
    </header>
  );
}
