'use server';

import { deleteCurrentSession } from '@/app/services/chat-api.service';
import {
  clearSessionCookie,
  getSessionToken,
} from '@/app/utils/session-cookie';

/**
 * Sai: apaga a Sessão na API e apaga o cookie. Se a API falhar, o cookie é apagado do mesmo jeito:
 * a Pessoa sai deste navegador de qualquer forma. Quem chama leva a Entrar (`UserMenu`), com uma
 * navegação completa, e não com `redirect`: o Next guarda as telas visitadas no cache do roteador
 * e, ao voltar pelo histórico, mostraria a Home de quem saiu.
 */
export async function signOut(): Promise<void> {
  const token = await getSessionToken();
  if (token) {
    try {
      await deleteCurrentSession(token);
    } catch {
      // Sem log por enquanto: a web ainda não tem logger estruturado (LLD, "Questões em aberto").
    }
  }
  await clearSessionCookie();
}
