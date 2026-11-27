'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Field } from '@/app/components/ui/field';
import { FormMessage } from '@/app/components/ui/form-message';
import { Input } from '@/app/components/ui/input';
import { signIn, type SignInState } from './actions';
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  validateSignIn,
  type SignInFieldErrors,
} from './sign-in-schema';

const INITIAL_STATE: SignInState = { error: null, fieldErrors: {}, email: '' };
const INVALID_CREDENTIALS_MESSAGE =
  'E-mail ou senha incorretos. Confira os dados e tente de novo.';
const UNAVAILABLE_MESSAGE =
  'Não foi possível entrar agora. Confira sua conexão e tente de novo.';

export function EntrarForm({ returnPath }: { returnPath: string | null }) {
  const [state, formAction, isPending] = useActionState(signIn, INITIAL_STATE);
  // Os campos são controlados: o React zera o formulário quando o envio termina, e a Pessoa
  // não pode perder o que digitou numa falha de rede.
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState('');
  const [clientErrors, setClientErrors] = useState<SignInFieldErrors | null>(
    null,
  );
  const [handledState, setHandledState] = useState(state);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const focusBeforeSubmitRef = useRef<HTMLElement | null>(null);

  // Credenciais erradas: a Senha volta vazia (ajuste no próprio render, sem efeito).
  if (state !== handledState) {
    setHandledState(state);
    if (state.error === 'invalid_credentials') setPassword('');
  }

  // O foco inicial fica no E-mail, só ao abrir a tela.
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Com credenciais erradas o foco vai para a Senha.
  useEffect(() => {
    if (!isPending && state.error === 'invalid_credentials') {
      passwordRef.current?.focus();
    }
  }, [isPending, state]);

  // O botão desabilitado durante o envio perde o foco: na falha no envio ele volta a quem o tinha.
  useEffect(() => {
    if (!isPending && state.error === 'unavailable') {
      if (document.activeElement === document.body) {
        focusBeforeSubmitRef.current?.focus();
      }
    }
  }, [isPending, state]);

  // Com JavaScript desligado, o Server Action valida e devolve os erros no estado.
  const fieldErrors = clientErrors ?? state.fieldErrors;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const errors = validateSignIn(email, password);
    if (!errors.email && !errors.password) {
      setClientErrors(null);
      focusBeforeSubmitRef.current =
        document.activeElement as HTMLElement | null;
      return;
    }
    event.preventDefault();
    setClientErrors(errors);
    (errors.email ? emailRef : passwordRef).current?.focus();
  }

  const passwordError =
    fieldErrors.password ??
    (state.error === 'invalid_credentials'
      ? INVALID_CREDENTIALS_MESSAGE
      : undefined);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="para" value={returnPath ?? ''} />
      <Field label="E-mail" htmlFor="email" error={fieldErrors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="nome@empresa.com"
          maxLength={MAX_EMAIL_LENGTH}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          ref={emailRef}
          invalid={fieldErrors.email !== undefined}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
      </Field>
      <Field label="Senha" htmlFor="password" error={passwordError}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={MAX_PASSWORD_LENGTH}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          ref={passwordRef}
          invalid={passwordError !== undefined}
          aria-describedby={passwordError ? 'password-error' : undefined}
        />
      </Field>
      {state.error === 'unavailable' && (
        <FormMessage id="form-error">{UNAVAILABLE_MESSAGE}</FormMessage>
      )}
      <Button type="submit" size="lg" loading={isPending}>
        Entrar
      </Button>
    </form>
  );
}
