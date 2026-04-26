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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">This Week</h1>
        <p className="text-stone-400 text-sm mt-0.5">Food truck schedule for Wilmington, NC</p>
      </div>

      {dates.length === 0 ? (
        <EmptyState icon="📅" title="No schedule data yet" description="We're pulling from social media. Check back soon." />
      ) : (
        dates.map((date) => (
          <section key={date}>
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
              {formatDate(date)}
            </h2>
            <div className="space-y-2">
              {week[date]!.map((entry) => (
                <Link key={entry.id} href={`/trucks/${(entry as any).truck.slug}`}
                  className="card flex items-center gap-3 p-4 active:scale-[0.98] transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl flex-shrink-0">
                    🚚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 truncate">{(entry as any).truck.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      <span className="truncate">{entry.locationName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                      <Clock className="w-3 h-3" />
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
