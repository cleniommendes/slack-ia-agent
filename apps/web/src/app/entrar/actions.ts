'use server';

import { redirect } from 'next/navigation';
import { ChatApiError, createSession } from '@/app/services/chat-api.service';
import { setSessionCookie } from '@/app/utils/session-cookie';

export interface SignInState {
  error: 'invalid_credentials' | null;
  email: string;
}

/** Entra pela API, grava o cookie e leva à Home. Credenciais erradas voltam como estado. */
export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  try {
    const { token } = await createSession(email, password);
    await setSessionCookie(token);
  } catch (error) {
    if (error instanceof ChatApiError && error.code === 'invalid_credentials') {
      return { error: 'invalid_credentials', email };
    }
    throw error;
  }

  redirect('/');
}
