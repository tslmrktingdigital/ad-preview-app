'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCampaign, useTriggerGenerate, useGenerateStatus, useCampaignAds, useShareCampaignPreview } from '../../../hooks/use-campaigns';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ShareLinkButton } from '../../../components/ui/ShareLinkButton';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [generating, setGenerating] = useState(false);

  const { data: campaign, isLoading, error } = useCampaign(campaignId);
  const triggerGenerate = useTriggerGenerate(campaignId);
  const generateStatus = useGenerateStatus(campaignId, generating);
  const { data: ads, isLoading: adsLoading } = useCampaignAds(campaignId);
  const shareCampaign = useShareCampaignPreview(campaignId);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await triggerGenerate.mutateAsync();
    } catch {
      setGenerating(false);
    }
  }

  // Stop polling when done
  const genStatus = generateStatus.data?.status;
  if (generating && genStatus && genStatus !== 'active' && genStatus !== 'waiting') {
    setGenerating(false);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Failed to load campaign: {(error as Error)?.message ?? 'Not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back link */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Campaigns
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          {campaign.client && (
            <Link
              href={`/clients/${campaign.client.id}`}
              className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block transition-colors"
            >
              {campaign.client.name}
            </Link>
          )}
          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3">
            <StatusBadge status={campaign.goal} />
            {campaign.season && <StatusBadge status={campaign.season} />}
            <span className="text-xs text-gray-400">
              Created {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/campaigns/${campaignId}/export.xlsx`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Excel
          </a>
          {ads && ads.length > 0 && (
            <ShareLinkButton
              label="Share All Variants"
              onGenerate={async () => {
                const result = await shareCampaign.mutateAsync();
                return result.url;
              }}
            />
          )}
          <button
            onClick={handleGenerate}
            disabled={triggerGenerate.isPending || generating}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
          >
            {(triggerGenerate.isPending || generating) ? (
              <>
                <Spinner size="sm" />
                Generating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Ads
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation progress */}
      {generating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Spinner size="md" />
            <p className="text-sm font-medium text-gray-900">Claude is writing your ads…</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full animate-pulse w-2/3" />
          </div>
          {generateStatus.data?.progress && (
            <p className="text-xs text-gray-500 mt-2">{generateStatus.data.progress}</p>
          )}
        </div>
      )}

      {/* Ad drafts */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Ad Drafts</h2>

        {adsLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {!adsLoading && (!ads || ads.length === 0) && (
          <EmptyState
            title="No ads generated yet"
            description="Click Generate Ads to have Claude write ad copy based on this campaign brief."
            action={
              <button
                onClick={handleGenerate}
                disabled={triggerGenerate.isPending || generating}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
              >
                {(triggerGenerate.isPending || generating) && <Spinner size="sm" />}
                Generate Ads
              </button>
            }
          />
        )}

        {ads && ads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ads.map((ad: any) => (
              <div
                key={ad.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {ad.headline ?? 'Untitled Ad'}
                  </p>
                  <StatusBadge status={ad.status} />
                </div>
                {ad.primaryText && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {ad.primaryText}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <Link
                    href={`/ads/${ad.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Review
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
