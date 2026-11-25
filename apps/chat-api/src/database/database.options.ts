import type { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/** Opções do TypeORM compartilhadas pela aplicação e pela CLI de migrações. */
export function buildDataSourceOptions(databaseUrl: string): DataSourceOptions {
  return {
    type: 'postgres',
    url: databaseUrl,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
  };
}
