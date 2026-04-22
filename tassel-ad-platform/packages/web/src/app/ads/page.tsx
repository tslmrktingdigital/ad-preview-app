'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAds } from '../../hooks/use-ads';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

const FILTER_TABS = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Published', value: 'published' },
];

export default function AdsPage() {
  const [activeFilter, setActiveFilter] = useState('');
  const { data: ads, isLoading, error } = useAds(activeFilter || undefined);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and approve generated ad drafts</p>
        </div>
        <a
          href={`/api/ads/export.xlsx${activeFilter ? `?status=${activeFilter}` : ''}`}
          download
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Excel
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === tab.value
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Failed to load ads: {(error as Error).message}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && ads?.length === 0 && (
        <EmptyState
          title={activeFilter ? `No ${activeFilter.replace('_', ' ')} ads` : 'No ads yet'}
          description={
            activeFilter
              ? `There are no ads with status "${activeFilter.replace('_', ' ')}" right now.`
              : 'Generate ads from a campaign to start the review process.'
          }
        />
      )}

      {/* Table */}
      {!isLoading && !error && ads && ads.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Headline</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Client / Campaign</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Created</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ads.map((ad: any) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {ad.headline ?? 'Untitled'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{ad.campaign?.client?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ad.campaign?.name ?? '—'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ad.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/ads/${ad.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      Review
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
