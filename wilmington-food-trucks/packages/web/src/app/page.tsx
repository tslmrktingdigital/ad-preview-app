import { getTrucks } from '../lib/api';
import { TruckCard } from '../components/truck/truck-card';
import { EmptyState } from '../components/ui/empty-state';

export const revalidate = 300;

export default async function HomePage() {
  const trucks = await getTrucks().catch(() => []);

  const trucksOutToday = trucks.filter((t) => t.schedule.length > 0);
  const otherTrucks = trucks.filter((t) => t.schedule.length === 0);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div>
      {/* Full-bleed hero */}
      <div className="bg-orange-600 -mx-4 -mt-5 px-4 pt-6 pb-10 mb-6">
        <p className="text-orange-200 text-sm font-medium mb-1">{today}</p>
        <h1 className="text-white text-3xl font-extrabold leading-tight">
          Where are the<br />trucks today?
        </h1>
      </div>

      {/* Out today */}
      <div className="space-y-5">
        {trucksOutToday.length > 0 ? (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Out Today · {trucksOutToday.length} truck{trucksOutToday.length !== 1 ? 's' : ''}
              </h2>
            </div>
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
            description="We pull from social media & websites every 4 hours. Check back soon or browse all trucks below."
          />
        )}

        {otherTrucks.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
              All Trucks · {otherTrucks.length}
            </h2>
            <div className="space-y-3">
              {otherTrucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} showLocation={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
