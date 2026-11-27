'use client';

import { useEffect } from 'react';

/**
 * O navegador pode devolver a página do histórico (bfcache) sem pedi-la ao servidor. Recarregar
 * no `pageshow` com `persisted` faz o proxy e o layout decidirem de novo: depois de sair, a
 * Pessoa não vê a tela logada.
 */
export function ReloadOnRestore() {
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) window.location.reload();
    }
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);
  return null;
}
