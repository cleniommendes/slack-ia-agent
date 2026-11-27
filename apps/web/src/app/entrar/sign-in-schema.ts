import { z } from 'zod';

export const EMAIL_MESSAGE = 'Informe um e-mail válido, como nome@empresa.com.';
export const PASSWORD_MESSAGE = 'Informe sua senha.';

// Tamanhos máximos da API do chat (`POST /v1/sessions`).
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PASSWORD_LENGTH = 256;

export interface SignInFieldErrors {
  email?: string;
  password?: string;
}

const emailSchema = z.email().max(MAX_EMAIL_LENGTH);

/**
 * Valida o que a Pessoa digitou. O formulário (cliente) e o Server Action usam esta mesma
 * função, então as mensagens são as mesmas nos dois lugares.
 */
export function validateSignIn(
  email: string,
  password: string,
): SignInFieldErrors {
  const errors: SignInFieldErrors = {};
  if (!emailSchema.safeParse(email.trim()).success) {
    errors.email = EMAIL_MESSAGE;
  }
  if (password === '') {
    errors.password = PASSWORD_MESSAGE;
  }
  return errors;
}
