'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClient, useTriggerScan, useScanStatus } from '../../../hooks/use-clients';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [scanning, setScanning] = useState(false);

  const { data: client, isLoading, error } = useClient(clientId);
  const triggerScan = useTriggerScan(clientId);
  const scanStatus = useScanStatus(clientId, scanning);

  async function handleScan() {
    setScanning(true);
    try {
      await triggerScan.mutateAsync();
    } catch {
      setScanning(false);
    }
  }

  // Stop polling once scan is done
  if (scanning && scanStatus.data?.status === 'complete') {
    setScanning(false);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Failed to load client: {(error as Error)?.message ?? 'Not found'}
        </div>
      </div>
    );
  }

  const profile = client.schoolProfile;

  return (
    <div className="p-8">
      {/* Back link */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Clients
      </Link>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        <a
          href={client.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
        >
          {client.websiteUrl}
        </a>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: School Profile (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">School Profile</h2>
              {profile && (
                <button
                  onClick={() => alert('Profile editing coming soon!')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="px-6 py-4">
              {profile ? (
                <dl>
                  <ProfileField label="School Name" value={profile.name} />
                  <ProfileField label="Tagline" value={profile.tagline} />
                  <ProfileField label="Mission" value={profile.mission} />
                  <ProfileField label="Grades" value={profile.grades} />
                  <ProfileField label="Programs" value={Array.isArray(profile.programs) ? profile.programs.join(', ') : profile.programs} />
                  <ProfileField label="Location" value={profile.location} />
                  <ProfileField label="Affiliation" value={profile.affiliation} />
                </dl>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">No school profile yet. Scan the website to automatically extract school information.</p>
                  <button
                    onClick={handleScan}
                    disabled={triggerScan.isPending || scanning}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
                  >
                    {(triggerScan.isPending || scanning) && <Spinner size="sm" />}
                    {triggerScan.isPending || scanning ? 'Scanning…' : 'Scan Website'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Scan status */}
          {scanning && scanStatus.data && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scanning website…</p>
                  {scanStatus.data.progress && (
                    <p className="text-xs text-gray-500 mt-0.5">{scanStatus.data.progress}</p>
                  )}
                </div>
                <StatusBadge status={scanStatus.data.status} />
              </div>
            </div>
          )}
        </div>

        {/* Right: Campaigns */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Campaigns</h2>
              <Link
                href={`/campaigns/new?clientId=${clientId}`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                + New
              </Link>
            </div>

            <div className="px-6 py-4">
              {client.campaigns && client.campaigns.length > 0 ? (
                <div className="space-y-3">
                  {client.campaigns.map((campaign: any) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                        <div className="mt-1">
                          <StatusBadge status={campaign.goal} />
                        </div>
                      </div>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium ml-3 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No campaigns yet"
                  description="Create a campaign to start generating ads."
                  action={
                    <Link
                      href={`/campaigns/new?clientId=${clientId}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      New Campaign
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
