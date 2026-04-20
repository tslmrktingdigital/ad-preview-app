'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useClients, useCreateClient, useTriggerScan } from '../../hooks/use-clients';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

function AddClientForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const createClient = useCreateClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !websiteUrl.trim()) return;
    try {
      await createClient.mutateAsync({ name: name.trim(), websiteUrl: websiteUrl.trim() });
      onClose();
    } catch (err) {
      // error surfaced via createClient.error
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Add New Client</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Eastern Christian School"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.edu"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        {createClient.error && (
          <p className="text-sm text-red-600">{(createClient.error as Error).message}</p>
        )}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={createClient.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
          >
            {createClient.isPending && <Spinner size="sm" />}
            {createClient.isPending ? 'Saving…' : 'Add Client'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ScanButton({ clientId }: { clientId: string }) {
  const scan = useTriggerScan(clientId);
  return (
    <button
      onClick={() => scan.mutate()}
      disabled={scan.isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-60"
    >
      {scan.isPending ? (
        <>
          <Spinner size="sm" />
          Scanning…
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Scan Site
        </>
      )}
    </button>
  );
}

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: clients, isLoading, error } = useClients();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage school clients and their profiles</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Client
          </button>
        )}
      </div>

      {/* Add client form */}
      {showForm && <AddClientForm onClose={() => setShowForm(false)} />}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Failed to load clients: {(error as Error).message}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && clients?.length === 0 && (
        <EmptyState
          title="No clients yet"
          description="Add your first school client to get started generating ads."
          action={
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add Client
            </button>
          }
        />
      )}

      {/* Table */}
      {!isLoading && !error && clients && clients.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">School Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Website</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Profile Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Campaigns</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={client.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-indigo-600 transition-colors truncate max-w-[200px] block"
                    >
                      {client.websiteUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={client.schoolProfile?.scanStatus ?? 'not scanned'} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {client._count?.campaigns ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <ScanButton clientId={client.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
