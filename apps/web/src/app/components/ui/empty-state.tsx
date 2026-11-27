type EmptyStateProps = { title: string; description: string };

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex w-[448px] flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex w-96 flex-col gap-1">
        <p className="text-title font-black text-fg">{title}</p>
        <p className="text-body text-fg-muted">{description}</p>
      </div>
    </div>
  );
}
