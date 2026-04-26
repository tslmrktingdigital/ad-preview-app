'use client';

import { useState } from 'react';
import { TruckCard } from '../../components/truck/truck-card';
import { EmptyState } from '../../components/ui/empty-state';
import type { TruckWithTodaySchedule } from '../../lib/api';

const CUISINE_LABELS: Record<string, string> = {
  american: '🍔 American',
  asian: '🍜 Asian',
  bbq: '🔥 BBQ',
  caribbean: '🌴 Caribbean',
  coffee: '☕ Coffee',
  desserts: '🍰 Desserts',
  italian: '🍝 Italian',
  mediterranean: '🫒 Mediterranean',
  mexican: '🌮 Mexican',
  other: '🍽️ Other',
  seafood: '🦞 Seafood',
  vegan: '🥗 Vegan',
};

interface Props {
  trucks: TruckWithTodaySchedule[];
}

export function TrucksList({ trucks }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const cuisines = [...new Set(trucks.flatMap((t) => t.cuisineTypes))].sort();

  const filtered = active
    ? trucks.filter((t) => t.cuisineTypes.includes(active))
    : trucks;

  return (
    <div className="space-y-5">
      {/* Filter chips */}
      {cuisines.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setActive(active === c ? null : c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                active === c
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300'
              }`}
            >
              {CUISINE_LABELS[c] ?? c}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-stone-400 font-medium">
        {filtered.length} of {trucks.length} trucks
        {active ? ` · ${CUISINE_LABELS[active] ?? active}` : ''}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="🤷" title="No trucks match" description="Try a different cuisine filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((truck) => (
            <TruckCard key={truck.id} truck={truck} showLocation={truck.schedule.length > 0} />
          ))}
        </div>
      )}
    </div>
  );
}
