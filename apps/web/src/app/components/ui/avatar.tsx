import { getAvatarColor, getInitials } from '@/app/utils/initials';

/**
 * Iniciais da Pessoa sobre uma das seis cores de avatar. `decorative` esconde o avatar dos leitores
 * de tela, para quando o nome já está no botão ou no texto ao lado.
 */
export function Avatar({
  id,
  name,
  decorative = false,
}: {
  id: string;
  name: string;
  decorative?: boolean;
}) {
  return (
    <div
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': name })}
      className={`flex size-9 items-center justify-center rounded-item text-small font-black text-on-primary ${getAvatarColor(id)}`}
    >
      {getInitials(name)}
    </div>
  );
}
