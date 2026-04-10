'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClients } from '../../../hooks/use-clients';
import { useCreateCampaign } from '../../../hooks/use-campaigns';
import { Spinner } from '../../../components/ui/Spinner';

const GOALS = [
  { value: 'enrollment', label: 'Enrollment' },
  { value: 'open_house', label: 'Open House' },
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'tour_booking', label: 'Tour Booking' },
  { value: 'engagement', label: 'Engagement' },
];

const SEASONS = [
  { value: 'back_to_school', label: 'Back to School' },
  { value: 'open_house', label: 'Open House' },
  { value: 'enrollment_deadline', label: 'Enrollment Deadline' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'general', label: 'General' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId') ?? '';

  const { data: clients, isLoading: clientsLoading } = useClients();
  const createCampaign = useCreateCampaign();

  const [clientId, setClientId] = useState(preselectedClientId);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('enrollment');
  const [season, setSeason] = useState('general');
  const [targetDemographic, setTargetDemographic] = useState('');
  const [messagingEmphasis, setMessagingEmphasis] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!clientId) errs.clientId = 'Please select a client';
    if (!name.trim()) errs.name = 'Campaign name is required';
    if (!goal) errs.goal = 'Please select a goal';
    if (!season) errs.season = 'Please select a season';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const campaign = await createCampaign.mutateAsync({
        clientId,
        name: name.trim(),
        goal,
        season,
        targetDemographic: targetDemographic.trim() || undefined,
        messagingEmphasis: messagingEmphasis.trim() || undefined,
        dailyBudget: budget ? parseFloat(budget) : undefined,
      });
      router.push(`/campaigns/${campaign.id}`);
    } catch {
      // error surfaced via createCampaign.error
    }
  }

  return (
    <div className="p-8 max-w-2xl">
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
        <p className="text-sm text-gray-500 mt-0.5">Set up a campaign brief to generate ad copy</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={clientsLoading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select a school…</option>
              {clients?.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-xs text-red-600">{errors.clientId}</p>}
          </div>

          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fall Enrollment 2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Goal + Season row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal <span className="text-red-500">*</span>
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {errors.goal && <p className="mt-1 text-xs text-red-600">{errors.goal}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Season <span className="text-red-500">*</span>
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {SEASONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.season && <p className="mt-1 text-xs text-red-600">{errors.season}</p>}
            </div>
          </div>

          {/* Target Demographic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Demographic
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={targetDemographic}
              onChange={(e) => setTargetDemographic(e.target.value)}
              placeholder="e.g. Parents of students aged 5-18 in Bergen County, NJ"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Messaging Emphasis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Messaging Emphasis
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={messagingEmphasis}
              onChange={(e) => setMessagingEmphasis(e.target.value)}
              placeholder="e.g. Emphasize faith-based education and small class sizes"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Daily Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Budget ($)
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="50"
              min="1"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* API error */}
          {createCampaign.error && (
            <p className="text-sm text-red-600">
              {(createCampaign.error as Error).message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createCampaign.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
            >
              {createCampaign.isPending && <Spinner size="sm" />}
              {createCampaign.isPending ? 'Creating…' : 'Create Campaign'}
            </button>
            <Link
              href="/campaigns"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
