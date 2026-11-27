'use server';

import { redirect } from 'next/navigation';
import {
  ChatApiError,
  ChatApiUnavailableError,
  createSession,
} from '@/app/services/chat-api.service';
import { safeReturnPath } from '@/app/utils/return-path';
import { setSessionCookie } from '@/app/utils/session-cookie';
import { validateSignIn, type SignInFieldErrors } from './sign-in-schema';

export interface SignInState {
  error: 'invalid_credentials' | 'unavailable' | null;
  fieldErrors: SignInFieldErrors;
  email: string;
}

/**
 * Entra pela API, grava o cookie e leva à Home. Todo resultado que não é o sucesso volta como
 * estado: campo inválido, credenciais erradas ou a API fora do ar.
 */
export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  // O campo vem do navegador: vale de novo a regra do caminho do chat.
  const returnPath = safeReturnPath(formData.get('para')) ?? '/';

  const fieldErrors = validateSignIn(email, password);
  if (fieldErrors.email || fieldErrors.password) {
    return { error: null, fieldErrors, email };
  }

  try {
    const { token } = await createSession(email, password);
    await setSessionCookie(token);
  } catch (error) {
    if (error instanceof ChatApiError && error.code === 'invalid_credentials') {
      return { error: 'invalid_credentials', fieldErrors: {}, email };
    }
    // Rede, tempo esgotado, 5xx e qualquer outra resposta da API; o 429 ganha o aviso próprio na F01-T08.
    if (
      error instanceof ChatApiUnavailableError ||
      error instanceof ChatApiError
    ) {
      return { error: 'unavailable', fieldErrors: {}, email };
    }
    throw error;
  }

  redirect(returnPath);
}
