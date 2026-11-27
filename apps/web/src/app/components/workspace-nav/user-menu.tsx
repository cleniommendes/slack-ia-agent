'use client';

import { LogOut } from 'lucide-react';
import { startTransition } from 'react';
import { signOut } from '@/app/(app)/actions';
import { Avatar } from '@/app/components/ui/avatar';
import { getInitials } from '@/app/utils/initials';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

type UserMenuProps = { person: { id: string; name: string } };

/** O avatar do Rail abre o menu da conta. Na F01 ele só tem o cabeçalho e "Sair do Clenio". */
export function UserMenu({ person }: UserMenuProps) {
  return (
    // Não modal: o Radix modal esconde o resto da página com `aria-hidden`, e o Rail e o link
    // "Início" continuam focáveis (axe, `aria-hidden-focus`).
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          // O nome acessível começa pelas iniciais visíveis (WCAG 2.5.3, "rótulo no nome").
          aria-label={`${getInitials(person.name)}, menu da conta de ${person.name}`}
          className="rounded-item outline-none focus-visible:ring-4 focus-visible:ring-focus/30"
        >
          <Avatar id={person.id} name={person.name} decorative />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <div className="flex items-center gap-3 px-4 pt-1 pb-2">
          <Avatar id={person.id} name={person.name} decorative />
          <p className="min-w-0 flex-1 truncate text-body font-black text-fg">
            {person.name}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            startTransition(async () => {
              await signOut();
              // Navegação completa: descarta o cache do roteador, e voltar pelo histórico não mostra a Home.
              window.location.replace('/entrar');
            })
          }
        >
          <LogOut aria-hidden className="size-4 shrink-0" />
          Sair do Clenio
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
