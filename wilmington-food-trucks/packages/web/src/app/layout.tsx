import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ILM Food Trucks — Wilmington, NC',
  description: 'Find food trucks near you in Wilmington, NC. Live locations, schedules, and menus sourced from social media.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-stone-100 font-sans pb-20">

        {/* Top bar — logo only */}
        <header className="bg-orange-600 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center">
            <span className="text-xl mr-2">🚚</span>
            <span className="font-bold text-lg tracking-tight">ILM Food Trucks</span>
            <span className="ml-2 text-xs text-orange-300 font-medium">Wilmington, NC</span>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-lg mx-auto px-4 py-5">
          {children}
        </main>

        {/* Bottom nav — thumb-friendly on mobile */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-lg">
          <div className="max-w-lg mx-auto flex">
            <a href="/" className="flex-1 flex flex-col items-center gap-1 py-3 text-orange-600 hover:bg-orange-50 transition-colors">
              <span className="text-xl">📍</span>
              <span className="text-xs font-semibold">Today</span>
            </a>
            <a href="/schedule" className="flex-1 flex flex-col items-center gap-1 py-3 text-stone-400 hover:bg-stone-50 transition-colors">
              <span className="text-xl">📅</span>
              <span className="text-xs font-semibold">This Week</span>
            </a>
            <a href="/trucks" className="flex-1 flex flex-col items-center gap-1 py-3 text-stone-400 hover:bg-stone-50 transition-colors">
              <span className="text-xl">🚚</span>
              <span className="text-xs font-semibold">All Trucks</span>
            </a>
            <a href="/admin" className="flex-1 flex flex-col items-center gap-1 py-3 text-stone-400 hover:bg-stone-50 transition-colors">
              <span className="text-xl">➕</span>
              <span className="text-xs font-semibold">Add Truck</span>
            </a>
          </div>
        </nav>

      </body>
    </html>
  );
}
