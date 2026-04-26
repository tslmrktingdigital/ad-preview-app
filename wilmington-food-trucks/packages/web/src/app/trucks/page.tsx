import { getTrucks } from '../../lib/api';
import { TruckCard } from '../../components/truck/truck-card';
import { EmptyState } from '../../components/ui/empty-state';

export const revalidate = 300;

export default async function TrucksPage() {
  const trucks = await getTrucks().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Food Trucks</h1>
        <p className="text-stone-500 text-sm mt-1">{trucks.length} trucks in Wilmington, NC</p>
      </div>

      {trucks.length === 0 ? (
        <EmptyState icon="🚚" title="No trucks yet" description="We're still gathering data. Check back soon!" />
      ) : (
        <div className="space-y-3">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} showLocation={truck.schedule.length > 0} />
          ))}
        </div>
      )}
    </div>
  );
}
