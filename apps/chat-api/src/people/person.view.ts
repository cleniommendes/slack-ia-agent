import type { Person } from './person.entity.js';

/** O que a API mostra de uma Pessoa. */
export interface PersonView {
  id: string;
  name: string;
  email: string;
}

export function toPersonView(person: Person): PersonView {
  return { id: person.id, name: person.name, email: person.email };
}
