'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAd, useUpdateAd, useApproveAd, useRejectAd, usePublishAd, useSharePreview } from '../../../hooks/use-ads';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Spinner } from '../../../components/ui/Spinner';
import { ShareLinkButton } from '../../../components/ui/ShareLinkButton';
import { FacebookFeedPreview } from '../../../components/previews/FacebookFeedPreview';
import { InstagramFeedPreview } from '../../../components/previews/InstagramFeedPreview';
import { InstagramStoriesPreview } from '../../../components/previews/InstagramStoriesPreview';

const CTA_OPTIONS = [
  { value: 'LEARN_MORE', label: 'Learn More' },
  { value: 'APPLY_NOW', label: 'Apply Now' },
  { value: 'SIGN_UP', label: 'Sign Up' },
  { value: 'CONTACT_US', label: 'Contact Us' },
  { value: 'GET_DIRECTIONS', label: 'Get Directions' },
  { value: 'BOOK_TRAVEL', label: 'Book Now' },
];

type PreviewTab = 'facebook' | 'instagram_feed' | 'instagram_stories';

export default function AdDetailPage() {
  const params = useParams();
  const adId = params.id as string;

  const { data: ad, isLoading, error } = useAd(adId);
  const updateAd = useUpdateAd(adId);
  const approveAd = useApproveAd(adId);
  const rejectAd = useRejectAd(adId);
  const publishAd = usePublishAd(adId);
  const sharePreview = useSharePreview(adId);

  // Local editable state
  const [primaryText, setPrimaryText] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [cta, setCta] = useState('LEARN_MORE');
  const [previewTab, setPreviewTab] = useState<PreviewTab>('facebook');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hydrate local state when ad loads
  useEffect(() => {
    if (ad) {
      setPrimaryText(ad.primaryText ?? '');
      setHeadline(ad.headline ?? '');
      setDescription(ad.description ?? '');
      setCta(ad.cta ?? 'LEARN_MORE');
    }
  }, [ad?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const clientName = ad?.campaign?.client?.name ?? 'Eastern Christian School';

  async function handleSave() {
    await updateAd.mutateAsync({ primaryText, headline, description, cta });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  async function handleApprove() {
    await approveAd.mutateAsync();
    setShowRejectInput(false);
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    await rejectAd.mutateAsync(rejectReason.trim());
    setShowRejectInput(false);
    setRejectReason('');
  }

  async function handlePublish() {
    await publishAd.mutateAsync();
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Failed to load ad: {(error as Error)?.message ?? 'Not found'}
        </div>
      </div>
    );
  }

  const previewAd = { primaryText, headline, description, cta, imageBrief: ad.imageBrief, hashtags: ad.hashtags };

  return (
    <div className="flex flex-col h-full">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ── */}
        <div className="w-[420px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Back + breadcrumb */}
            <div>
              <Link
                href="/ads"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Ad Queue
              </Link>
              <div className="flex items-center gap-2 flex-wrap">
                {ad.campaign?.client && (
                  <span className="text-xs text-gray-500">{ad.campaign.client.name}</span>
                )}
                {ad.campaign?.client && ad.campaign && (
                  <span className="text-xs text-gray-300">/</span>
                )}
                {ad.campaign && (
                  <span className="text-xs text-gray-500">{ad.campaign.name}</span>
                )}
              </div>
              <div className="mt-2">
                <StatusBadge status={ad.status} />
              </div>
            </div>

            {/* Editable fields */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Ad Copy</h2>

              {/* Primary Text */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Primary Text</label>
                <textarea
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* CTA */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Call to Action</label>
                <select
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {CTA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Save button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={updateAd.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
                >
                  {updateAd.isPending && <Spinner size="sm" />}
                  Save Changes
                </button>
                {saveSuccess && (
                  <span className="text-xs text-green-600 font-medium">Saved!</span>
                )}
              </div>
            </div>

            {/* Image Brief */}
            {ad.imageBrief && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Image Brief</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 leading-relaxed">
                  {ad.imageBrief}
                </div>
              </div>
            )}

            {/* Targeting */}
            {ad.targetingParams && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Targeting</h2>
                <div className="space-y-1.5">
                  {ad.targetingParams.ageMin && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-24">Age Range:</span>
                      <span className="text-gray-900">
                        {ad.targetingParams.ageMin}–{ad.targetingParams.ageMax ?? '65+'}
                      </span>
                    </div>
                  )}
                  {ad.targetingParams.radius && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-24">Radius:</span>
                      <span className="text-gray-900">{ad.targetingParams.radius} miles</span>
                    </div>
                  )}
                  {ad.targetingParams.interests && ad.targetingParams.interests.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 w-24">Interests:</span>
                      <span className="text-gray-900">{ad.targetingParams.interests.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hashtags */}
            {ad.hashtags && ad.hashtags.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Hashtags</h2>
                <div className="flex flex-wrap gap-1.5">
                  {ad.hashtags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Internal notes */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Internal Notes</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-400 italic">
                Internal notes — coming soon
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Live Preview ── */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            {/* Preview tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1 w-fit">
              {(
                [
                  { key: 'facebook', label: 'Facebook Feed' },
                  { key: 'instagram_feed', label: 'Instagram Feed' },
                  { key: 'instagram_stories', label: 'Instagram Stories' },
                ] as { key: PreviewTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPreviewTab(tab.key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    previewTab === tab.key
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Preview component */}
            <div className="flex justify-center">
              {previewTab === 'facebook' && (
                <FacebookFeedPreview
                  ad={previewAd}
                  pageName={clientName}
                  imageUrl={ad.imageUrl}
                />
              )}
              {previewTab === 'instagram_feed' && (
                <InstagramFeedPreview
                  ad={previewAd}
                  pageName={clientName}
                  imageUrl={ad.imageUrl}
                />
              )}
              {previewTab === 'instagram_stories' && (
                <InstagramStoriesPreview
                  ad={previewAd}
                  pageName={clientName}
                  imageUrl={ad.imageUrl}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Action Bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Draft / In Review: approve + reject */}
          {(ad.status === 'draft' || ad.status === 'in_review') && (
            <>
              <button
                onClick={handleApprove}
                disabled={approveAd.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
              >
                {approveAd.isPending && <Spinner size="sm" />}
                Approve
              </button>

              {!showRejectInput ? (
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Reject
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection…"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleReject()}
                  />
                  <button
                    onClick={handleReject}
                    disabled={rejectAd.isPending || !rejectReason.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
                  >
                    {rejectAd.isPending && <Spinner size="sm" />}
                    Confirm
                  </button>
                  <button
                    onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                    className="text-sm text-gray-500 hover:text-gray-700 px-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}

          {/* Approved: publish button */}
          {ad.status === 'approved' && (
            <button
              onClick={handlePublish}
              disabled={publishAd.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
            >
              {publishAd.isPending && <Spinner size="sm" />}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Publish to Meta
            </button>
          )}

          {/* Share Preview — always visible */}
          <div className="ml-auto">
            <ShareLinkButton
              label="Share Preview"
              onGenerate={async () => {
                const result = await sharePreview.mutateAsync();
                return result.url;
              }}
            />
          </div>

          {/* Published: green label */}
          {ad.status === 'published' && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Published</span>
            </div>
          )}

          {/* Rejected: show badge */}
          {ad.status === 'rejected' && (
            <div className="flex items-center gap-2">
              <StatusBadge status="rejected" />
              {ad.rejectionReason && (
                <span className="text-sm text-gray-500">Reason: {ad.rejectionReason}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
