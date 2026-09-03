import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-lg bg-[var(--color-brand-600)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--color-brand-500)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
