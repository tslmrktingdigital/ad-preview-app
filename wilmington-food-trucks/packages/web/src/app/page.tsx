import { getTodaySchedule, getTrucks } from '../lib/api';
import { TruckCard } from '../components/truck/truck-card';
import { EmptyState } from '../components/ui/empty-state';
import { formatDate } from '../lib/utils';

export const revalidate = 300; // ISR: refresh every 5 minutes

export default async function HomePage() {
  const [schedule, trucks] = await Promise.all([
    getTodaySchedule().catch(() => []),
    getTrucks().catch(() => []),
  ]);

  const today = formatDate(new Date().toISOString().split('T')[0]!);
  const trucksOutToday = trucks.filter((t) => t.schedule.length > 0);
  const trucksWithNoLocation = trucks.filter((t) => t.schedule.length === 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Where are the trucks?</h1>
        <p className="text-stone-500 text-sm mt-1">{today} · Wilmington, NC</p>
      </div>

      {trucksOutToday.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Out Today ({trucksOutToday.length})
          </h2>
          <div className="space-y-3">
            {trucksOutToday.map((truck) => (
              <TruckCard key={truck.id} truck={truck} showLocation />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          icon="🔍"
          title="No trucks spotted yet today"
          description="Check back soon — we update every 4 hours from social media and truck websites."
        />
      )}

      {trucksWithNoLocation.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Other Trucks
          </h2>
          <div className="space-y-3">
            {trucksWithNoLocation.map((truck) => (
              <TruckCard key={truck.id} truck={truck} showLocation={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
