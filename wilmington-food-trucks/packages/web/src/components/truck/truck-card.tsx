'use client';
import Link from 'next/link';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { formatTime } from '../../lib/utils';
import type { TruckWithTodaySchedule } from '../../lib/api';

const CUISINE_EMOJI: Record<string, string> = {
  bbq: '🔥', mexican: '🌮', seafood: '🦞', asian: '🍜', american: '🍔',
  caribbean: '🌴', mediterranean: '🫒', vegan: '🥗', desserts: '🍰',
  coffee: '☕', italian: '🍝', other: '🍽️',
};

interface TruckCardProps {
  truck: TruckWithTodaySchedule;
  showLocation: boolean;
}

export function TruckCard({ truck, showLocation }: TruckCardProps) {
  const todayEntry = truck.schedule[0];
  const emoji = truck.cuisineTypes[0] ? (CUISINE_EMOJI[truck.cuisineTypes[0]] ?? '🍽️') : '🚚';

  return (
    <Link
      href={`/trucks/${truck.slug}`}
      className="card flex items-stretch active:scale-[0.98] transition-transform"
    >
      {/* Color stripe */}
      <div className="w-1.5 bg-orange-500 rounded-l-2xl flex-shrink-0" />

      <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0 border border-orange-100">
          {emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-stone-900 text-base leading-tight">{truck.name}</h3>
            {showLocation && todayEntry && (
              <span className="badge-green flex-shrink-0">Out Today</span>
            )}
          </div>

          {truck.cuisineTypes.length > 0 && (
            <p className="text-xs text-stone-400 mt-0.5 capitalize">
              {truck.cuisineTypes.join(' · ')}
            </p>
          )}

          {showLocation && todayEntry ? (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-sm text-stone-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span className="truncate">{todayEntry.locationName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{formatTime(todayEntry.startTime)} – {formatTime(todayEntry.endTime)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-400 mt-1 line-clamp-1">
              {truck.description ?? 'Tap to see schedule & details'}
            </p>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
      </div>
    </Link>
  );
}
