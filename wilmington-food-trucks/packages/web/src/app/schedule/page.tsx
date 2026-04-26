import { getWeekSchedule } from '../../lib/api';
import { MapPin, Clock } from 'lucide-react';
import { formatDate, formatTime } from '../../lib/utils';
import { EmptyState } from '../../components/ui/empty-state';
import Link from 'next/link';

export const revalidate = 300;

export default async function SchedulePage() {
  const week = await getWeekSchedule().catch(() => ({}));
  const dates = Object.keys(week).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">This Week</h1>

      {dates.length === 0 ? (
        <EmptyState icon="📅" title="No schedule data yet" description="We're pulling from social media. Check back soon." />
      ) : (
        dates.map((date) => (
          <section key={date}>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
              {formatDate(date)}
            </h2>
            <div className="space-y-2">
              {week[date]!.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/trucks/${(entry as any).truck.slug}`}
                  className="flex items-start gap-3 bg-white rounded-xl border border-stone-100 p-4 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-lg flex-shrink-0">
                    🚚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900">{(entry as any).truck.name}</p>
                    <div className="flex items-center gap-1.5 text-sm text-stone-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-500" />
                      {entry.locationName}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-stone-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
