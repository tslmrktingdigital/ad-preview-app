interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="card text-center py-10 px-6">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-bold text-stone-700 text-lg">{title}</h3>
      <p className="text-stone-400 text-sm mt-1 leading-relaxed">{description}</p>
    </div>
  );
}
