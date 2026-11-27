import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ReloadOnRestore } from '@/app/components/workspace-nav/reload-on-restore';
import { Rail } from '@/app/components/workspace-nav/rail';
import { Sidebar } from '@/app/components/workspace-nav/sidebar';
import {
  ChatApiError,
  getCurrentSession,
  type PersonView,
} from '@/app/services/chat-api.service';
import { REQUEST_PATH_HEADER, endSessionPath } from '@/app/utils/return-path';
import { getSessionToken } from '@/app/utils/session-cookie';

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
  const requestedPath = (await headers()).get(REQUEST_PATH_HEADER);
  if (!token) redirect(endSessionPath(requestedPath));

  let person: PersonView;
  try {
    ({ person } = await getCurrentSession(token));
  } catch (error) {
    if (error instanceof ChatApiError && error.status === 401) {
      redirect(endSessionPath(requestedPath));
    }
    throw error;
  }

  return (
    <div className="flex h-dvh">
      <ReloadOnRestore />
      <Rail person={person} />
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col items-center justify-center bg-surface">
        {children}
      </main>
    </div>
  );
}
