const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-indigo-100 text-indigo-700',
  complete: 'bg-green-100 text-green-700',
  scanning: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-100 text-blue-700',
  waiting: 'bg-yellow-100 text-yellow-700',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
