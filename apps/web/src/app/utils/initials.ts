const AVATAR_COLORS = [
  'bg-avatar-1',
  'bg-avatar-2',
  'bg-avatar-3',
  'bg-avatar-4',
  'bg-avatar-5',
  'bg-avatar-6',
] as const;

/** Primeira letra do primeiro e do último nome, em maiúsculas. */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`.toLocaleUpperCase('pt-BR');
}

/** A mesma Pessoa sempre cai na mesma cor de avatar. */
export function getAvatarColor(id: string): string {
  let sum = 0;
  for (const char of id) sum += char.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}
