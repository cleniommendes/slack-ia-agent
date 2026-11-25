import { cn } from '@/app/utils/cn';

type FieldProps = {
  label: string;
  htmlFor: string;
  /** Id do elemento da mensagem de erro, para o campo apontar para ela. */
  errorId?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

/** Rótulo, controle e a mensagem de erro abaixo dele. */
export function Field({
  label,
  htmlFor,
  errorId,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={htmlFor} className="text-body font-bold text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-small text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}
