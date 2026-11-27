import { House } from 'lucide-react';
import Link from 'next/link';
import { UserMenu } from './user-menu';

type RailProps = { person: { id: string; name: string } };

/** Trilho de seções, com o logo, "Início" ativo e o menu da Pessoa no avatar. */
export function Rail({ person }: RailProps) {
  return (
    <nav
      aria-label="Seções"
      className="flex w-rail shrink-0 flex-col items-center gap-2 bg-chrome px-2 py-3"
    >
      <div className="pb-2">
        <div className="flex size-9 items-center justify-center rounded-card bg-sidebar-fg-strong text-small font-black text-sidebar">
          FC
        </div>
      </div>
      <Link
        href="/"
        aria-current="page"
        className="flex w-full flex-col items-center gap-1 py-1 text-caption font-bold text-sidebar-fg"
      >
        <span className="flex size-9 items-center justify-center">
          <House aria-hidden className="size-5" />
        </span>
        Início
      </Link>
      <div className="flex-1" />
      <UserMenu person={person} />
    </nav>
  );
}
