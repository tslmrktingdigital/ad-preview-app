import { AddTruckForm } from './add-truck-form';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Add a Food Truck</h1>
        <p className="text-stone-400 text-sm mt-0.5">
          Add a new Wilmington food truck. The crawler will pull their schedule automatically.
        </p>
      </div>
      <AddTruckForm />
    </div>
  );
}
