import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Rail } from '@/app/components/workspace-nav/rail';
import { Sidebar } from '@/app/components/workspace-nav/sidebar';
import {
  ChatApiError,
  getCurrentSession,
  type PersonView,
} from '@/app/services/chat-api.service';
import { getSessionToken } from '@/app/utils/session-cookie';

const END_SESSION_PATH = '/api/sessao/encerrar';

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ler o cookie é dado da requisição: com `cacheComponents`, fica dentro do Suspense.
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

/** Verifica a Sessão na API a cada renderização e monta o shell com a Pessoa. */
async function Shell({ children }: { children: React.ReactNode }) {
  const token = await getSessionToken();
  if (!token) redirect(END_SESSION_PATH);

  let person: PersonView;
  try {
    ({ person } = await getCurrentSession(token));
  } catch (error) {
    if (error instanceof ChatApiError && error.status === 401) {
      redirect(END_SESSION_PATH);
    }
    throw error;
  }

  return (
    <div className="flex h-dvh">
      <Rail person={person} />
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col items-center justify-center bg-surface">
        {children}
      </main>
    </div>
  );
}
