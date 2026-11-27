import { MessageSquare } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import {
  ChatApiError,
  getCurrentSession,
} from '@/app/services/chat-api.service';
import { endSessionPath, safeReturnPath } from '@/app/utils/return-path';
import { getSessionToken } from '@/app/utils/session-cookie';
import { EntrarForm } from './entrar-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function EntrarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
        {/* Ler o cookie e a busca é dado da requisição: com `cacheComponents`, fica no Suspense.
            O formulário também é o fallback, para estar no HTML inicial (sem JavaScript e sem espera). */}
        <Suspense fallback={<EntrarForm returnPath={null} />}>
          <EntrarGate searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

/**
 * Com cookie, verifica a Sessão: 200 leva à Home, 401 apaga o cookie e volta aqui com o mesmo
 * `para`. Com falha de rede ou 5xx, mostra o formulário: a Pessoa não fica presa numa tela de erro.
 */
async function EntrarGate({ searchParams }: { searchParams: SearchParams }) {
  const returnPath = safeReturnPath((await searchParams).para);
  const token = await getSessionToken();

  if (token) {
    let session: 'valid' | 'invalid' | 'unknown' = 'unknown';
    try {
      await getCurrentSession(token);
      session = 'valid';
    } catch (error) {
      if (error instanceof ChatApiError && error.status === 401) {
        session = 'invalid';
      }
    }
    if (session === 'valid') redirect('/');
    if (session === 'invalid') redirect(endSessionPath(returnPath));
  }

  return <EntrarForm returnPath={returnPath} />;
}
