import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/utils/cn';
import { Spinner } from './spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control text-body font-bold transition-colors duration-100 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
      },
      size: {
        md: 'h-9 px-4',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

/** Botão do design system. Carregando mostra o spinner e não aceita novo clique. */
export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
