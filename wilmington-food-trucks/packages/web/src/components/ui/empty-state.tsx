interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-stone-700">{title}</h3>
      <p className="text-stone-400 text-sm mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  );
}
