import { MessageSquare } from 'lucide-react';
import { EntrarForm } from './entrar-form';

export default function EntrarPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-subtle">
      <div className="flex w-[448px] flex-col gap-6 rounded-panel bg-surface-raised p-8 shadow-2">
        <header className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-card bg-sidebar text-sidebar-fg-strong">
            <MessageSquare aria-hidden className="size-6" />
          </div>
          <div className="flex w-full flex-col gap-1 text-center">
            <h1 className="text-display font-black text-fg">
              Entrar no Full Cycle
            </h1>
            <p className="text-body text-fg-muted">
              Use o e-mail da sua conta de trabalho.
            </p>
          </div>
        </header>
        <EntrarForm />
      </div>
    </main>
  );
}
