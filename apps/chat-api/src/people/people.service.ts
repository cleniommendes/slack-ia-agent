import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from '@node-rs/argon2';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { EmailAlreadyUsedError } from './email-already-used.error.js';
import { Person } from './person.entity.js';

const UNIQUE_VIOLATION = '23505';

export interface CreatePersonInput {
  email: string;
  name: string;
  password: string;
}

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person) private readonly people: Repository<Person>,
  ) {}

  /** Sem os espaços das pontas e em minúsculas, como o e-mail é gravado e comparado. */
  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async create(input: CreatePersonInput): Promise<Person> {
    const person = this.people.create({
      email: this.normalizeEmail(input.email),
      name: input.name,
      passwordHash: await hash(input.password),
    });

    try {
      return await this.people.save(person);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new EmailAlreadyUsedError();
      }
      throw error;
    }
  }

  /** Troca o hash da senha. Com `manager`, entra na transação de quem chamou. */
  async setPassword(
    personId: string,
    password: string,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = manager?.getRepository(Person) ?? this.people;
    await repository.update(
      { id: personId },
      { passwordHash: await hash(password) },
    );
  }

  findByEmail(email: string): Promise<Person | null> {
    return this.people.findOneBy({ email: this.normalizeEmail(email) });
  }

  verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    return verify(passwordHash, password);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password);
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code === UNIQUE_VIOLATION
  );
}
