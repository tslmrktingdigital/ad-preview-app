import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tassel Ad Platform</h1>
      <p className="text-gray-500 mb-8">Internal tool for Tassel Marketing</p>
      <nav className="flex gap-4">
        <Link href="/clients" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Clients
        </Link>
        <Link href="/campaigns" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Campaigns
        </Link>
        <Link href="/ads" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Ad Queue
        </Link>
      </nav>
    </main>
  );
}
