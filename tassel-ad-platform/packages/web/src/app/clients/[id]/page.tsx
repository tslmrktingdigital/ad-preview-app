'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useTriggerScan } from '../../../hooks/use-clients';
import { api } from '../../../lib/api-client';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';

function ProfileField({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{display}</dd>
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [scanning, setScanning] = useState(false);
  const qc = useQueryClient();

  // Poll every 3s while scanning so the profile appears automatically when ready
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => api.get<any>(`/clients/${clientId}`),
    enabled: !!clientId,
    refetchInterval: scanning ? 3000 : false,
  });

  const triggerScan = useTriggerScan(clientId);

  // Stop polling once profile arrives
  if (scanning && client?.schoolProfile?.scanStatus === 'complete') {
    setScanning(false);
    qc.invalidateQueries({ queryKey: ['clients'] });
  }

  async function handleScan() {
    setScanning(true);
    try {
      await triggerScan.mutateAsync();
    } catch {
      setScanning(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
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
  // profileData is the JSON blob with the actual school info
  const pd = profile?.profileData as any;

  return (
    <div className="p-8">
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Clients
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 mt-1 inline-block">
            {client.websiteUrl}
          </a>
        </div>
        {profile && (
          <StatusBadge status={profile.scanStatus} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Profile */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">School Profile</h2>
              {profile && !scanning && (
                <button onClick={handleScan}
                  disabled={triggerScan.isPending}
                  className="text-xs text-gray-400 hover:text-indigo-600 font-medium transition-colors">
                  Re-scan
                </button>
              )}
            </div>

            <div className="px-6 py-4">
              {scanning ? (
                <div className="py-8 flex flex-col items-center gap-3">
                  <Spinner size="lg" />
                  <p className="text-sm text-gray-500">Crawling {client.websiteUrl}…</p>
                  <p className="text-xs text-gray-400">This takes about 30 seconds</p>
                </div>
              ) : pd ? (
                <dl>
                  <ProfileField label="School Name" value={pd.name} />
                  <ProfileField label="Tagline" value={pd.tagline} />
                  <ProfileField label="Mission" value={pd.missionStatement} />
                  <ProfileField label="Grade Levels" value={pd.gradeLevels} />
                  <ProfileField label="Programs" value={pd.programs} />
                  <ProfileField label="Religious Affiliation" value={pd.religiousAffiliation} />
                  <ProfileField label="Location" value={[pd.location?.city, pd.location?.state].filter(Boolean).join(', ')} />
                  <ProfileField label="Accreditations" value={pd.accreditations} />
                  <ProfileField label="Student-Teacher Ratio" value={pd.studentTeacherRatio} />
                </dl>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    No school profile yet. Scan the website to automatically extract school information.
                  </p>
                  <button onClick={handleScan} disabled={triggerScan.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors">
                    {triggerScan.isPending && <Spinner size="sm" />}
                    Scan Website
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Testimonials */}
          {pd?.testimonials?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Testimonials Found</h2>
              <div className="space-y-2">
                {pd.testimonials.map((t: string, i: number) => (
                  <p key={i} className="text-sm text-gray-600 italic border-l-2 border-indigo-200 pl-3">"{t}"</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campaigns sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Campaigns</h2>
              <Link href={`/campaigns/new?clientId=${clientId}`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                + New
              </Link>
            </div>
            <div className="px-6 py-4">
              {client.campaigns?.length > 0 ? (
                <div className="space-y-3">
                  {client.campaigns.map((campaign: any) => (
                    <div key={campaign.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                        <div className="mt-1"><StatusBadge status={campaign.goal} /></div>
                      </div>
                      <Link href={`/campaigns/${campaign.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium ml-3">
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
                    <Link href={`/campaigns/new?clientId=${clientId}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
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
