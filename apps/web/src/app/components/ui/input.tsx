import { cn } from '@/app/utils/cn';

type InputProps = React.ComponentProps<'input'> & { invalid?: boolean };

/** Campo de texto do design system (h-9, borda `border-strong`, foco com anel). */
export function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'h-9 w-full rounded-control border border-border-strong bg-surface px-3 text-body text-fg outline-none placeholder:text-fg-muted',
        'focus:border-focus focus:ring-4 focus:ring-focus/30',
        invalid && 'border-danger focus:border-danger focus:ring-danger/25',
        className,
      )}
      {...props}
    />
  );
}
