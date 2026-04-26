import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ILM Food Trucks — Wilmington, NC',
  description: 'Find food trucks near you in Wilmington, NC. Live locations, schedules, and menus sourced from social media.',
  keywords: ['food trucks', 'Wilmington NC', 'ILM', 'local food', 'street food'],
  openGraph: {
    title: 'ILM Food Trucks',
    description: 'Where are the food trucks in Wilmington today?',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e8722a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-stone-50 text-stone-900 min-h-screen">
        <header className="sticky top-0 z-50 bg-brand-500 text-white shadow-md">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-bold text-lg">
              🚚 ILM Food Trucks
            </a>
            <nav className="flex gap-4 text-sm font-medium">
              <a href="/" className="hover:text-brand-100 transition-colors">Today</a>
              <a href="/schedule" className="hover:text-brand-100 transition-colors">This Week</a>
              <a href="/trucks" className="hover:text-brand-100 transition-colors">All Trucks</a>
            </nav>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="text-center text-xs text-stone-400 py-8">
          Data sourced from food truck social media & websites · Updated every 4 hours
        </footer>
      </body>
    </html>
  );
}
