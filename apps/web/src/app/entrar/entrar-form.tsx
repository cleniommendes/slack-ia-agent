'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Field } from '@/app/components/ui/field';
import { Input } from '@/app/components/ui/input';
import { signIn, type SignInState } from './actions';

const INITIAL_STATE: SignInState = { error: null, email: '' };
const INVALID_CREDENTIALS_MESSAGE =
  'E-mail ou senha incorretos. Confira os dados e tente de novo.';

export function EntrarForm() {
  const [state, formAction, isPending] = useActionState(signIn, INITIAL_STATE);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // O foco inicial fica no E-mail, só ao abrir a tela.
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // O formulário limpa os campos ao terminar o envio; com credenciais erradas o foco vai para a Senha.
  useEffect(() => {
    if (!isPending && state.error) passwordRef.current?.focus();
  }, [isPending, state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="E-mail" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="nome@empresa.com"
          defaultValue={state.email}
          ref={emailRef}
        />
      </Field>
      <Field
        label="Senha"
        htmlFor="password"
        errorId="password-error"
        error={state.error ? INVALID_CREDENTIALS_MESSAGE : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          ref={passwordRef}
          invalid={state.error !== null}
          aria-describedby={state.error ? 'password-error' : undefined}
        />
      </Field>
      <Button type="submit" size="lg" loading={isPending}>
        Entrar
      </Button>
    </form>
  );
}
