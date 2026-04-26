import { getTrucks } from '../../lib/api';
import { TrucksList } from './trucks-list';

export const revalidate = 300;

export default async function TrucksPage() {
  const trucks = await getTrucks().catch(() => []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">All Food Trucks</h1>
        <p className="text-stone-400 text-sm mt-0.5">{trucks.length} trucks in Wilmington, NC</p>
      </div>
      <TrucksList trucks={trucks} />
    </div>
  );
}
