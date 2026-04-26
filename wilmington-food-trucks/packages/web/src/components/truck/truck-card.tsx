import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { cn, formatTime } from '../../lib/utils';
import type { TruckWithTodaySchedule } from '../../lib/api';

interface TruckCardProps {
  truck: TruckWithTodaySchedule;
  showLocation: boolean;
}

export function TruckCard({ truck, showLocation }: TruckCardProps) {
  const todayEntry = truck.schedule[0];

  return (
    <Link
      href={`/trucks/${truck.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0">
          {truck.logoUrl ? (
            <Image
              src={truck.logoUrl}
              alt={truck.name}
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-2xl">
              🚚
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-stone-900 leading-tight">{truck.name}</h3>
            {showLocation && todayEntry && (
              <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                Out Today
              </span>
            )}
          </div>

          {truck.cuisineTypes.length > 0 && (
            <p className="text-xs text-stone-400 mt-0.5 capitalize">
              {truck.cuisineTypes.join(' · ')}
            </p>
          )}

          {showLocation && todayEntry && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-sm text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span className="truncate">{todayEntry.locationName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-stone-500">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formatTime(todayEntry.startTime)} – {formatTime(todayEntry.endTime)}</span>
              </div>
            </div>
          )}

          {!showLocation && truck.description && (
            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{truck.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
