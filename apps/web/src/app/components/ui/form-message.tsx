import { cn } from '@/app/utils/cn';

type FormMessageProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

/** Mensagem de erro do formulário inteiro, anunciada ao aparecer. Fica entre o último campo e o botão. */
export function FormMessage({ id, children, className }: FormMessageProps) {
  return (
    <p
      id={id}
      role="alert"
      className={cn('text-small text-danger-fg', className)}
    >
      {children}
    </p>
  );
}
