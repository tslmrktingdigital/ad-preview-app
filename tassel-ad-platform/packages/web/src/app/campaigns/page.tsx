'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCampaigns, useTriggerGenerate } from '../../hooks/use-campaigns';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

function GenerateButton({ campaignId }: { campaignId: string }) {
  const generate = useTriggerGenerate(campaignId);
  return (
    <button
      onClick={() => generate.mutate()}
      disabled={generate.isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-60"
    >
      {generate.isPending ? (
        <>
          <Spinner size="sm" />
          Generating…
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Ads
        </>
      )}
    </button>
  );
}

export default function CampaignsPage() {
  const { data: campaigns, isLoading, error } = useCampaigns();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage ad campaigns for your school clients</p>
        </div>
        <Link
          href="/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Campaign
        </Link>
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
          Failed to load campaigns: {(error as Error).message}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && campaigns?.length === 0 && (
        <EmptyState
          title="No campaigns yet"
          description="Create your first campaign to start generating ads."
          action={
            <Link
              href="/campaigns/new"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              New Campaign
            </Link>
          }
        />
      )}

      {/* Table */}
      {!isLoading && !error && campaigns && campaigns.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Campaign</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Client</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Goal</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Ads</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Created</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((campaign: any) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {campaign.client?.name ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={campaign.goal} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {campaign._count?.adDrafts ?? 0}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {campaign.createdAt
                      ? new Date(campaign.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <GenerateButton campaignId={campaign.id} />
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
