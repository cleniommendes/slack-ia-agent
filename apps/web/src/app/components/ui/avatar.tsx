import { getAvatarColor, getInitials } from '@/app/utils/initials';

/** Iniciais da Pessoa sobre uma das seis cores de avatar. */
export function Avatar({ id, name }: { id: string; name: string }) {
  return (
    <div
      role="img"
      aria-label={name}
      className={`flex size-9 items-center justify-center rounded-item text-small font-black text-on-primary ${getAvatarColor(id)}`}
    >
      {getInitials(name)}
    </div>
  );
}
