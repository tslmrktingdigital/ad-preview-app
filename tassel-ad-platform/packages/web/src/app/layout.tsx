import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/providers';
import { NavLinks } from '../components/NavLinks';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tassel Ad Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-gray-900 flex flex-col">
              {/* Logo */}
              <div className="px-6 py-6 border-b border-gray-800">
                <p className="text-white text-xl font-bold tracking-tight">Tassel</p>
                <p className="text-gray-400 text-xs mt-0.5">Ad Platform</p>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                <NavLinks />
              </nav>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-800">
                <p className="text-gray-500 text-xs">v0.1.0</p>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
